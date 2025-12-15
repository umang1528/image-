import React from 'react';
import { GeneratedImage as IGeneratedImage } from '../types';
import GeneratedImage from './GeneratedImage';
import { Layers, Trash2 } from 'lucide-react';

interface ImageGridProps {
  images: IGeneratedImage[];
  isLoading?: boolean;
  onReusePrompt: (prompt: string) => void;
  onClearHistory: () => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, isLoading, onReusePrompt, onClearHistory }) => {
  if (images.length === 0 && !isLoading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
        <Layers className="w-16 h-16 mb-4 opacity-50" />
        <h3 className="text-xl font-medium text-slate-400">No images generated yet</h3>
        <p className="text-sm">Enter a prompt and unleash your imagination.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-12">
       <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
            <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
            History & Gallery
          </h2>
          <div className="flex items-center gap-4">
             <span className="text-sm text-slate-500">{images.length} Creations</span>
             {images.length > 0 && (
                <button 
                  onClick={onClearHistory}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-colors border border-red-500/20"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear History
                </button>
             )}
          </div>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Loading Skeletons */}
         {isLoading && Array.from({ length: 4 }).map((_, i) => (
           <div key={`loading-${i}`} className="aspect-square rounded-xl bg-slate-800/50 animate-pulse border border-slate-700/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/20 to-transparent translate-x-[-100%] animate-[shimmer_1.5s_infinite]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
              </div>
           </div>
         ))}

         {/* Actual Images */}
         {images.map((img) => (
           <GeneratedImage key={img.id} image={img} onReusePrompt={onReusePrompt} />
         ))}
       </div>
    </div>
  );
};

export default ImageGrid;