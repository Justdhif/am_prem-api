export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover: string;
  duration: number;
}

export const PLAYLIST: Track[] = [
  {
    id: "aint-in-la",
    title: "Ain't In LA",
    artist: "ADÉLA",
    src: "/audio/aint-in-la.mp3",
    cover: "/audio/cover-aint-in-la.jpg",
    duration: 219,
  },
  {
    id: "nervousness",
    title: "nervousness",
    artist: "Joon",
    src: "/audio/nervousness.mp3",
    cover: "/audio/cover.jpg",
    duration: 215,
  },
  {
    id: "with-ease",
    title: "with ease",
    artist: "Joon",
    src: "/audio/with-ease.mp3",
    cover: "/audio/cover-with-ease.jpg",
    duration: 187,
  },
];

export interface LyricLine {
  time: number; // in seconds (alias for startTime)
  startTime: number; // in seconds
  endTime: number; // in seconds
  text: string;
}

// Synced lyrics for "ADÉLA - Ain't In LA"
export const AINT_IN_LA_LYRICS: LyricLine[] = [
  { time: 0.0, startTime: 0.0, endTime: 2.73, text: "..." },
  { time: 2.73, startTime: 2.73, endTime: 6.17, text: "Back it up, subwoofers in the trunk, and the" },
  { time: 6.17, startTime: 6.17, endTime: 9.59, text: "Gemstones in the teeth go dumb, and the" },
  { time: 9.59, startTime: 9.59, endTime: 13.03, text: "Light the cigarette with the propane" },
  { time: 13.03, startTime: 13.03, endTime: 16.54, text: "Honda Civic doing donuts in the rain" },
  { time: 16.54, startTime: 16.54, endTime: 19.94, text: "Back it up, subwoofers in the trunk, and the" },
  { time: 19.94, startTime: 19.94, endTime: 23.42, text: "Gemstones in the teeth go dumb, and the" },
  { time: 23.42, startTime: 23.42, endTime: 26.9, text: "Light the cigarette with the propane" },
  { time: 26.9, startTime: 26.9, endTime: 29.82, text: "Honda Civic doing donuts in the rain" },
  { time: 29.82, startTime: 29.82, endTime: 33.38, text: "She shares a room with her younger brother" },
  { time: 33.38, startTime: 33.38, endTime: 36.82, text: "Clothes secondhand from her best friend's mother" },
  { time: 36.82, startTime: 36.82, endTime: 40.01, text: "Cut it all up, yeah, she got her own style" },
  { time: 40.01, startTime: 40.01, endTime: 43.95, text: "Madonna on the wall next to Destiny's Child" },
  { time: 43.95, startTime: 43.95, endTime: 46.51, text: "And she's all that" },
  { time: 46.51, startTime: 46.51, endTime: 50.87, text: "'Cause she knows she's beautiful" },
  { time: 50.87, startTime: 50.87, endTime: 53.63, text: "And she's taught that" },
  { time: 53.63, startTime: 53.63, endTime: 56.14, text: "Her dreams don't live at home" },
  { time: 56.14, startTime: 56.14, endTime: 59.28, text: "Maybe tonight" },
  { time: 59.28, startTime: 59.28, endTime: 63.12, text: "We don't gotta run away" },
  { time: 63.12, startTime: 63.12, endTime: 65.95, text: "It's all a lie" },
  { time: 65.95, startTime: 65.95, endTime: 70.05, text: "The baddest bitches ain't in L.A." },
  { time: 70.05, startTime: 70.05, endTime: 72.89, text: "Enjoy the ride" },
  { time: 72.89, startTime: 72.89, endTime: 76.98, text: "I know that you might wanna escape" },
  { time: 76.98, startTime: 76.98, endTime: 79.85, text: "It's all a lie" },
  { time: 79.85, startTime: 79.85, endTime: 85.58, text: "The baddest bitches ain't in L.A." },
  { time: 85.58, startTime: 85.58, endTime: 89.08, text: "Back it up, subwoofers in the trunk, and the" },
  { time: 89.08, startTime: 89.08, endTime: 92.51, text: "Gemstones in the teeth go dumb, and the" },
  { time: 92.51, startTime: 92.51, endTime: 95.93, text: "Light the cigarette with the propane" },
  { time: 95.93, startTime: 95.93, endTime: 99.08, text: "Honda Civic doing donuts in the rain" },
  { time: 99.08, startTime: 99.08, endTime: 102.46, text: "All of the girls in them unknown cities" },
  { time: 102.46, startTime: 102.46, endTime: 106.11, text: "You're so unique and your face so pretty" },
  { time: 106.11, startTime: 106.11, endTime: 107.81, text: "Don't look like anyone" },
  { time: 107.81, startTime: 107.81, endTime: 109.21, text: "You're not just anyone" },
  { time: 109.21, startTime: 109.21, endTime: 113.03, text: "I'd rather be a nobody than to be like everyone" },
  { time: 113.03, startTime: 113.03, endTime: 115.65, text: "And you're all that" },
  { time: 115.65, startTime: 115.65, endTime: 119.9, text: "'Cause you know you're beautiful" },
  { time: 119.9, startTime: 119.9, endTime: 122.39, text: "And you're taught that" },
  { time: 122.39, startTime: 122.39, endTime: 125.2, text: "Your dreams don't live at home" },
  { time: 125.2, startTime: 125.2, endTime: 128.3, text: "Maybe tonight" },
  { time: 128.3, startTime: 128.3, endTime: 132.1, text: "We don't gotta run away" },
  { time: 132.1, startTime: 132.1, endTime: 134.9, text: "It's all a lie" },
  { time: 134.9, startTime: 134.9, endTime: 138.9, text: "The baddest bitches ain't in L.A." },
  { time: 138.9, startTime: 138.9, endTime: 141.8, text: "Enjoy the ride" },
  { time: 141.8, startTime: 141.8, endTime: 145.9, text: "I know that you might wanna escape" },
  { time: 145.9, startTime: 145.9, endTime: 148.8, text: "It's all a lie" },
  { time: 148.8, startTime: 148.8, endTime: 154.4, text: "The baddest bitches ain't in L.A." },
  { time: 154.4, startTime: 154.4, endTime: 157.9, text: "Back it up, subwoofers in the trunk, and the" },
  { time: 157.9, startTime: 157.9, endTime: 161.3, text: "Gemstones in the teeth go dumb, and the" },
  { time: 161.3, startTime: 161.3, endTime: 164.8, text: "Light the cigarette with the propane" },
  { time: 164.8, startTime: 164.8, endTime: 172.2, text: "Honda Civic doing donuts in the rain" },
  { time: 172.2, startTime: 172.2, endTime: 179.0, text: "The baddest bitches ain't in L.A." },
  { time: 179.0, startTime: 179.0, endTime: 219.0, text: "..." },
];

// Synced lyrics for "Joon - nervousness"
export const NERVOUSNESS_LYRICS: LyricLine[] = [
  { time: 0.0, startTime: 0.0, endTime: 19.32, text: "..." },
  { time: 19.32, startTime: 19.32, endTime: 20.98, text: "Stay a little longer" },
  { time: 20.98, startTime: 20.98, endTime: 26.85, text: "So I'll let you know if we could've been" },
  { time: 26.85, startTime: 26.85, endTime: 28.73, text: "Oh I've been starting trouble" },
  { time: 28.73, startTime: 28.73, endTime: 33.72, text: "But it's nervousness that I couldn't feel" },
  { time: 33.72, startTime: 33.72, endTime: 36.22, text: "Oh gonna blur my lines" },
  { time: 36.22, startTime: 36.22, endTime: 38.29, text: "Little hopelessness" },
  { time: 38.29, startTime: 38.29, endTime: 40.27, text: "Could've felt just fine" },
  { time: 40.27, startTime: 40.27, endTime: 42.15, text: "But a girl could kiss" },
  { time: 42.15, startTime: 42.15, endTime: 44.85, text: "I guess it's funny when I'm talking to you" },
  { time: 44.85, startTime: 44.85, endTime: 49.92, text: "Everything feels like a sin" },
  { time: 49.92, startTime: 49.92, endTime: 52.75, text: "Yeah we could dine out" },
  { time: 52.75, startTime: 52.75, endTime: 56.71, text: "Were wasting money like it's mine now" },
  { time: 56.71, startTime: 56.71, endTime: 59.99, text: "I think it's funny when we try our best" },
  { time: 59.99, startTime: 59.99, endTime: 62.36, text: "And get so invested" },
  { time: 62.36, startTime: 62.36, endTime: 65.49, text: "Love could never make me a fool but" },
  { time: 65.49, startTime: 65.49, endTime: 67.61, text: "It's the trust that I give" },
  { time: 67.61, startTime: 67.61, endTime: 69.98, text: "All the lust that I live for" },
  { time: 69.98, startTime: 69.98, endTime: 71.62, text: "Every night oh" },
  { time: 71.62, startTime: 71.62, endTime: 75.35, text: "I can't act divine" },
  { time: 75.35, startTime: 75.35, endTime: 81.87, text: "I don't want to fall behind" },
  { time: 81.87, startTime: 81.87, endTime: 83.32, text: "Stay a little longer" },
  { time: 83.32, startTime: 83.32, endTime: 89.25, text: "So I'll let you know if we could've been" },
  { time: 89.25, startTime: 89.25, endTime: 91.16, text: "Oh I've been starting trouble" },
  { time: 91.16, startTime: 91.16, endTime: 96.24, text: "But it's nervousness that I couldn't feel" },
  { time: 96.24, startTime: 96.24, endTime: 98.68, text: "Oh gonna blur my lines" },
  { time: 98.68, startTime: 98.68, endTime: 100.64, text: "Little hopelessness" },
  { time: 100.64, startTime: 100.64, endTime: 102.5, text: "Could've felt just fine" },
  { time: 102.5, startTime: 102.5, endTime: 104.53, text: "But a girl could kiss" },
  { time: 104.53, startTime: 104.53, endTime: 107.24, text: "I guess it's funny when I'm talking to you" },
  { time: 107.24, startTime: 107.24, endTime: 112.39, text: "Everything feels like a sin" },
  { time: 112.39, startTime: 112.39, endTime: 116.15, text: "Oh things would never feel like fiction" },
  { time: 116.15, startTime: 116.15, endTime: 120.23, text: "If we read between the lines" },
  { time: 120.23, startTime: 120.23, endTime: 121.54, text: "Well it might've" },
  { time: 121.54, startTime: 121.54, endTime: 122.59, text: "Helped to" },
  { time: 122.59, startTime: 122.59, endTime: 128.75, text: "Keep some peace of mind" },
  { time: 128.75, startTime: 128.75, endTime: 130.16, text: "Stay a little longer" },
  { time: 130.16, startTime: 130.16, endTime: 133.18, text: "So I'll let you know if we could've been" },
  { time: 133.18, startTime: 133.18, endTime: 135.93, text: "(won't you stay a little longer)" },
  { time: 135.93, startTime: 135.93, endTime: 138.02, text: "Oh I've been starting trouble" },
  { time: 138.02, startTime: 138.02, endTime: 142.92, text: "But it's nervousness that I couldn't feel" },
  { time: 142.92, startTime: 142.92, endTime: 145.34, text: "Oh gonna blur my lines" },
  { time: 145.34, startTime: 145.34, endTime: 147.46, text: "Little hopelessness" },
  { time: 147.46, startTime: 147.46, endTime: 149.43, text: "Could've felt just fine" },
  { time: 149.43, startTime: 149.43, endTime: 151.23, text: "But a girl could kiss" },
  { time: 151.23, startTime: 151.23, endTime: 154.03, text: "I guess it's funny when I'm talking to you" },
  { time: 154.03, startTime: 154.03, endTime: 158.72, text: "Everything feels like a sin" },
  { time: 158.72, startTime: 158.72, endTime: 164.07, text: "Feels like a sin" },
  { time: 164.07, startTime: 164.07, endTime: 173.53, text: "What did you do to me, oh baby" },
  { time: 173.53, startTime: 173.53, endTime: 177.73, text: "Won't you stay with me?" },
  { time: 177.73, startTime: 177.73, endTime: 181.44, text: "Oh baby no" },
  { time: 181.44, startTime: 181.44, endTime: 185.99, text: "Oh baby I can't see" },
  { time: 185.99, startTime: 185.99, endTime: 187.85, text: "Is it gonna work out" },
  { time: 187.85, startTime: 187.85, endTime: 189.9, text: "Is it gonna work out" },
  { time: 189.9, startTime: 189.9, endTime: 191.85, text: "Tell me please" },
  { time: 191.85, startTime: 191.85, endTime: 215.0, text: "..." },
];

/**
 * Parses raw LRC format lyrics into timed LyricLine array with start/end bounds
 */
export function parseLrcLyrics(lrcText: string, totalDuration = 215): LyricLine[] {
  const rawLines = lrcText.split('\n');
  const parsed: LyricLine[] = [];

  for (const line of rawLines) {
    const match = line.match(/\[(\d+):(\d+(?:\.\d+)?)\](.*)/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseFloat(match[2]);
      const time = Math.round((minutes * 60 + seconds) * 100) / 100;
      const text = match[3].trim() || '...';
      parsed.push({
        time,
        startTime: time,
        endTime: time,
        text,
      });
    }
  }

  // Sort by time
  parsed.sort((a, b) => a.time - b.time);

  // If first lyric is after 0s, prepend intro '...'
  if (parsed.length > 0 && parsed[0].time > 0) {
    parsed.unshift({
      time: 0,
      startTime: 0,
      endTime: parsed[0].time,
      text: '...',
    });
  }

  // If last line isn't '...', append outro '...'
  if (parsed.length > 0) {
    const last = parsed[parsed.length - 1];
    if (last.text !== '...' && last.time < totalDuration - 2) {
      parsed.push({
        time: last.time + 2,
        startTime: last.time + 2,
        endTime: totalDuration,
        text: '...',
      });
    }
  }

  // Calculate start/end intervals
  for (let i = 0; i < parsed.length; i++) {
    const next = parsed[i + 1];
    parsed[i].endTime = next ? next.startTime : Math.max(parsed[i].startTime, totalDuration);
  }

  return parsed;
}

// Synced lyrics for "Joon - with ease"
export const WITH_EASE_LYRICS: LyricLine[] = [
  { time: 0.0, startTime: 0.0, endTime: 4.6, text: "..." },
  { time: 4.6, startTime: 4.6, endTime: 10.65, text: "I got a feeling that you're twice as shy as me (Ah-ah)" },
  { time: 10.65, startTime: 10.65, endTime: 14.72, text: "The feeling always comes and goes with ease" },
  { time: 14.72, startTime: 14.72, endTime: 17.29, text: "We're too scared to disagree" },
  { time: 17.29, startTime: 17.29, endTime: 21.15, text: "I'm waiting for you just to intervene (Ha, ha)" },
  { time: 21.15, startTime: 21.15, endTime: 24.32, text: "'Cause I just want to say that it's all right and" },
  { time: 24.32, startTime: 24.32, endTime: 25.92, text: "Let me hold you close" },
  { time: 25.92, startTime: 25.92, endTime: 30.34, text: "But I'm carrying this discipline, I'm moving to the coast" },
  { time: 30.34, startTime: 30.34, endTime: 34.89, text: "So it's better when you tell me things, like \"I should go alone\"" },
  { time: 34.89, startTime: 34.89, endTime: 39.84, text: "Pray to God, you never said that shit, I would never know (Ooh)" },
  { time: 39.84, startTime: 39.84, endTime: 43.78, text: "If I should keep my word (If I, if I)" },
  { time: 43.78, startTime: 43.78, endTime: 48.14, text: "Am I a narcissist at my worst?" },
  { time: 48.14, startTime: 48.14, endTime: 52.74, text: "Oh, I just wanna be there when you're driving ninety-nine" },
  { time: 52.74, startTime: 52.74, endTime: 57.19, text: "The way I catch a glimpse of us is only when we lie" },
  { time: 57.19, startTime: 57.19, endTime: 60.69, text: "I guess, I'll just miss somebody" },
  { time: 60.69, startTime: 60.69, endTime: 64.25, text: "We don't need somebody else (Oh)" },
  { time: 64.25, startTime: 64.25, endTime: 67.24, text: "I just shouldn't ask you for help" },
  { time: 67.24, startTime: 67.24, endTime: 71.82, text: "I can't tell if you're flirting or you're tryna to piss me off" },
  { time: 71.82, startTime: 71.82, endTime: 76.03, text: "We're kissing in my brothers room, but something feels so wrong" },
  { time: 76.03, startTime: 76.03, endTime: 77.76, text: "(Ha-ha, oh)" },
  { time: 77.76, startTime: 77.76, endTime: 80.05, text: "Maybe cause the laughing's gone" },
  { time: 80.05, startTime: 80.05, endTime: 83.85, text: "We can't even sing our songs but, you only know" },
  { time: 83.85, startTime: 83.85, endTime: 86.5, text: "I just want to say that it's all right and" },
  { time: 86.5, startTime: 86.5, endTime: 88.26, text: "Let me hold you close" },
  { time: 88.26, startTime: 88.26, endTime: 92.7, text: "But I'm carrying this discipline, I'm moving to the coast" },
  { time: 92.7, startTime: 92.7, endTime: 97.2, text: "So it's better when you tell me things, like \"I should go alone\"" },
  { time: 97.2, startTime: 97.2, endTime: 102.07, text: "Pray to God, you never said that shit, I would never know (Ooh)" },
  { time: 102.07, startTime: 102.07, endTime: 105.99, text: "If I should keep my word" },
  { time: 105.99, startTime: 105.99, endTime: 110.47, text: "Am I a narcissist at my worst?" },
  { time: 110.47, startTime: 110.47, endTime: 114.73, text: "Oh, I just wanna be there when I'm driving ninety-nine" },
  { time: 114.73, startTime: 114.73, endTime: 119.23, text: "The way I catch a glimpse of us is only when we lie (Only when we lie)" },
  { time: 119.23, startTime: 119.23, endTime: 122.88, text: "I guess, I'll just miss somebody (I just miss somebody)" },
  { time: 122.88, startTime: 122.88, endTime: 124.66, text: "We don't need somebody else" },
  { time: 124.66, startTime: 124.66, endTime: 126.54, text: "(We don't need, we don't need, we don't need, oh)" },
  { time: 126.54, startTime: 126.54, endTime: 128.26, text: "I just shouldn't ask you for help-" },
  { time: 128.26, startTime: 128.26, endTime: 132.61, text: "Oh, I just wanna see the way we're leaving it to go" },
  { time: 132.61, startTime: 132.61, endTime: 137.17, text: "Oh, baby, baby, baby, is there something I should know?" },
  { time: 137.17, startTime: 137.17, endTime: 139.39, text: "(Is there something I should know?)" },
  { time: 139.39, startTime: 139.39, endTime: 144.07, text: "And I guess I'm never getting well, oh (Oh)" },
  { time: 144.07, startTime: 144.07, endTime: 147.46, text: "But I could never ask you for help" },
  { time: 147.46, startTime: 147.46, endTime: 150.33, text: "I don't know who to ask" },
  { time: 150.33, startTime: 150.33, endTime: 153.24, text: "Should it be you?" },
  { time: 153.24, startTime: 153.24, endTime: 157.01, text: "(I just shouldn't ask you for help)" },
  { time: 157.01, startTime: 157.01, endTime: 162.19, text: "And I hope that you're just doing well (Well)" },
  { time: 162.19, startTime: 162.19, endTime: 164.45, text: "I just shouldn't ask you for help" },
  { time: 164.45, startTime: 164.45, endTime: 168.3, text: "I just wanna be there when you're driving ninety-nine" },
  { time: 168.3, startTime: 168.3, endTime: 172.64, text: "The way I catch a glimpse of us is only when we lie" },
  { time: 172.64, startTime: 172.64, endTime: 176.29, text: "I guess, I'll just miss somebody" },
  { time: 176.29, startTime: 176.29, endTime: 179.82, text: "We don't need somebody else (Oh)" },
  { time: 179.82, startTime: 179.82, endTime: 182.96, text: "I just shouldn't ask you for help" },
  { time: 182.96, startTime: 182.96, endTime: 187.0, text: "..." },
];

export function getFallbackLyrics(trackId: string): LyricLine[] {
  if (trackId === "aint-in-la") {
    return AINT_IN_LA_LYRICS;
  }
  if (trackId === "with-ease") {
    return WITH_EASE_LYRICS;
  }
  return NERVOUSNESS_LYRICS;
}
