
import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import { analyzeResume } from './services/geminiService';
import { UserInput, AnalysisResult, AppStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [input, setInput] = useState<UserInput>({
    jobDescription: '',
    resumeContent: '',
    jdFile: null,
    resumeFile: null
  });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateInput = (updates: Partial<UserInput>) => {
    setInput(prev => ({ ...prev, ...updates }));
  };

  const handleAnalyze = async () => {
    try {
      setStatus(AppStatus.ANALYZING);
      setError(null);
      const data = await analyzeResume(input);
      setResult(data);
      setStatus(AppStatus.COMPLETED);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please check your inputs and try again.');
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            AI Resume <span className="text-blue-600">Strategist.</span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto font-medium">
            Upload your files or paste text to get instant professional HR feedback and a 1-10 compatibility score.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center space-x-3 text-red-600 animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            <span className="font-semibold text-sm">{error}</span>
          </div>
        )}

        {status === AppStatus.IDLE || status === AppStatus.ANALYZING || status === AppStatus.ERROR ? (
          <InputSection 
            input={input} 
            onUpdate={handleUpdateInput} 
            onSubmit={handleAnalyze} 
            isAnalyzing={status === AppStatus.ANALYZING}
          />
        ) : (
          result && <ResultsSection result={result} onReset={handleReset} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-xs font-medium">
            Professional Analysis powered by Gemini 3.0 Pro &copy; {new Date().getFullYear()} ElevateCV
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
