
import React from 'react';
import { AnalysisResult } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ResultsSectionProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ result, onReset }) => {
  // Map 1-10 score to percentage for the chart
  const percentage = result.matchScore * 10;
  const chartData = [
    { value: percentage, color: result.matchScore >= 7 ? '#10b981' : result.matchScore >= 4 ? '#f59e0b' : '#ef4444' },
    { value: 100 - percentage, color: '#e2e8f0' }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(result.revampedResumeDraft);
    alert('Resume draft copied to clipboard!');
  };

  return (
    <div className="space-y-10 pb-20 animate-in zoom-in-95 duration-500">
      {/* Score Header */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center min-w-[200px]">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Match Score</h3>
          <div className="h-32 w-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={35}
                  outerRadius={50}
                  startAngle={90}
                  endAngle={450}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-black fill-slate-800">
                  {result.matchScore}
                  <tspan className="text-xs font-normal fill-slate-400">/10</tspan>
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full mt-2 ${
            result.matchScore >= 7 ? 'bg-emerald-100 text-emerald-700' : 
            result.matchScore >= 4 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
          }`}>
            {result.matchScore >= 7 ? 'Strong Match' : result.matchScore >= 4 ? 'Developing' : 'Needs Optimization'}
          </span>
        </div>

        <div className="flex-grow bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
            HR Expert Assessment
          </h3>
          <p className="text-slate-600 leading-relaxed italic text-sm">
            "{result.overallFeedback}"
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.keywordGap.slice(0, 6).map((word, i) => (
              <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                +{word}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 Suggestions */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 text-center">Top 3 Critical Improvements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {result.topSuggestions.slice(0, 3).map((suggestion, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-blue-500 relative overflow-hidden flex flex-col">
              <span className="absolute -right-2 -top-2 text-6xl font-black text-slate-50 opacity-50 select-none">{i + 1}</span>
              <div className="mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                  suggestion.impact === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {suggestion.impact} Impact
                </span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2 relative z-10">{suggestion.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed relative z-10">{suggestion.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Revamped Version */}
      <section className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden text-white mt-12">
        <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">Recommended Revamped Version</h3>
            <p className="text-slate-400 text-xs">A copy-paste ready optimized draft.</p>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-xs font-bold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
            <span>Copy Text</span>
          </button>
        </div>
        <div className="p-8 max-h-[400px] overflow-y-auto font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-slate-400 scrollbar-thin scrollbar-thumb-slate-700">
          {result.revampedResumeDraft}
        </div>
      </section>

      <div className="flex justify-center pt-8">
        <button
          onClick={onReset}
          className="text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors border-b border-transparent hover:border-blue-600 pb-1"
        >
          Optimize Another Application
        </button>
      </div>
    </div>
  );
};

export default ResultsSection;
