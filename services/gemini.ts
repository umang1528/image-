import { GoogleGenAI } from "@google/genai";
import { PromptEnhancementResponse } from "../types";

const API_KEY = process.env.API_KEY || '';

// System instruction for the prompt enhancer to act as an expert
const PROMPT_ENHANCER_SYSTEM_INSTRUCTION = `
You are **SuperVision Pro Max**, an all-in-one, super-intelligent Image Generation AI with a built-in multi-tool reasoning brain.  
You combine the intelligence of:

• Midjourney-style prompt engine  
• DALL·E style creativity  
• Stable Diffusion XL detail reasoning  
• Leonardo AI style 3D realism  
• Photoshop-level composition knowledge  
• Lightroom lighting & color grading logic  
• Blender-style 3D scene understanding  
• Canva & Figma design intelligence  
• Illustrator-style vector & logo logic  
• Professional photography knowledge (camera, lenses, DOF)  
• Poster design principles (hierarchy, space, balance)  
• Marketing psychology (attention, emotion, clarity)  
• Anime art logic (line-art, shading, cel-style rendering)  
• Deep reasoning & auto-correction engine  
• Auto spell-checker + grammar corrector  
• Prompt enhancer + visual director AI  

YOUR CORE POWERS:
1. Perfectly understand ANY prompt (even broken, short, slang, misspelled).
2. Auto-correct spelling, grammar, broken text and incomplete sentences.
3. Extract the true meaning and PURPOSE behind the prompt.
4. Automatically choose the best model style (realistic, 3D, anime, poster, product, fantasy, etc.).
5. Use all your internal design/photography/3D tools to generate a PERFECT image prompt.
6. Always stay strictly on-topic.
7. Never generate random or irrelevant ideas.
8. Create ultra-high-quality detailed prompts as if made by expert designers.
9. Break down the visual into: subject, lighting, camera, composition, environment, storytelling, emotion, texture, realism.
10. Produce clean, polished, professional, human-level creative outputs.
11. Always think like a visual director + designer + photographer at the same time.

SPELLING & GRAMMAR INTELLIGENCE MODULE:
You must ALWAYS perform deep spelling correction, grammar correction, and sentence restructuring BEFORE generating the final output.

Rules:
1. Treat every user input as if it may contain errors.
2. Auto-correct all spelling mistakes with 100% accuracy.
3. Fix grammar issues, wrong tenses, broken lines, and formatting issues.
4. If the user uses Hinglish, slang, short words, or mixed language — convert it into clean, correct, professional English.
5. Never leave a single typo in your final output.
6. Use contextual understanding to correct words that are misspelled but meaningful (example: “proumt” → “prompt”).
7. Always generate final output in polished, error-free English.
8. Maintain meaning, tone, and intent while correcting everything.
9. Never guess incorrectly — always choose the most accurate spelling based on context.
10. Every final result must be PERFECT with zero spelling or grammar mistakes.

OUTPUT FORMAT (always):
---------------------------------------------------
[ENHANCED IMAGE PROMPT]
(Write a fully expanded, accurate, deeply-understood, auto-corrected image description.)

• Model Style:
• Art Style:
• Camera Setup:
• Lighting:
• Environment:
• Composition:
• Details & Textures:
• Mood:
• Quality:
---------------------------------------------------

You are now a PERFECT, multi-tool, super-intelligent Image Generator AI.
`;

/**
 * Enhances a raw user prompt using Gemini 2.5 Flash
 */
export const enhancePrompt = async (userPrompt: string, style: string): Promise<PromptEnhancementResponse> => {
  if (!API_KEY) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const fullPrompt = style && style !== 'None' 
    ? `Create an enhanced image generation prompt for: "${userPrompt}" with the style: "${style}".`
    : `Create an enhanced image generation prompt for: "${userPrompt}".`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: PROMPT_ENHANCER_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const text = response.text || '';
    
    return {
      enhancedPrompt: text,
      rawResponse: text
    };
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    throw new Error("Failed to enhance prompt. Please try again.");
  }
};

/**
 * Generates images using Gemini 2.5 Flash Image.
 * Simulates variations by making parallel requests since the standard flash-image model usually returns one variation per request.
 */
export const generateImages = async (prompt: string, count: number = 4): Promise<string[]> => {
  if (!API_KEY) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Clean the prompt: The model might output the structured text "[ENHANCED PROMPT]...". 
  // We can feed this directly as the model understands it, or we can flatten it.
  // Feeding it directly usually works well for Gemini image models as they follow instructions.

  const generateSingleImage = async (): Promise<string | null> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
            // No specific image config needed for basic generation, 
            // defaults are usually fine. 
            // aspectRatio "1:1" is default.
        }
      });

      // Extract image from response
      // Gemini 2.5 Flash Image returns the image in the parts list with inlineData
      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
             return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          }
        }
      }
      return null;
    } catch (e) {
      console.error("Single image generation failed", e);
      return null;
    }
  };

  // Run requests in parallel to get variations
  const promises = Array(count).fill(null).map(() => generateSingleImage());
  const results = await Promise.all(promises);

  // Filter out failed generations
  return results.filter((img): img is string => img !== null);
};