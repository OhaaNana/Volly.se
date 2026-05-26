import { useEffect, useState, type FormEvent } from "react";

type Props = {
  userEmail: string;
  isReadOnly?: boolean;
  onBack?: () => void;
  onProfileUpdated?: (nextEmail: string) => void;
};

type ProfilePost = {
  id: string | number;
  author_email?: string;
  first_name?: string | null;
  last_name?: string | null;
  category?: string | null;
  title?: string | null;
  description?: string | null;
  help_type?: string | null;
  created_at?: string | Date | number | null;
  tags?: string[];
};

type ProfileResponse = {
  id?: number;
  email?: string;
  first_name?: string | null;
  last_name?: string | null;
  bio?: string | null;
};

const PROFILE_API_BASE = "/api/users/by-email";
const POSTS_API_BASE = "/api/posts";

function getDisplayName(email: string) {
  const localPart = email.split("@")[0] || "Anna Andersson";
  const cleaned = localPart.split(/[._-]/).filter(Boolean);

  if (cleaned.length === 0) return "Anna Andersson";

  return cleaned
    .slice(0, 2)
    .map((part) => part.replace(/^\w/, (c) => c.toUpperCase()))
    .join(" ");
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatTimeAgo(input: string | Date | number | null | undefined) {
  if (input == null) return "Okänt";
  let createdAt: number;
  if (typeof input === "number") {
    createdAt = input < 1e12 ? input * 1000 : input;
  } else {
    const date = new Date(input as string | Date);
    if (Number.isNaN(date.getTime())) return "Okänt";
    createdAt = date.getTime();
  }
  const sec = Math.floor((Date.now() - createdAt) / 1000);
  if (sec < 60) return "nyss";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min sen`;
  const h = Math.floor(min / 60);
  if (h < 48) return `${h}h sen`;
  const d = Math.floor(h / 24);
  return `${d} d sen`;
}

function formatHelpLabel(helpType?: string | null) {
  if (helpType === "giveHelp") return "Erbjuder hjälp";
  if (helpType === "getHelp") return "Söker hjälp";
  return "Inlägg";
}

function normalizeCreatedAt(value: unknown): number | undefined {
  if (typeof value === "number") return value < 1e12 ? value * 1000 : value;
  if (typeof value === "string") {
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? undefined : time;
  }
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isNaN(time) ? undefined : time;
  }
  return undefined;
}

export default function ProfilePage({
  userEmail,
  isReadOnly = false,
  onBack,
  onProfileUpdated,
}: Props) {
  const [currentEmail, setCurrentEmail] = useState(userEmail);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setIsProfileLoading(true);
      setErrorMessage("");
      setStatusMessage("");
      setIsEditing(false);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${PROFILE_API_BASE}/${encodeURIComponent(userEmail)}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (!response.ok) {
          throw new Error("Det gick inte att hämta profilen.");
        }

        const payload = (await response.json()) as ProfileResponse;

        if (!mounted) return;

        setCurrentEmail(payload.email ?? userEmail);
        setFirstName(payload.first_name ?? "");
        setLastName(payload.last_name ?? "");
        setBio(payload.bio ?? "");
      } catch (error) {
        if (!mounted) return;
        const msg =
          error instanceof Error
            ? error.message
            : "Det gick inte att hämta profilen.";

        setErrorMessage(
          msg.includes("Failed to fetch")
            ? "Kunde inte nå servern. Försök igen senare."
            : msg
        );
        setCurrentEmail(userEmail);
      } finally {
        if (mounted) {
          setIsProfileLoading(false);
        }
      }
    }

    async function loadPosts() {
      setIsPostsLoading(true);

      try {
        const response = await fetch(
          `${POSTS_API_BASE}?author_email=${encodeURIComponent(userEmail)}`
        );

        if (!response.ok) {
          throw new Error("Det gick inte att hämta inlägg.");
        }

        const raw = await response.json();

        if (!mounted) return;

        const payload = Array.isArray(raw) ? raw : [];

        const mapped = payload.map((item: unknown) => {
          const p = item as Record<string, unknown>;
          const tagsFromArray = Array.isArray(p.tags)
            ? (p.tags as unknown[]).filter(Boolean).map(String)
            : undefined;
          const tagsFromString =
            typeof p.tagg === "string" && p.tagg.trim()
              ? String(p.tagg)
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : undefined;

          return {
            ...(p as Record<string, unknown>),
            created_at: normalizeCreatedAt(p.created_at),
            tags: tagsFromArray ?? tagsFromString,
          } as ProfilePost;
        });

        setPosts(mapped as ProfilePost[]);
      } catch (error) {
        if (!mounted) return;

        const msg =
          error instanceof Error
            ? error.message
            : "Det gick inte att hämta inlägg.";
        setPosts([]);
        setErrorMessage(
          msg.includes("Failed to fetch")
            ? "Kunde inte nå servern. Försök igen senare."
            : "Det gick inte att hämta inlägg."
        );
      } finally {
        if (mounted) {
          setIsPostsLoading(false);
        }
      }
    }

    loadProfile();
    loadPosts();

    return () => {
      mounted = false;
    };
  }, [userEmail]);

  const displayName =
    `${firstName} ${lastName}`.trim() || getDisplayName(currentEmail);
  const initials =
    getInitials(displayName) || currentEmail.slice(0, 2).toUpperCase();
  const offeredPosts = posts.filter(
    (post) => post.help_type === "giveHelp"
  ).length;
  const seekingPosts = posts.filter(
    (post) => post.help_type === "getHelp"
  ).length;
  const isLoading = isProfileLoading || isPostsLoading;
  const isFormLocked = isReadOnly || !isEditing || isLoading || isSaving;

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${PROFILE_API_BASE}/${encodeURIComponent(userEmail)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            email: currentEmail,
            first_name: firstName,
            last_name: lastName,
            bio,
          }),
        }
      );

      const payload = (await response.json().catch(() => null)) as {
        email?: string;
        first_name?: string | null;
        last_name?: string | null;
        bio?: string | null;
        message?: string;
      } | null;

      if (!response.ok) {
        throw new Error(
          payload?.message ?? "Det gick inte att spara profilen."
        );
      }

      const nextEmail = payload?.email ?? currentEmail;
      setCurrentEmail(nextEmail);
      setFirstName(payload?.first_name ?? firstName);
      setLastName(payload?.last_name ?? lastName);
      setBio(payload?.bio ?? bio);
      setStatusMessage("Profilen sparades.");
      setIsEditing(false);
      onProfileUpdated?.(nextEmail);

      const refreshedPosts = await fetch(
        `${POSTS_API_BASE}?author_email=${encodeURIComponent(nextEmail)}`
      );

      if (refreshedPosts.ok) {
        const payload = (await refreshedPosts.json()) as ProfilePost[];
        const mapped = payload.map((p) => ({
          ...p,
          created_at: normalizeCreatedAt(p.created_at),
        }));
        setPosts(mapped as ProfilePost[]);
      }
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Det gick inte att spara profilen.";
      setErrorMessage(
        msg.includes("Failed to fetch")
          ? "Kunde inte nå servern på http://localhost:3001 — kontrollera att backend körs."
          : msg
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full min-w-0 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <section className="overflow-hidden rounded-[28px] border border-Colors-border bg-Colors-card shadow-[0px_8px_24px_-8px_rgba(22,26,38,0.08),0px_1px_3px_0px_rgba(22,26,38,0.05)]">
          <div className="relative h-44 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-r from-[#0f766e] via-[#16a34a] to-[#15803d]" />
            <div className="absolute inset-x-0 top-28 h-16 bg-Colors-card" />

            <div className="absolute inset-x-0 top-18 flex items-start justify-between px-5 pb-4 sm:px-7">
              <div className="flex items-end gap-4">
                <div className="flex size-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-Colors-card bg-[#D3FBD5] text-3xl font-bold text-[#166534] shadow-[0px_8px_24px_-8px_rgba(22,26,38,0.12)]">
                  {initials}
                </div>
                <div className="hidden flex-col gap-1 pb-1 sm:flex">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                    Profil
                  </div>
                  <div className="text-sm text-white/85">
                    Inloggad som {currentEmail}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 self-end pb-1.5">
                {isReadOnly && onBack ? (
                  <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-3xl border border-Colors-border bg-Colors-card px-4 text-sm font-semibold text-Colors-foreground transition-opacity hover:opacity-90"
                  >
                    Tillbaka
                  </button>
                ) : null}

                {!isReadOnly ? (
                  <button
                    type="button"
                    onClick={() => {
                      setStatusMessage("");
                      setErrorMessage("");
                      setIsEditing((prev) => !prev);
                    }}
                    disabled={isLoading || isSaving}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-3xl border border-Colors-border bg-Colors-card px-4 text-sm font-semibold text-Colors-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isEditing ? "Avbryt" : "Redigera"}
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 px-5 pb-6 sm:px-7">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-[#161a26] sm:text-3xl">
                {displayName}
              </h2>
              <p className="max-w-3xl text-base leading-7 text-Colors-muted-foreground">
                {isReadOnly
                  ? "Här kan du läsa mer om användaren och se personens inlägg."
                  : "Uppdatera dina kontaktuppgifter och en kort presentation av dig själv här."}
              </p>
            </div>

            <form className="grid gap-4 sm:grid-cols-2" onSubmit={saveProfile}>
              <label className="flex flex-col gap-2 sm:col-span-1">
                <span className="text-sm font-semibold text-[#161a26]">
                  Förnamn
                </span>
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  disabled={isFormLocked}
                  className="h-12 rounded-3xl border border-Colors-border bg-Colors-card px-4 text-base text-[#161a26] outline-none transition-shadow disabled:cursor-not-allowed disabled:bg-[#f3f4f6] disabled:text-[#6b7280] focus:shadow-[0px_0px_0px_4px_rgba(19,78,74,0.12)]"
                  placeholder="Förnamn"
                />
              </label>

              <label className="flex flex-col gap-2 sm:col-span-1">
                <span className="text-sm font-semibold text-[#161a26]">
                  Efternamn
                </span>
                <input
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  disabled={isFormLocked}
                  className="h-12 rounded-3xl border border-Colors-border bg-Colors-card px-4 text-base text-[#161a26] outline-none transition-shadow disabled:cursor-not-allowed disabled:bg-[#f3f4f6] disabled:text-[#6b7280] focus:shadow-[0px_0px_0px_4px_rgba(19,78,74,0.12)]"
                  placeholder="Efternamn"
                />
              </label>

              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="text-sm font-semibold text-[#161a26]">
                  E-post
                </span>
                <input
                  type="email"
                  value={currentEmail}
                  onChange={(event) => setCurrentEmail(event.target.value)}
                  disabled={isFormLocked}
                  className="h-12 rounded-3xl border border-Colors-border bg-Colors-card px-4 text-base text-[#161a26] outline-none transition-shadow disabled:cursor-not-allowed disabled:bg-[#f3f4f6] disabled:text-[#6b7280] focus:shadow-[0px_0px_0px_4px_rgba(19,78,74,0.12)]"
                  placeholder="namn@exempel.se"
                />
              </label>

              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="text-sm font-semibold text-[#161a26]">
                  Om dig själv
                </span>
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  disabled={isFormLocked}
                  className="min-h-32 rounded-3xl border border-Colors-border bg-Colors-card px-4 py-3 text-base text-[#161a26] outline-none transition-shadow placeholder:text-Colors-muted-foreground disabled:cursor-not-allowed disabled:bg-[#f3f4f6] disabled:text-[#6b7280] focus:shadow-[0px_0px_0px_4px_rgba(19,78,74,0.12)]"
                  placeholder="Skriv något om vad du kan hjälpa till med, språk du talar eller vad du söker hjälp med."
                />
              </label>

              <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-1">
                {!isReadOnly && isEditing ? (
                  <button
                    type="submit"
                    disabled={isSaving || isLoading}
                    className="inline-flex h-11 items-center justify-center rounded-3xl bg-Colors-foreground px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving ? "Sparar..." : "Spara ändringar"}
                  </button>
                ) : !isReadOnly ? (
                  <span className="text-sm text-Colors-muted-foreground">
                    Fälten är låsta. Tryck på Redigera för att uppdatera din
                    profil.
                  </span>
                ) : (
                  <span className="text-sm text-Colors-muted-foreground">
                    Visningsläge för profil.
                  </span>
                )}

                {isLoading ? (
                  <span className="text-sm text-Colors-muted-foreground">
                    Laddar profil och inlägg...
                  </span>
                ) : null}
                {statusMessage ? (
                  <span className="text-sm font-medium text-green-700">
                    {statusMessage}
                  </span>
                ) : null}
                {errorMessage ? (
                  <span className="text-sm font-medium text-red-600">
                    {errorMessage}
                  </span>
                ) : null}
              </div>
            </form>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-orange-50/70 px-3 py-4 text-center ring-1 ring-inset ring-[#e9e4dc]">
                <div className="text-lg font-bold text-[#161a26]">
                  {posts.length}
                </div>
                <div className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-Colors-muted-foreground">
                  Inlägg
                </div>
              </div>
              <div className="rounded-2xl bg-orange-50/70 px-3 py-4 text-center ring-1 ring-inset ring-[#e9e4dc]">
                <div className="text-lg font-bold text-[#161a26]">
                  {offeredPosts}
                </div>
                <div className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-Colors-muted-foreground">
                  Erbjuder
                </div>
              </div>
              <div className="rounded-2xl bg-orange-50/70 px-3 py-4 text-center ring-1 ring-inset ring-[#e9e4dc]">
                <div className="text-lg font-bold text-[#161a26]">
                  {seekingPosts}
                </div>
                <div className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-Colors-muted-foreground">
                  Söker
                </div>
              </div>
            </div>

            {bio.trim() ? (
              <div className="rounded-3xl border border-Colors-border bg-[#f8faf7] px-4 py-4 text-sm leading-6 text-[#334155]">
                <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-Colors-muted-foreground">
                  Om mig
                </div>
                {bio}
              </div>
            ) : null}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-[#161a26]">
              {isReadOnly ? "Inlägg" : "Dina inlägg"}
            </h3>
            <span className="rounded-full bg-Colors-muted px-3 py-1 text-xs font-semibold text-Colors-muted-foreground">
              {posts.length} st
            </span>
          </div>

          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-3xl border border-Colors-border bg-Colors-card p-5 shadow-[0px_8px_24px_-8px_rgba(22,26,38,0.08),0px_1px_3px_0px_rgba(22,26,38,0.05)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#D3FBD5] text-sm font-semibold text-[#166534]">
                        {getInitials(
                          `${post.first_name ?? ""} ${post.last_name ?? ""}`.trim() ||
                            displayName
                        )}
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <div className="truncate text-sm font-semibold text-[#161a26]">
                          {`${post.first_name ?? firstName} ${post.last_name ?? lastName}`.trim() ||
                            displayName}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-Colors-muted-foreground">
                          <span>{formatTimeAgo(post.created_at)}</span>
                          <span>·</span>
                          <span>{formatHelpLabel(post.help_type)}</span>
                        </div>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-green-400/20 px-3 py-1 text-xs font-semibold text-[#166534]">
                      {formatHelpLabel(post.help_type)}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <h4 className="text-lg font-bold leading-6 text-[#161a26]">
                      {post.title ?? "Utan rubrik"}
                    </h4>
                    <p className="text-sm leading-6 text-Colors-muted-foreground">
                      {post.description ?? "Ingen beskrivning."}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.category ? (
                      <span className="rounded-full bg-[#D3FBD5] px-2.5 py-1 text-xs font-medium text-[#166534]">
                        {post.category}
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#D3FBD5] px-2.5 py-1 text-xs font-medium text-[#166534]">
                        Okänd kategori
                      </span>
                    )}

                    {post.tags && post.tags.length > 0
                      ? post.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-Colors-muted px-2.5 py-1 text-xs font-medium text-Colors-muted-foreground"
                          >
                            {t}
                          </span>
                        ))
                      : null}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-Colors-border bg-Colors-card p-6 text-sm text-Colors-muted-foreground">
                Du har inga inlägg ännu.
              </div>
            )}
          </div>
        </section>

        {/* reviews removed */}
      </div>
    </div>
  );
}
