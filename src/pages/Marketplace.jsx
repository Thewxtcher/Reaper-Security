import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Store, Palette, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Marketplace() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-6">
            <Store className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold font-serif text-white mb-4">Marketplace</h1>
          <p className="text-gray-400 text-lg">
            Customize your experience with themes and more.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to={createPageUrl('Themes')}>
              <Card className="bg-[#111] border border-purple-500/20 hover:border-purple-500/40 transition-all h-full group">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Palette className="w-7 h-7 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Themes</h3>
                  <p className="text-gray-400 mb-6">
                    Create and customize your personal color themes. Personalize the look and feel of your experience.
                  </p>
                  <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                    <span className="font-medium">Browse Themes</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-[#111] border border-white/10 h-full opacity-60">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-gray-500/10 flex items-center justify-center mb-6">
                  <Store className="w-7 h-7 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">More Coming Soon</h3>
                <p className="text-gray-500 mb-6">
                  Additional marketplace features are being developed. Stay tuned for plugins, templates, and more.
                </p>
                <div className="text-gray-500">
                  <span className="font-medium">Coming Soon</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}