import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Globe, Menu, X, Shield, Moon, Sun, Facebook, Linkedin, Instagram, Mail, Layout as LayoutIcon, MessageCircle, Send, Bell } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, toggleLanguage, darkMode, toggleDarkMode, isAuthenticated, settings, socialLinks, notifications } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Filter unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { nameEn: 'Home', nameAr: 'الرئيسية', path: '/' },
    { nameEn: 'Education', nameAr: 'التعليم', path: '/#education' },
    { nameEn: 'Services', nameAr: 'الخدمات', path: '/#services' },
    { nameEn: 'Projects', nameAr: 'المشاريع', path: '/#projects' },
    { nameEn: 'Certificates', nameAr: 'الشهادات', path: '/#certifications' },
    { nameEn: 'Blog', nameAr: 'المدونة', path: '/blog' },
  ];

  const handleNavClick = (path: string) => {
    setIsMenuOpen(false);
    if (path.startsWith('/#')) {
      const id = path.substring(2);
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getSocialIcon = (link: any) => {
    if (link.customIcon) {
      return <img src={link.customIcon} alt={link.platform} className="w-5 h-5 object-contain" />;
    }

    switch (link.platform) {
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'email': return <Mail className="w-5 h-5" />;
      case 'whatsapp': return <MessageCircle className="w-5 h-5" />;
      case 'website': return <Globe className="w-5 h-5" />;
      case 'telegram': return <Send className="w-5 h-5 -rotate-45 translate-x-1" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  const getSocialColorClass = (platform: string) => {
    switch (platform) {
      case 'linkedin': return 'text-[#0077b5] hover:text-white hover:bg-[#0077b5]';
      case 'facebook': return 'text-[#1877F2] hover:text-white hover:bg-[#1877F2]';
      case 'instagram': return 'text-[#E4405F] hover:text-white hover:bg-[#E4405F]';
      case 'whatsapp': return 'text-[#25D366] hover:text-white hover:bg-[#25D366]';
      case 'telegram': return 'text-[#0088cc] hover:text-white hover:bg-[#0088cc]';
      case 'email': return 'text-gray-400 hover:text-white hover:bg-maroon';
      case 'github': return 'text-white hover:text-black hover:bg-white';
      default: return 'text-gray-400 hover:text-white hover:bg-maroon';
    }
  };

  const getLinkName = (link: any) => {
    return language === 'ar' ? link.nameAr : link.nameEn;
  };

  const getLangCode = () => {
    return language === 'ar' ? 'AR' : 'EN';
  };

  return (
    <div className="min-h-screen flex flex-col text-anthracite font-sans dark:text-gray-100 transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-off-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-lavender/30 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Dynamic */}
            <Link to="/" className="flex items-center gap-2 group">
              {settings.logoImage ? (
                <img src={settings.logoImage} alt="Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <Shield className="w-8 h-8 text-maroon group-hover:scale-110 transition-transform duration-300" />
              )}
              <div>
                <span className="block text-xl font-bold text-maroon leading-none">
                  {language === 'ar' ? settings.siteNameAr : settings.siteNameEn}
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse">
              {navLinks.map((link) => (
                pathIsHash(link.path) ? (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className="text-sm font-medium hover:text-maroon dark:hover:text-maroon transition-colors relative group"
                  >
                    {getLinkName(link)}
                    <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-maroon transition-all duration-300 group-hover:w-full"></span>
                  </button>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium hover:text-maroon transition-colors relative group ${location.pathname === link.path ? 'text-maroon' : ''}`}
                  >
                    {getLinkName(link)}
                    <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-maroon transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )
              ))}

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>

              {/* Language & Dark Mode */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1 text-sm font-medium hover:text-maroon transition-colors px-2 uppercase"
                >
                  <Globe className="w-4 h-4" />
                  <span>{getLangCode()}</span>
                </button>

                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>

              {/* Notification Bell (Only shows if ALREADY logged in) - Admin Button Hidden */}
              <div className="flex items-center gap-2">
                {isAuthenticated && (
                  <button
                    onClick={() => navigate('/admincyber')}
                    className="p-2 relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-maroon"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-4">
              <button onClick={toggleDarkMode}>
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={toggleLanguage} className="font-bold text-maroon uppercase">
                {getLangCode()}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6 dark:text-white" /> : <Menu className="w-6 h-6 dark:text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                {navLinks.map((link) => (
                  pathIsHash(link.path) ? (
                    <button
                      key={link.path}
                      onClick={() => handleNavClick(link.path)}
                      className="block w-full text-start px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-maroon hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {getLinkName(link)}
                    </button>
                  ) : (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-maroon hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {getLinkName(link)}
                    </Link>
                  )
                ))}
                {/* Admin Login Button Removed from Mobile Menu */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-t from-gray-900 to-[#2D0A15] border-t-4 border-maroon py-12 mt-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-maroon to-transparent opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-maroon/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-black/40 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">

          <div className="flex justify-center items-center gap-6 mb-8 flex-wrap">
            {socialLinks.filter(l => l.isActive).map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={`p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_15px_rgba(148,16,55,0.5)] ${getSocialColorClass(link.platform)}`}
              >
                {getSocialIcon(link)}
              </a>
            ))}
          </div>

          <div className="w-full h-px bg-white/10 max-w-xs mx-auto mb-6"></div>

          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {language === 'ar' ? 'جميع الحقوق محفوظة لدى م. ملك البنا' : 'All rights reserved. Eng. Malk All Banna'}
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-green-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-[10px] text-green-400 font-mono tracking-wider">SYSTEM ONLINE</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const pathIsHash = (path: string) => path.startsWith('/#');

export default Layout;