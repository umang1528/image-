export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export interface PromptEnhancementResponse {
  enhancedPrompt: string;
  rawResponse: string;
}

export enum GenerationState {
  IDLE = 'IDLE',
  ENHANCING = 'ENHANCING',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface AppState {
  originalPrompt: string;
  enhancedPrompt: string;
  generatedImages: GeneratedImage[];
  status: GenerationState;
  error: string | null;
  selectedStyle: string;
  aspectRatio: string;
}

export const IMAGE_STYLES = [
  "Photorealistic",
  "3D Render",
  "Anime",
  "Cinematic",
  "Digital Art",
  "Oil Painting",
  "Cyberpunk",
  "Minimalist",
  "Vintage"
];

export const ASPECT_RATIOS = [
  { label: "Square (1:1)", value: "1:1" },
  { label: "Portrait (3:4)", value: "3:4" },
  { label: "Landscape (4:3)", value: "4:3" },
  { label: "Story (9:16)", value: "9:16" },
  { label: "Wide (16:9)", value: "16:9" },
];