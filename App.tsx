import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageGrid from './components/ImageGrid';
import { AppState, GeneratedImage, GenerationState } from './types';
import { enhancePrompt, generateImages } from './services/gemini';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    originalPrompt: '',
    enhancedPrompt: '',
    generatedImages: [],
    status: GenerationState.IDLE,
    error: null,
    selectedStyle: ''
  });

  // Load API key check (implicit since we use it in service, but good to handle errors UI wise)
  useEffect(() => {
    // If we wanted to check for key existence or show a banner
  }, []);

  const handleEnhance = async () => {
    if (!state.originalPrompt.trim()) return;

    setState(prev => ({ ...prev, status: GenerationState.ENHANCING, error: null }));

    try {
      const response = await enhancePrompt(state.originalPrompt, state.selectedStyle);
      setState(prev => ({
        ...prev,
        enhancedPrompt: response.enhancedPrompt,
        status: GenerationState.IDLE
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        status: GenerationState.ERROR,
        error: error.message || "Failed to enhance prompt"
      }));
    }
  };

  const handleGenerate = async () => {
    // Use enhanced prompt if available, otherwise original
    const promptToUse = state.enhancedPrompt || state.originalPrompt;
    
    if (!promptToUse.trim()) return;

    setState(prev => ({ ...prev, status: GenerationState.GENERATING, error: null }));

    try {
      // Generate 4 variations
      const imageUrls = await generateImages(promptToUse, 4);
      
      if (imageUrls.length === 0) {
        throw new Error("No images were returned from the model.");
      }

      const newImages: GeneratedImage[] = imageUrls.map(url => ({
        id: Math.random().toString(36).substring(7),
        url: url,
        prompt: promptToUse,
        timestamp: Date.now()
      }));

      setState(prev => ({
        ...prev,
        generatedImages: [...newImages, ...prev.generatedImages], // Add to front
        status: GenerationState.COMPLETE
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        status: GenerationState.ERROR,
        error: error.message || "Failed to generate images"
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 pt-8 pb-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Visualize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Dreams</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Transform text into stunning visuals. Use our advanced AI to enhance your prompts and generate professional-quality images in seconds.
          </p>
        </div>

        {/* Error Banner */}
        {state.error && (
          <div className="w-full max-w-2xl mx-auto p-4 bg-red-900/20 border border-red-800/50 rounded-xl flex items-center gap-3 text-red-200 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{state.error}</p>
            <button 
              onClick={() => setState(prev => ({ ...prev, error: null }))}
              className="ml-auto text-red-300 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Interaction Area */}
        <section className="relative z-10">
          <PromptInput
            prompt={state.originalPrompt}
            setPrompt={(val) => setState(prev => ({ ...prev, originalPrompt: val }))}
            enhancedPrompt={state.enhancedPrompt}
            setEnhancedPrompt={(val) => setState(prev => ({ ...prev, enhancedPrompt: val }))}
            selectedStyle={state.selectedStyle}
            setSelectedStyle={(val) => setState(prev => ({ ...prev, selectedStyle: val }))}
            onGenerate={handleGenerate}
            onEnhance={handleEnhance}
            status={state.status}
          />
        </section>

        {/* Results Area */}
        <section className="pb-20">
          <ImageGrid 
            images={state.generatedImages} 
            isLoading={state.status === GenerationState.GENERATING}
          />
        </section>
      </main>

      <footer className="py-8 border-t border-slate-800/50 text-center text-slate-500 text-sm">
        <p>© 2024 ImagineAI. Powered by Google Gemini 2.5.</p>
      </footer>
    </div>
  );
};

export default App;