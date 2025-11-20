import { useEffect, useRef } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export default function FaceMeshOverlay({ videoRef, onFaceDetected }) {
    const canvasRef = useRef(null);
    const landmarkerRef = useRef(null);
    const requestRef = useRef(null);

    useEffect(() => {
        const initLandmarker = async () => {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
            );

            landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                    delegate: "GPU"
                },
                outputFaceBlendshapes: true,
                runningMode: "VIDEO",
                numFaces: 2,
                minFaceDetectionConfidence: 0.8,
                minFacePresenceConfidence: 0.8
            });

            predictWebcam();
        };

        initLandmarker();

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);

    const predictWebcam = () => {
        const video = videoRef.current?.video;
        const canvas = canvasRef.current;

        if (video && canvas && landmarkerRef.current) {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                const startTimeMs = performance.now();
                const results = landmarkerRef.current.detectForVideo(video, startTimeMs);

                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const hasFace = results.faceLandmarks && results.faceLandmarks.length > 0;
                let fullFace = false;
                if (hasFace) {
                    // Determine bounding box of first detected face
                    const landmarks = results.faceLandmarks[0];
                    let minX = 1, maxX = 0, minY = 1, maxY = 0;
                    for (const point of landmarks) {
                        if (point.x < minX) minX = point.x;
                        if (point.x > maxX) maxX = point.x;
                        if (point.y < minY) minY = point.y;
                        if (point.y > maxY) maxY = point.y;
                    }
                    // Consider face fully visible if bounding box stays within 10% margins of the frame
                    const margin = 0.1;
                    fullFace = (minX > margin && maxX < 1 - margin && minY > margin && maxY < 1 - margin);
                }
                if (onFaceDetected) {
                    // Pass true only when a face is detected and fully visible
                    onFaceDetected(hasFace && fullFace);
                }

                if (hasFace) {
                    for (const landmarks of results.faceLandmarks) {
                        drawVintageMesh(ctx, landmarks);
                    }
                }
            }
        }
        requestRef.current = requestAnimationFrame(predictWebcam);
    };

    const drawVintageMesh = (ctx, landmarks) => {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(74, 222, 128, 0.4)"; // Vintage Green
        ctx.fillStyle = "rgba(212, 175, 55, 0.6)"; // Gold points

        // Draw points
        // Optimization: Don't draw all 478 points, just key ones for style
        for (let i = 0; i < landmarks.length; i += 5) { // Draw every 5th point
            const x = landmarks[i].x * ctx.canvas.width;
            const y = landmarks[i].y * ctx.canvas.height;

            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Draw connecting lines (simplified for aesthetic)
        // Connecting a few key contours
        const contours = [
            // Face oval
            [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109],
            // Left Eye
            [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7],
            // Right Eye
            [263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249],
            // Lips
            [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291]
        ];

        ctx.strokeStyle = "rgba(74, 222, 128, 0.3)";
        contours.forEach(contour => {
            ctx.beginPath();
            const first = landmarks[contour[0]];
            ctx.moveTo(first.x * ctx.canvas.width, first.y * ctx.canvas.height);

            for (let i = 1; i < contour.length; i++) {
                const point = landmarks[contour[i]];
                ctx.lineTo(point.x * ctx.canvas.width, point.y * ctx.canvas.height);
            }
            ctx.closePath();
            ctx.stroke();
        });
    };

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10 object-cover scale-x-[-1]"
        />
    );
}
