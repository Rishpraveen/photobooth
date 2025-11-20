# Am I Beautiful? 📸

A vintage-styled AI-powered beauty analyzer that provides personalized, uplifting compliments based on your photo. This interactive web application combines modern AI technology with a nostalgic photo booth aesthetic.

## ✨ Features

- **AI-Powered Analysis**: Uses Google's Gemini API to generate unique, personalized compliments
- **Vintage Photo Booth Design**: Retro aesthetic with film grain effects and classic typography
- **Dual Camera Modes**: 
  - Solo mode for individual photos
  - Friends mode for group photos
- **Real-time Processing**: Instant AI-generated responses with visual feedback
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🎯 Use Case

Perfect for:
- Building confidence with AI-generated positive affirmations
- Creating a fun interactive experience at events or gatherings
- Demonstrating AI capabilities in a creative, user-friendly way
- Exploring the intersection of AI and human emotion

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key (get one at [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd am-i-beautiful
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your Gemini API key to `.env`:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🏗️ Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **AI**: Google Gemini API
- **UI Components**: Radix UI, Lucide Icons
- **Camera**: react-webcam

## 📦 Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI analysis | Yes |

## 🎨 Project Structure

```
am-i-beautiful/
├── src/
│   ├── components/      # React components
│   │   ├── LandingPage.jsx
│   │   ├── CameraPage.jsx
│   │   ├── ResultPage.jsx
│   │   └── ui/         # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── store/          # Zustand state management
│   ├── utils/          # Utility functions
│   │   ├── ai.js       # Gemini API integration
│   │   └── gamification.js
│   └── App.jsx         # Main application component
├── public/             # Static assets
└── package.json
```

## 🛡️ Security Note

This application uses client-side API calls to Google Gemini. For production use, consider:
- Implementing a backend proxy to secure your API key
- Setting up rate limiting
- Adding user authentication
- Implementing proper API key rotation

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Disclaimer**: This application is for entertainment purposes only. The AI-generated compliments are meant to be uplifting and positive, not scientific assessments.
