import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { useAppStore } from "@/store/appStore";
import { Camera, RefreshCw, Users, User, Flame } from "lucide-react";
import { generateDescription } from "@/utils/ai";
import FaceMeshOverlay from "./FaceMeshOverlay";
import { updateStreak, playSound } from "@/utils/gamification";

export default function CameraPage() {
    const webcamRef = useRef(null);
    const { setCapturedImage, setBeautyDescription, setPage, setIsGenerating, cameraMode, setCameraMode } = useAppStore();
    const [isFlashing, setIsFlashing] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [faceDetected, setFaceDetected] = useState(false);
    const [showError, setShowError] = useState(false);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const { count } = updateStreak();
        setStreak(count);
    }, []);

    const faceDetectedRef = useRef(false);

    const handleFaceDetected = useCallback((detected) => {
        setFaceDetected(detected);
        faceDetectedRef.current = detected;
    }, []);

    const capture = useCallback(async () => {
        // Immediate validation before capture using Ref for fresh state
        if (!faceDetectedRef.current) {
            setShowError(true);
            setTimeout(() => setShowError(false), 2000);
            return;
        }

        playSound('shutter'); // Play shutter sound
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        setIsFlashing(true);

        setTimeout(() => {
            setIsFlashing(false);
            setPage("result");

            // Start AI generation in background
            setIsGenerating(true);
            generateDescription(imageSrc, cameraMode).then((desc) => {
                setBeautyDescription(desc);
                setIsGenerating(false);
            });
        }, 150);
    }, [setCapturedImage, setPage, setBeautyDescription, setIsGenerating, cameraMode]);

    const startCountdown = () => {
        if (!faceDetected) {
            setShowError(true);
            setTimeout(() => setShowError(false), 2000);
            return;
        }

        setCountdown(3);
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(interval);
                    capture();
                    return null;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Determine aspect ratio based on mode - keep container size consistent
    const aspectRatio = cameraMode === "friends" ? "aspect-video" : "aspect-[3/4]";

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
            {/* Streak Counter */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-black/50 px-3 py-1 rounded-full border border-orange-500/50 animate-in fade-in slide-in-from-top-4 duration-700">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                <span className="text-orange-500 font-bold font-mono text-sm">{streak} Day Streak</span>
            </div>

            <div className={`relative w-full max-w-md ${aspectRatio} bg-vintage-dark p-4 shadow-2xl rotate-1`}>
                {/* Viewfinder Frame */}
                <div className="relative w-full h-full bg-black overflow-hidden border-4 border-vintage-gold/30">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        mirrored={true}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "user" }}
                        className="w-full h-full object-cover filter sepia-[0.3] contrast-110"
                    />

                    {/* Face Mesh Overlay */}
                    <FaceMeshOverlay videoRef={webcamRef} onFaceDetected={handleFaceDetected} />

                    {/* Error Overlay */}
                    {showError && (
                        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/80 animate-in fade-in duration-200">
                            <div className="text-center p-4 border-2 border-red-500 bg-black text-red-500 font-mono">
                                <p className="text-xl font-bold mb-2">Error: Face not clear</p>
                                <p className="text-sm mb-1">Please ensure your face is fully visible and not covered.</p>
                                <p className="text-xs mt-2 opacity-70">Please step into the frame</p>
                            </div>
                        </div>
                    )}

                    {/* Flash Effect */}
                    {isFlashing && (
                        <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-500" />
                    )}

                    {/* Countdown Overlay */}
                    {countdown && (
                        <div className="absolute inset-0 flex items-center justify-center z-40">
                            <span className="text-9xl font-display text-white drop-shadow-lg animate-bounce">
                                {countdown}
                            </span>
                        </div>
                    )}

                    {/* Grid Lines */}
                    <div className="absolute inset-0 pointer-events-none opacity-30">
                        <div className="w-full h-1/3 border-b border-white/50 absolute top-0" />
                        <div className="w-full h-1/3 border-b border-white/50 absolute top-1/3" />
                        <div className="h-full w-1/3 border-r border-white/50 absolute left-0" />
                        <div className="h-full w-1/3 border-r border-white/50 absolute left-1/3" />
                    </div>
                </div>
            </div>

            {/* Mode Toggle */}
            <div className="mt-6 flex gap-2 bg-vintage-cream/50 p-1 rounded-full border-2 border-vintage-dark">
                <button
                    onClick={() => setCameraMode("solo")}
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${cameraMode === "solo" ? 'bg-vintage-dark text-vintage-cream' : 'text-vintage-dark hover:bg-vintage-sepia'}`}
                >
                    <User className="w-4 h-4" />
                    SOLO
                </button>
                <button
                    onClick={() => setCameraMode("friends")}
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${cameraMode === "friends" ? 'bg-vintage-dark text-vintage-cream' : 'text-vintage-dark hover:bg-vintage-sepia'}`}
                >
                    <Users className="w-4 h-4" />
                    FRIENDS
                </button>
            </div>

            {/* Anti-Screen Warning */}
            <div className="mt-4 max-w-md text-center bg-vintage-cream/70 border-2 border-vintage-dark px-4 py-2 rounded-lg">
                <p className="text-[10px] md:text-xs font-bold text-vintage-dark mb-1">
                    ⚠️ REAL FACES ONLY
                </p>
                <p className="text-[9px] md:text-[10px] text-vintage-dark/80">
                    Please don't show phone screens or photos to the camera. Want to share this with someone? Share the site link instead! 📲
                </p>
            </div>

            {/* Controls */}
            <div className="mt-6 flex gap-6 items-center">
                <button
                    onClick={() => setPage("landing")}
                    className="p-4 rounded-full bg-vintage-cream border-2 border-vintage-dark text-vintage-dark hover:bg-vintage-sepia transition-colors"
                >
                    <RefreshCw className="w-6 h-6" />
                </button>

                {/* Capture Button */}
                <button
                    onClick={startCountdown}
                    disabled={!!countdown}
                    className={`w-16 h-16 rounded-full bg-vintage-dark border-4 ${(faceDetected || cameraMode === "friends") ? 'border-vintage-gold' : 'border-red-500/50'} flex items-center justify-center shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed group`}
                >
                    <div className={`w-12 h-12 rounded-full border-2 border-white/20 bg-gradient-to-br ${(faceDetected || cameraMode === "friends") ? 'from-gray-800 to-black group-hover:from-gray-700' : 'from-red-900/20 to-black'} `}>
                        <Camera className={`w-6 h-6 mx-auto mt-3 ${(faceDetected || cameraMode === "friends") ? 'text-white' : 'text-white/50'}`} />
                    </div>
                </button>
            </div>
        </div>
    );
}
