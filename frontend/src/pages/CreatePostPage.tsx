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

const fieldShadow =
  "shadow-[0px_4px_16px_0px_rgba(22,26,38,0.05),0px_1px_2px_0px_rgba(22,26,38,0.04)]";

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
    "flex-1 min-w-0 p-5 bg-Colors-card rounded-2xl outline outline-2 -outline-offset-2 outline-Colors-border inline-flex flex-col justify-start items-start text-left transition-[outline-color,outline-width]";

  return (
    <div className="w-full max-w-250 min-h-0 py-6 inline-flex flex-col justify-start items-center overflow-hidden">
      <div className="w-full max-w-2xl px-4 py-6 flex flex-col justify-start items-start gap-1">
        <div className="w-full max-w-2xl pb-6 flex flex-col justify-start items-start gap-1 overflow-hidden">
          <div className="self-stretch pb-1 inline-flex justify-center items-center">
            <h1 className="flex-1 justify-start text-Colors-foreground text-3xl font-bold font-['DM_Sans']">
              Skapa nytt inlägg
            </h1>
          </div>
          <p className="self-stretch justify-start text-Colors-muted-foreground text-base font-medium font-['DM_Sans']">
            Berätta vad du behöver - eller vad du kan bidra med.
          </p>
        </div>

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
                  ? "outline-Colors-foreground"
                  : "hover:outline-Colors-muted-foreground/40"
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
                  ? "outline-Colors-foreground"
                  : "hover:outline-Colors-muted-foreground/40"
              }`}
            >
              <div className="w-6 h-6 pb-2 flex flex-col justify-center items-center">
                <i
                  aria-hidden
                  className="fi fi-rr-heart-partner-handshake text-[20px] leading-none text-Colors-foreground"
                />
              </div>
              <div className="self-stretch inline-flex justify-center items-center gap-2.5">
                <span className="flex-1 justify-start text-Colors-foreground text-base font-semibold font-['DM_Sans']">
                  Erbjuder hjälp
                </span>
              </div>
              <div className="self-stretch pt-0.5 inline-flex justify-center items-center gap-2.5">
                <span className="flex-1 justify-start text-Colors-muted-foreground text-xs font-normal font-['DM_Sans']">
                  Erbjud din hjälp till någon som behöver.
                </span>
              </div>
            </button>
          </div>

          <label className="self-stretch flex flex-col justify-start items-start gap-2">
            <span className="justify-start text-Colors-foreground text-base font-semibold font-['DM_Sans']">
              Rubrik
            </span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Text"
              required
              className={`self-stretch h-12 px-4 bg-Colors-card rounded-3xl ${fieldShadow} outline outline-1 -outline-offset-1 outline-Colors-border text-Colors-foreground placeholder:text-Colors-muted-foreground text-base font-normal font-['DM_Sans']`}
            />
          </label>

          <label className="self-stretch flex flex-col justify-start items-start gap-2">
            <span className="justify-start text-Colors-foreground text-base font-semibold font-['DM_Sans']">
              Beskrivning
            </span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Text"
              rows={4}
              required
              className={`self-stretch min-h-28 p-4 bg-Colors-card rounded-2xl ${fieldShadow} outline outline-1 -outline-offset-1 outline-Colors-border text-Colors-foreground placeholder:text-Colors-muted-foreground text-base font-normal font-['DM_Sans'] resize-y`}
            />
          </label>

          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="justify-start text-Colors-foreground text-base font-semibold font-['DM_Sans']">
                Kategori
              </span>
              {!category ? (
                <span className="text-rose-700 text-xs font-medium font-['DM_Sans']">
                  Välj en kategori
                </span>
              ) : null}
            </div>
            <div className="self-stretch inline-flex justify-start items-start gap-2.5 flex-wrap content-start overflow-hidden">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  aria-pressed={category === c.id}
                  className={`${categoryChip} ${c.bg} ${
                    category === c.id
                      ? "outline-2 -outline-offset-2 outline-Colors-foreground"
                      : "min-h-7"
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
                  className={`${tagChipBase} bg-Colors-muted text-Colors-muted-foreground ${
                    tags.includes(t)
                      ? "outline outline-2 -outline-offset-1 outline-Colors-foreground"
                      : "outline outline-1 -outline-offset-1 outline-transparent hover:outline-Colors-border"
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
              className="flex-1 h-12 p-2.5 rounded-3xl outline outline-1 -outline-offset-1 outline-Colors-border inline-flex flex-col justify-center items-center bg-transparent hover:bg-Colors-muted/50 transition-colors"
            >
              <span className="justify-start text-Colors-foreground text-base font-semibold font-['DM_Sans'] leading-5">
                Avbryt
              </span>
            </button>
            <button
              type="submit"
              disabled={!category}
              className={`flex-1 h-12 p-2.5 rounded-3xl ${fieldShadow} inline-flex flex-col justify-center items-center bg-gradient-to-br from-orange-300 to-red-400 hover:opacity-95 disabled:opacity-40 disabled:pointer-events-none transition-opacity`}
            >
              <span className="justify-start text-Colors-warm-foreground text-base font-semibold font-['DM_Sans'] leading-5">
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
                  className="justify-start text-Colors-foreground text-xl font-bold font-['DM_Sans']"
                >
                  Avbryt inlägg?
                </div>
                <div
                  id="cancel-post-desc"
                  className="justify-start text-Colors-muted-foreground text-sm font-normal font-['DM_Sans']"
                >
                  Det du skrivit kommer inte att sparas.
                </div>
              </div>
            </div>
            <div className="self-stretch h-11 inline-flex justify-start items-start gap-2 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 self-stretch rounded-3xl outline outline-1 -outline-offset-1 outline-Colors-border inline-flex flex-col justify-center items-center overflow-hidden hover:bg-Colors-muted/40 transition-colors"
              >
                <span className="text-center justify-center text-Colors-foreground text-base font-semibold font-['DM_Sans']">
                  Fortsätt skriva
                </span>
              </button>
              <button
                type="button"
                onClick={confirmDiscard}
                className="flex-1 self-stretch bg-red-500 rounded-3xl shadow-[0px_4px_16px_0px_rgba(22,26,38,0.05),0px_1px_2px_0px_rgba(22,26,38,0.04)] outline outline-1 -outline-offset-1 outline-Colors-border inline-flex flex-col justify-center items-center hover:bg-red-600 transition-colors"
              >
                <span className="text-center justify-center text-Colors-card text-base font-semibold font-['DM_Sans']">
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
