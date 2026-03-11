import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, BarChart2, Shield, Server, FileText, Database, Users, Settings,
  RefreshCw, Search, Globe, Wifi, Cpu, HardDrive, Clock, TrendingUp,
  AlertTriangle, Lock, Archive, Bug, CheckCircle, XCircle, Eye,
  Activity, Terminal, Package, Monitor, Map, Key, Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';

const TOOL_CATEGORIES = [
  {
    id: 'performance', label: '🚀 Performance & Speed', color: 'from-blue-500 to-cyan-500',
    tools: [
      { id: 'page_load', name: 'Page Load Time', desc: 'TTFB, FCP, LCP, size analysis', icon: Zap, params: [{ key: 'url', label: 'URL', placeholder: 'https://example.com' }] },
      { id: 'waterfall', name: 'Resource Waterfall', desc: 'Script & stylesheet loading breakdown', icon: Activity, params: [{ key: 'url', label: 'URL', placeholder: 'https://example.com' }] },
      { id: 'cdn', name: 'CDN Detector', desc: 'Detect CDN provider and cache status', icon: Globe, params: [{ key: 'url', label: 'URL', placeholder: 'https://example.com' }] },
      { id: 'render', name: 'PageSpeed Insights', desc: 'Google PageSpeed scores (mobile)', icon: Monitor, params: [{ key: 'url', label: 'URL', placeholder: 'https://example.com' }] },
      { id: 'bundle', name: 'Bundle Analyzer', desc: 'JS/CSS bundle sizes from page', icon: Package, params: [{ key: 'url', label: 'URL', placeholder: 'https://example.com' }] },
    ]
  },
  {
    id: 'traffic', label: '📊 Traffic & Analytics', color: 'from-purple-500 to-pink-500',
    tools: [
      { id: 'realtime_visitors', name: 'Active Users (1h)', desc: 'Users active in last hour', icon: Eye, params: [] },
      { id: 'traffic_source', name: 'Platform Activity', desc: 'Messages, posts, projects summary', icon: BarChart2, params: [] },
      { id: 'heatmap', name: 'Heatmap Setup Guide', desc: 'How to integrate Clarity/Hotjar', icon: Map, params: [] },
      { id: 'popular_pages', name: 'Popular Content', desc: 'Top posts, projects, challenges', icon: TrendingUp, params: [] },
      { id: 'device_stats', name: 'User Stats', desc: 'Registered user analytics', icon: Monitor, params: [] },
    ]
  },
  {
    id: 'security', label: '🛡 Security Monitoring', color: 'from-red-500 to-orange-500',
    tools: [
      { id: 'intrusion', name: 'Intrusion Scan', desc: 'Detect XSS/SQLi in messages', icon: AlertTriangle, params: [] },
      { id: 'waf', name: 'WAF Detector', desc: 'Detect WAF/security headers', icon: Shield, params: [{ key: 'url', label: 'URL', placeholder: 'https://example.com' }] },
      { id: 'brute_force', name: 'Login Guard Status', desc: 'Brute force protection info', icon: Lock, params: [] },
      { id: 'ssl', name: 'SSL/HTTPS Check', desc: 'HTTPS, HSTS, CSP header check', icon: CheckCircle, params: [{ key: 'url', label: 'Domain', placeholder: 'example.com' }] },
      { id: 'malware', name: 'Malware Pattern Scan', desc: 'Pattern-based malware detection', icon: Bug, params: [{ key: 'url', label: 'URL', placeholder: 'https://example.com' }] },
    ]
  },
  {
    id: 'server', label: '💻 Server & Uptime', color: 'from-green-500 to-emerald-500',
    tools: [
      { id: 'uptime', name: 'Uptime Checker', desc: 'HTTP availability and response time', icon: CheckCircle, params: [{ key: 'url', label: 'URL', placeholder: 'https://example.com' }] },
      { id: 'ping', name: 'DNS Lookup', desc: 'A, MX, NS, TXT records via DoH', icon: Wifi, params: [{ key: 'domain', label: 'Domain', placeholder: 'example.com' }] },
      { id: 'cpu', name: 'CPU/Memory Stats', desc: 'Live stats via SSH', icon: Cpu, params: [{ key: 'host', label: 'SSH Host', placeholder: '1.2.3.4' }, { key: 'port', label: 'Port', placeholder: '22' }, { key: 'username', label: 'Username', placeholder: 'root' }, { key: 'password', label: 'Password', placeholder: '****', type: 'password' }] },
      { id: 'disk', name: 'Disk Space (df -h)', desc: 'Disk usage via SSH', icon: HardDrive, params: [{ key: 'host', label: 'SSH Host', placeholder: '1.2.3.4' }, { key: 'port', label: 'Port', placeholder: '22' }, { key: 'username', label: 'Username', placeholder: 'root' }, { key: 'password', label: 'Password', placeholder: '****', type: 'password' }] },
      { id: 'process', name: 'Process Monitor', desc: 'Top processes via SSH', icon: Server, params: [{ key: 'host', label: 'SSH Host', placeholder: '1.2.3.4' }, { key: 'port', label: 'Port', placeholder: '22' }, { key: 'username', label: 'Username', placeholder: 'root' }, { key: 'password', label: 'Password', placeholder: '****', type: 'password' }] },
    ]
  },
  {
    id: 'logs', label: '📁 Logs & Debugging', color: 'from-yellow-500 to-amber-500',
    tools: [
      { id: 'access_logs', name: 'Access Logs (tail -100)', desc: 'Nginx/Apache access log via SSH', icon: FileText, params: [{ key: 'host', label: 'SSH Host', placeholder: '1.2.3.4' }, { key: 'port', label: 'Port', placeholder: '22' }, { key: 'username', label: 'User', placeholder: 'root' }, { key: 'password', label: 'Password', placeholder: '****', type: 'password' }] },
      { id: 'error_logs', name: 'Error Logs (tail -100)', desc: 'Nginx/Apache error log via SSH', icon: Bug, params: [{ key: 'host', label: 'SSH Host', placeholder: '1.2.3.4' }, { key: 'port', label: 'Port', placeholder: '22' }, { key: 'username', label: 'User', placeholder: 'root' }, { key: 'password', label: 'Password', placeholder: '****', type: 'password' }] },
      { id: 'debug', name: 'System Journal Logs', desc: 'journalctl/dmesg via SSH', icon: Terminal, params: [{ key: 'host', label: 'SSH Host', placeholder: '1.2.3.4' }, { key: 'port', label: 'Port', placeholder: '22' }, { key: 'username', label: 'User', placeholder: 'root' }, { key: 'password', label: 'Password', placeholder: '****', type: 'password' }] },
      { id: 'log_export', name: 'Log Export (CSV)', desc: 'Export message/post logs', icon: Archive, params: [] },
      { id: 'error_rate', name: 'Error Rate Monitor', desc: 'Error rate in platform messages', icon: AlertTriangle, params: [] },
    ]
  },
  {
    id: 'database', label: '📦 Database & Storage', color: 'from-cyan-500 to-blue-500',
    tools: [
      { id: 'db_status', name: 'DB Connection Health', desc: 'Connection latency and health', icon: Database, params: [] },
      { id: 'query_perf', name: 'Query Performance', desc: 'Query latency for all entities', icon: BarChart2, params: [] },
      { id: 'slow_query', name: 'Slow Query Analyzer', desc: 'Identify bottlenecks', icon: Clock, params: [] },
      { id: 'db_backup', name: 'DB Backup Status', desc: 'Record counts per entity', icon: Archive, params: [] },
      { id: 'storage', name: 'Storage Breakdown', desc: 'Row counts across all entities', icon: HardDrive, params: [] },
    ]
  },
  {
    id: 'useraccess', label: '👤 User & Access Control', color: 'from-violet-500 to-purple-500',
    tools: [
      { id: 'activity_logs', name: 'User Activity Logs', desc: 'Recent actions across platform', icon: Activity, params: [] },
      { id: 'roles', name: 'Roles & Permissions', desc: 'Admin/mod role assignments', icon: Key, params: [] },
      { id: 'mfa', name: 'MFA Configuration', desc: 'Multi-factor auth status', icon: Lock, params: [] },
      { id: 'sessions', name: 'Session Manager', desc: 'Active user sessions today', icon: Users, params: [] },
      { id: 'login_history', name: 'Registration History', desc: 'Recent user registrations', icon: Clock, params: [] },
    ]
  },
  {
    id: 'maintenance', label: '⚙️ Site Maintenance', color: 'from-gray-500 to-zinc-500',
    tools: [
      { id: 'cron', name: 'Scheduled Tasks', desc: 'Automation job status', icon: Clock, params: [] },
      { id: 'cache', name: 'Cache Headers Check', desc: 'Inspect cache-control headers', icon: RefreshCw, params: [{ key: 'url', label: 'URL', placeholder: 'https://example.com' }] },
      { id: 'feature_flags', name: 'Feature Flags (Plugins)', desc: 'Active/inactive plugin flags', icon: Settings, params: [] },
      { id: 'rollback', name: 'Version Rollback', desc: 'Rollback instructions', icon: RefreshCw, params: [] },
      { id: 'maintenance_mode', name: 'Maintenance Mode', desc: 'Toggle maintenance info', icon: Settings, params: [] },
    ]
  },
  {
    id: 'backups', label: '🔁 Backups & Recovery', color: 'from-teal-500 to-green-500',
    tools: [
      { id: 'full_backup', name: 'Full Site Backup', desc: 'Snapshot all entity record counts', icon: Archive, params: [] },
      { id: 'incremental', name: 'Incremental (24h)', desc: 'New records in last 24 hours', icon: BarChart2, params: [] },
      { id: 'restore', name: 'Backup Restore Guide', desc: 'Step-by-step restore instructions', icon: RefreshCw, params: [] },
      { id: 'cloud_sync', name: 'Cloud Sync Status', desc: 'S3/GCS backup sync info', icon: Globe, params: [] },
      { id: 'backup_schedule', name: 'Backup Schedule', desc: 'Backup intervals and retention', icon: Clock, params: [] },
    ]
  },
  {
    id: 'seo', label: '🔍 SEO & UX', color: 'from-pink-500 to-rose-500',
    tools: [
      { id: 'sitemap', name: 'Sitemap Check', desc: 'XML sitemap validation', icon: Globe, params: [{ key: 'url', label: 'URL', placeholder: 'https://example.com' }] },
      { id: 'robots', name: 'Robots.txt Validator', desc: 'Parse and validate robots.txt', icon: CheckCircle, params: [{ key: 'url', label: 'URL', placeholder: 'https://example.com' }] },
      { id: 'broken_links', name: 'Broken Link Checker', desc: 'Crawl page and check all links', icon: XCircle, params: [{ key: 'url', label: 'URL', placeholder: 'https://example.com' }] },
      { id: 'meta_tags', name: 'Meta Tags Report', desc: 'OG tags, title, description, canonical', icon: FileText, params: [{ key: 'url', label: 'URL', placeholder: 'https://example.com' }] },
      { id: 'page_speed', name: 'PageSpeed Insights', desc: 'Google Core Web Vitals scores', icon: Zap, params: [{ key: 'url', label: 'URL', placeholder: 'https://example.com' }] },
    ]
  },
];

function ResultDisplay({ result }) {
  if (!result) return null;
  const isError = result.error || result.status === 'ERROR' || result.status === 'FAIL' || result.status === 'DOWN';
  const isWarning = result.status === 'WARNING';
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 mt-4 max-h-96 overflow-y-auto">
      <div className="flex items-center gap-2 mb-3">
        {isError ? <XCircle className="w-4 h-4 text-red-400" /> : isWarning ? <AlertTriangle className="w-4 h-4 text-yellow-400" /> : <CheckCircle className="w-4 h-4 text-green-400" />}
        <span className={`text-sm font-medium ${isError ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-green-400'}`}>
          {isError ? 'Error' : isWarning ? 'Warning' : 'Result'}
        </span>
      </div>
      <div className="font-mono text-xs text-gray-300 space-y-1.5">
        {Object.entries(result).map(([k, v]) => (
          <div key={k} className="flex flex-col gap-0.5">
            <span className="text-gray-500 uppercase text-[10px] tracking-wide">{k.replace(/_/g, ' ')}</span>
            <span className={`whitespace-pre-wrap break-all pl-2 ${k === 'status' ? (isError ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-green-400') : k === 'output' ? 'text-green-300 font-mono text-[11px] bg-black/40 p-2 rounded' : 'text-white'}`}>{String(v)}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ToolModal({ tool, onClose }) {
  const [params, setParams] = useState({});
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runTool = async () => {
    setRunning(true);
    setResult(null);
    setError(null);
    try {
      const res = await base44.functions.invoke('adminTools', { toolId: tool.id, params });
      if (res.data?.error) setError(res.data.error);
      else setResult(res.data?.result || res.data);
    } catch (e) {
      setError(e.message);
    }
    setRunning(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white font-bold text-lg">{tool.name}</h3>
            <p className="text-gray-400 text-sm mt-1">{tool.desc}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white ml-4">✕</button>
        </div>

        {tool.params?.length > 0 && (
          <div className="space-y-3 mb-4">
            {tool.params.map(p => (
              <div key={p.key}>
                <label className="text-xs text-gray-400 mb-1 block">{p.label}</label>
                <Input type={p.type || 'text'} value={params[p.key] || ''} onChange={e => setParams(prev => ({ ...prev, [p.key]: e.target.value }))}
                  placeholder={p.placeholder} className="bg-black border-white/10 text-white text-sm" />
              </div>
            ))}
          </div>
        )}

        <Button onClick={runTool} disabled={running} className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500">
          {running ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Running...</> : `▶ Run ${tool.name}`}
        </Button>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
        )}
        <ResultDisplay result={result} />
      </motion.div>
    </div>
  );
}

export default function AdminToolSuite() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [search, setSearch] = useState('');

  const filteredCategories = TOOL_CATEGORIES.map(cat => ({
    ...cat,
    tools: cat.tools.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
  })).filter(cat => !search || cat.tools.length > 0);

  const totalTools = TOOL_CATEGORIES.reduce((s, c) => s + c.tools.length, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">🔧 Tool Suite</h1>
        <p className="text-gray-400 text-sm">{totalTools} fully functional admin tools — real network calls, SSH access, and live app data</p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools..."
          className="pl-9 bg-[#111] border-white/10 text-white" />
      </div>

      <div className="space-y-4">
        {filteredCategories.map(cat => (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#111] border border-white/5 rounded-xl overflow-hidden">
            <button onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors">
              <h2 className="text-white font-bold text-sm">{cat.label}</h2>
              <span className="text-gray-500 text-xs">{selectedCategory === cat.id ? '▲' : '▼'} {cat.tools.length} tools</span>
            </button>

            {selectedCategory === cat.id && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-4 pb-4">
                {cat.tools.map(tool => (
                  <button key={tool.id} onClick={() => setActiveTool(tool)}
                    className="text-left p-4 bg-black/40 border border-white/5 rounded-xl hover:border-white/20 hover:bg-white/5 transition-all group">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg border border-white/8 bg-white/5 flex items-center justify-center flex-shrink-0">
                        <tool.icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{tool.name}</div>
                        <div className="text-gray-500 text-xs mt-0.5 leading-relaxed">{tool.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedCategory !== cat.id && (
              <div className="flex flex-wrap gap-2 px-4 pb-3">
                {cat.tools.slice(0, 3).map(tool => (
                  <button key={tool.id} onClick={() => { setSelectedCategory(cat.id); setActiveTool(tool); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-xs">
                    <tool.icon className="w-3 h-3" />{tool.name}
                  </button>
                ))}
                {cat.tools.length > 3 && (
                  <button onClick={() => setSelectedCategory(cat.id)}
                    className="px-3 py-1.5 bg-white/5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors text-xs">
                    +{cat.tools.length - 3} more
                  </button>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeTool && <ToolModal tool={activeTool} onClose={() => setActiveTool(null)} />}
      </AnimatePresence>
    </div>
  );
}