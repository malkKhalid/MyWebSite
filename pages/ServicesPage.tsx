import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Lock, Terminal, Eye, Code, Wifi, X, MessageCircle, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skill } from '../types';

const ServicesPage: React.FC = () => {
  const { language, skills, settings } = useApp();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const t = {
    orderNow: language === 'ar' ? 'اطلب الخدمة الآن' : 'Order Service Now',
    viaWhatsapp: language === 'ar' ? 'عبر واتساب' : 'Via WhatsApp',
    viaEmail: language === 'ar' ? 'عبر البريد' : 'Via Email',
  };

  const getIcon = (name: string) => {
    switch(name) {
      case 'Shield': return <Shield className="w-8 h-8" />;
      case 'Lock': return <Lock className="w-8 h-8" />;
      case 'Terminal': return <Terminal className="w-8 h-8" />;
      case 'Eye': return <Eye className="w-8 h-8" />;
      case 'Code': return <Code className="w-8 h-8" />;
      case 'Wifi': return <Wifi className="w-8 h-8" />;
      default: return <Shield className="w-8 h-8" />;
    }
  };

  const getWhatsAppLink = (skill: Skill) => {
    const text = language === 'ar' 
      ? `مرحباً سارة، أنا مهتم بخدمة: ${skill.titleAr}. هل يمكننا مناقشة التفاصيل؟`
      : `Hello Sarah, I am interested in the service: ${skill.titleEn}. Can we discuss details?`;
    return `https://wa.me/${settings.contactPhone}?text=${encodeURIComponent(text)}`;
  };

  const getEmailLink = (skill: Skill) => {
    const subject = language === 'ar' ? `استفسار خدمة: ${skill.titleAr}` : `Service Inquiry: ${skill.titleEn}`;
    return `mailto:${settings.contactEmail}?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-anthracite dark:text-white mb-4">
          {language === 'ar' ? 'خدماتي ومهاراتي' : 'Services & Skills'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {language === 'ar' 
            ? 'مجموعة شاملة من خدمات الأمن السيبراني لضمان حماية أصولك الرقمية.' 
            : 'Comprehensive cybersecurity services to ensure your digital assets are protected.'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skills.map((skill, idx) => (
          <motion.div 
            key={skill.id} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedSkill(skill)}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-maroon/20 cursor-pointer transition-all duration-300 group"
          >
            <div className="mb-4 text-maroon group-hover:scale-110 transition-transform duration-300 bg-maroon/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              {getIcon(skill.iconName)}
            </div>
            <h3 className="text-xl font-semibold text-anthracite dark:text-white text-center mb-2">
              {language === 'ar' ? skill.titleAr : skill.titleEn}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-4">
               {language === 'ar' ? skill.descAr : skill.descEn}
            </p>
            {skill.price && (
                <div className="text-center">
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                        {skill.price}
                    </span>
                </div>
            )}
          </motion.div>
        ))}
      </div>

       {/* Service Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 bg-gradient-to-r from-maroon to-[#5c0a22] text-white flex justify-between items-start">
                 <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                       {getIcon(selectedSkill.iconName)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{language === 'ar' ? selectedSkill.titleAr : selectedSkill.titleEn}</h3>
                      <p className="text-white/80 text-sm">{language === 'ar' ? selectedSkill.descAr : selectedSkill.descEn}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedSkill(null)} className="text-white/70 hover:text-white">
                   <X className="w-6 h-6" />
                 </button>
              </div>
              
              <div className="p-6 space-y-6">
                 <div>
                    <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        {language === 'ar' ? 'تفاصيل الخدمة' : 'Service Details'}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {language === 'ar' ? (selectedSkill.detailsAr || selectedSkill.descAr) : (selectedSkill.detailsEn || selectedSkill.descEn)}
                    </p>
                 </div>

                 {selectedSkill.price && (
                     <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex justify-between items-center">
                        <span className="font-bold text-gray-700 dark:text-gray-200">{language === 'ar' ? 'السعر المتوقع' : 'Estimated Price'}</span>
                        <span className="text-xl font-bold text-maroon">{selectedSkill.price}</span>
                     </div>
                 )}

                 <div className="flex flex-col gap-3">
                    <p className="text-center text-sm font-bold text-anthracite dark:text-white mb-1">{t.orderNow}</p>
                    <div className="flex gap-3">
                        <a 
                          href={getWhatsAppLink(selectedSkill)} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-colors"
                        >
                            <MessageCircle className="w-5 h-5" />
                            {t.viaWhatsapp}
                        </a>
                         <a 
                          href={getEmailLink(selectedSkill)} 
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-anthracite py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-colors"
                        >
                            <Mail className="w-5 h-5" />
                            {t.viaEmail}
                        </a>
                    </div>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServicesPage;