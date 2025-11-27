export enum InputMode {
  VIDEO = 'VIDEO',
  TEXT = 'TEXT'
}

export interface TranscriptionResult {
  original: string;
  indonesian: string;
  raw: string;
}

export interface ProcessingState {
  status: 'idle' | 'processing' | 'success' | 'error';
  message?: string;
}
