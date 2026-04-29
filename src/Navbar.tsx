import { Link } from "react-router-dom";

function Navbar() {

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: "smooth" })
    
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#f2ede385] border-b border-[rgb(229,221,208)] shadow-[0_10px_30px_rgba(120,100,70,0.14)]">
      <nav className="w-full px-4 sm:px-6 py-3 md:py-4 flex items-center justify-between">

        <div className="text-[20px] sm:text-[20px] font-black tracking-[0.24em] sm:tracking-[0.3em] uppercase">
          Volly
        </div>
    
        <div className="flex justify-end gap-4 sm:gap-6">
          {[
            { id: "Vision", label: "Vår vision" },
            { id: "Funkar", label: "Hur volly fungerar" },
          ].map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="px-4 py-2 text-[10px] uppercase tracking-[0.4em] text-[#000000] rounded-full transition-all duration-200 hover:text-[#bbb7b1] hover:bg-[rgba(214,207,196,0.75)] hover:shadow-[0_8px_25_rgba(120,100,70,0.2)] hover:-translate-y-px"
            >
              {link.label}
            </button>
          ))}
          <Link
            to="/faq"
            className="px-4 py-2 text-[10px] uppercase tracking-[0.4em] text-[#000000] rounded-full transition-all duration-200 hover:text-[#bbb7b1] hover:bg-[rgba(214,207,196,0.75)] hover:shadow-[0_8px_25_rgba(120,100,70,0.2)] hover:-translate-y-px"
          >
            FAQ
          </Link>
        </div>
      </nav>
    </header>

  )
}

export default Navbar