import type { ReactNode } from "react";
import upArrow from "./assets/upArrow.png";
import Footer from "./components/footer";
import Navbar from "./Navbar";

type HomePageProps = {
  children: ReactNode;
};

const scroll = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

function HomePage({ children }: HomePageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="w-full">
        <div className="w-full">{children}</div>
      </main>

      <section
        id="Vision"
        className="self-stretch px-20 py-28 bg-white inline-flex justify-center items-start gap-12 overflow-hidden"
      >
        <div className="flex-1 max-w-[900px] inline-flex flex-col justify-start items-start gap-6">
          <div className="self-stretch h-16 justify-start text-black text-5xl font-medium font-['DM_Sans'] leading-[68px]">
            Vår Vision
          </div>
          <div className="self-stretch justify-start text-black/80 text-xl font-normal font-['DM_Sans'] leading-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </div>
          <div className="self-stretch pt-6 inline-flex justify-start items-center gap-[5px]">
            <div className="justify-start text-black text-xl font-medium font-['DM_Sans'] leading-8">
              Läs mer
            </div>
            {/* Lägg till down arrow icon */}
          </div>
        </div>
      </section>

      <button
        onClick={scroll}
        aria-label="Scroll to top"
        className="fixed bottom-40 right-6 z-50 rounded-full bg-white p-2 shadow-lg hover:scale-105 transition-transform"
      >
        <img src={upArrow} alt="pil" className="w-10 h-10 object-contain" />
      </button>

      <section
        id="Skapa konto"
        className="self-stretch px-20 py-48 bg-gray-200 inline-flex justify-center items-center"
      >
        <div
          data-property-1="Default"
          className="inline-flex flex-col justify-center items-center gap-12"
        >
          <div className="flex flex-col justify-start items-center gap-8">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch text-center justify-start text-black text-3xl font-medium font-['DM_Sans'] leading-8">
                Skapa konto
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="flex flex-col justify-start items-center gap-4"
            >
              <div className="self-stretch px-3 inline-flex justify-start items-start gap-2 overflow-hidden">
                <div className="w-44 h-10 px-3 py-2 bg-white rounded outline outline-2 outline-offset-[-2px] outline-black flex justify-start items-center gap-2">
                  <input
                    name="firstName"
                    placeholder="Förnamn *"
                    className="flex-1 opacity-50 justify-start text-black text-base font-normal font-['DM_Sans'] leading-5 line-clamp-1 bg-transparent border-none outline-none"
                  />
                </div>
                <div className="w-44 h-10 px-3 py-2 bg-white rounded outline outline-2 outline-offset-[-2px] outline-black flex justify-start items-center gap-2">
                  <input
                    name="lastName"
                    placeholder="Efternamn *"
                    className="flex-1 opacity-50 justify-start text-black text-base font-normal font-['DM_Sans'] leading-5 line-clamp-1 bg-transparent border-none outline-none"
                  />
                </div>
              </div>
              <div className="w-80 h-10 px-3 py-2 bg-white rounded outline outline-2 outline-offset-[-2px] outline-black inline-flex justify-start items-center gap-2">
                <input
                  name="email"
                  type="email"
                  placeholder="E-post *"
                  className="flex-1 opacity-50 justify-start text-black text-base font-normal font-['DM_Sans'] leading-5 line-clamp-1 bg-transparent border-none outline-none"
                />
              </div>
              <div className="w-80 h-10 px-3 py-2 bg-white rounded outline outline-2 outline-offset-[-2px] outline-black inline-flex justify-start items-center gap-2">
                <input
                  name="password"
                  type="password"
                  placeholder="Lösenord *"
                  className="flex-1 opacity-50 justify-start text-black text-base font-normal font-['DM_Sans'] leading-5 line-clamp-1 bg-transparent border-none outline-none"
                />
              </div>
              <div className="w-80 h-10 px-3 py-2 bg-white rounded outline outline-2 outline-offset-[-2px] outline-black inline-flex justify-start items-center gap-2">
                <input
                  name="repeatPassword"
                  type="password"
                  placeholder="Upprepa lösenord *"
                  className="flex-1 opacity-50 justify-start text-black text-base font-normal font-['DM_Sans'] leading-5 line-clamp-1 bg-transparent border-none outline-none"
                />
              </div>
              <label className="self-stretch px-3 py-2 inline-flex justify-start items-center gap-2 cursor-pointer">
                <div className="w-4 h-4 relative overflow-hidden">
                  <input
                    type="checkbox"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="w-3.5 h-3.5 left-[1.33px] top-[1.30px] absolute bg-black" />
                </div>
                <div className="justify-start text-black text-xs font-normal font-['DM_Sans'] leading-4">
                  Jag har läst och godkänner villkoren
                </div>
              </label>
              <button
                type="submit"
                className="w-80 h-10 px-12 bg-black rounded inline-flex justify-center items-center gap-2.5 overflow-hidden"
              >
                <div className="justify-start text-white text-base font-medium font-['DM_Sans'] leading-5">
                  Skapa konto
                </div>
              </button>
            </form>
          </div>
        </div>
      </section>

      <section
        id="Funkar"
        className="w-[1440px] h-[800px] px-20 inline-flex flex-col justify-start items-start"
      >
        <div className="self-stretch px-80 py-80 flex flex-col justify-center items-center gap-12 overflow-hidden">
          <div className="text-center justify-start text-black text-5xl font-normal font-['DM_Sans'] leading-[52px]">
            Hur Volly fungerar
          </div>
          <div className="px-24 flex flex-col justify-start items-start gap-6">
            <div className="w-[708px] px-24 inline-flex justify-center items-center gap-2">
              <div className="flex-1 text-center justify-start text-black text-xl font-normal font-['DM_Sans'] leading-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default HomePage;
