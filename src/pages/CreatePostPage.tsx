import { useState } from "react";

type Props = {
  onSubmit: (post: { title: string; content: string }) => void;
};

export default function CreatePostPage({ onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content });
    setTitle("");
    setContent("");
  };

  return (
    <div className="w-[750px] max-w-[750px] p-10 bg-white-3 rounded-[30px] outline outline-1 outline-offset-[-1px] outline-stone-300/40 flex flex-col justify-start items-start gap-6 overflow-hidden">
      <div className="self-stretch py-2.5 flex flex-col justify-start items-start gap-2.5">
        <h2 className="justify-start text-dark-gray text-4xl font-bold font-['DM_Sans'] leading-10">
          Skapa inlägg
        </h2>
        <div className="self-stretch justify-start text-neutral-500 text-lg font-normal font-['DM_Sans'] leading-7">
          Skriv en titel och en beskrivning så publicerar vi ditt inlägg.
        </div>
      </div>

      <form className="self-stretch flex flex-col justify-start items-start gap-4" onSubmit={submit}>
        <label className="block">
          <div className="justify-start text-dark-gray text-base font-semibold font-['DM_Sans'] leading-5">
            Titel
          </div>
          <input
            className="mt-2 w-[750px] max-w-[750px] p-3.5 bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-stone-300/40 text-dark-gray placeholder:text-zinc-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Skriv en rubrik"
            required
          />
        </label>

        <label className="block">
          <div className="justify-start text-dark-gray text-base font-semibold font-['DM_Sans'] leading-5">
            Text
          </div>
          <textarea
            className="mt-2 w-[750px] max-w-[750px] p-3.5 bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-stone-300/40 text-dark-gray placeholder:text-zinc-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Vad vill du dela?"
            rows={6}
            required
          />
        </label>

        <div className="self-stretch pt-2.5 inline-flex justify-end items-center gap-3">
          <button
            type="submit"
            className="px-10 py-3.5 bg-orange-300 rounded-3xl outline outline-1 outline-offset-[-1px] outline-zinc-400/30 inline-flex justify-center items-center gap-2.5 overflow-hidden hover:opacity-90"
          >
            <div className="justify-center text-dark-gray text-base font-semibold font-['DM_Sans'] leading-5">
              Lägg upp
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}
