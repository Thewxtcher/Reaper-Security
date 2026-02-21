import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, BarChart2, Shield, Server, FileText, Database, Users, Settings,
  RefreshCw, Search, Globe, Wifi, Cpu, HardDrive, Clock, TrendingUp,
  AlertTriangle, Lock, Archive, Bug, CheckCircle, XCircle, Eye,
  Activity, Terminal, Package, Monitor, Map, Key
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const TOOL_CATEGORIES = [
  {
    id: 'performance',
    label: '🚀 Performance & Speed',
    color: 'from-blue-500 to-cyan-500',
    tools: [
      { id: 'page_load', name: 'Page Load Time Checker', desc: 'Measure and benchmark page load performance', icon: Zap },
      { id: 'waterfall', name: 'Resource Load Waterfall', desc: 'Visualize resource loading sequence', icon: Activity },
      { id: 'cdn', name: 'CDN Status Monitor', desc: 'Check CDN nodes and cache status', icon: Globe },
      { id: 'render', name: 'Browser Rendering Stats', desc: 'FCP, LCP, CLS and other vitals', icon: Monitor },
      { id: 'bundle', name: 'JS/CSS Bundle Analyzer', desc: 'Analyze bundle sizes and unused code', icon: Package },
    ]
  },
  {
    id: 'traffic',
    label: '📊 Traffic & Analytics',
    color: 'from-purple-500 to-pink-500',
    tools: [
      { id: 'realtime_visitors', name: 'Real-Time Visitor Stats', desc: 'Live visitor count and session data', icon: Eye },
      { id: 'traffic_source', name: 'Traffic Source Breakdown', desc: 'Organic, direct, referral analysis', icon: BarChart2 },
      { id: 'heatmap', name: 'Visitor Heatmap', desc: 'Click and scroll heatmap visualization', icon: Map },
      { id: 'popular_pages', name: 'Popular Pages Report', desc: 'Top visited pages and bounce rates', icon: TrendingUp },
      { id: 'device_stats', name: 'Visitor Device/Browser Stats', desc: 'Device type and browser distribution', icon: Monitor },
    ]
  },
  {
    id: 'security',
    label: '🛡 Security Monitoring',
    color: 'from-red-500 to-orange-500',
    tools: [
      { id: 'intrusion', name: 'Intrusion Detection Alerts', desc: 'Monitor for suspicious access patterns', icon: AlertTriangle },
      { id: 'waf', name: 'WAF Stats', desc: 'Web Application Firewall rule hits and blocks', icon: Shield },
      { id: 'brute_force', name: 'Brute Force Login Guard', desc: 'Failed login attempts and IP blocks', icon: Lock },
      { id: 'ssl', name: 'SSL Certificate Monitor', desc: 'Certificate validity and expiry alerts', icon: CheckCircle },
      { id: 'malware', name: 'Malware Scan Results', desc: 'Latest security scan reports', icon: Bug },
    ]
  },
  {
    id: 'server',
    label: '💻 Server & Uptime',
    color: 'from-green-500 to-emerald-500',
    tools: [
      { id: 'uptime', name: 'Uptime Monitor', desc: 'HTTP/HTTPS endpoint availability tracking', icon: CheckCircle },
      { id: 'ping', name: 'Ping/DNS Status', desc: 'DNS resolution and ping times', icon: Wifi },
      { id: 'cpu', name: 'Server CPU/Memory Stats', desc: 'Real-time resource utilization', icon: Cpu },
      { id: 'disk', name: 'Disk Space Usage', desc: 'Storage allocation and free space', icon: HardDrive },
      { id: 'process', name: 'Process/Service Monitor', desc: 'Running processes and service health', icon: Server },
    ]
  },
  {
    id: 'logs',
    label: '📁 Logs & Debugging',
    color: 'from-yellow-500 to-amber-500',
    tools: [
      { id: 'access_logs', name: 'Access Logs Viewer', desc: 'HTTP request logs with filtering', icon: FileText },
      { id: 'error_logs', name: 'Error Logs Viewer', desc: 'Application and server error stream', icon: Bug },
      { id: 'debug', name: 'Debug Mode Controller', desc: 'Toggle verbose logging modes', icon: Terminal },
      { id: 'log_export', name: 'Log Export / Download', desc: 'Export logs in CSV, JSON formats', icon: Archive },
      { id: 'error_rate', name: 'Alert on High Error Rates', desc: 'Threshold-based error rate alerts', icon: AlertTriangle },
    ]
  },
  {
    id: 'database',
    label: '📦 Database & Storage',
    color: 'from-cyan-500 to-blue-500',
    tools: [
      { id: 'db_status', name: 'Database Connection Status', desc: 'Connection pool health and latency', icon: Database },
      { id: 'query_perf', name: 'Query Performance Stats', desc: 'Slowest queries and execution plans', icon: BarChart2 },
      { id: 'slow_query', name: 'Slow Query Log Analyzer', desc: 'Identify and optimize bottlenecks', icon: Clock },
      { id: 'db_backup', name: 'DB Backup Scheduler', desc: 'Manage automated database backups', icon: Archive },
      { id: 'storage', name: 'Storage Usage Breakdown', desc: 'Entity storage and file usage stats', icon: HardDrive },
    ]
  },
  {
    id: 'useraccess',
    label: '👤 User & Access Control',
    color: 'from-violet-500 to-purple-500',
    tools: [
      { id: 'activity_logs', name: 'User Activity Logs', desc: 'Track user actions across the platform', icon: Activity },
      { id: 'roles', name: 'Role/Permission Editor', desc: 'Manage user roles and permissions', icon: Key },
      { id: 'mfa', name: 'Multi-Factor Auth Config', desc: 'MFA settings and enforcement policy', icon: Lock },
      { id: 'sessions', name: 'Session Manager', desc: 'View and terminate active sessions', icon: Users },
      { id: 'login_history', name: 'Login History Tracker', desc: 'IP-based login history and anomalies', icon: Clock },
    ]
  },
  {
    id: 'maintenance',
    label: '⚙️ Site Maintenance',
    color: 'from-gray-500 to-zinc-500',
    tools: [
      { id: 'cron', name: 'Scheduled Tasks Monitor', desc: 'Cron job status and last run times', icon: Clock },
      { id: 'cache', name: 'Cache Clear / Purge', desc: 'Purge page cache and CDN assets', icon: RefreshCw },
      { id: 'feature_flags', name: 'Feature Flags Dashboard', desc: 'Toggle features without deployment', icon: Settings },
      { id: 'rollback', name: 'Version Rollback Tools', desc: 'Rollback to previous stable version', icon: RefreshCw },
      { id: 'maintenance_mode', name: 'Maintenance Mode Switch', desc: 'Enable/disable maintenance page', icon: Settings },
    ]
  },
  {
    id: 'backups',
    label: '🔁 Backups & Recovery',
    color: 'from-teal-500 to-green-500',
    tools: [
      { id: 'full_backup', name: 'Full Site Backup', desc: 'Trigger and manage full backups', icon: Archive },
      { id: 'incremental', name: 'Incremental Backup Status', desc: 'Delta backup progress and coverage', icon: BarChart2 },
      { id: 'restore', name: 'Backup Restore Wizard', desc: 'Step-by-step restoration guide', icon: RefreshCw },
      { id: 'cloud_sync', name: 'Cloud Backup Sync', desc: 'S3/GCS backup synchronization status', icon: Globe },
      { id: 'backup_schedule', name: 'Backup Scheduling', desc: 'Configure backup intervals and retention', icon: Clock },
    ]
  },
  {
    id: 'seo',
    label: '🔍 SEO & UX',
    color: 'from-pink-500 to-rose-500',
    tools: [
      { id: 'sitemap', name: 'Sitemap Status', desc: 'XML sitemap generation and submission', icon: Globe },
      { id: 'robots', name: 'Robots.txt Validator', desc: 'Validate and test robots.txt rules', icon: CheckCircle },
      { id: 'broken_links', name: 'Broken Link Checker', desc: 'Crawl and detect 404 links', icon: XCircle },
      { id: 'meta_tags', name: 'Meta Tags Report', desc: 'OG tags, title, description analysis', icon: FileText },
      { id: 'page_speed', name: 'Page Speed Insights', desc: 'Google PageSpeed scores integration', icon: Zap },
    ]
  },
];

function ToolModal({ tool, onClose }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const runTool = () => {
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setRunning(false);
      const fakeResults = {
        page_load: { status: 'OK', value: '1.24s', score: 87, details: 'TTFB: 210ms, FCP: 890ms, LCP: 1240ms' },
        ssl: { status: 'OK', value: 'Valid', expiry: '2026-09-15', issuer: "Let's Encrypt" },
        uptime: { status: 'OK', value: '99.97%', downtime: '13min/month', lastCheck: new Date().toLocaleString() },
        cpu: { status: 'OK', cpu: '23%', memory: '41%', load: '0.8', uptime: '14d 6h' },
        disk: { status: 'OK', used: '18.4GB', total: '50GB', percent: 37 },
        broken_links: { status: 'OK', scanned: 142, broken: 0, warnings: 3 },
        default: { status: 'OK', result: 'Tool executed successfully', timestamp: new Date().toLocaleString() }
      };
      setResult(fakeResults[tool.id] || fakeResults.default);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white font-bold text-lg">{tool.name}</h3>
            <p className="text-gray-400 text-sm mt-1">{tool.desc}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white ml-4 mt-1">✕</button>
        </div>

        <Button
          onClick={runTool}
          disabled={running}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 mb-4"
        >
          {running ? (
            <><span className="animate-spin mr-2">⚙</span> Running...</>
          ) : (
            `▶ Run ${tool.name}`
          )}
        </Button>

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Result</span>
            </div>
            <div className="font-mono text-xs text-gray-300 space-y-1">
              {Object.entries(result).map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-gray-500 min-w-[80px]">{k}:</span>
                  <span className={k === 'status' ? (v === 'OK' ? 'text-green-400' : 'text-red-400') : 'text-white'}>{String(v)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <p className="text-gray-600 text-xs mt-3 text-center">
          ⚠️ Tool Suite is for monitoring only. Actions are simulated in demo mode.
        </p>
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
    tools: cat.tools.filter(t =>
      !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => !search || cat.tools.length > 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">🔧 Tool Suite</h1>
        <p className="text-gray-400 text-sm">50 real-world admin monitoring and management tools</p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools..."
          className="pl-9 bg-[#111] border-white/10 text-white" />
      </div>

      <div className="space-y-6">
        {filteredCategories.map(cat => (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className="w-full flex items-center justify-between mb-3 group"
            >
              <h2 className="text-white font-bold text-sm">{cat.label}</h2>
              <span className="text-gray-500 text-xs">{selectedCategory === cat.id ? '▲' : '▼'} {cat.tools.length} tools</span>
            </button>

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ${selectedCategory === cat.id ? '' : 'hidden'}`}>
              {cat.tools.map(tool => (
                <button key={tool.id} onClick={() => setActiveTool(tool)}
                  className="text-left p-4 bg-[#111] border border-white/5 rounded-xl hover:border-white/20 hover:bg-white/5 transition-all group">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${cat.color} bg-opacity-10 flex items-center justify-center flex-shrink-0`}
                      style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))`, border: '1px solid rgba(255,255,255,0.08)' }}>
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

            {/* Collapsed preview */}
            {selectedCategory !== cat.id && (
              <div className="flex flex-wrap gap-2">
                {cat.tools.slice(0, 3).map(tool => (
                  <button key={tool.id} onClick={() => { setSelectedCategory(cat.id); setActiveTool(tool); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-xs">
                    <tool.icon className="w-3 h-3" />
                    {tool.name}
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