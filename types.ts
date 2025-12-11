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