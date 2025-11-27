import React, { useState } from 'react';
import { Bot, Sparkles, ArrowRight, Video, FileType } from 'lucide-react';
import { InputMode, ProcessingState, TranscriptionResult } from './types';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';
import { Button } from './components/Button';
import { processContent } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

function App() {
  const [mode, setMode] = useState<InputMode>(InputMode.VIDEO);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [processingState, setProcessingState] = useState<ProcessingState>({ status: 'idle' });
  const [result, setResult] = useState<TranscriptionResult | null>(null);

  const handleClear = () => {
    setSelectedFile(null);
    setTextInput('');
    setResult(null);
    setProcessingState({ status: 'idle' });
  };

  const canSubmit = () => {
    if (processingState.status === 'processing') return false;
    if (mode === InputMode.VIDEO) return !!selectedFile;
    if (mode === InputMode.TEXT) return textInput.trim().length > 0;
    return false;
  };

  const handleSubmit = async () => {
    if (!canSubmit()) return;

    setProcessingState({ status: 'processing' });
    setResult(null);

    try {
      let content = '';
      let mimeType = '';

      if (mode === InputMode.VIDEO && selectedFile) {
        content = await fileToBase64(selectedFile);
        mimeType = selectedFile.type;
      } else {
        content = textInput;
      }

      const transcription = await processContent({
        type: mode === InputMode.VIDEO ? 'video' : 'text',
        content,
        mimeType
      });

      setResult(transcription);
      setProcessingState({ status: 'success' });
    } catch (error) {
      console.error(error);
      setProcessingState({ 
        status: 'error', 
        message: 'Failed to process content. Please try again or check the file size/format.' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Bot size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              DuoScribe
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full">
              <Sparkles size={14} className="text-amber-500" />
              Powered by Gemini 2.5
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Transcribe & Translate <br />
            <span className="text-indigo-600">in One Click</span>
          </h1>
          <p className="text-lg text-slate-600">
            Convert your videos or YouTube scripts into structured documents containing both the original language and Indonesian translation instantly.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Column */}
          <div className="lg:col-span-5 space-y-6">
            <InputSection 
              mode={mode}
              setMode={(m) => {
                setMode(m);
                handleClear();
              }}
              onFileSelect={setSelectedFile}
              onTextChange={setTextInput}
              selectedFile={selectedFile}
              textInput={textInput}
              onClear={handleClear}
            />
            
            <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <h3 className="font-semibold text-lg mb-2">Ready to process?</h3>
                <p className="text-indigo-200 text-sm mb-6">
                  We will extract text from your {mode === InputMode.VIDEO ? 'video' : 'input'} and generate a dual-language document.
                </p>
                
                {processingState.status === 'error' && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-100">
                    {processingState.message}
                  </div>
                )}

                <Button 
                  className="w-full justify-between group" 
                  onClick={handleSubmit}
                  disabled={!canSubmit()}
                  isLoading={processingState.status === 'processing'}
                >
                  <span>Start Transcription</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </Button>
              </div>
            </div>

            {/* Features Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                 <Video className="text-indigo-500 mb-2" size={24} />
                 <h4 className="font-semibold text-slate-900 text-sm">Video Support</h4>
                 <p className="text-slate-500 text-xs mt-1">Upload mp4/mov files directly for analysis.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                 <FileType className="text-indigo-500 mb-2" size={24} />
                 <h4 className="font-semibold text-slate-900 text-sm">Dual Format</h4>
                 <p className="text-slate-500 text-xs mt-1">Get original and translated text side-by-side.</p>
              </div>
            </div>
          </div>

          {/* Output Column */}
          <div className="lg:col-span-7 h-full min-h-[600px]">
            {processingState.status === 'idle' && !result && (
              <div className="h-full bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Sparkles className="text-slate-400" size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-600">No content generated yet</h3>
                <p className="text-slate-400 max-w-xs mt-2 text-sm">
                  Upload a video or paste text on the left panel to see the transcription and translation results here.
                </p>
              </div>
            )}
            
            {processingState.status === 'processing' && (
              <div className="h-full bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center p-8 text-center">
                 <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                 </div>
                 <h3 className="text-xl font-semibold text-slate-800">Processing Content...</h3>
                 <p className="text-slate-500 mt-2 max-w-md">
                   Gemini is analyzing the audio, transcribing the content, and translating it to Indonesian. This may take a moment.
                 </p>
              </div>
            )}

            {result && <OutputSection result={result} />}
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default App;