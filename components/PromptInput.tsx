import React, { useRef } from 'react';
import { Wand2, Image as ImageIcon, Loader2, ImagePlus, X } from 'lucide-react';
import { IMAGE_STYLES, ASPECT_RATIOS, GenerationState, ReferenceImage } from '../types';

interface PromptInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  enhancedPrompt: string;
  setEnhancedPrompt: (value: string) => void;
  selectedStyle: string;
  setSelectedStyle: (value: string) => void;
  aspectRatio: string;
  setAspectRatio: (value: string) => void;
  referenceImages: ReferenceImage[];
  setReferenceImages: (images: ReferenceImage[]) => void;
  onGenerate: () => void;
  onEnhance: () => void;
  status: GenerationState;
}

const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  setPrompt,
  enhancedPrompt,
  setEnhancedPrompt,
  selectedStyle,
  setSelectedStyle,
  aspectRatio,
  setAspectRatio,
  referenceImages,
  setReferenceImages,
  onGenerate,
  onEnhance,
  status
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEnhancing = status === GenerationState.ENHANCING;
  const isGenerating = status === GenerationState.GENERATING;
  const isBusy = isEnhancing || isGenerating;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Limit total images to 4
    const remainingSlots = 4 - referenceImages.length;
    // Fix: Cast the array to File[] so that the 'file' variable in forEach is correctly typed as File instead of unknown.
    const filesToProcess = Array.from(files).slice(0, remainingSlots) as File[];

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix for API
        const base64Data = base64String.split(',')[1];
        const mimeType = file.type;
        
        const newImage: ReferenceImage = {
          id: Math.random().toString(36).substring(7),
          data: base64Data,
          mimeType: mimeType,
          previewUrl: base64String
        };
        
        setReferenceImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (id: string) => {
    setReferenceImages(referenceImages.filter(img => img.id !== id));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Main Input Area */}
      <div className="bg-slate-900/50 rounded-2xl p-1 border border-slate-800 shadow-xl backdrop-blur-sm">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your imagination here... (e.g., 'A futuristic city with flying cars at sunset')"
          className="w-full bg-slate-950/50 text-slate-200 placeholder-slate-500 rounded-xl p-4 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-lg"
          disabled={isBusy}
        />

        {/* Reference Images Preview */}
        {referenceImages.length > 0 && (
          <div className="px-4 pb-2 flex gap-3 overflow-x-auto no-scrollbar">
            {referenceImages.map((img) => (
              <div key={img.id} className="relative group flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-slate-700">
                <img src={img.previewUrl} alt="Reference" className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeImage(img.id)}
                  className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 border-t border-slate-800/50">
            {/* Options Selectors */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
              
              {/* Image Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy || referenceImages.length >= 4}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Add Reference Image"
              >
                <ImagePlus className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Add Ref</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                multiple 
                className="hidden" 
              />

              <div className="w-px h-6 bg-slate-800 mx-1 hidden sm:block"></div>
              
              {/* Style Selector */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider hidden sm:inline">Style</span>
                <select 
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="bg-slate-800 text-slate-300 text-sm rounded-lg border border-slate-700 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500/50 outline-none cursor-pointer hover:bg-slate-750 transition-colors"
                  disabled={isBusy}
                >
                  <option value="">Auto Style</option>
                  {IMAGE_STYLES.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              {/* Aspect Ratio Selector */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider hidden sm:inline">Ratio</span>
                <select 
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="bg-slate-800 text-slate-300 text-sm rounded-lg border border-slate-700 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500/50 outline-none cursor-pointer hover:bg-slate-750 transition-colors"
                  disabled={isBusy}
                >
                  {ASPECT_RATIOS.map(ratio => (
                    <option key={ratio.value} value={ratio.value}>{ratio.label}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onEnhance}
                disabled={isBusy || (!prompt.trim() && referenceImages.length === 0)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"
              >
                {isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                <span>Enhance</span>
              </button>
              
              <button
                onClick={onGenerate}
                disabled={isBusy || ((!prompt.trim() && !enhancedPrompt.trim()) && referenceImages.length === 0)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                <span>Generate</span>
              </button>
            </div>
        </div>
      </div>

      {/* Enhanced Prompt Display (if available) */}
      {(enhancedPrompt || isEnhancing) && (
        <div className="relative group">
          <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl opacity-30 group-hover:opacity-50 blur transition duration-1000 ${isEnhancing ? 'animate-pulse' : ''}`}></div>
          <div className="relative bg-slate-900 rounded-xl p-5 border border-slate-800">
             <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-purple-400 flex items-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  AI Enhanced Prompt
                </h3>
                {enhancedPrompt && (
                   <button 
                     onClick={() => {
                        // Copy to clipboard or use as main prompt
                        setPrompt(enhancedPrompt);
                     }}
                     className="text-xs text-slate-500 hover:text-white transition-colors"
                   >
                     Use as Input
                   </button>
                )}
             </div>
             
             {isEnhancing ? (
               <div className="space-y-2 animate-pulse">
                 <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                 <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                 <div className="h-4 bg-slate-800 rounded w-5/6"></div>
               </div>
             ) : (
                <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed overflow-x-auto">
                  {enhancedPrompt}
                </pre>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptInput;