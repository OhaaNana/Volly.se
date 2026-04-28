import type { ReactNode } from "react";
import Navbar from "./Navbar";

type HomePageProps = {
  children: ReactNode;
};

function HomePage({ children }: HomePageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <Navbar />

      <main className="grow flex items-center justify-center">
        <div className="mt-12 w-full max-w-7xl md:mt-16">{children}</div>
      </main>

      <section
        id="Vision"
        className="scroll-mt-28 w-full max-w-7xl self-center px-8 py-10 sm:px-12 md:px-20 md:py-14"
      >
        <h1 className="mt-3 text-6xl text-center font-black tracking-tight text-black sm:text-7xl md:text-8xl">
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
            lever.
          </p>
        <div>
          <h1></h1>
        </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
