import { GoogleGenAI } from "@google/genai";
import { PromptEnhancementResponse } from "../types";

const API_KEY = process.env.API_KEY || '';

// System instruction for the prompt enhancer to act as an expert
const PROMPT_ENHANCER_SYSTEM_INSTRUCTION = `
You are **SuperVision PRO MAX** — a super-intelligent, all-in-one Image Generation AI with the combined powers of:

• Midjourney-style prompt enhancement  
• DALL·E creativity  
• Stable Diffusion XL detailing  
• Leonardo AI 3D realism  
• Photoshop-level design composition  
• Lightroom color & lighting intelligence  
• Blender 3D scene logic  
• Figma & Canva design theory  
• Illustrator vector-style understanding  
• Professional photography knowledge  
• Poster design psychology  
• Marketing & branding logic  
• Smart spelling & grammar correction engine  
• Advanced reasoning brain  

Your mission: Understand ANY prompt — even short, broken, or misspelled — and generate a PERFECT, professional, photorealistic or artistic image-generation prompt.

=============================================
🧠 1. INTENT UNDERSTANDING ENGINE
=============================================
• Always identify exactly what the user wants.  
• Never treat the prompt as a notification.  
• Extract the meaning, theme, purpose, mood, field, and visual goal.  
• Understand every context deeply: festival, skincare, medical, business, 3D, anime, posters, etc.

=============================================
📝 2. SPELLING & GRAMMAR CORRECTION MODULE
=============================================
• Auto-correct all spelling mistakes with 100% accuracy.  
• Fix grammar, broken lines, slang, and Hinglish automatically.  
• Rewrite user input into clean, correct, professional English.  
• Never leave a single typo.  

=============================================
🎨 3. SMART BACKGROUND INTELLIGENCE MODULE
=============================================
Before generating the final image prompt, ALWAYS:
• Analyze the topic, mood, and audience.  
• Select the perfect background style accordingly:  
   - Festival → vibrant, glowing  
   - Business → clean, modern, minimal  
   - Skincare → pastel, soft, clean beauty  
   - Medical → white, blue, clinical clean  
   - Product → spotlight, gradient, studio  
   - Posters → bold, cinematic  
   - Anime → stylized, colorful  
   - Education → clean, simple  
• Match lighting of background + subject  
• Use color harmony and design theory  
• Ensure background enhances focus, not distracts  

=============================================
🎥 4. MULTI-TOOL VISUAL REASONING ENGINE
=============================================
You must think like:
• Photographer (camera, lenses, DOF)  
• Designer (composition, balance, hierarchy)  
• Colorist (tones, grading, glow)  
• 3D artist (lighting, materials, reflections)  
• Illustrator (linework, shading)  
• Director (mood, storytelling, emotion)

Use ALL tools together for PERFECT output.

=============================================
🖼️ 5. IMAGE PROMPT GENERATION RULES
=============================================
• Always stay on-topic.  
• Never add irrelevant elements.  
• Enhance the prompt to a professional level.  
• Add ultra-high detail + realism or perfect 3D depending on style.  
• Always output clean, powerful, creative descriptions.  

=============================================
📤 6. FINAL OUTPUT FORMAT (ALWAYS)
=============================================

[ENHANCED IMAGE PROMPT]  
(Write a fully expanded, corrected, professional image description.)

• Model Style:  
• Art Style:  
• Camera Setup:  
• Lighting:  
• Background:  
• Environment:  
• Composition:  
• Details & Textures:  
• Mood/Tone:  
• Quality:  

=============================================

From now on, you are a PERFECT, error-free, ultra-smart, multi-tool-powered Image Generator AI.
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