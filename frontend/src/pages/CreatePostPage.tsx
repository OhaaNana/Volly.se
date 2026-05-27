import { useEffect, useState } from "react";

export type CreatePostPayload = {
  title: string;
  content: string;
  postType: "seek" | "offer";
  category: string;
  tags: string[];
};

type Props = {
  onSubmit: (post: CreatePostPayload) => void;
  onCancel?: () => void;
};

const CATEGORIES: readonly {
  id: string;
  label: string;
  bg: string;
  text: string;
}[] = [
  { id: "teknik", label: "Teknik", bg: "bg-teal-200", text: "text-teal-800" },
  { id: "sprak", label: "Språk", bg: "bg-pink-200", text: "text-fuchsia-800" },
  {
    id: "socialt",
    label: "Socialt & sällskap",
    bg: "bg-orange-200",
    text: "text-orange-900",
  },
  { id: "karriar", label: "Karriär", bg: "bg-blue-200", text: "text-blue-900" },
  {
    id: "studier",
    label: "Studier",
    bg: "bg-green-200",
    text: "text-green-900",
  },
  {
    id: "dokument",
    label: "Dokument & byråkrati",
    bg: "bg-slate-300",
    text: "text-slate-900",
  },
  {
    id: "npf",
    label: "Funktionsvariation & NPF",
    bg: "bg-violet-200",
    text: "text-violet-900",
  },
  {
    id: "mental",
    label: "Mental hälsa",
    bg: "bg-rose-200",
    text: "text-rose-900",
  },
  {
    id: "vardag",
    label: "Vardag",
    bg: "bg-yellow-200",
    text: "text-yellow-900",
  },
] as const;

const TAG_OPTIONS = [
  "Chatt",
  "Videochatt",
  "NPF-vänlig",
  "Nybörjare",
  "Blind/nedsatt syn",
  "Anonym OK",
  "Tålamodig",
] as const;

const categoryChip =
  "px-3.5 py-2 rounded-3xl outline outline-1 -outline-offset-1 outline-Colors-border inline-flex flex-col justify-center items-start gap-1.5";

const tagChipBase =
  "px-2.5 py-1 rounded-3xl inline-flex flex-col justify-center items-center text-xs font-medium font-['DM_Sans'] leading-4 transition-[outline,background-color]";

export default function CreatePostPage({ onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<"seek" | "offer">("seek");
  const [category, setCategory] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const toggleTag = (label: string) => {
    setTags((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  const hasUnsavedChanges =
    title.trim() !== "" ||
    content.trim() !== "" ||
    category !== null ||
    tags.length > 0;

  const handleCancelClick = () => {
    if (hasUnsavedChanges) {
      setShowCancelConfirm(true);
    } else {
      onCancel?.();
    }
  };

  const confirmDiscard = () => {
    setShowCancelConfirm(false);
    setTitle("");
    setContent("");
    setPostType("seek");
    setCategory(null);
    setTags([]);
    onCancel?.();
  };

  useEffect(() => {
    if (!showCancelConfirm) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowCancelConfirm(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showCancelConfirm]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    const cat = CATEGORIES.find((c) => c.id === category);
    onSubmit({
      title,
      content,
      postType,
      category: cat?.label ?? category,
      tags,
    });
    setTitle("");
    setContent("");
    setPostType("seek");
    setCategory(null);
    setTags([]);
  };

  const postCardBase =
    "flex-1 min-w-0 p-5 bg-Colors-card rounded-2xl  border-2 border-border inline-flex flex-col justify-start items-start text-left transition-[outline-color,outline-width]";

  return (
    <div className="w-full min-w-0 self-stretch inline-flex flex-col justify-start items-center gap-8">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:py-10">
        <header className="mb-6">
          <h1 className="font-display mb-1 text-3xl font-bold tracking-tight">
            Skapa nytt inlägg
          </h1>
          <p className="text-muted-foreground">
            Berätta vad du behöver - eller vad du kan bidra med.
          </p>
        </header>

        <form
          className="self-stretch pb-6 flex flex-col justify-start items-start gap-6"
          onSubmit={submit}
        >
          <div className="self-stretch inline-flex justify-start items-stretch gap-3 max-sm:flex-col">
            <button
              type="button"
              onClick={() => setPostType("seek")}
              aria-pressed={postType === "seek"}
              className={`${postCardBase} ${
                postType === "seek"
                  ? "border-warm bg-warm/10 shadow-card"
                  : "border-border hover:bg-muted"
              }`}
            >
              <div className="w-6 h-6 pb-2 flex flex-col justify-center items-center">
                <i
                  aria-hidden
                  className="fi fi-br-search-heart text-[20px] leading-none text-Colors-foreground"
                />
              </div>
              <div className="self-stretch inline-flex justify-center items-center gap-2.5">
                <span className="flex-1 justify-start text-Colors-foreground text-base font-semibold font-['DM_Sans']">
                  Söker hjälp
                </span>
              </div>
              <div className="self-stretch pt-0.5 inline-flex justify-center items-center gap-2.5">
                <span className="flex-1 justify-start text-Colors-muted-foreground text-xs font-normal font-['DM_Sans']">
                  Be om hjälp från andra.
                </span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPostType("offer")}
              aria-pressed={postType === "offer"}
              className={`${postCardBase} ${
                postType === "offer"
                  ? "border-success bg-success/10 shadow-card"
                  : "border-border hover:bg-muted"
              }`}
            >
              <div className="w-6 h-6 pb-2 flex flex-col justify-center items-center">
                <i
                  aria-hidden
                  className="fi fi-rr-heart-partner-handshake text-[20px] leading-none text-foreground"
                />
              </div>
              <div className="self-stretch inline-flex justify-center items-center gap-2.5">
                <span className="flex-1 justify-start text-foreground text-base font-semibold">
                  Erbjuder hjälp
                </span>
              </div>
              <div className="self-stretch pt-0.5 inline-flex justify-center items-center gap-2.5">
                <span className="flex-1 justify-start text-muted-foreground text-xs font-normal">
                  Erbjud din hjälp till någon som behöver.
                </span>
              </div>
            </button>
          </div>

          <label className="self-stretch flex flex-col justify-start items-start gap-2">
            <span className="justify-start text-foreground text-base font-semibold">
              Rubrik
            </span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Beskriv kort vad ditt inlägg handlar om"
              required
              className="self-stretch h-12 px-4 bg-card rounded-3xl border border-border text-foreground placeholder:text-muted-foreground text-base font-normal shadow-soft focus:outline-none focus:ring focus:ring-ring"
            />
          </label>

          <label className="self-stretch flex flex-col justify-start items-start gap-2">
            <span className="justify-start text-Colors-foreground text-base font-semibold">
              Beskrivning
            </span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Berätta lite mer om vad du söker eller vill hjälpa till med."
              rows={4}
              required
              className="self-stretch min-h-28 p-4 bg-Colors-card rounded-2xl border border-border text-foreground placeholder:text-muted-foreground text-base font-normal resize-y shadow-soft focus:outline-none focus:ring focus:ring-ring"
            />
          </label>

          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="justify-start text-Colors-foreground text-base font-semibold">
                Kategori
              </span>
              {!category ? (
                <span className="text-destructive text-xs font-medium font-['DM_Sans']">
                  Välj en kategori
                </span>
              ) : null}
            </div>
            <div className="self-stretch inline-flex justify-start items-start gap-2.5 flex-wrap content-start">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  aria-pressed={category === c.id}
                  className={`${categoryChip} ${c.bg} ${
                    category === c.id
                      ? "outline-2 outline-muted-foreground/70"
                      : "min-h-7 outline outline-border hover:bg-muted"
                  }`}
                >
                  <span
                    className={`justify-start ${c.text} text-xs font-medium font-['DM_Sans'] leading-4`}
                  >
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <span className="justify-start text-Colors-foreground text-base font-semibold font-['DM_Sans']">
              Taggar
            </span>
            <div className="self-stretch inline-flex justify-start items-start gap-2.5 flex-wrap content-start">
              {TAG_OPTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t)}
                  aria-pressed={tags.includes(t)}
                  className={`${tagChipBase} bg-card outline-2 outline-border text-muted-foreground ${
                    tags.includes(t)
                      ? "bg-muted outline-muted-foreground/70"
                      : "hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="self-stretch pt-2 inline-flex justify-start items-stretch gap-3 max-sm:flex-col">
            <button
              type="button"
              onClick={handleCancelClick}
              className="flex-1 h-12 p-2.5 rounded-3xl border border-border inline-flex flex-col justify-center items-center bg-transparent hover:bg-muted hover:shadow-card transition-all"
            >
              <span className="justify-start text-foreground text-base font-semibold">
                Avbryt
              </span>
            </button>
            <button
              type="submit"
              disabled={!category}
              className="flex-1 h-12 p-2.5 rounded-3xl shadow-card inline-flex flex-col justify-center items-center bg-gradient-warm hover:shadow-glow disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <span className="justify-start text-Colors-warm-foreground text-base font-semibold">
                Publicera
              </span>
            </button>
          </div>
        </form>
      </div>

      {showCancelConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-post-title"
          aria-describedby="cancel-post-desc"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowCancelConfirm(false)}
        >
          <div
            className="w-96 max-w-full p-6 bg-Colors-card rounded-3xl shadow-[0px_8px_32px_0px_rgba(0,157,157,0.18)] inline-flex flex-col justify-start items-start"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="self-stretch pb-6 flex flex-col justify-start items-center gap-3 overflow-hidden">
              <div className="size-14 bg-red-500/20 rounded-[50px] inline-flex justify-center items-center gap-2.5">
                <i
                  aria-hidden
                  className="fi fi-rr-trash text-[24px] leading-none text-red-500"
                />
              </div>
              <div className="flex flex-col justify-start items-center gap-2">
                <div
                  id="cancel-post-title"
                  className="justify-start text-Colors-foreground text-xl font-bold"
                >
                  Avbryt inlägg?
                </div>
                <div
                  id="cancel-post-desc"
                  className="justify-start text-Colors-muted-foreground text-sm font-normal"
                >
                  Det du skrivit kommer inte att sparas.
                </div>
              </div>
            </div>
            <div className="self-stretch h-11 inline-flex justify-start items-start gap-2 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 self-stretch rounded-3xl border border-border inline-flex flex-col justify-center items-center overflow-hidden hover:bg-muted/40 transition-colors"
              >
                <span className="text-center justify-center text-Colors-foreground text-base font-semibold">
                  Fortsätt skriva
                </span>
              </button>
              <button
                type="button"
                onClick={confirmDiscard}
                className="flex-1 self-stretch bg-red-500 rounded-3xl shadow-[0px_4px_16px_0px_rgba(22,26,38,0.05),0px_1px_2px_0px_rgba(22,26,38,0.04)] border border-border inline-flex flex-col justify-center items-center hover:bg-red-600 transition-colors"
              >
                <span className="text-center justify-center text-Colors-card text-base font-semibold">
                  Ta bort inlägg
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
