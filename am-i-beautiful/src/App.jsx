import { useAppStore } from "@/store/appStore";
import LandingPage from "@/components/LandingPage";
import CameraPage from "@/components/CameraPage";
import ResultPage from "@/components/ResultPage";

function App() {
  const { currentPage } = useAppStore();

  return (
    <div className="min-h-screen relative">
      <div className="film-grain" />
      <div className="vignette" />

      <main className="relative z-10 min-h-screen flex flex-col">
        {currentPage === "landing" && <LandingPage />}
        {currentPage === "camera" && <CameraPage />}
        {currentPage === "result" && <ResultPage />}
      </main>
    </div>
  );
}

export default App;
