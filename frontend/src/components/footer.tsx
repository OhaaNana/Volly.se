function Footer() {
  return (
    <div className="self-stretch px-12 pt-12 pb-6 bg-neutral-200 inline-flex flex-col justify-start items-start gap-3.5">
      <div className="self-stretch p-8 inline-flex justify-start items-start gap-24">
        <div className="self-stretch inline-flex flex-col justify-start items-start gap-3.5">
          <div className="justify-start text-black text-3xl font-medium font-['DM_Sans'] leading-6">
            Lorem Ipsum
          </div>
          <div className="flex flex-col justify-start items-start gap-2.5">
            <div className="self-stretch justify-start text-black text-xl font-normal font-['DM_Sans'] leading-6">
              Dolor sit amet
            </div>
            <div className="self-stretch justify-start text-black text-xl font-normal font-['DM_Sans'] leading-6">
              Consectetur adipiscing
            </div>
            <div className="self-stretch justify-start text-black text-xl font-normal font-['DM_Sans'] leading-6">
              Sed do eiusmod{" "}
            </div>
            <div className="self-stretch justify-start text-black text-xl font-normal font-['DM_Sans'] leading-6">
              tempor incididunt
            </div>
          </div>
        </div>
        <div className="self-stretch inline-flex flex-col justify-between items-start">
          <div className="flex flex-col justify-start items-start gap-3.5">
            <div className="justify-start text-black text-3xl font-medium font-['DM_Sans'] leading-6">
              Lorem Ipsum
            </div>
            <div className="justify-start text-black text-xl font-normal font-['DM_Sans'] leading-6">
              info@loremupsum.se
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-3.5">
            <div className="justify-start text-black text-3xl font-medium font-['DM_Sans'] leading-6">
              Lorem Ipsum
            </div>
            <div className="justify-start text-black text-xl font-normal font-['DM_Sans'] leading-6">
              Dolor sit amet Consectetur adipiscing
            </div>
          </div>
        </div>
        <div className="flex-1 self-stretch inline-flex flex-col justify-between items-end">
          <div className="py-16 flex flex-col justify-center items-end gap-2.5">
            <div className="opacity-70 justify-start text-black text-7xl font-normal font-['Emblema_One'] leading-6">
              Volly
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch flex flex-col justify-center items-center gap-[750px]">
        <div className="inline-flex justify-center items-center gap-2.5">
          <div className="justify-start text-black/40 text-xl font-normal font-['DM_Sans'] leading-6">
            © 2026 Volly
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
