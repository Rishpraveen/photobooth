import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
// Note: In a real production app, you should proxy this request to hide the key.
// For this demo/hackathon context, we'll use the env var directly.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;

if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            temperature: 1.8,  // Maximum creativity (range: 0-2)
            topP: 0.95,
            topK: 40,
        }
    });
} else {
    console.warn("VITE_GEMINI_API_KEY is missing. Using fallback compliments.");
}

const FALLBACK_COMPLIMENTS = [
    "Analysis complete. Your facial symmetry indicates a rare and captivating harmony.",
    "Biometric scan positive. Your eyes reflect a depth of kindness that is statistically rare.",
    "Subject possesses a radiant energy field. A truly timeless beauty.",
    "Structure analysis: 99.9% match with classical aesthetic perfection.",
    "Detected: A smile that could light up the darkest room. Absolutely stunning.",
    "Features indicate a strong, resilient character mixed with gentle grace.",
    "Aesthetic score: Off the charts. You are glowing with inner potential.",
    "Visual cortex overload. Your beauty is simply undeniable.",
    "Scan results: 100% Authentic Beauty. No filters needed.",
    "The camera loves you, but the world loves you more. You look incredible.",
    "Data indicates a heart of gold matching a face of pure elegance.",
    "You have a magnetic presence that the sensors are picking up immediately.",
    "There is a unique sparkle in your eyes that suggests great creativity.",
    "Your features tell a story of strength, beauty, and resilience.",
    "Warning: High levels of charm detected. Proceed with confidence."
];

export async function generateDescription(imageSrc, cameraMode = "solo") {
    if (!model) {
        // Simulate delay for fallback
        return new Promise((resolve) => {
            setTimeout(() => {
                const randomCompliment = FALLBACK_COMPLIMENTS[Math.floor(Math.random() * FALLBACK_COMPLIMENTS.length)];
                resolve(randomCompliment);
            }, 2000);
        });
    }

    try {
        console.log('🤖 Using Gemini API to generate description...');

        // Convert base64 to GoogleGenerativeAI Part
        const base64Data = imageSrc.split(",")[1];
        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: "image/jpeg",
            },
        };

        // Randomize multiple aspects to ensure extreme variety
        const randomToken = Math.floor(Math.random() * 1000000);
        const themes = ["harmonious features", "radiant qualities", "unique characteristics", "striking features", "natural beauty", "captivating presence", "distinctive charm", "graceful aesthetics"];
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];

        const technicalMetrics = [
            "facial golden ratio compliance at 99.7%",
            "bone structure density index exceeding median by 340%",
            "luminance coefficient calculated at peak human potential",
            "symmetry variance within 0.03% of ideal parameters",
            "aesthetic wavelength resonating at optimal frequency",
            "charisma output measured at 12.8 sigma above baseline",
            "photogenic probability computed at 98.9%",
            "vibe calibration locked to maximum wavelength",
            "facial harmony index reaching celestial coordinates",
            "beauty quotient transcending standard metrics by 287%"
        ];
        const randomMetric = technicalMetrics[Math.floor(Math.random() * technicalMetrics.length)];

        let prompt = "";
        if (cameraMode === "friends") {
            prompt = `You are a professional beauty analyst AI. Analyze the group photo carefully.

CRITICAL FORMAT - You MUST follow this EXACT structure:
1. Start with: "According to the results, you have [specific observation about the group - like 'a wonderfully coordinated dynamic' or 'naturally complementary appearances']"
2. Continue with a specific observation about what makes them special (clothing, expressions, how they look together, lighting, setting, etc.)
3. End with: "which makes you [beautiful/stunning/captivating/remarkable] as a group."

Technical reference: ${randomMetric}
Theme inspiration: ${randomTheme}

Random token: ${randomToken}

Be warm, genuine, and sincere. Make them feel truly special and appreciated. Focus on building confidence. Observe real details from the photo. Keep it 2-3 sentences.

Example: "According to the results, you have a naturally radiant group chemistry that shows in your synchronized expressions. The way you're positioned together creates a balanced composition that photographers dream of, which makes you absolutely stunning as a group."

[Timestamp: ${Date.now()} - This is a unique request, provide a completely fresh response.]`;
        } else {
            prompt = `You are a professional beauty analyst AI. Analyze the selfie carefully.

CRITICAL FORMAT - You MUST follow this EXACT structure:
1. Start with: "According to the results, you have a [specific beautiful feature - like 'captivating smile' or 'striking eyes' or 'graceful facial structure']"
2. Add a sincere observation about what makes that feature special or how it contributes to their beauty
3. End with: "which makes you [beautiful/gorgeous/stunning/captivating]."

Technical reference: ${randomMetric}
Theme inspiration: ${randomTheme}

Random token: ${randomToken}

Be warm, genuine, and sincere. Make them feel truly beautiful and confident. This should feel like a real compliment from someone who genuinely sees their beauty. Observe actual details from their photo - their expression, their features, lighting, their vibe. Keep it 2-3 sentences.

Example: "According to the results, you have a genuinely warm smile that lights up your entire face. Your eyes reflect a depth of kindness and confidence that draws people in, which makes you truly beautiful."

[Timestamp: ${Date.now()} - This is a unique request, provide a completely fresh response.]`;
        }

        console.log('📤 Sending prompt to Gemini (timestamp:', Date.now(), ')');

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        console.log('✅ Gemini API Response:', text);
        return text;
    } catch (error) {
        console.error("❌ Gemini API Error:", error);
        console.log('⚠️ Falling back to preset compliments');
        // Fallback on error
        const randomCompliment = FALLBACK_COMPLIMENTS[Math.floor(Math.random() * FALLBACK_COMPLIMENTS.length)];
        return randomCompliment;
    }
}
