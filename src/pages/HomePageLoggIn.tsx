import Navbar from "../Navbar";

type HomePageLoggedInProps = {
  currentUser: string;
  onLogout: () => void;
};

function HomePageLoggedIn({ currentUser, onLogout }: HomePageLoggedInProps) {
  return (
    <div>
        <div className="min-h-screen bg-white flex flex-col p-6">
            <Navbar />
        </div>
        <div id="HomePageLoggedIn" className="scroll-mt-24 ">
        <p>
            You are logged in as: <strong>{currentUser}</strong>
        </p>

        <button type="button" onClick={onLogout}>
            Log out
        </button>

        <h1>hej på dig kan du se detta </h1>
        </div>
    </div>
    
  );
}

export default HomePageLoggedIn;