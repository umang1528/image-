import React from 'react';
import { Wand2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { IMAGE_STYLES, GenerationState } from '../types';

interface PromptInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  enhancedPrompt: string;
  setEnhancedPrompt: (value: string) => void;
  selectedStyle: string;
  setSelectedStyle: (value: string) => void;
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
  onGenerate,
  onEnhance,
  status
}) => {
  const isEnhancing = status === GenerationState.ENHANCING;
  const isGenerating = status === GenerationState.GENERATING;
  const isBusy = isEnhancing || isGenerating;

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
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 border-t border-slate-800/50">
            {/* Style Selector */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
              <span className="text-slate-500 text-sm whitespace-nowrap">Style:</span>
              <select 
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="bg-slate-800 text-slate-300 text-sm rounded-lg border-none px-3 py-1.5 focus:ring-2 focus:ring-indigo-500/50 outline-none cursor-pointer"
                disabled={isBusy}
              >
                <option value="">Auto</option>
                {IMAGE_STYLES.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onEnhance}
                disabled={isBusy || !prompt.trim()}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"
              >
                {isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                <span>Enhance</span>
              </button>
              
              <button
                onClick={onGenerate}
                disabled={isBusy || (!prompt.trim() && !enhancedPrompt.trim())}
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