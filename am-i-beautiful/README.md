# Am I Beautiful? 📸

A vintage-styled AI-powered photo booth that provides personalized, uplifting compliments based on your photo. This interactive web application combines modern AI technology (Google Gemini 2.0) with a nostalgic photo booth aesthetic.

## ✨ Features

- **AI-Powered Analysis**: Uses Google's Gemini 2.0 Flash to generate unique, personalized compliments
- **User-Provided API Keys**: Secure approach where users input their own API keys
- **Vintage Photo Booth Design**: Retro aesthetic with film grain effects, sepia tones, and classic typography
- **Dual Camera Modes**: 
  - Solo mode for individual photos
  - Friends mode for group photos
- **Smart Text Highlighting**: Intelligently highlights meaningful descriptive words in compliments
- **Downloadable Polaroids**: Save your photos with compliments in a vintage polaroid style
- **Responsive Design**: Mobile-first design with desktop widescreen camera support
- **Face Mesh Overlay**: Real-time face detection during photo capture
- **Gamification**: Rarity system with different beauty tier stamps (Common to Mythic)

## 🎯 Use Case

Perfect for:
- Building confidence with AI-generated positive affirmations
- Creating a fun interactive experience at events or gatherings
- Demonstrating AI capabilities in a creative, user-friendly way
- Exploring the intersection of AI and human emotion
- Social media content creation with downloadable vintage-style results

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key (get one free at [Google AI Studio](https://aistudio.google.com/apikey))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Rishpraveen/photobooth.git
cd photobooth/am-i-beautiful
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

5. **Enter your API key**: When prompted, enter your Google Gemini API key
   - The key is stored locally in your browser
   - It persists across page refreshes
   - Get your free key at [Google AI Studio](https://aistudio.google.com/apikey)

## 🏗️ Tech Stack

- **Frontend**: React 19.1.1, Vite 7.2.2
- **Styling**: Tailwind CSS 4.1.17
- **State Management**: Zustand 5.0.8 (with persist middleware)
- **AI**: Google Gemini 2.0 Flash (@google/generative-ai 0.24.1)
- **Camera**: react-webcam 7.2.0
- **Face Detection**: MediaPipe tasks-vision 0.10.22
- **UI Components**: Radix UI, Lucide Icons

## 📦 Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🚢 Deploy to Vercel

### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

**Note**: No environment variables needed! Users provide their own API keys through the app interface.

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com) and import your repository
3. Deploy!

No environment variable configuration needed - users will input their own API keys when using the app.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Rishpraveen/photobooth)

## 🔑 API Key Management

This app uses a **user-provided API key** approach for security:

- Users enter their own Google Gemini API key on first use
- Keys are validated (must start with "AIza")
- Stored securely in browser localStorage via Zustand persist
- Persists across page refreshes
- No server-side API key exposure
- Each user manages their own quota and billing

**Get your free API key**: [Google AI Studio](https://aistudio.google.com/apikey)

## 🎨 Project Structure

```
am-i-beautiful/
├── src/
│   ├── components/      # React components
│   │   ├── LandingPage.jsx    # Entry with API key dialog
│   │   ├── CameraPage.jsx     # Camera capture interface
│   │   ├── ResultPage.jsx     # Results with AI compliments
│   │   ├── FaceMeshOverlay.jsx # Face detection overlay
│   │   └── ui/                # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── store/          
│   │   └── appStore.js        # Zustand store with API key persistence
│   ├── utils/          
│   │   ├── ai.js              # Gemini 2.0 API integration
│   │   └── gamification.js    # Rarity and sound effects
│   ├── App.jsx         # Main application component
│   └── index.css       # Global styles and vintage theme
├── public/             # Static assets
├── vercel.json         # Vercel deployment config
└── package.json
```

## 🎮 Features in Detail

### Smart Highlighting
The app intelligently highlights meaningful words in compliments:
- High priority: Beauty adjectives (radiant, stunning, elegant)
- Medium priority: Descriptive words ending in -ful, -ous, -ic, -al
- Skips common filler words (the, a, and, your, etc.)

### Rarity System
- Common (60%): Bronze stamp
- Rare (25%): Silver stamp  
- Epic (10%): Gold stamp
- Legendary (4%): Holographic stamp with fanfare
- Mythic (1%): Rainbow stamp with confetti

### Downloadable Results
Export your photo with compliment in vintage polaroid format:
- Sepia-toned image
- Text wrapped below photo
- White polaroid border
- Ready to share on social media

## 🛡️ Security & Privacy

- **No server-side API keys**: Each user provides their own
- **Client-side only**: No backend server required
- **Local storage**: API keys stored only in user's browser
- **No data collection**: Photos processed locally, not stored
- **HTTPS recommended**: Use secure connections in production

## 🐛 Troubleshooting

**API not working?**
- Check console logs (F12 → Console) for detailed error messages
- Verify your API key is valid and active
- Ensure you haven't exceeded API quota
- Try using `gemini-1.5-flash-latest` if `gemini-2.0-flash-exp` has issues

**Camera not working?**
- Grant camera permissions in browser
- Use HTTPS in production (required for camera access)
- Check if camera is already in use by another application

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Disclaimer**: This application is for entertainment purposes only. The AI-generated compliments are meant to be uplifting and positive, not scientific assessments of beauty or appearance.
