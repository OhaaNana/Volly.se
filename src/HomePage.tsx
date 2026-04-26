import type { ReactNode } from "react";
import Navbar from "./Navbar";

type HomePageProps = {
  children: ReactNode;
};

function HomePage({ children }: HomePageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <Navbar />

      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-7xl">
          {children}
        </div>
      </main>
     
    </div>
  );

  
}

export default HomePage;