
import React, { useState } from 'react';
import { UserInput, FileData } from '../types';
import * as mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

// Configure PDF.js worker - Pins version to 4.10.38 to match index.html importmap
const PDF_WORKER_URL = `https://esm.sh/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs`;
pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;

interface InputSectionProps {
  input: UserInput;
  onUpdate: (updates: Partial<UserInput>) => void;
  onSubmit: () => void;
  isAnalyzing: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ input, onUpdate, onSubmit, isAnalyzing }) => {
  const [loading, setLoading] = useState({ jd: false, resume: false });

  const processFile = async (file: File, field: 'jd' | 'resume') => {
    setLoading(prev => ({ ...prev, [field]: true }));
    const type = file.type;
    const name = file.name;

    try {
      if (type.includes('image')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          onUpdate({
            [field === 'jd' ? 'jdFile' : 'resumeFile']: { name, type, base64 }
          });
          setLoading(prev => ({ ...prev, [field]: false }));
        };
        reader.onerror = () => {
          alert('Failed to read image file.');
          setLoading(prev => ({ ...prev, [field]: false }));
        };
        reader.readAsDataURL(file);
        return; // Early return as reader is async
      } else if (type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const typedArray = new Uint8Array(arrayBuffer);
        const loadingTask = pdfjs.getDocument({ data: typedArray });
        const pdf = await loadingTask.promise;
        
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items
            .map((item: any) => item.str || '')
            .filter(str => str.trim().length > 0);
          fullText += strings.join(' ') + '\n';
        }

        if (!fullText.trim()) {
          throw new Error('PDF appears to be empty or contains only images.');
        }

        onUpdate({
          [field === 'jd' ? 'jobDescription' : 'resumeContent']: fullText,
          [field === 'jd' ? 'jdFile' : 'resumeFile']: { name, type }
        });
      } else if (type.includes('word') || name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        
        if (!result.value.trim()) {
          throw new Error('Word document appears to be empty.');
        }

        onUpdate({
          [field === 'jd' ? 'jobDescription' : 'resumeContent']: result.value,
          [field === 'jd' ? 'jdFile' : 'resumeFile']: { name, type }
        });
      } else {
        alert('Unsupported format. Please use PDF, DOCX, or Image.');
      }
    } catch (error) {
      console.error('File processing error:', error);
      alert(`Error processing ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'jd' | 'resume') => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0], field);
    }
    e.target.value = '';
  };

  const isFormValid = (input.jobDescription.trim().length > 20 || input.jdFile) && 
                      (input.resumeContent.trim().length > 20 || input.resumeFile);

  const FileStatus = ({ file, field }: { file: FileData | null, field: 'jd' | 'resume' }) => {
    if (!file) return null;
    return (
      <div className="flex items-center justify-between bg-blue-50 border border-blue-100 p-3 rounded-xl mt-3 animate-in fade-in slide-in-from-top-2">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-bold text-blue-900 truncate">{file.name}</span>
            <span className="text-[10px] text-blue-500 uppercase font-bold tracking-wider">Ready for Analysis</span>
          </div>
        </div>
        <button 
          onClick={() => {
            onUpdate({
              [field === 'jd' ? 'jdFile' : 'resumeFile']: null,
              [field === 'jd' ? 'jobDescription' : 'resumeContent']: ''
            });
          }} 
          className="p-1 hover:bg-blue-100 rounded-full text-blue-400 hover:text-red-500 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Job Description Side */}
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Target Job Description
            </label>
            <input type="file" id="jd-file" className="hidden" accept=".pdf,.docx,.png,.jpg,.jpeg" onChange={(e) => handleFileChange(e, 'jd')} />
            <label htmlFor="jd-file" className={`
              cursor-pointer text-xs font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center space-x-1
              ${loading.jd ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50 shadow-sm'}
            `}>
              {loading.jd ? <span>Reading...</span> : <span>Upload File</span>}
            </label>
          </div>
          <textarea
            className="w-full h-64 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-slate-600 placeholder:text-slate-400 text-sm"
            placeholder="Paste text here or upload a document..."
            value={input.jobDescription}
            onChange={(e) => onUpdate({ jobDescription: e.target.value })}
          />
          <FileStatus file={input.jdFile} field="jd" />
        </div>

        {/* Resume Side */}
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Your Resume
            </label>
            <input type="file" id="resume-file" className="hidden" accept=".pdf,.docx,.png,.jpg,.jpeg" onChange={(e) => handleFileChange(e, 'resume')} />
            <label htmlFor="resume-file" className={`
              cursor-pointer text-xs font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center space-x-1
              ${loading.resume ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50 shadow-sm'}
            `}>
              {loading.resume ? <span>Reading...</span> : <span>Upload File</span>}
            </label>
          </div>
          <textarea
            className="w-full h-64 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-slate-600 placeholder:text-slate-400 text-sm"
            placeholder="Paste text here or upload a document..."
            value={input.resumeContent}
            onChange={(e) => onUpdate({ resumeContent: e.target.value })}
          />
          <FileStatus file={input.resumeFile} field="resume" />
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={onSubmit}
          disabled={!isFormValid || isAnalyzing || loading.jd || loading.resume}
          className={`
            px-16 py-4 rounded-full font-black text-white transition-all shadow-xl text-lg flex items-center space-x-3
            ${isFormValid && !isAnalyzing && !loading.jd && !loading.resume
              ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-blue-200' 
              : 'bg-slate-300 cursor-not-allowed'}
          `}
        >
          {isAnalyzing ? <span>Strategizing...</span> : <span>Get Expert Analysis</span>}
        </button>
      </div>
    </div>
  );
};

export default InputSection;
