import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Shield, CheckCircle2, Loader2, LogIn, Globe, DollarSign,
  Clock, Eye, EyeOff, Award, Briefcase, Save, ExternalLink
} from 'lucide-react';
import { createPageUrl } from '../utils';
import { Link } from 'react-router-dom';

const AVAILABILITY_OPTIONS = [
  { value: 'available',     label: 'Available for projects',   color: 'text-green-400' },
  { value: 'limited',       label: 'Limited availability',     color: 'text-yellow-400' },
  { value: 'consulting',    label: 'Consulting only',          color: 'text-blue-400' },
  { value: 'unavailable',   label: 'Not accepting work',       color: 'text-red-400' },
];

export default function ProviderSetup() {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    page_headline: '',
    hourly_rate: '',
    availability: 'available',
    page_published: false,
  });

  useEffect(() => {
    const init = async () => {
      const auth = await base44.auth.isAuthenticated();
      setIsAuth(auth);
      if (auth) {
        const u = await base44.auth.me();
        setUser(u);
        const apps = await base44.entities.ServiceProviderApplication.filter({ applicant_email: u.email });
        if (apps.length > 0) {
          setApp(apps[0]);
          setForm({
            page_headline: apps[0].page_headline || '',
            hourly_rate: apps[0].hourly_rate || '',
            availability: apps[0].availability || 'available',
            page_published: apps[0].page_published || false,
          });
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleSave = async () => {
    if (!app) return;
    setSaving(true);
    await base44.entities.ServiceProviderApplication.update(app.id, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
    </div>
  );

  if (!isAuth) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-center">
        <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-white mb-4">You need to be logged in to access this page.</p>
        <Button onClick={() => base44.auth.redirectToLogin(window.location.href)} className="bg-red-600 hover:bg-red-500">
          <LogIn className="w-4 h-4 mr-2" /> Sign In
        </Button>
      </div>
    </div>
  );

  if (!app) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-center max-w-md px-6">
        <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h2 className="text-white text-xl font-bold mb-2">No Application Found</h2>
        <p className="text-gray-400 mb-6">You haven't submitted a service provider application yet.</p>
        <Link to={createPageUrl('ServiceProviderApply')}>
          <Button className="bg-red-600 hover:bg-red-500">Apply as Provider</Button>
        </Link>
      </div>
    </div>
  );

  if (app.status !== 'approved') return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-center max-w-md px-6">
        <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-white text-xl font-bold mb-2">Application Pending</h2>
        <p className="text-gray-400 mb-2">Your provider page will be available once your application is approved.</p>
        <p className="text-yellow-400 text-sm capitalize">Current status: {app.status?.replace('_', ' ')}</p>
        <Link to={createPageUrl('ServiceProviderApply')} className="mt-4 inline-block">
          <Button variant="outline" className="border-white/10 text-gray-300 mt-4">View Application</Button>
        </Link>
      </div>
    </div>
  );

  const availConfig = AVAILABILITY_OPTIONS.find(a => a.value === form.availability) || AVAILABILITY_OPTIONS[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-3xl mx-auto">

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Approved Provider</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white font-serif">Your Provider Page</h1>
          <p className="text-gray-400 mt-1">Customize your public profile to attract clients on Reaper Security.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#111] border border-white/10 rounded-xl p-5 space-y-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-red-400" /> Profile Settings
              </h3>

              <div>
                <Label className="text-gray-400 text-xs">Headline / Tagline</Label>
                <Input
                  value={form.page_headline}
                  onChange={e => setForm(f => ({ ...f, page_headline: e.target.value }))}
                  className="bg-[#0a0a0a] border-white/10 text-white mt-1"
                  placeholder="e.g. Full-Stack Pentester | OSCP Certified | 8+ Years"
                  maxLength={120}
                />
                <p className="text-gray-600 text-xs mt-1">{form.page_headline.length}/120 characters</p>
              </div>

              <div>
                <Label className="text-gray-400 text-xs">Hourly Rate</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    value={form.hourly_rate}
                    onChange={e => setForm(f => ({ ...f, hourly_rate: e.target.value }))}
                    className="bg-[#0a0a0a] border-white/10 text-white pl-9"
                    placeholder="e.g. $150/hr or Contact for pricing"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-400 text-xs mb-2 block">Availability Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABILITY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setForm(f => ({ ...f, availability: opt.value }))}
                      className={`p-3 rounded-lg border text-sm text-left transition-all ${
                        form.availability === opt.value
                          ? 'border-white/30 bg-white/5'
                          : 'border-white/5 bg-transparent hover:border-white/15'
                      }`}
                    >
                      <span className={`font-medium ${opt.color}`}>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setForm(f => ({ ...f, page_published: !f.page_published }))}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-all ${
                      form.page_published
                        ? 'bg-green-500/15 border-green-500/30 text-green-400'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    {form.page_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    {form.page_published ? 'Published' : 'Unpublished'}
                  </button>
                  <span className="text-gray-600 text-xs">
                    {form.page_published ? 'Visible to clients' : 'Hidden from clients'}
                  </span>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-red-600 hover:bg-red-500">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  {saved ? 'Saved ✓' : 'Save'}
                </Button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <div className="bg-[#111] border border-white/10 rounded-xl p-4 sticky top-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Profile Preview</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-lg font-bold text-white">
                    {user?.full_name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{user?.full_name}</div>
                    <div className="text-gray-400 text-xs">{form.page_headline || 'Your headline...'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${availConfig.color}`}>● {availConfig.label}</span>
                </div>

                {form.hourly_rate && (
                  <div className="text-green-400 text-sm font-medium">{form.hourly_rate}</div>
                )}

                {app.specializations?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {app.specializations.slice(0, 4).map(s => (
                      <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/15 text-red-300">{s}</span>
                    ))}
                    {app.specializations.length > 4 && (
                      <span className="text-[10px] text-gray-500">+{app.specializations.length - 4} more</span>
                    )}
                  </div>
                )}

                {app.certification_names?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {app.certification_names.map(c => (
                      <span key={c} className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/15 text-yellow-400">
                        <Award className="w-2.5 h-2.5" />{c}
                      </span>
                    ))}
                  </div>
                )}

                <div className={`text-xs text-center py-1.5 rounded-lg border ${
                  form.page_published
                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                    : 'bg-white/5 border-white/10 text-gray-500'
                }`}>
                  {form.page_published ? '✓ Live on Services page' : 'Not published yet'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}