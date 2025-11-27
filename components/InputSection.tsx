import React, { useRef, useState } from 'react';
import { Upload, FileText, Youtube, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { InputMode } from '../types';
import { Button } from './Button';

interface InputSectionProps {
  mode: InputMode;
  setMode: (mode: InputMode) => void;
  onFileSelect: (file: File) => void;
  onTextChange: (text: string) => void;
  selectedFile: File | null;
  textInput: string;
  onClear: () => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  mode,
  setMode,
  onFileSelect,
  onTextChange,
  selectedFile,
  textInput,
  onClear
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const validateAndSelectFile = (file: File) => {
    // Basic validation for size (e.g., limit to 50MB for browser-based processing to be safe)
    if (file.size > 50 * 1024 * 1024) {
      alert("File is too large. Please upload a video smaller than 50MB for this demo.");
      return;
    }
    // Basic type check
    if (!file.type.startsWith('video/')) {
      alert("Please upload a valid video file.");
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setMode(InputMode.VIDEO)}
          className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            mode === InputMode.VIDEO
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Upload size={18} />
          Video Upload
        </button>
        <button
          onClick={() => setMode(InputMode.TEXT)}
          className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            mode === InputMode.TEXT
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Youtube size={18} />
          YouTube Text / Script
        </button>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 min-h-[300px] flex flex-col">
        {mode === InputMode.VIDEO ? (
          <div className="flex-1 flex flex-col h-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Upload Video File</h3>
              <p className="text-slate-500 text-sm mt-1">
                Supported formats: MP4, MOV, WEBM (Max 50MB)
              </p>
            </div>

            {!selectedFile ? (
              <div
                className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all ${
                  dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-slate-100'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <Upload className="w-8 h-8 text-indigo-500" />
                </div>
                <p className="text-slate-700 font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-slate-400 text-xs">Video files up to 50MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="video/*"
                  onChange={handleFileInput}
                />
                <Button 
                  variant="secondary" 
                  className="mt-6"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select File
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center border border-indigo-100 bg-indigo-50/30 rounded-xl p-6 relative">
                <button 
                  onClick={onClear}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <FileText size={32} />
                </div>
                <h4 className="text-lg font-medium text-slate-900 break-all text-center max-w-md">
                  {selectedFile.name}
                </h4>
                <p className="text-slate-500 text-sm mt-1">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <div className="flex items-center gap-2 mt-4 text-emerald-600 text-sm font-medium bg-emerald-50 px-3 py-1 rounded-full">
                  <CheckCircle2 size={16} />
                  Ready to transcribe
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Input Text</h3>
              <p className="text-slate-500 text-sm mt-1">
                Paste YouTube transcript, captions, or any text to translate.
              </p>
            </div>
            <textarea
              className="flex-1 w-full p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none text-slate-700 placeholder:text-slate-400 font-mono text-sm leading-relaxed"
              placeholder="Paste your text here..."
              value={textInput}
              onChange={(e) => onTextChange(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};