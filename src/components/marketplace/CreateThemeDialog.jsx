import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Wand2, Eye, Palette, Type, Layers, Sparkles } from 'lucide-react';

const FONTS = ['Inter', 'JetBrains Mono', 'Playfair Display', 'Space Grotesk', 'Syne', 'DM Sans', 'Fira Code'];

const BORDER_RADII = [
  { label: 'Sharp', value: '0px' },
  { label: 'Subtle', value: '0.375rem' },
  { label: 'Rounded', value: '0.75rem' },
  { label: 'Pill', value: '9999px' },
];

const PRESETS = [
  {
    label: 'Reaper Dark',
    primary_color: '#ef4444', secondary_color: '#22c55e', background_color: '#0a0a0a',
    card_color: '#111111', text_color: '#ffffff', accent_color: '#8b5cf6',
    border_color: '#ffffff1a', glow_enabled: true,
  },
  {
    label: 'Cyber Teal',
    primary_color: '#06b6d4', secondary_color: '#a3e635', background_color: '#020917',
    card_color: '#0d1a2b', text_color: '#e2f8ff', accent_color: '#f59e0b',
    border_color: '#06b6d420', glow_enabled: true,
  },
  {
    label: 'Phantom Purple',
    primary_color: '#a855f7', secondary_color: '#ec4899', background_color: '#09050f',
    card_color: '#130d1e', text_color: '#f3e8ff', accent_color: '#f97316',
    border_color: '#a855f720', glow_enabled: true,
  },
  {
    label: 'Ghost White',
    primary_color: '#1e1e1e', secondary_color: '#6366f1', background_color: '#f8f8f8',
    card_color: '#ffffff', text_color: '#111111', accent_color: '#ec4899',
    border_color: '#11111115', glow_enabled: false,
  },
  {
    label: 'Neon Void',
    primary_color: '#39ff14', secondary_color: '#ff00ff', background_color: '#000000',
    card_color: '#0d0d0d', text_color: '#ffffff', accent_color: '#00ffff',
    border_color: '#39ff1430', glow_enabled: true,
  },
  {
    label: 'Rust & Steel',
    primary_color: '#f97316', secondary_color: '#94a3b8', background_color: '#0f0a07',
    card_color: '#1a1208', text_color: '#fef3c7', accent_color: '#ef4444',
    border_color: '#f9731620', glow_enabled: false,
  },
];

function ColorSwatch({ label, colorKey, value, onChange }) {
  return (
    <div>
      <Label className="text-gray-400 text-xs mb-1 block">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={e => onChange(colorKey, e.target.value)}
            className="w-9 h-9 rounded-lg cursor-pointer border border-white/10 bg-transparent p-0.5"
          />
        </div>
        <Input
          value={value}
          onChange={e => onChange(colorKey, e.target.value)}
          className="bg-[#0a0a0a] border-white/10 text-white font-mono text-xs h-9 flex-1"
        />
      </div>
    </div>
  );
}

function ThemePreview({ form }) {
  const glowStyle = form.glow_enabled
    ? { boxShadow: `0 0 30px ${form.primary_color}30` }
    : {};

  return (
    <div
      className="rounded-xl p-5 border transition-all duration-300"
      style={{ backgroundColor: form.background_color, borderColor: form.border_color, ...glowStyle }}
    >
      {/* Nav bar preview */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: form.border_color }}>
        <div className="text-sm font-bold" style={{ color: form.primary_color, fontFamily: form.font_family }}>
          REAPER
        </div>
        <div className="flex gap-2">
          {['Home', 'Services', 'Contact'].map(n => (
            <div key={n} className="text-xs px-2 py-1 rounded" style={{ color: form.text_color + '99', fontFamily: form.font_family }}>{n}</div>
          ))}
        </div>
      </div>

      {/* Card preview */}
      <div
        className="rounded-lg p-4 mb-3 border"
        style={{ backgroundColor: form.card_color, borderColor: form.border_color, borderRadius: form.border_radius }}
      >
        <div className="text-sm font-semibold mb-1" style={{ color: form.text_color, fontFamily: form.font_family }}>Security Service</div>
        <div className="text-xs mb-3" style={{ color: form.text_color + '80', fontFamily: form.font_family }}>
          Web application penetration testing and vulnerability assessment.
        </div>
        <div className="flex gap-2">
          <div
            className="px-3 py-1 text-xs font-medium rounded text-white"
            style={{ backgroundColor: form.primary_color, borderRadius: form.border_radius }}
          >
            Request
          </div>
          <div
            className="px-3 py-1 text-xs font-medium rounded"
            style={{ backgroundColor: form.accent_color + '20', color: form.accent_color, borderRadius: form.border_radius }}
          >
            Learn More
          </div>
        </div>
      </div>

      {/* Badge row */}
      <div className="flex gap-2 flex-wrap">
        <div className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: form.primary_color + '20', color: form.primary_color }}>
          Primary
        </div>
        <div className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: form.secondary_color + '20', color: form.secondary_color }}>
          Secondary
        </div>
        <div className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: form.accent_color + '20', color: form.accent_color }}>
          Accent
        </div>
      </div>
    </div>
  );
}

const DEFAULT_FORM = {
  name: '', description: '', tags: '',
  primary_color: '#ef4444', secondary_color: '#22c55e',
  background_color: '#0a0a0a', card_color: '#111111',
  text_color: '#ffffff', accent_color: '#8b5cf6',
  border_color: '#ffffff1a', font_family: 'Inter',
  border_radius: '0.5rem', glow_enabled: false,
};

export default function CreateThemeDialog({ open, onClose, user, queryClient }) {
  const [form, setForm] = useState(DEFAULT_FORM);

  const setColor = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const applyPreset = (preset) => setForm(f => ({ ...f, ...preset }));

  const createTheme = useMutation({
    mutationFn: (data) => base44.entities.Theme.create({
      ...data,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      owner_email: user.email,
      is_active: false,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allThemes'] });
      queryClient.invalidateQueries({ queryKey: ['themes'] });
      setForm(DEFAULT_FORM);
      onClose();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0d0d0d] border-white/10 text-white max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-serif">
            <Palette className="w-5 h-5 text-purple-400" />
            Advanced Theme Creator
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6 mt-2">
          {/* Left: Controls */}
          <div className="space-y-5">
            {/* Basic Info */}
            <div className="space-y-3">
              <div>
                <Label className="text-gray-400 text-xs">Theme Name *</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="My Awesome Theme" className="bg-[#0a0a0a] border-white/10 text-white mt-1" />
              </div>
              <div>
                <Label className="text-gray-400 text-xs">Description</Label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={2} placeholder="What makes this theme special?"
                  className="w-full mt-1 bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30 resize-none" />
              </div>
              <div>
                <Label className="text-gray-400 text-xs">Tags (comma-separated)</Label>
                <Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                  placeholder="dark, minimal, cyber" className="bg-[#0a0a0a] border-white/10 text-white mt-1" />
              </div>
            </div>

            <Tabs defaultValue="colors">
              <TabsList className="bg-white/5 border border-white/10 w-full">
                <TabsTrigger value="colors" className="flex-1 text-xs data-[state=active]:bg-white/10">
                  <Layers className="w-3 h-3 mr-1" />Colors
                </TabsTrigger>
                <TabsTrigger value="typography" className="flex-1 text-xs data-[state=active]:bg-white/10">
                  <Type className="w-3 h-3 mr-1" />Typography
                </TabsTrigger>
                <TabsTrigger value="presets" className="flex-1 text-xs data-[state=active]:bg-white/10">
                  <Wand2 className="w-3 h-3 mr-1" />Presets
                </TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <ColorSwatch label="Primary" colorKey="primary_color" value={form.primary_color} onChange={setColor} />
                  <ColorSwatch label="Secondary" colorKey="secondary_color" value={form.secondary_color} onChange={setColor} />
                  <ColorSwatch label="Accent" colorKey="accent_color" value={form.accent_color} onChange={setColor} />
                  <ColorSwatch label="Background" colorKey="background_color" value={form.background_color} onChange={setColor} />
                  <ColorSwatch label="Card Surface" colorKey="card_color" value={form.card_color} onChange={setColor} />
                  <ColorSwatch label="Text" colorKey="text_color" value={form.text_color} onChange={setColor} />
                  <ColorSwatch label="Border" colorKey="border_color" value={form.border_color} onChange={setColor} />
                </div>

                {/* Glow toggle */}
                <label className="flex items-center gap-3 mt-2 cursor-pointer p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                  <Sparkles className={`w-4 h-4 ${form.glow_enabled ? 'text-yellow-400' : 'text-gray-500'}`} />
                  <div className="flex-1">
                    <div className="text-sm text-white">Glow Effect</div>
                    <div className="text-xs text-gray-500">Add a subtle primary-color glow to cards</div>
                  </div>
                  <div
                    onClick={() => setForm(f => ({ ...f, glow_enabled: !f.glow_enabled }))}
                    className={`w-10 h-5 rounded-full transition-all relative ${form.glow_enabled ? 'bg-purple-500' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.glow_enabled ? 'left-5' : 'left-0.5'}`} />
                  </div>
                </label>
              </TabsContent>

              <TabsContent value="typography" className="mt-4 space-y-4">
                <div>
                  <Label className="text-gray-400 text-xs mb-2 block">Font Family</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {FONTS.map(font => (
                      <button
                        key={font}
                        onClick={() => setForm(f => ({ ...f, font_family: font }))}
                        className={`px-3 py-2 rounded-lg text-sm border transition-all text-left ${form.font_family === font ? 'border-purple-500/60 bg-purple-500/15 text-white' : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'}`}
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-gray-400 text-xs mb-2 block">Border Radius</Label>
                  <div className="flex gap-2">
                    {BORDER_RADII.map(r => (
                      <button
                        key={r.value}
                        onClick={() => setForm(f => ({ ...f, border_radius: r.value }))}
                        className={`flex-1 py-2 text-xs border transition-all ${form.border_radius === r.value ? 'border-purple-500/60 bg-purple-500/15 text-white' : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'}`}
                        style={{ borderRadius: r.value === '9999px' ? '9999px' : '0.5rem' }}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="presets" className="mt-4">
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => applyPreset(preset)}
                      className="p-3 rounded-xl border border-white/10 hover:border-white/25 bg-white/5 transition-all text-left group"
                    >
                      <div className="flex gap-1 mb-2">
                        {[preset.primary_color, preset.secondary_color, preset.accent_color, preset.background_color].map((c, i) => (
                          <div key={i} className="w-5 h-5 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <div className="text-xs text-white font-medium group-hover:text-purple-300 transition-colors">{preset.label}</div>
                    </button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Live Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Eye className="w-4 h-4" />
              Live Preview
            </div>
            <ThemePreview form={form} />

            {/* Tags preview */}
            {form.tags && (
              <div className="flex flex-wrap gap-1 mt-2">
                {form.tags.split(',').filter(t => t.trim()).map(t => (
                  <Badge key={t} className="bg-white/5 text-gray-400 text-xs border border-white/10">{t.trim()}</Badge>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => createTheme.mutate(form)}
                disabled={!form.name || createTheme.isPending}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 flex-1"
              >
                {createTheme.isPending ? 'Publishing...' : 'Publish Theme'}
              </Button>
              <Button variant="outline" onClick={onClose} className="border-gray-700 text-gray-300">Cancel</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}