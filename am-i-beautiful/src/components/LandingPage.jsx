import { useAppStore } from "@/store/appStore";
import { Sparkles, Key } from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const { setPage, apiKey, setApiKey, showApiKeyDialog, setShowApiKeyDialog } = useAppStore();
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Show dialog if no API key is set
    if (!apiKey) {
      setShowApiKeyDialog(true);
    }
  }, [apiKey, setShowApiKeyDialog]);

  const handleSaveApiKey = () => {
    const trimmedKey = inputKey.trim();
    if (!trimmedKey) {
      setError("Please enter a valid API key");
      return;
    }
    if (!trimmedKey.startsWith("AIza")) {
      setError("Invalid API key format. Should start with 'AIza'");
      return;
    }
    setApiKey(trimmedKey);
    setShowApiKeyDialog(false);
    setError("");
  };

  const handleEnterBooth = () => {
    if (!apiKey) {
      setShowApiKeyDialog(true);
      return;
    }
    setPage("camera");
  };

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
            onClick={handleEnterBooth}
            className="group relative inline-block focus:outline-none focus:ring"
          >
            <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-vintage-gold transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>
            <span className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-vintage-dark bg-vintage-cream group-active:text-opacity-75">
              Enter Booth
            </span>
          </button>

          {apiKey && (
            <button
              onClick={() => setShowApiKeyDialog(true)}
              className="mt-4 text-xs text-vintage-dark/60 hover:text-vintage-dark flex items-center gap-1 mx-auto"
            >
              <Key className="w-3 h-3" />
              Change API Key
            </button>
          )}
        </div>
      </div>

      {/* API Key Dialog */}
      {showApiKeyDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-vintage-cream border-4 border-vintage-dark p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-6 h-6 text-vintage-gold" />
              <h2 className="text-2xl font-display text-vintage-dark">Gemini API Key Required</h2>
            </div>
            
            <p className="text-sm text-vintage-dark/80 mb-4 leading-relaxed">
              This app uses Google's Gemini API to generate personalized compliments. 
              Please enter your API key to continue.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-bold text-vintage-dark mb-2">
                API Key:
              </label>
              <input
                type="password"
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSaveApiKey()}
                placeholder="AIza..."
                className="w-full px-4 py-2 border-2 border-vintage-dark bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-vintage-gold"
              />
              {error && (
                <p className="text-red-600 text-xs mt-1">{error}</p>
              )}
            </div>

            <div className="text-xs text-vintage-dark/60 mb-4 bg-yellow-50 border border-yellow-200 p-3 rounded">
              <p className="font-bold mb-1">📌 How to get an API key:</p>
              <ol className="list-decimal ml-4 space-y-1">
                <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google AI Studio</a></li>
                <li>Sign in with your Google account</li>
                <li>Click "Create API Key"</li>
                <li>Copy and paste it here</li>
              </ol>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSaveApiKey}
                className="flex-1 px-4 py-2 bg-vintage-dark text-vintage-cream font-bold tracking-wider hover:bg-gray-900 transition-colors"
              >
                Save Key
              </button>
              {apiKey && (
                <button
                  onClick={() => {
                    setShowApiKeyDialog(false);
                    setError("");
                    setInputKey("");
                  }}
                  className="px-4 py-2 border-2 border-vintage-dark text-vintage-dark font-bold tracking-wider hover:bg-vintage-dark hover:text-vintage-cream transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
