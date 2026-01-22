
import React, { useState, useCallback, useMemo } from 'react';
import { 
  Search, 
  BarChart3, 
  PieChart as PieChartIcon, 
  MessageSquare, 
  ShieldCheck, 
  Activity,
  AlertCircle,
  Zap,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Filter
} from 'lucide-react';
import { LLMMentionItem, BrandVisibilityReport, AuthConfig } from './types';
import { fetchLLMMentions } from './services/dataForSeoService';
import { getBrandInsights, enhanceMentionsWithSentiment } from './services/geminiService';
import { MetricsCard } from './components/MetricsCard';
import { VisibilityChart, SentimentPie } from './components/Charts';

const App: React.FC = () => {
  const [brand, setBrand] = useState('Tesla');
  const [auth, setAuth] = useState<AuthConfig>({ user: '', pass: '' });
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<BrandVisibilityReport | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!brand.trim()) return;

    setLoading(true);
    try {
      const rawItems = await fetchLLMMentions(brand, auth);
      // Enhance with Gemini for sentiment and context
      const enrichedItems = await enhanceMentionsWithSentiment(brand, rawItems);
      const insights = await getBrandInsights(brand, enrichedItems);

      const totalVol = enrichedItems.reduce((acc, curr) => acc + curr.search_volume, 0);
      const mentionedCount = enrichedItems.filter(i => i.is_mentioned).length;

      setReport({
        brand,
        items: enrichedItems,
        totalMentions: mentionedCount,
        avgSearchVolume: Math.round(totalVol / enrichedItems.length),
        insights
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sidebar/Navigation */}
      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-6 sticky top-0 h-screen">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">BrandSight AI</h1>
          </div>

          <nav className="space-y-1 flex-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-700">
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50">
              <Activity size={18} />
              Real-time Feed
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50">
              <BarChart3 size={18} />
              Competitors
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50"
            >
              <Zap size={18} />
              API Settings
            </button>
          </nav>

          <div className="pt-6 mt-6 border-t border-slate-100">
            <div className="bg-slate-900 rounded-xl p-4 text-white">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Pro Feature</p>
              <p className="text-sm mb-3">Get advanced alerts for brand mentions.</p>
              <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-bold transition">
                Upgrade Now
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">LLM Visibility Tracker</h2>
              <p className="text-slate-500">Monitor how AI models perceive and discuss your brand.</p>
            </div>

            <form onSubmit={handleAnalyze} className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-full md:w-96">
              <div className="pl-3 text-slate-400">
                <Search size={20} />
              </div>
              <input 
                type="text" 
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Enter brand name..." 
                className="flex-1 bg-transparent border-none outline-none py-2 text-sm text-slate-700"
              />
              <button 
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {loading ? 'Analyzing...' : 'Search'}
              </button>
            </form>
          </div>

          {/* API Settings Collapsible */}
          {showSettings && (
            <div className="mb-8 p-6 bg-white rounded-xl border-2 border-indigo-100 shadow-sm animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-2 mb-4 text-indigo-700">
                <ShieldCheck size={20} />
                <h3 className="font-bold">DataForSEO API Configuration</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">Provide your credentials for live data extraction. Leave empty to use simulated demonstration data.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Username (Email)</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={auth.user}
                    onChange={(e) => setAuth(prev => ({ ...prev, user: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password (API Key)</label>
                  <input 
                    type="password" 
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={auth.pass}
                    onChange={(e) => setAuth(prev => ({ ...prev, pass: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Initial State / Empty State */}
          {!report && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-4">
                <Search size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Ready to start tracking?</h3>
              <p className="text-slate-500 max-w-sm">Enter a brand name above to analyze its presence across GPT-4, Gemini, Claude, and other LLMs.</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium animate-pulse">Scanning AI optimization endpoints for {brand}...</p>
            </div>
          )}

          {/* Dashboard View */}
          {report && !loading && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricsCard 
                  label="Total LLM Mentions" 
                  value={report.totalMentions} 
                  icon={<MessageSquare size={20} />} 
                  trend={{ value: 12, isUp: true }}
                />
                <MetricsCard 
                  label="Avg. AI Search Volume" 
                  value={report.avgSearchVolume.toLocaleString()} 
                  icon={<BarChart3 size={20} />} 
                  trend={{ value: 5, isUp: true }}
                />
                <MetricsCard 
                  label="Positive Sentiment" 
                  value={`${Math.round((report.items.filter(i => i.sentiment === 'positive').length / report.items.length) * 100)}%`} 
                  icon={<Zap size={20} />} 
                />
                <MetricsCard 
                  label="Mention Probability" 
                  value={`${Math.round((report.totalMentions / report.items.length) * 100)}%`} 
                  icon={<Activity size={20} />} 
                />
              </div>

              {/* Main Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Insights and Charts */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">AI Visibility by Trigger Prompt</h3>
                      <button className="text-indigo-600 text-sm font-semibold hover:underline">Download CSV</button>
                    </div>
                    <VisibilityChart items={report.items} />
                  </div>

                  <div className="bg-indigo-900 rounded-xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4 text-indigo-300">
                        <Zap size={20} />
                        <span className="text-sm font-bold uppercase tracking-widest">Gemini AI Insights</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Executive Summary</h3>
                      <p className="text-indigo-100 text-lg leading-relaxed italic">
                        "{report.insights}"
                      </p>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <ShieldCheck size={200} />
                    </div>
                  </div>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Sentiment Distribution</h3>
                    <SentimentPie items={report.items} />
                    <div className="mt-4 space-y-2">
                       <div className="flex items-center justify-between text-sm">
                         <span className="text-slate-500">Brand Reputation Risk</span>
                         <span className="font-bold text-emerald-500 uppercase">Low</span>
                       </div>
                       <div className="flex items-center justify-between text-sm">
                         <span className="text-slate-500">Model hallucination rate</span>
                         <span className="font-bold text-slate-800">2.4%</span>
                       </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Top Trigger Prompts</h3>
                    <div className="space-y-4">
                      {report.items.slice(0, 5).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${item.is_mentioned ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 leading-tight">{item.keyword}</p>
                            <p className="text-xs text-slate-500 mt-1">{item.search_volume.toLocaleString()} AI Search Vol</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-6 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
                      View All Prompts
                    </button>
                  </div>
                </div>
              </div>

              {/* Mention Context Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                 <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-lg font-bold">LLM Mention Contexts</h3>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-slate-600 transition"><Filter size={18} /></button>
                    </div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="text-xs font-bold text-slate-400 uppercase bg-slate-50 border-b border-slate-100">
                             <th className="px-6 py-3">Prompt Variation</th>
                             <th className="px-6 py-3">Mention Status</th>
                             <th className="px-6 py-3">Sentiment</th>
                             <th className="px-6 py-3">Context Preview</th>
                             <th className="px-6 py-3 text-right">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {report.items.map((item, idx) => (
                             <tr key={idx} className="hover:bg-slate-50 transition cursor-default">
                                <td className="px-6 py-4">
                                   <div className="font-medium text-slate-800">{item.keyword}</div>
                                </td>
                                <td className="px-6 py-4">
                                   {item.is_mentioned ? (
                                      <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">MENTIONED</span>
                                   ) : (
                                      <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">NOT SEEN</span>
                                   )}
                                </td>
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-2">
                                      <span className={`w-2 h-2 rounded-full ${
                                         item.sentiment === 'positive' ? 'bg-emerald-500' : 
                                         item.sentiment === 'negative' ? 'bg-rose-500' : 'bg-slate-400'
                                      }`}></span>
                                      <span className="text-xs font-medium capitalize">{item.sentiment}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-4 max-w-xs">
                                   <p className="text-xs text-slate-500 truncate">{item.context_snippet || 'Analyzing contextual data...'}</p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                   <button className="text-slate-400 hover:text-indigo-600 transition">
                                      <ChevronRight size={18} />
                                   </button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-8 flex justify-between items-center text-xs text-slate-400">
        <p>&copy; 2024 BrandSight AI. Powered by DataForSEO & Gemini 3.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-600">API Documentation</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
