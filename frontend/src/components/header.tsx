export default function header() {
  return (
    <div className="self-stretch h-32 px-14 py-10 relative bg-neutral-200 inline-flex justify-between items-center">
      <div className="h-12 flex justify-start items-center gap-3">
        <div className="justify-start text-black text-5xl font-normal font-['Emblema_One'] leading-12">
          Volly
        </div>
      </div>
      <div className="flex justify-start items-start gap-9">
        <div className="justify-start text-black text-3xl font-normal font-['DM_Sans'] leading-8">
          Vår vision
        </div>
        <div className="justify-start text-black text-3xl font-normal font-['DM_Sans'] leading-8">
          Hur Volly fungerar
        </div>
        <div className="justify-start text-black text-3xl font-normal font-['DM_Sans'] leading-8">
          FAQ
        </div>
        <div className="justify-start text-black text-3xl font-normal font-['DM_Sans'] leading-8">
          Skapa konto
        </div>
      </div>
      <div className="w-400 h-0 -left-20 top-32 absolute outline-2 -outline-offset-1 outline-black/50" />
    </div>
  );
}
