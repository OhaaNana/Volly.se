import type { ReactNode } from "react";
import Navbar from "./Navbar";
import upArrow from "./assets/upArrow.png";



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

      <main className="grow flex items-center justify-center">
        <div className="mt-12 w-full max-w-7xl md:mt-16">{children}</div>
      </main>

      <section
        id="Vision"
        className="scroll-mt-28 w-full max-w-7xl self-center px-8 py-10 sm:px-12 md:px-20 md:py-14"
      >
        <h1 className="mt-3 text-5xl text-center font-black tracking-tight text-black sm:text-7xl md:text-5xl">
          VÅR VISION
        </h1>
        <div className="mt-6 max-w-5xl space-y-6 text-xl leading-10 text-black/80 sm:text-2xl sm:leading-[2.7rem]">
          <p>
            På Volly tror vi på kraften i människor som hjälper människor. Vår
            vision är att göra volontärarbete till en naturlig del av vardagen,
            där det ska kännas enkelt, meningsfullt och tillgängligt att bidra,
            oavsett vem du är eller var du befinner dig.
          </p>
          <p>
            Vi vill bygga en plattform som för människor närmare varandra,
            stärker lokala gemenskaper och skapar verklig förändring över tid.
            Genom att koppla rätt person till rätt insats i rätt ögonblick vill
            vi göra omtanke till handling och tillsammans skapa en framtid där
            samarbete, medmänsklighet och ansvar är en självklar del av hur vi
            .Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
        <div id="Funkar" className="mt-6 max-w-5xl space-y-6 text-xl leading-10 text-black/80 sm:text-2xl sm:leading-[2.7rem]">
          <h1 className="mt-20 text-6xl text-center font-black tracking-tight text-black sm:text-7xl md:text-5xl">Hur Volly fungerar</h1>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
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


      <section id="CreateAccount" className="w-full bg-[#eeeeee] py-20 px-8 flex flex-col items-center text-center">
        <div className="w-full max-w-5xl flex flex-col items-center">
          <h2 className="text-4xl font-medium mb-4 text-black">Skapa konto</h2>

          <div className="mt-10 w-full max-w-md flex flex-col items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // placeholder: implement signup flow
              console.log("Skapa konto skickat");
            }}
            className="w-full flex flex-col gap-4"
          >
            <input
              name="name"
              placeholder="Namn"
              className="w-full border-2 border-black p-3 rounded-lg bg-white placeholder:text-gray-400"
            />

            <input
              name="email"
              type="email"
              placeholder="E-post"
              className="w-full border-2 border-black p-3 rounded-lg bg-white placeholder:text-gray-400"
            />

            <input
              name="password"
              type="password"
              placeholder="Lösenord"
              className="w-full border-2 border-black p-3 rounded-lg bg-white placeholder:text-gray-400"
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-4 mt-4 font-bold rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Skapa konto
            </button>
          </form>
        </div>
        </div>
      </section>

      <footer className="mt-auto w-full bg-[#e5e5e5] min-h-[20vh] flex items-center justify-between px-6 py-4 flex-row-reverse">
      


        <h1 className="mt-3 text-right text-5xl font-black">Volly</h1>
        <p>hjadsbjcf</p>
        <p>info@volly.se</p>
        <p>hjadsbjcf</p>
        <p>@2026</p>
        
      </footer>
    </div>
  );
}

export default HomePage;
