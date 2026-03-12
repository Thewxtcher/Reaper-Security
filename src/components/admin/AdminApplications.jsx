import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2, Clock, FileText, Calendar, X, Eye, Award, ExternalLink,
  ChevronDown, User, Mail, Phone, Linkedin, Globe, Loader2
} from 'lucide-react';

const STATUS_CONFIG = {
  pending:             { color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', label: 'Pending Review' },
  reviewing:           { color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',       label: 'Reviewing' },
  interview_scheduled: { color: 'bg-purple-500/15 text-purple-400 border-purple-500/30', label: 'Interview Scheduled' },
  approved:            { color: 'bg-green-500/15 text-green-400 border-green-500/30',    label: 'Approved' },
  rejected:            { color: 'bg-red-500/15 text-red-400 border-red-500/30',          label: 'Rejected' },
};

function ApplicationRow({ app, onSelect, selected }) {
  const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
  return (
    <div
      onClick={() => onSelect(app)}
      className={`p-4 rounded-xl border cursor-pointer transition-all hover:border-white/20 ${
        selected ? 'bg-white/5 border-white/20' : 'bg-[#111] border-white/5'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {app.applicant_name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <div className="text-white font-medium text-sm truncate">{app.applicant_name}</div>
            <div className="text-gray-500 text-xs truncate">{app.applicant_email}</div>
            <div className="text-gray-600 text-xs mt-0.5">{app.years_experience}y exp · {app.specializations?.length || 0} specs</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className={`text-[11px] px-2 py-0.5 rounded-full border ${cfg.color}`}>{cfg.label}</span>
          <span className="text-gray-600 text-[10px]">{new Date(app.created_date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

function ApplicationDetail({ app, onClose, onUpdate }) {
  const [status, setStatus] = useState(app.status);
  const [adminNotes, setAdminNotes] = useState(app.admin_notes || '');
  const [interviewDate, setInterviewDate] = useState(app.interview_date || '');
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();

  const handleSave = async () => {
    setSaving(true);
    const updateData = { status, admin_notes: adminNotes };
    if (status === 'interview_scheduled' && interviewDate) updateData.interview_date = interviewDate;
    await base44.entities.ServiceProviderApplication.update(app.id, updateData);

    // Notify applicant if status changed
    if (status !== app.status) {
      const messages = {
        approved: 'Your service provider application has been approved! You can now set up your provider page.',
        rejected: 'Your service provider application has been reviewed. Unfortunately, it was not approved at this time.',
        interview_scheduled: interviewDate
          ? `Your interview has been scheduled for ${new Date(interviewDate).toLocaleString()}. Check your email for details.`
          : 'Your interview has been scheduled. Check your email for details.',
        reviewing: 'Your service provider application is currently being reviewed by our team.',
      };
      if (messages[status]) {
        await base44.entities.Notification.create({
          user_email: app.applicant_email,
          type: 'system',
          title: 'Application Update',
          body: messages[status],
          link: '/ServiceProviderApply',
        });
      }
    }

    qc.invalidateQueries(['applications']);
    setSaving(false);
    onUpdate();
  };

  return (
    <div className="bg-[#111] border border-white/10 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold">{app.applicant_name}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Contact Info */}
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center gap-2 text-gray-400"><Mail className="w-3.5 h-3.5" />{app.applicant_email}</div>
        {app.phone && <div className="flex items-center gap-2 text-gray-400"><Phone className="w-3.5 h-3.5" />{app.phone}</div>}
        {app.linkedin_url && <a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:underline"><Linkedin className="w-3.5 h-3.5" />LinkedIn</a>}
        {app.portfolio_url && <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:underline"><Globe className="w-3.5 h-3.5" />Portfolio</a>}
      </div>

      {/* Bio */}
      {app.bio && (
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Bio</p>
          <p className="text-gray-300 text-sm leading-relaxed">{app.bio}</p>
        </div>
      )}

      {/* Specializations */}
      {app.specializations?.length > 0 && (
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Specializations ({app.years_experience}y exp)</p>
          <div className="flex flex-wrap gap-1.5">
            {app.specializations.map(s => (
              <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {app.certification_names?.length > 0 && (
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Certifications</p>
          <div className="space-y-1">
            {app.certification_names.map((name, i) => (
              <div key={i} className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-yellow-400" />
                <a href={app.certifications?.[i]} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline flex items-center gap-1">
                  {name} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resume */}
      {app.resume_url && (
        <a href={app.resume_url} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-blue-400 hover:underline">
          <FileText className="w-4 h-4" /> View Resume <ExternalLink className="w-3 h-3" />
        </a>
      )}

      {/* Interview dates */}
      {app.preferred_interview_dates?.filter(Boolean).length > 0 && (
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Preferred Interview Times</p>
          {app.preferred_interview_dates.filter(Boolean).map((d, i) => (
            <div key={i} className="text-gray-300 text-sm flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              {new Date(d).toLocaleString()}
            </div>
          ))}
        </div>
      )}

      {/* Admin controls */}
      <div className="border-t border-white/10 pt-4 space-y-3">
        <div>
          <label className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Update Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 text-white text-sm rounded px-3 py-2 outline-none focus:border-white/30"
          >
            {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {status === 'interview_scheduled' && (
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Interview Date & Time</label>
            <input
              type="datetime-local"
              value={interviewDate}
              onChange={e => setInterviewDate(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 text-white text-sm rounded px-3 py-2 outline-none focus:border-white/30"
            />
          </div>
        )}

        <div>
          <label className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Admin Notes (visible to applicant)</label>
          <textarea
            value={adminNotes}
            onChange={e => setAdminNotes(e.target.value)}
            rows={3}
            className="w-full bg-[#1a1a1a] border border-white/10 text-white text-sm rounded px-3 py-2 outline-none focus:border-white/30 resize-none"
            placeholder="Optional notes for the applicant..."
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full bg-red-600 hover:bg-red-500 text-white">
          {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}

export default function AdminApplications() {
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const qc = useQueryClient();

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: () => base44.entities.ServiceProviderApplication.list('-created_date', 100),
  });

  const filtered = statusFilter === 'all' ? apps : apps.filter(a => a.status === statusFilter);
  const counts = apps.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Provider Applications</h2>
          <p className="text-gray-500 text-sm mt-1">{apps.length} total applications</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'reviewing', 'interview_scheduled', 'approved', 'rejected'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                statusFilter === s
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {s.replace('_', ' ')} {s !== 'all' && counts[s] ? `(${counts[s]})` : ''}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-red-500 animate-spin" /></div>
      ) : (
        <div className={`grid gap-4 ${selected ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No applications found.</div>
            ) : (
              filtered.map(app => (
                <ApplicationRow
                  key={app.id}
                  app={app}
                  selected={selected?.id === app.id}
                  onSelect={(a) => setSelected(selected?.id === a.id ? null : a)}
                />
              ))
            )}
          </div>
          {selected && (
            <ApplicationDetail
              app={selected}
              onClose={() => setSelected(null)}
              onUpdate={() => {
                qc.invalidateQueries(['applications']);
                setSelected(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}