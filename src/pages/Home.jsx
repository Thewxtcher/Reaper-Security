import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  Shield, Globe, FileSearch, Users, CheckCircle2, 
  ArrowRight, AlertTriangle, Lock, Server, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const services = [
  {
    icon: Globe,
    title: 'Web Application Security',
    description: 'OWASP Top 10 testing, authentication & session analysis',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  {
    icon: Server,
    title: 'Network Security',
    description: 'External exposure review, firewall analysis, misconfiguration discovery',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20'
  },
  {
    icon: FileSearch,
    title: 'Security Audits',
    description: 'Configuration review, risk scoring, remediation roadmaps',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20'
  },
  {
    icon: Users,
    title: 'Social Engineering',
    description: 'Contract-based simulation under strict authorization',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20'
  }
];

const features = [
  'Signed authorization required for all engagements',
  'Clearly defined scope agreements',
  'Professional reporting with remediation guidance',
  'Confidential and secure handling of findings'
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center py-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-green-950/10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                <Shield className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm font-medium">Authorized Security Testing</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-white font-serif tracking-tight">Offensive &</span><br />
                <span className="text-white font-serif tracking-tight">Defensive</span><br />
                <span className="text-white font-serif tracking-tight">Security</span><br />
                <span className="text-white">—</span>{' '}
                <span className="text-green-500 font-serif italic">Authorized</span><br />
                <span className="text-red-500 font-serif italic">Only.</span>
              </h1>
              
              <p className="text-gray-400 text-lg mb-8 max-w-lg">
                Independent Web & Network Security Testing for businesses that want real answers. 
                Professional penetration testing under strict ethical guidelines.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Link to={createPageUrl('Contact')}>
                  <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-6 text-lg">
                    Request Assessment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to={createPageUrl('Research')}>
                  <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-white/5 px-6 py-6 text-lg">
                    View Research
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Signed authorization required for all engagements</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Clearly defined scope agreements</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent rounded-2xl blur-3xl" />
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6995223a811449e76d0ebadb/741e36bb4_ChatGPTImageFeb18202606_16_37PM.png"
                  alt="Reaper Security"
                  className="w-80 h-80 object-contain relative z-10 rounded-2xl border border-white/10"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Warning Banner */}
      <div className="bg-gradient-to-r from-yellow-900/20 via-yellow-800/10 to-yellow-900/20 border-y border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-3 text-yellow-500">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">No unsolicited testing. All engagements require signed agreement.</span>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-serif text-white mb-4">Security Services</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive security testing methodologies tailored to your organization's needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-[#111] border ${service.borderColor} hover:border-opacity-50 transition-all duration-300 h-full`}>
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl ${service.bgColor} flex items-center justify-center mb-4`}>
                      <service.icon className={`w-6 h-6 ${service.color}`} />
                    </div>
                    <CardTitle className="text-white font-serif">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to={createPageUrl('Services')}>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-white/5">
                View All Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gradient-to-b from-transparent via-red-950/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold font-serif text-white mb-6">
                Why Choose Reaper Security
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Professional security testing with a commitment to ethical practices and thorough documentation. 
                Every engagement is conducted with precision and full transparency.
              </p>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-[#111] border border-white/10">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-6 h-6 text-green-500" />
                    <CardTitle className="text-white font-serif">Ethical Standards</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-gray-400 italic border-l-2 border-green-500 pl-4">
                    "Testing performed only under signed authorization and defined scope."
                  </blockquote>
                  <p className="text-gray-500 text-sm mt-4">
                    All services clearly state requirements for proper authorization before any security 
                    testing begins. We operate within legal and ethical boundaries.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-serif text-white mb-6">
              Ready to Secure Your Assets?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Request an assessment today and get a professional evaluation of your security posture.
            </p>
            <Link to={createPageUrl('Contact')}>
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-8 py-6 text-lg">
                Request Assessment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}