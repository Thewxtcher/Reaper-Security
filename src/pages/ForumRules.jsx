import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Shield, X, CheckCircle2, AlertTriangle, Scale
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const prohibitedContent = [
  'Posting live targets or systems you don\'t own',
  'Sharing zero-day exploits or unpatched vulnerabilities',
  'Selling or trading hacking tools',
  'Doxxing or sharing personal information',
  'Discussing illegal activities or providing instructions for unauthorized access',
  'Harassment, discrimination, or hate speech',
  'Spam or self-promotion without value',
  'Creating multiple accounts to evade bans'
];

const encouragedContent = [
  'Educational discussions about security concepts',
  'Sharing writeups from CTF challenges',
  'Discussing defensive security strategies',
  'Asking questions about ethical career paths',
  'Sharing open-source security tools',
  'Discussing published CVEs and patches',
  'Helping others learn in a constructive way',
  'Reporting security concerns through proper channels'
];

const enforcement = [
  'Content removal',
  'Thread locking',
  'Temporary suspension',
  'Permanent ban',
  'Reporting to appropriate authorities for illegal activities'
];

export default function ForumRules() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={createPageUrl('Forum')} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Forum
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-green-500/20 flex items-center justify-center mx-auto mb-6">
            <Scale className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-4xl font-bold font-serif text-white mb-4">Community Guidelines</h1>
          <p className="text-gray-400 text-lg">
            These rules exist to maintain a safe, ethical, and educational environment for all members.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-[#111] to-[#1a1a1a] border border-green-500/20 mb-8">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-white font-serif text-xl mb-2">Our Mission</h3>
                <p className="text-gray-400">
                  The Mr. J Security community exists for ethical security education, research discussion, 
                  and professional growth. We believe in responsible disclosure, legal compliance, and 
                  helping each other become better security professionals.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Rules */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-[#111] border border-red-500/20 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400 font-serif">
                  <X className="w-5 h-5" />
                  Prohibited Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {prohibitedContent.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-[#111] border border-green-500/20 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400 font-serif">
                  <CheckCircle2 className="w-5 h-5" />
                  Encouraged Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {encouragedContent.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Enforcement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-[#111] border border-yellow-500/20 mb-8">
            <CardHeader>
              <CardTitle className="text-yellow-400 font-serif">Enforcement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Violations of these rules may result in:
              </p>
              <ul className="space-y-2 mb-4">
                {enforcement.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    <span className="text-gray-400 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-500 text-sm">
                Posts may be held for review before publishing. The moderation team reserves the right 
                to remove content that violates the spirit of these guidelines.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Legal Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-[#0a0a0a] border border-white/10">
            <CardContent className="p-6">
              <h3 className="text-white font-semibold mb-3">Legal Disclaimer</h3>
              <p className="text-gray-500 text-sm">
                All community discussions are for educational and defensive cybersecurity purposes only. 
                Members are prohibited from engaging in or encouraging unauthorized access to systems. 
                By participating in this community, you agree to operate within all applicable laws 
                and ethical guidelines.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}