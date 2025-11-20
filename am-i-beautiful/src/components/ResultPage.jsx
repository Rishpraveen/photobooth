import { useEffect, useState } from "react";
import { useAppStore } from "@/store/appStore";
import { RefreshCw, Volume2, VolumeX, Users, User, Share2, Download, Sparkles } from "lucide-react";
import { calculateRarity, playSound } from "@/utils/gamification";

export default function ResultPage() {
    const { capturedImage, beautyDescription, isGenerating, setPage, reset, cameraMode } = useAppStore();
    const [displayedText, setDisplayedText] = useState("");
    const [isMuted, setIsMuted] = useState(false);
    const [revealState, setRevealState] = useState("analyzing"); // analyzing -> tension -> revealed
    const [voices, setVoices] = useState([]);
    const [tensionProgress, setTensionProgress] = useState(0);
    const [showBeautyPopup, setShowBeautyPopup] = useState(false);
    const [rarity, setRarity] = useState(null);

    // Calculate rarity once on mount
    useEffect(() => {
        const r = calculateRarity();
        setRarity(r);
    }, []);

    // Load voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    useEffect(() => {
        let interval;

        // Only start the flow when generation is complete
        if (!isGenerating && beautyDescription) {
            if (revealState === "analyzing") {
                // Wait a bit then switch to tension
                const timer = setTimeout(() => {
                    setRevealState("tension");
                    playSound('reveal');
                }, 1500);
                return () => clearTimeout(timer);
            } else if (revealState === "tension") {
                // Tension progress loop
                const duration = Math.floor(Math.random() * 2000) + 3000; // 3-5s
                const startTime = Date.now();

                interval = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min((elapsed / duration) * 100, 100);
                    setTensionProgress(progress);

                    if (progress >= 100) {
                        clearInterval(interval);
                        setRevealState("revealed");
                        setShowBeautyPopup(true);
                        playSound('stamp');
                        if (rarity && (rarity.id === 'epic' || rarity.id === 'legendary' || rarity.id === 'mythic')) {
                            playSound('fanfare');
                        }
                    }
                }, 50);
            }
        }
        return () => clearInterval(interval);
    }, [revealState, isGenerating, beautyDescription, rarity]);

    // Typewriter effect
    useEffect(() => {
        if (revealState === "revealed" && beautyDescription) {
            let i = 0;
            const interval = setInterval(() => {
                setDisplayedText(beautyDescription.slice(0, i + 1));
                i++;
                if (i > beautyDescription.length) {
                    clearInterval(interval);
                    if (!isMuted) {
                        speak(beautyDescription);
                    }
                }
            }, 50);
            return () => clearInterval(interval);
        }
    }, [revealState, beautyDescription, isMuted]); // Removed voices dependency to avoid re-triggering

    const speak = (text) => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1.1;

            // Try to find a female voice or a soft voice
            const preferredVoice = voices.find(v => v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Google US English"));
            if (preferredVoice) utterance.voice = preferredVoice;

            window.speechSynthesis.speak(utterance);
        }
    };

    const handleRetake = () => {
        window.speechSynthesis.cancel();
        reset();
        setPage("camera");
    };

    // Function to highlight exactly 2 key terms
    const renderHighlightedText = (text) => {
        if (!text) return null;

        const words = text.split(" ");
        const keyWordsList = ["symmetry", "radiance", "divine", "iconic", "flawless", "aesthetic", "golden", "ratio", "structure", "luminance", "harmony", "celestial", "legendary", "magnetic"];

        // Find all potential key terms with their indices
        const potentialTerms = words.map((word, index) => {
            const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");
            const isKeyWord = keyWordsList.includes(cleanWord.toLowerCase());
            const isLongWord = cleanWord.length > 7;

            return {
                index,
                word,
                cleanWord,
                score: isKeyWord ? 2 : (isLongWord ? 1 : 0)
            };
        }).filter(item => item.score > 0);

        // Sort by score and take top 2
        const topTerms = potentialTerms
            .sort((a, b) => b.score - a.score)
            .slice(0, 2)
            .map(item => item.index);

        return words.map((word, index) => {
            if (topTerms.includes(index)) {
                return <span key={index} className="highlight-term mx-1">{word}</span>;
            }
            return <span key={index}>{word} </span>;
        });
    };

    // New: download combined image + description
    const handleDownloadResult = async () => {
        if (!capturedImage) return;
        try {
            const img = new Image();
            img.src = capturedImage;
            await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });

            // Calculate dimensions - polaroid style with large image area
            const polaroidWidth = 800;
            const padding = 30; // White border
            const innerPadding = 15; // Gap between image and text
            
            // Image takes most space (3:4 ratio)
            const imageWidth = polaroidWidth - (padding * 2);
            const imageHeight = Math.floor(imageWidth * (4/3));
            
            // Compact text area
            const textAreaHeight = 100;
            const bottomPadding = 40;
            
            const totalHeight = padding + imageHeight + innerPadding + textAreaHeight + bottomPadding;

            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.width = polaroidWidth;
            canvas.height = totalHeight;
            const ctx = canvas.getContext('2d');

            // White polaroid background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw image with filters
            ctx.filter = 'sepia(0.4) contrast(1.1)';
            ctx.fillStyle = '#000000';
            ctx.fillRect(padding, padding, imageWidth, imageHeight);
            ctx.drawImage(img, padding, padding, imageWidth, imageHeight);
            ctx.filter = 'none';

            // Draw text
            const text = beautyDescription || displayedText;
            ctx.fillStyle = '#2C1810';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            
            const fontSize = text.length > 120 ? 16 : text.length > 80 ? 18 : 20;
            ctx.font = `${fontSize}px "Courier Prime", "Courier New", monospace`;

            // Word wrap
            const maxWidth = imageWidth - 40;
            const words = text.split(' ');
            const lines = [];
            let currentLine = '';

            words.forEach(word => {
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            });
            if (currentLine) lines.push(currentLine);

            // Draw text lines
            const lineHeight = fontSize * 1.4;
            let startY = padding + imageHeight + innerPadding + 15;

            lines.forEach(line => {
                ctx.fillText(line, canvas.width / 2, startY);
                startY += lineHeight;
            });

            // Export as PNG
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'photobooth_result.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 'image/png');
        } catch (e) {
            console.error('Combined download failed', e);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto min-h-0">
            <div className="polaroid-container relative bg-white p-2 sm:p-3 pb-4 sm:pb-6 shadow-2xl rotate-1 w-full max-w-[280px] sm:max-w-sm md:max-w-md animate-in zoom-in duration-500 my-auto">
                {/* Polaroid Image Area */}
                <div className="aspect-[3/4] bg-black w-full mb-2 overflow-hidden relative">
                    {capturedImage && (
                        <img
                            src={capturedImage}
                            alt="Captured"
                            className={`w-full h-full object-cover filter sepia-[0.4] contrast-110 transition-all duration-[2000ms] ${revealState !== 'revealed' ? 'blur-sm grayscale opacity-80' : 'blur-0 grayscale-0 opacity-100'}`}
                        />
                    )}
                </div>
                {/* Scanning Overlay */}
                {isGenerating && (
                    <div className="absolute inset-0 z-20 pointer-events-none">
                        <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,_transparent_1px),_linear-gradient(90deg,_rgba(0,255,0,0.1)_1px,_transparent_1px)] bg-[size:20px_20px] opacity-30" />
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-400/50 shadow-[0_0_15px_rgba(74,222,128,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
                        <div className="absolute bottom-4 left-0 w-full text-center">
                            <span className="inline-block px-2 py-1 bg-black/50 text-green-400 font-mono text-xs tracking-widest animate-pulse">
                                ANALYZING BIOMETRICS...
                            </span>
                        </div>
                        <AnimatedMetrics />
                    </div>
                )}

                {/* Tension Overlay */}
                {revealState === "tension" && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-center">
                        <div className="text-4xl md:text-5xl font-display text-white animate-pulse tracking-widest mb-6">
                            CALCULATING<br />VERDICT...
                        </div>
                        <TechnicalReasons />
                        <ProgressBar progress={tensionProgress} />
                    </div>
                )}

                {/* Rarity Stamp Overlay - Always visible when revealed */}
                {revealState === "revealed" && rarity && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden">
                        <div
                            className="border-4 sm:border-6 md:border-8 border-current px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 text-xl sm:text-3xl md:text-5xl font-black tracking-tighter uppercase rotate-[-15deg] opacity-0 animate-stamp-in"
                            style={{
                                color: rarity.color,
                                borderColor: rarity.color,
                                textShadow: '3px 3px 0px rgba(0,0,0,0.8)',
                                animationFillMode: 'forwards',
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                backdropFilter: 'blur(2px)'
                            }}
                        >
                            {rarity.label}
                        </div>

                        {/* Simple CSS Confetti for ALL tiers (more for high tiers) */}
                        <div className="absolute inset-0 overflow-hidden">
                            {[...Array(rarity.id === 'mythic' ? 30 : rarity.id === 'legendary' ? 20 : 15)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-confetti"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `-20px`,
                                        backgroundColor: ['#FFD700', '#FF69B4', '#00BFFF', '#32CD32', '#FF4500', '#9370DB'][Math.floor(Math.random() * 6)],
                                        animationDelay: `${Math.random() * 0.5}s`,
                                        animationDuration: `${Math.random() * 2 + 3}s`
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Beauty Popup Overlay */}
                {revealState === "revealed" && beautyDescription && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <BeautyPopup />
                    </div>
                )}

                {/* Result Text Area (Inside Polaroid) */}
                <div className="flex-1 w-full flex flex-col items-center justify-center text-center px-2 sm:px-3 md:px-4 py-3 sm:py-4 bg-white overflow-hidden min-h-[80px] sm:min-h-[100px] max-h-[140px]">
                    {revealState === "revealed" ? (
                        <p className="font-typewriter text-vintage-dark leading-snug" style={{
                            fontSize: displayedText.length > 120 ? '0.65rem' : displayedText.length > 80 ? '0.75rem' : '0.85rem'
                        }}>
                            {renderHighlightedText(displayedText)}
                            <span className="animate-pulse">|</span>
                        </p>
                    ) : (
                        <div className="w-full space-y-2 opacity-50">
                            <div className="h-2 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
                            <div className="h-2 bg-gray-200 rounded animate-pulse w-1/2 mx-auto" />
                        </div>
                    )}
                </div>
            </div>

            {/* Random Facts / Quotes */}
        {revealState === "revealed" && (
            <>
                <div className="mt-2 sm:mt-3 md:mt-4 max-w-md text-center opacity-70 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 px-3 sm:px-4">
                    <p className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-typewriter italic text-vintage-dark/80">
                        "Beauty is power; a smile is its sword."
                    </p>
                </div>

                {/* Motivational Message */}
                <div className="mt-2 sm:mt-2.5 md:mt-3 max-w-md text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 px-3 sm:px-4">
                    <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-bold text-vintage-dark bg-vintage-gold/20 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border border-vintage-gold">
                        ✨ Now go out there and BE CONFIDENT! ✨
                    </p>
                </div>
            </>
        )}

        {/* Controls */}
        <div className="mt-2 sm:mt-3 flex flex-col gap-2 pb-4 px-2">
        <div className="flex flex-wrap gap-2 justify-center">
            <button
                onClick={() => {
                    setIsMuted(!isMuted);
                    if (isMuted && beautyDescription) speak(beautyDescription);
                }}
                className="p-2 sm:p-3 rounded-full bg-vintage-cream border-2 border-vintage-dark text-vintage-dark hover:bg-vintage-sepia transition-colors"
            >
                {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <button
                onClick={handleRetake}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-vintage-dark text-vintage-cream font-bold tracking-widest border-2 border-vintage-gold hover:bg-gray-900 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
            >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                TRY AGAIN
            </button>

            <button
                onClick={handleDownloadResult}
                className="px-3 sm:px-4 py-2 bg-vintage-dark text-vintage-cream rounded-full flex items-center gap-1 sm:gap-2 hover:bg-vintage-sepia transition-colors text-xs sm:text-sm"
            >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">DOWNLOAD</span>
            </button>
        </div>

        {/* Friends Mode Prompt */}
        {cameraMode === 'friends' && (
            <div className="mt-3 sm:mt-4 p-4 sm:p-6 bg-vintage-cream border-2 border-vintage-gold rounded-lg text-center max-w-md mx-auto animate-in slide-in-from-bottom-4 duration-700">
                <p className="font-display text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3 text-vintage-dark">Looks like only one person is visible.</p>
                <p className="mb-3 sm:mb-4 text-sm sm:text-base text-vintage-dark/80">Invite a friend for a group vibe or switch to solo mode.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
                    <button
                        onClick={() => {
                            useAppStore.getState().setCameraMode('solo');
                            setPage('camera');
                        }}
                        className="px-5 py-2 bg-vintage-dark text-vintage-cream rounded-full hover:bg-vintage-sepia transition-colors flex items-center gap-2 text-sm font-bold tracking-wider"
                    >
                        <User className="w-4 h-4" /> SOLO MODE
                    </button>
                    <button
                        onClick={() => setPage('camera')}
                        className="px-5 py-2 bg-vintage-dark text-vintage-cream rounded-full hover:bg-vintage-sepia transition-colors flex items-center gap-2 text-sm font-bold tracking-wider"
                    >
                        <Users className="w-4 h-4" /> TRY WITH FRIEND
                    </button>
                </div>
            </div>
        )}
            </div>
        </div>
    );
}

function AnimatedMetrics() {
    const [metrics, setMetrics] = useState({
        symmetry: 0,
        radiance: 0,
        charm: 0
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics({
                symmetry: Math.floor(Math.random() * 15) + 85,
                radiance: Math.floor(Math.random() * 10) + 90,
                charm: Math.floor(Math.random() * 5) + 95
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1 pointer-events-none">
            <MetricItem label="SYMMETRY" value={metrics.symmetry} />
            <MetricItem label="RADIANCE" value={metrics.radiance} />
            <MetricItem label="CHARISMA" value={metrics.charm} />
            <span className="text-[10px] font-mono text-green-400 bg-black/60 px-1 animate-pulse">
                STATUS: OPTIMAL
            </span>
        </div>
    );
}

function MetricItem({ label, value }) {
    return (
        <span className="text-[10px] font-mono text-green-400 bg-black/60 px-1">
            {label}: {value}.{Math.floor(Math.random() * 9)}%
        </span>
    );
}

function BeautyPopup() {
    const words = ["DIVINE", "ETHEREAL", "ICONIC", "FLAWLESS", "LEGENDARY", "RADIANT", "MAGNETIC"];
    const [word, setWord] = useState("");
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setWord(words[Math.floor(Math.random() * words.length)]);

        const timer = setTimeout(() => {
            setVisible(false);
        }, 2500); // Disappear after 2.5s

        return () => clearTimeout(timer);
    }, []);

    if (!word || !visible) return null;

    return (
        <div className="animate-[pop-bounce_0.8s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
            <span className="beauty-popup text-5xl md:text-7xl font-display text-transparent bg-clip-text bg-gradient-to-b from-pink-300 to-purple-600 drop-shadow-2xl tracking-widest italic">
                {word}
            </span>
            <div className="absolute -inset-4 bg-pink-400/20 blur-xl rounded-full -z-10 animate-pulse" />
        </div>
    );
}

function TechnicalReasons() {
    const reasons = [
        "Analyzing Golden Ratio Alignment...",
        "Calculating Skin Luminance Index...",
        "Measuring Facial Symmetry Vector...",
        "Evaluating Jawline Geometry...",
        "Processing Eye Sparkle Density...",
        "Quantifying Charisma Output...",
        "Verifying Angelic Features...",
        "Detecting Main Character Energy..."
    ];
    const [currentReason, setCurrentReason] = useState(reasons[0]);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % reasons.length;
            setCurrentReason(reasons[i]);
        }, 400); // Change every 400ms

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-12 flex items-center justify-center">
            <p className="text-green-400 font-mono text-xs md:text-sm tracking-widest animate-pulse bg-black/50 px-2 py-1 rounded">
                {currentReason}
            </p>
        </div>
    );
}
function ProgressBar({ progress }) {
    return (
        <div className="w-64 h-2 bg-gray-700 rounded-full mt-4 overflow-hidden border border-gray-600">
            <div
                className="h-full bg-green-500 shadow-[0_0_10px_rgba(74,222,128,0.8)] transition-all duration-200 ease-out"
                style={{ width: `${Math.min(progress, 100)}% ` }}
            />
        </div>
    );
}
