import React, { useState } from 'react';
import { Copy, Check, Download, Languages, FileText } from 'lucide-react';
import { TranscriptionResult } from '../types';
import { Button } from './Button';
import { downloadTextFile } from '../utils/fileUtils';

interface OutputSectionProps {
  result: TranscriptionResult | null;
}

export const OutputSection: React.FC<OutputSectionProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'side-by-side' | 'original' | 'indonesian'>('side-by-side');
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedIndonesian, setCopiedIndonesian] = useState(false);

  if (!result) return null;

  const handleCopy = (text: string, isOriginal: boolean) => {
    navigator.clipboard.writeText(text);
    if (isOriginal) {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } else {
      setCopiedIndonesian(true);
      setTimeout(() => setCopiedIndonesian(false), 2000);
    }
  };

  const handleDownload = () => {
    const content = `ORIGINAL TRANSCRIPTION:\n\n${result.original}\n\n-------------------\n\nINDONESIAN TRANSLATION:\n\n${result.indonesian}`;
    downloadTextFile(content, 'transcription-export.txt');
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
           <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
             <FileText size={18} />
           </div>
           <h3 className="font-semibold text-slate-800">Document Output</h3>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="hidden md:flex bg-slate-200 rounded-lg p-1 mr-2">
             <button 
              onClick={() => setActiveTab('side-by-side')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'side-by-side' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-600 hover:text-slate-800'}`}
             >
               Split View
             </button>
             <button 
              onClick={() => setActiveTab('original')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'original' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-600 hover:text-slate-800'}`}
             >
               Original
             </button>
             <button 
              onClick={() => setActiveTab('indonesian')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'indonesian' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-600 hover:text-slate-800'}`}
             >
               Indonesian
             </button>
           </div>
           
           <Button variant="outline" size="sm" onClick={handleDownload} icon={<Download size={14} />}>
             Export
           </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-50/30">
        <div className={`grid h-full ${activeTab === 'side-by-side' ? 'md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200' : 'grid-cols-1'}`}>
          
          {/* Original Column */}
          {(activeTab === 'side-by-side' || activeTab === 'original') && (
            <div className="flex flex-col h-full min-h-[400px]">
              <div className="p-3 bg-slate-100/50 border-b border-slate-200 flex items-center justify-between sticky top-0 backdrop-blur-sm z-10">
                 <span className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-2">Original Text</span>
                 <button 
                  onClick={() => handleCopy(result.original, true)}
                  className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-indigo-600 transition-colors"
                  title="Copy original text"
                 >
                   {copiedOriginal ? <Check size={14} /> : <Copy size={14} />}
                 </button>
              </div>
              <div className="p-6 text-slate-700 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                {result.original}
              </div>
            </div>
          )}

          {/* Indonesian Column */}
          {(activeTab === 'side-by-side' || activeTab === 'indonesian') && (
            <div className="flex flex-col h-full min-h-[400px] bg-indigo-50/10">
              <div className="p-3 bg-indigo-50/80 border-b border-indigo-100 flex items-center justify-between sticky top-0 backdrop-blur-sm z-10">
                 <div className="flex items-center gap-2 pl-2">
                   <Languages size={14} className="text-indigo-500" />
                   <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Indonesian Translation</span>
                 </div>
                 <button 
                  onClick={() => handleCopy(result.indonesian, false)}
                  className="p-1.5 hover:bg-indigo-100 rounded text-indigo-400 hover:text-indigo-600 transition-colors"
                  title="Copy translation"
                 >
                   {copiedIndonesian ? <Check size={14} /> : <Copy size={14} />}
                 </button>
              </div>
              <div className="p-6 text-slate-800 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                {result.indonesian}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};