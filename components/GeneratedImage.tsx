import React, { useState } from 'react';
import { Download, Maximize2, X, RotateCcw } from 'lucide-react';
import { GeneratedImage as IGeneratedImage } from '../types';

interface GeneratedImageProps {
  image: IGeneratedImage;
  onReusePrompt: (prompt: string) => void;
}

const GeneratedImage: React.FC<GeneratedImageProps> = ({ image, onReusePrompt }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `imagine-ai-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="group relative aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shadow-xl transition-all hover:shadow-indigo-500/20">
        <img
          src={image.url}
          alt={image.prompt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex gap-2 justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={() => onReusePrompt(image.prompt)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
              title="Reuse Prompt"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
              title="View Fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <img
            src={image.url}
            alt={image.prompt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
             <button
               onClick={() => {
                 setIsFullscreen(false);
                 onReusePrompt(image.prompt);
               }}
               className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-medium shadow-lg transition-transform hover:scale-105 border border-slate-700"
             >
               <RotateCcw className="w-5 h-5" />
               Reuse Prompt
             </button>
             <button
               onClick={handleDownload}
               className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium shadow-lg transition-transform hover:scale-105"
             >
               <Download className="w-5 h-5" />
               Download
             </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GeneratedImage;