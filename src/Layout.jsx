import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  Home, Shield, BookOpen, Users, MessageSquare, Code, Mail, 
  Store, LogIn, Menu, X, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { name: 'Home', icon: Home, page: 'Home' },
  { name: 'Services', icon: Shield, page: 'Services' },
  { name: 'Learning', icon: BookOpen, page: 'Learning' },
  { name: 'Community', icon: Users, page: 'Community' },
  { name: 'Forum', icon: MessageSquare, page: 'Forum' },
  { name: 'Code Hub', icon: Code, page: 'CodeHub' },
  { name: 'Contact', icon: Mail, page: 'Contact' },
  { name: 'Marketplace', icon: Store, page: 'Marketplace', hasDropdown: true },
];

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch active theme
  const { data: themes } = useQuery({
    queryKey: ['activeTheme'],
    queryFn: async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const currentUser = await base44.auth.me();
          const userThemes = await base44.entities.Theme.filter({ 
            owner_email: currentUser.email, 
            is_active: true 
          });
          return userThemes;
        }
        return [];
      } catch {
        return [];
      }
    },
    initialData: []
  });

  const activeTheme = themes?.[0];

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await base44.auth.isAuthenticated();
      setIsAuthenticated(auth);
      if (auth) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  const themeStyles = activeTheme ? {
    '--primary': activeTheme.primary_color,
    '--secondary': activeTheme.secondary_color,
    '--background': activeTheme.background_color,
    '--card': activeTheme.card_color,
    '--text': activeTheme.text_color,
  } : {};

  return (
    <div 
      className="min-h-screen bg-[#0a0a0a] text-white"
      style={themeStyles}
    >
      <style>{`
        :root {
          --primary: ${activeTheme?.primary_color || '#ef4444'};
          --secondary: ${activeTheme?.secondary_color || '#22c55e'};
          --background: ${activeTheme?.background_color || '#0a0a0a'};
          --card: ${activeTheme?.card_color || '#111111'};
          --text: ${activeTheme?.text_color || '#ffffff'};
        }
        body {
          background-color: var(--background) !important;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6995223a811449e76d0ebadb/741e36bb4_ChatGPTImageFeb18202606_16_37PM.png"
                alt="Reaper Security"
                className="w-8 h-8 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-red-500 font-bold tracking-wide text-sm">REAPER</span>
                <span className="text-red-500 font-bold tracking-widest text-xs -mt-1">SECURITY</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = currentPageName === item.page;
                
                if (item.hasDropdown) {
                  return (
                    <DropdownMenu key={item.name}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                            ${isActive 
                              ? 'bg-white/10 text-white' 
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.name}
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#1a1a1a] border-white/10">
                        <DropdownMenuItem asChild>
                          <Link to={createPageUrl('Marketplace')} className="text-gray-300 hover:text-white">
                            Browse Marketplace
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={createPageUrl('Themes')} className="text-gray-300 hover:text-white">
                            Themes
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.page)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                      ${isActive 
                        ? 'bg-white/10 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Auth Button */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-gray-300 hover:text-white">
                      {user?.full_name || user?.email}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#1a1a1a] border-white/10">
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('Profile')} className="text-gray-300 hover:text-white">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('Themes')} className="text-gray-300 hover:text-white">
                        My Themes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                className="lg:hidden text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0a0a0a] border-t border-white/5">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.page)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${currentPageName === item.page 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}