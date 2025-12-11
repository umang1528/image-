import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ImagineAI
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide">PROFESSIONAL IMAGE GENERATOR</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs text-slate-400">
            Powered by Gemini 2.5
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;