
export interface Suggestion {
  title: string;
  description: string;
  impact: 'High' | 'Medium';
}

export interface AnalysisResult {
  matchScore: number; // 1 to 10
  topSuggestions: Suggestion[]; // Top 3 specifically
  overallFeedback: string;
  revampedResumeDraft: string;
  keywordGap: string[];
}

export interface FileData {
  name: string;
  type: string;
  content?: string; // For text/pdf/docx
  base64?: string; // For images
}

export interface UserInput {
  jobDescription: string;
  resumeContent: string;
  jdFile: FileData | null;
  resumeFile: FileData | null;
}

export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
