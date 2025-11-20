/**
 * Gamification Utilities
 * Handles Rarity System and Streak Tracking
 */

// Rarity Tiers and Probabilities
export const RARITY_TIERS = {
    COMMON: { id: 'common', label: 'COMMON VIBE', color: '#A0A0A0', probability: 0.40 },
    RARE: { id: 'rare', label: 'RARE AURA', color: '#3B82F6', probability: 0.30 },
    EPIC: { id: 'epic', label: 'EPIC ENERGY', color: '#8B5CF6', probability: 0.20 },
    LEGENDARY: { id: 'legendary', label: 'LEGENDARY SOUL', color: '#F59E0B', probability: 0.09 },
    MYTHIC: { id: 'mythic', label: 'MYTHIC PRESENCE', color: '#EF4444', probability: 0.01 },
};

/**
 * Calculates a random rarity based on weighted probabilities.
 * @returns {Object} The selected rarity tier object.
 */
export const calculateRarity = () => {
    const random = Math.random();
    let cumulativeProbability = 0;

    for (const key in RARITY_TIERS) {
        cumulativeProbability += RARITY_TIERS[key].probability;
        if (random < cumulativeProbability) {
            return RARITY_TIERS[key];
        }
    }
    return RARITY_TIERS.COMMON; // Fallback
};

/**
 * Updates and retrieves the current user streak.
 * Logic:
 * - If last visit was yesterday (within 24-48h), increment streak.
 * - If last visit was today (within 24h), keep streak.
 * - If last visit was older than 48h, reset streak to 1.
 * @returns {Object} { count: number, isNewDay: boolean }
 */
export const updateStreak = () => {
    const now = new Date();
    const lastVisit = localStorage.getItem('lastVisit');
    const currentStreak = parseInt(localStorage.getItem('vibeStreak') || '0', 10);

    if (!lastVisit) {
        // First time user
        localStorage.setItem('lastVisit', now.toISOString());
        localStorage.setItem('vibeStreak', '1');
        return { count: 1, isNewDay: true };
    }

    const lastDate = new Date(lastVisit);
    const diffTime = Math.abs(now - lastDate);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    // Check if it's the same calendar day (to avoid abusing refresh)
    const isSameDay = now.toDateString() === lastDate.toDateString();

    if (isSameDay) {
        return { count: currentStreak, isNewDay: false };
    }

    if (diffDays < 2) {
        // Consecutive day (roughly)
        const newStreak = currentStreak + 1;
        localStorage.setItem('lastVisit', now.toISOString());
        localStorage.setItem('vibeStreak', newStreak.toString());
        return { count: newStreak, isNewDay: true };
    } else {
        // Streak broken
        localStorage.setItem('lastVisit', now.toISOString());
        localStorage.setItem('vibeStreak', '1');
        return { count: 1, isNewDay: true };
    }
};

/**
 * Simple sound synthesizer for retro effects
 * @param {string} type - 'shutter', 'reveal', 'rare', 'legendary'
 */
export const playSound = (type) => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        switch (type) {
            case 'shutter':
                // Mechanical click sound
                osc.type = 'square';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;

            case 'reveal':
                // Rising tension
                osc.type = 'sine';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.linearRampToValueAtTime(600, now + 2);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 2);
                osc.start(now);
                osc.stop(now + 2);
                break;

            case 'stamp':
                // Heavy thud
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(20, now + 0.3);
                gain.gain.setValueAtTime(0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;

            case 'fanfare':
                // High pitched success
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.setValueAtTime(600, now + 0.1);
                osc.frequency.setValueAtTime(1000, now + 0.2);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
                break;
        }
    } catch (e) {
        console.error("Audio play failed", e);
    }
};
