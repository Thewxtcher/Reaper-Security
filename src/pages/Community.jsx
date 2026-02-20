import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function Community() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await base44.auth.isAuthenticated();
      setIsAuthenticated(auth);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Login Required</h1>
          <p className="text-gray-400 mb-8">
            Join the Reaper Security community.
          </p>
          <Button
            onClick={handleLogin}
            className="bg-gradient-to-r from-red-600 to-green-600 hover:from-red-500 hover:to-green-500"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login to Continue
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <h1 className="text-5xl font-bold font-serif text-white mb-6">Community</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Welcome to the Reaper Security community. Connect with fellow security enthusiasts.
          </p>
        </motion.div>
      </div>
    </div>
  );
}