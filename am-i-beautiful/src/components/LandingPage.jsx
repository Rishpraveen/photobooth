import { useAppStore } from "@/store/appStore";
import { Sparkles } from "lucide-react";

export default function LandingPage() {
  const { setPage } = useAppStore();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="border-4 border-vintage-dark p-2 mb-12 rotate-1 shadow-xl bg-white max-w-md w-full">
        <div className="border-2 border-vintage-dark p-8 bg-vintage-cream">
          <div className="mb-6 flex justify-center">
            <Sparkles className="w-12 h-12 text-vintage-gold animate-pulse" />
          </div>

          <h1 className="text-4xl md:text-6xl font-display mb-4 text-shadow-vintage tracking-wider">
            AM I<br />BEAUTIFUL?
          </h1>

          <div className="w-full h-px bg-vintage-dark/30 my-6" />

          <p className="text-lg md:text-xl mb-8 leading-relaxed opacity-80">
            "A mirror that speaks the truth of your soul."
          </p>

          <button
            onClick={() => setPage("camera")}
            className="group relative inline-block focus:outline-none focus:ring"
          >
            <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-vintage-gold transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>
            <span className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-vintage-dark bg-vintage-cream group-active:text-opacity-75">
              Enter Booth
            </span>
          </button>
        </div>
      </div>

      <footer className="text-sm opacity-50 font-bold tracking-widest mt-8">
        EST. 2025 • ADVANCED BIOMETRIC ANALYSIS
      </footer>

      {/* Fake Disclaimer */}
      <div className="mt-8 text-[10px] text-vintage-dark/40 text-center max-w-xs mx-auto leading-tight">
        * Disclaimer: This application is for research and entertainment purposes only. The biometric analysis is simulated and not a medical or scientific assessment. Results should not be taken as definitive judgments of beauty.
      </div>
    </div>
  );
}
