import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  Globe, Server, FileSearch, Users, MessageSquare, BookOpen,
  CheckCircle2, ArrowRight, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const services = [
  {
    icon: Globe,
    title: 'Web Application Security Testing',
    description: 'Comprehensive testing of web applications to identify vulnerabilities before attackers do.',
    features: [
      'OWASP Top 10 testing methodology',
      'Authentication testing',
      'Session management analysis',
      'Input validation testing',
      'Business logic flaw identification',
      'API security testing'
    ],
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  {
    icon: Server,
    title: 'Network Security Testing',
    description: 'Thorough examination of network infrastructure to discover potential entry points.',
    features: [
      'External exposure review',
      'Internal segmentation testing',
      'Firewall rule analysis',
      'Misconfiguration discovery',
      'Service enumeration',
      'Vulnerability scanning'
    ],
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20'
  },
  {
    icon: FileSearch,
    title: 'Security Audit',
    description: 'Detailed security assessment with actionable remediation guidance.',
    features: [
      'Configuration review',
      'Risk scoring methodology',
      'Remediation roadmap',
      'Compliance checking',
      'Policy review',
      'Documentation audit'
    ],
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20'
  },
  {
    icon: Users,
    title: 'Social Engineering Simulation',
    description: 'Controlled social engineering assessments to test human security awareness.',
    features: [
      'Phishing simulation campaigns',
      'Physical security assessment',
      'Pretexting scenarios',
      'Security awareness evaluation',
      'Detailed reporting',
      'Training recommendations'
    ],
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    badge: 'Strict Authorization'
  },
  {
    icon: MessageSquare,
    title: 'Security Consulting',
    description: 'Expert guidance on security strategy and implementation.',
    features: [
      'Security architecture review',
      'Incident response planning',
      'Security program development',
      'Vendor security assessment',
      'Risk management guidance',
      'Best practices implementation'
    ],
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  },
  {
    icon: BookOpen,
    title: 'Security Education',
    description: 'Training and education programs for teams and individuals.',
    features: [
      'Security awareness training',
      'Developer security training',
      'Hands-on workshops',
      'CTF challenges',
      'Custom training programs',
      'One-on-one mentoring'
    ],
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20'
  }
];

const processSteps = [
  { step: '01', title: 'Scoping', description: 'Define engagement scope and sign authorization' },
  { step: '02', title: 'Testing', description: 'Execute security testing within defined boundaries' },
  { step: '03', title: 'Analysis', description: 'Analyze findings and assess risk levels' },
  { step: '04', title: 'Reporting', description: 'Deliver detailed report with remediation guidance' }
];

export default function Services() {
  return (
    <div className="min-h-screen py-20">
      {/* Header */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 mb-6">
              Professional Services
            </Badge>
            <h1 className="text-5xl font-bold font-serif text-white mb-6">Security Services</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive security testing and consulting services delivered with professionalism 
              and strict ethical standards.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-[#111] border ${service.borderColor} h-full hover:border-opacity-60 transition-all duration-300`}>
                  <CardHeader>
                    {service.badge && (
                      <Badge className="w-fit mb-4 bg-red-500/10 text-red-400 border-red-500/20">
                        <Lock className="w-3 h-3 mr-1" />
                        {service.badge}
                      </Badge>
                    )}
                    <div className={`w-12 h-12 rounded-xl ${service.bgColor} flex items-center justify-center mb-4`}>
                      <service.icon className={`w-6 h-6 ${service.color}`} />
                    </div>
                    <CardTitle className="text-white font-serif text-xl">{service.title}</CardTitle>
                    <p className="text-gray-400 text-sm mt-2">{service.description}</p>
                  </CardHeader>
                  <CardContent>
                    {service.badge && (
                      <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 mb-4">
                        <p className="text-red-400 text-xs">
                          Only conducted under signed contract with executive authorization.
                        </p>
                      </div>
                    )}
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <CheckCircle2 className={`w-4 h-4 ${service.color}`} />
                          <span className="text-gray-400 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-serif text-white mb-4">Our Process</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Every engagement follows a structured methodology to ensure thorough testing and comprehensive reporting.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-red-500/30 font-serif mb-4">{step.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold font-serif text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-400 mb-8">
              Contact us to discuss your security needs and receive a customized assessment proposal.
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