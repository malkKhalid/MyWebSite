
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Lock, Terminal, Eye, Code, Wifi,
  ExternalLink, Github, Linkedin, Mail, MessageCircle,
  ChevronRight, Star, Download, Award, X, Upload, Check, Quote,
  ArrowRight, Languages, CheckCircle2, User, GraduationCap, Briefcase, Globe, Calendar, Layout as LayoutIcon, FileText,
  MessageSquare, FolderOpen, Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skill, Certification, Testimonial } from '../types';
import ImageCropper from '../components/ImageCropper';
import { EducationItem } from '../types';

const EducationCard: React.FC<{ edu: EducationItem; idx: number; language: 'en' | 'ar'; t: any; onClick: (edu: EducationItem) => void }> = ({ edu, idx, language, t, onClick }) => {
  const description = language === 'ar' ? edu.descriptionAr : edu.descriptionEn;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      onClick={() => onClick(edu)}
      className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-[0_0_15px_rgba(236,72,153,0.1)] border-2 border-pink-200 dark:border-pink-900/50 hover:border-pink-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left rtl:md:text-right"
    >
      {/* Decorative Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-maroon/0 via-maroon/0 to-maroon/5 group-hover:via-maroon/5 transition-all duration-500"></div>

      {/* Institution Logo */}
      <div className="shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-white/50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 p-2 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
        {edu.institutionLogo ? (
          <img src={edu.institutionLogo} alt={edu.institutionEn} className="w-full h-full object-contain" />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-300">
            <GraduationCap className="w-8 h-8 mb-1" />
            <span className="text-[10px] font-bold">No Logo</span>
          </div>
        )}
      </div>

      <div className="flex-1 w-full relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-2 gap-2">
          <div>
            <h3 className="text-xl font-bold text-anthracite dark:text-white group-hover:text-maroon transition-colors">
              {language === 'ar' ? edu.degreeAr : edu.degreeEn}
            </h3>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
              {language === 'ar' ? edu.institutionAr : edu.institutionEn}
            </p>
          </div>

          <div className="flex flex-col items-center gap-1 whitespace-nowrap">
            <span className="inline-block px-3 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded-full text-xs font-bold font-mono border border-pink-100 dark:border-pink-800">
              {edu.date}
            </span>
            {(edu.gradeEn || edu.gradeAr) && (
              <div className="flex items-center justify-center gap-1 text-sm font-bold text-green-600 dark:text-green-400">
                <Star className="w-4 h-4 fill-green-500 text-green-500" />
                <span>GPA: {language === 'ar' ? edu.gradeAr : edu.gradeEn}</span>
              </div>
            )}
          </div>
        </div>

        {/* Truncated Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
          {description}
        </p>

        <div className="flex items-center justify-center md:justify-start gap-2 text-maroon font-bold text-xs uppercase tracking-wider group-hover:gap-3 transition-all">
          {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
          <ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
        </div>
      </div>
    </motion.div>
  );
};

// ... inside Home component (I will inject the logic via another edit or include it here if I am replacing Home)
// For this tool call, I'm just re-adding the EducationCard definition and restoring the Layout Section. 
// Wait, I need to add state to Home too. I'll do that in a separate replacement or try to do it all if possible. 
// I'll start by adding the `EducationCard` definition at line 14 where I deleted EducationItem.




const EducationModal: React.FC<{ edu: EducationItem; onClose: () => void; language: 'en' | 'ar' }> = ({ edu, onClose, language }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-6 mb-8 border-b border-gray-100 dark:border-gray-700 pb-8">
            <div className="shrink-0 w-32 h-32 rounded-xl bg-white p-2 shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
              {edu.institutionLogo ? (
                <img src={edu.institutionLogo} alt={edu.institutionEn} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300 text-xs text-center p-2">
                  Organization Logo
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-anthracite dark:text-white mb-2">
                {language === 'ar' ? edu.degreeAr : edu.degreeEn}
              </h2>
              <div className="flex items-center gap-2 text-xl text-maroon font-medium mb-4">
                <Globe className="w-5 h-5" />
                {language === 'ar' ? edu.institutionAr : edu.institutionEn}
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 font-bold text-sm border border-blue-100 dark:border-blue-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {edu.date}
                </div>
                {(edu.gradeEn || edu.gradeAr) && (
                  <div className="px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-bold text-sm border border-green-100 dark:border-green-800 flex items-center gap-2">
                    <Star className="w-4 h-4 fill-green-500 text-green-500" />
                    GPA: {language === 'ar' ? edu.gradeAr : edu.gradeEn}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Description - Directly Shown */}
            <div>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {language === 'ar' ? edu.descriptionAr : edu.descriptionEn}
              </p>
            </div>

            {/* Certificate Image */}
            {edu.degreeImage && (
              <div>
                <h3 className="text-lg font-bold text-anthracite dark:text-white mb-4 flex items-center gap-2 border-b pb-2">
                  <Award className="w-5 h-5 text-maroon" />
                  {language === 'ar' ? 'الشهادة المرفقة' : 'Attached Certificate'}
                </h3>
                <div className="rounded-xl overflow-hidden border-2 border-gray-100 dark:border-gray-700 shadow-lg group relative">
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors cursor-pointer" onClick={() => {
                      if (edu.degreeImage?.startsWith('data:')) {
                        const arr = edu.degreeImage.split(',');
                        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
                        const bstr = atob(arr[1]);
                        let n = bstr.length;
                        const u8arr = new Uint8Array(n);
                        while (n--) u8arr[n] = bstr.charCodeAt(n);
                        const blob = new Blob([u8arr], { type: mime });
                        const url = URL.createObjectURL(blob);
                        window.open(url, '_blank');
                      } else {
                        window.open(edu.degreeImage, '_blank');
                      }
                  }} />
                  <img src={edu.degreeImage} alt="Certificate" className="w-full h-auto" />
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Click to View Fullsize
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const TestimonialCard: React.FC<{ t: any; idx: number; language: 'en' | 'ar'; onClick: (t: any) => void }> = ({ t, idx, language, onClick }) => {
  const text = language === 'ar' ? (t.textAr || '') : (t.textEn || '');
  const shouldTruncate = text.length > 150;
  const displayText = shouldTruncate ? text.slice(0, 150) + '...' : text;
  const name = language === 'ar' ? (t.nameAr || t.name || '') : (t.nameEn || t.name || '');
  const title = language === 'ar' ? (t.titleAr || t.title || '') : (t.titleEn || t.title || '');
  const company = language === 'ar' ? (t.companyAr || '') : (t.companyEn || '');
  const country = language === 'ar' ? (t.countryAr || t.country || '') : (t.countryEn || t.country || '');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.1 }}
      onClick={() => onClick(t)}
      className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-pink-200 dark:border-pink-900/50 shadow-[0_0_15px_rgba(236,72,153,0.1)] hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all relative flex flex-col h-full cursor-pointer group"
    >
      <div className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} text-yellow-400 group-hover:scale-110 transition-transform`}>
        <Star className="w-6 h-6 fill-yellow-400" />
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden shrink-0 border border-gray-100">
          {t.image ? <img src={t.image} alt={name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 bg-gray-100">{name[0] || '?'}</div>}
        </div>
        <div>
          <h4 className="font-bold text-anthracite dark:text-white group-hover:text-maroon transition-colors">{name}</h4>
          <div className="flex items-center gap-1.5 flex-wrap">
            {company && <p className="text-xs text-maroon font-bold">{company}</p>}
            {company && country && <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>}
            {country && <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">{country}</p>}
          </div>
          {title && <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 italic">{title}</p>}
        </div>
      </div>
      <div className="flex-1">
        <p className="text-gray-600 dark:text-gray-300 text-sm italic leading-relaxed">"{displayText}"</p>
      </div>
    </motion.div>
  );
};

const TestimonialModal: React.FC<{ t: any; onClose: () => void; language: 'en' | 'ar' }> = ({ t, onClose, language }) => {
  const name = language === 'ar' ? (t.nameAr || t.name || '') : (t.nameEn || t.name || '');
  const title = language === 'ar' ? (t.titleAr || t.title || '') : (t.titleEn || t.title || '');
  const company = language === 'ar' ? (t.companyAr || '') : (t.companyEn || '');
  const country = language === 'ar' ? (t.countryAr || t.country || '') : (t.countryEn || t.country || '');
  const text = language === 'ar' ? (t.textAr || '') : (t.textEn || '');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700 relative p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: photo + name + title + company + country */}
        <div className="flex flex-col items-center text-center border-b border-gray-100 dark:border-gray-700 pb-6 mb-6 mt-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden mb-4 border-2 border-pink-200 shadow-lg">
            {t.image
              ? <img src={t.image} alt={name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-500 bg-gray-100">{name[0] || '?'}</div>}
          </div>
          <h2 className="text-2xl font-bold text-anthracite dark:text-white mb-1">{name}</h2>
          <div className="flex items-center gap-2 mb-1 flex-wrap justify-center">
            {company && <p className="text-base text-maroon font-bold">{company}</p>}
            {company && country && <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></span>}
            {country && <p className="text-base text-gray-600 dark:text-gray-400 font-medium">{country}</p>}
          </div>
          {title && <p className="text-sm text-gray-500 dark:text-gray-500 italic mb-2">{title}</p>}
        </div>

        {/* Full testimonial text */}
        <div className="relative p-6 bg-pink-50/50 dark:bg-pink-900/10 rounded-xl mb-6">
          <Quote className="absolute top-2 left-2 rtl:left-auto rtl:right-2 w-8 h-8 text-maroon/10 rotate-180 rtl:rotate-0" />
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic relative z-10 text-center">
            "{text}"
          </p>
          <Quote className="absolute bottom-2 right-2 rtl:right-auto rtl:left-2 w-8 h-8 text-maroon/10 rtl:rotate-180" />
        </div>

        {/* LinkedIn link if available */}
        {t.linkedin && (
          <div className="text-center">
            <a
              href={t.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              {language === 'ar' ? 'التواصل عبر لينكد إن' : 'Connect on LinkedIn'}
            </a>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};




const Home: React.FC = () => {
  const { language, blogs, totalVisits, testimonials, addTestimonial, skills, projects, certifications, settings, languagesList, experienceCategories, experienceItems, educationList } = useApp();

  // Enhanced Review State - all bilingual fields
  const [newReview, setNewReview] = useState({
    nameEn: '', nameAr: '',
    titleEn: '', titleAr: '',
    companyEn: '', companyAr: '',
    countryEn: '', countryAr: '',
    textEn: '', textAr: '',
    linkedin: '', image: ''
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Modal States
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedEdu, setSelectedEdu] = useState<EducationItem | null>(null);

  // Image Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImage, setCropperImage] = useState<string>('');
  const [cropperCallback, setCropperCallback] = useState<(base64: string) => void>(() => { });

  // Translations
  const t = {
    about: language === 'ar' ? 'نبذة عني' : 'About Me',
    education: language === 'ar' ? 'التعليم' : 'Education', // Removed Qualifications
    skills: language === 'ar' ? 'خدماتي ومهاراتي' : 'Services & Skills',
    languages: language === 'ar' ? 'اللغات' : 'Languages',
    certs: language === 'ar' ? 'الشهادات والدورات' : 'Certifications & Courses',
    projects: language === 'ar' ? 'أبرز المشاريع' : 'Featured Projects',
    blogTitle: language === 'ar' ? 'أحدث المقالات' : 'Recent Insights',
    readMore: language === 'ar' ? 'اقرأ المزيد' : 'Read More',
    stats: language === 'ar' ? 'إجمالي الزيارات' : 'Total Visits',
    endorsements: language === 'ar' ? 'التوصيات' : 'Endorsements',
    addReview: language === 'ar' ? 'أضف توصية' : 'Add Recommendation',
    namePlaceholder: language === 'ar' ? 'اسمك' : 'Your Name',
    titlePlaceholder: language === 'ar' ? 'المسمى الوظيفي' : 'Job Title',
    linkedinPlaceholder: language === 'ar' ? 'رابط لينكد إن' : 'LinkedIn Profile URL',
    countryPlaceholder: language === 'ar' ? 'الدولة (مثال: المملكة العربية السعودية)' : 'Country (e.g. Saudi Arabia)',
    reviewPlaceholder: language === 'ar' ? 'اكتب رأيك...' : 'Write your feedback...',
    submit: language === 'ar' ? 'إرسال' : 'Submit',
    successMsg: language === 'ar' ? 'شكراً! سيتم مراجعة توصيتك قريباً.' : 'Thanks! Your review will be reviewed shortly.',
    viewAll: language === 'ar' ? 'عرض الكل' : 'View All',
    orderNow: language === 'ar' ? 'اطلب الخدمة الآن' : 'Order Service Now',
    close: language === 'ar' ? 'إغلاق' : 'Close',
    viaWhatsapp: language === 'ar' ? 'عبر واتساب' : 'Via WhatsApp',
    viaEmail: language === 'ar' ? 'عبر البريد' : 'Via Email',
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Shield': return <Shield className="w-8 h-8" />;
      case 'Lock': return <Lock className="w-8 h-8" />;
      case 'Terminal': return <Terminal className="w-8 h-8" />;
      case 'Eye': return <Eye className="w-8 h-8" />;
      case 'Code': return <Code className="w-8 h-8" />;
      case 'Wifi': return <Wifi className="w-8 h-8" />;
      default: return <Shield className="w-8 h-8" />;
    }
  };

  const renderSkillIcon = (skill: Skill) => {
    if (skill.image) {
      return <img src={skill.image} alt={language === 'ar' ? skill.titleAr : skill.titleEn} className="w-12 h-12 object-contain" />;
    }
    return getIcon(skill.iconName);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.nameEn && newReview.nameAr && (newReview.textEn || newReview.textAr)) {
      addTestimonial({
        id: Date.now().toString(),
        nameEn: newReview.nameEn,
        nameAr: newReview.nameAr,
        name: newReview.nameEn,
        titleEn: newReview.titleEn,
        titleAr: newReview.titleAr,
        title: newReview.titleEn,
        companyEn: newReview.companyEn,
        companyAr: newReview.companyAr,
        countryEn: newReview.countryEn,
        countryAr: newReview.countryAr,
        country: newReview.countryEn,
        textEn: newReview.textEn,
        textAr: newReview.textAr,
        linkedin: newReview.linkedin,
        image: newReview.image,
        approved: false
      });
      setReviewSubmitted(true);
      setNewReview({ nameEn: '', nameAr: '', titleEn: '', titleAr: '', companyEn: '', companyAr: '', countryEn: '', countryAr: '', textEn: '', textAr: '', linkedin: '', image: '' });
      setTimeout(() => setReviewSubmitted(false), 5000);
    }
  };

  const handleReviewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCropperImage(reader.result);
          setCropperCallback(() => (cropped: string) => setNewReview({ ...newReview, image: cropped }));
          setCropperOpen(true);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const getWhatsAppLink = (skill: Skill) => {
    let text = '';
    if (language === 'ar') {
      text = `مرحباً م. ملك البنا، أنا مهتم بخدمة: ${skill.titleAr}. هل يمكننا مناقشة التفاصيل؟`;
    } else {
      text = `Hello Eng. Malk, I am interested in the service: ${skill.titleEn}. Can we discuss details?`;
    }
    return `https://wa.me/970593038780?text=${encodeURIComponent(text)}`;
  };

  const getEmailLink = (skill: Skill) => {
    const subject = language === 'ar' ? `استفسار خدمة: ${skill.titleAr}` : `Service Inquiry: ${skill.titleEn}`;
    return `mailto:bannamalak156@gmail.com?subject=${encodeURIComponent(subject)}`;
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden py-16">
        {/* Background Banner with Berry/Pink Gradient & Glow */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="w-full h-2/3 bg-gradient-to-r from-[#800020] via-[#c71585] to-[#FFC0CB] opacity-10 blur-3xl transform skew-y-6 rounded-3xl"></div>
          <div className="absolute w-96 h-96 bg-maroon/20 blur-[100px] rounded-full"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-[auto_1fr] gap-6 lg:gap-10 items-center">
          {/* Profile Image - Always on Left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center md:justify-start"
          >
            <div className="relative w-56 sm:w-64 lg:w-72 aspect-[3/4] rounded-3xl p-[4px] overflow-hidden shadow-[0_0_40px_rgb(var(--color-primary)/0.35)]">
              {/* Rotating Light Border */}
              <div className="absolute -inset-[150%] animate-border-flow bg-[conic-gradient(from_0deg,rgb(var(--color-primary))_0deg,rgb(var(--color-primary))_70deg,transparent_130deg,transparent_230deg,#C8A2C8_300deg,transparent_360deg)]"></div>
              {/* Static Inner Image */}
              <div className="relative h-full w-full rounded-[calc(1.5rem-4px)] overflow-hidden bg-gradient-to-br from-maroon/10 to-lavender/10 dark:bg-gray-800">
                {settings.profileImage ? (
                  <img
                    src={settings.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-24 h-24 text-maroon/30" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>
          </motion.div>

          {/* Name, Role & About */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-anthracite dark:text-white mb-3 leading-tight whitespace-nowrap">
              {language === 'ar' ? (settings.fullNameAr || settings.siteNameAr) : (settings.fullNameEn || settings.siteNameEn)}
            </h1>

            <p className="text-lg md:text-xl text-maroon font-semibold mb-5">
              {language === 'ar' ? (settings.heroTitleAr || settings.heroSubtitleAr) : (settings.heroTitleEn || settings.heroSubtitleEn)}
            </p>

            {/* About Me Blurb with Icon */}
            <div className="flex items-start gap-3 p-5 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur border border-pink-200 dark:border-pink-900/40 shadow-[0_0_20px_rgba(236,72,153,0.12)] mb-6">
              <div className="shrink-0 p-2.5 bg-maroon/5 rounded-full text-maroon">
                <User className="w-5 h-5" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base" style={language === 'ar' ? { textAlign: 'right' } : { textAlign: 'left' }}>
                {language === 'ar' ? settings.aboutTextAr : settings.aboutTextEn}
              </p>
            </div>

            {/* Stats Bar */}
            <div className="inline-flex items-center gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur px-6 py-2.5 rounded-full shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">{t.stats}</span>
              </div>
              <span className="text-lg font-bold text-maroon font-mono">{totalVisits.toLocaleString()}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="max-w-4xl mx-auto px-4">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4 w-full" style={language === 'ar' ? { direction: 'rtl', justifyContent: 'flex-start' } : {}}>
            {language === 'ar' ? (
              <>
                <Briefcase className="w-6 h-6 text-maroon shrink-0" />
                <h2 className="text-3xl font-bold text-maroon">الخبرات المهنية</h2>
              </>
            ) : (
              <>
                <Briefcase className="w-6 h-6 text-maroon shrink-0" />
                <h2 className="text-3xl font-bold text-maroon">Professional Experience</h2>
              </>
            )}
          </div>
          <div className={`w-20 h-1 bg-maroon rounded-full opacity-30 ${language === 'ar' ? 'ml-auto' : 'mr-auto'}`}></div>
        </div>

        <div className="space-y-4">
          {[...experienceCategories].sort((a,b) => (a.orderNum||0) - (b.orderNum||0)).map((cat, idx) => (
            <div key={cat.id} className="rounded-2xl overflow-hidden border-2 border-pink-200 dark:border-pink-900/50 shadow-[0_0_15px_rgba(236,72,153,0.1)] hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all bg-white dark:bg-gray-800">
              <button
                onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-colors"
              >
                <h3 className="text-xl font-bold text-anthracite dark:text-white">
                  {language === 'ar' ? cat.titleAr : cat.titleEn}
                </h3>
                <ChevronRight className={`w-5 h-5 text-maroon transition-transform duration-300 ${expandedCategory === cat.id ? 'rotate-90' : ''}`} />
              </button>

              <AnimatePresence>
                {expandedCategory === cat.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-pink-100 dark:border-pink-900/30"
                  >
                    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-800/50">
                      {[...experienceItems].filter(item => item.categoryId === cat.id).sort((a,b) => (a.orderNum||0) - (b.orderNum||0)).map(item => (
                        <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                          <div className="shrink-0">
                            {item.logo ? (
                              <img src={item.logo} alt={item.company} className="w-16 h-16 object-contain rounded-lg border bg-white" />
                            ) : (
                              <div className="w-16 h-16 bg-maroon/10 rounded-lg flex items-center justify-center text-maroon">
                                <Briefcase className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                              <div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{language === 'ar' ? item.titleAr : item.titleEn}</h4>
                                <p className="text-maroon font-medium">{item.company}</p>
                              </div>
                              <div className="text-right">
                                <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                                  {item.duration}
                                </span>
                                <p className="text-xs text-gray-500">{item.country}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                              {language === 'ar' ? item.descAr : item.descEn}
                            </p>
                          </div>
                        </div>
                      ))}
                      {experienceItems.filter(item => item.categoryId === cat.id).length === 0 && (
                        <p className="text-center text-gray-500 italic py-4">No experience listed in this field yet.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 relative bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row gap-8 lg:gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/4 md:sticky md:top-32"
          >
            <div className={`flex flex-col gap-2 mb-4 ${language === 'ar' ? 'items-end' : 'items-start'}`}>
              <GraduationCap className="w-10 h-10 text-maroon" />
              <h2 className="text-3xl font-bold text-maroon">{language === 'ar' ? 'التعليم' : 'Education'}</h2>
              <h2 className="text-3xl font-bold text-maroon">{language === 'ar' ? 'الأكاديمي' : ''}</h2>
            </div>
            <div className={`w-20 h-1 bg-maroon rounded-full opacity-30 ${language === 'ar' ? 'ml-auto' : 'mr-auto'}`}></div>
          </motion.div>

          <div className="md:w-3/4 grid grid-cols-1 gap-8">
            {[...educationList].sort((a,b) => (a.orderNum||0) - (b.orderNum||0)).map((edu, idx) => (
              <EducationCard
                key={edu.id}
                edu={edu}
                idx={idx}
                language={language}
                t={t}
                onClick={setSelectedEdu}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="max-w-7xl mx-auto px-4">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4 w-full" style={language === 'ar' ? { direction: 'rtl', justifyContent: 'flex-start' } : {}}>
            {language === 'ar' ? (
              <>
                <Settings className="w-6 h-6 text-maroon shrink-0" />
                <h2 className="text-3xl font-bold text-maroon">{t.skills}</h2>
              </>
            ) : (
              <>
                <Settings className="w-6 h-6 text-maroon shrink-0" />
                <h2 className="text-3xl font-bold text-maroon">{t.skills}</h2>
              </>
            )}
          </div>
          <div className={`w-20 h-1 bg-maroon rounded-full opacity-30 ${language === 'ar' ? 'ml-auto' : 'mr-auto'}`}></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.slice(0, 4).map((skill, idx) => (
            <motion.div
              key={skill.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
              onClick={() => setSelectedSkill(skill)}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-[0_0_15px_rgba(236,72,153,0.1)] border-2 border-pink-200 dark:border-pink-900/50 hover:border-pink-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all duration-300 cursor-pointer group text-center relative overflow-hidden"
            >
              <div className="mb-6 inline-block p-4 bg-maroon/5 rounded-full text-maroon group-hover:scale-110 transition-transform duration-300">
                {renderSkillIcon(skill)}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-anthracite dark:text-white group-hover:text-maroon transition-colors">
                {language === 'ar' ? skill.titleAr : skill.titleEn}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                {language === 'ar' ? skill.descAr : skill.descEn}
              </p>
              {skill.price && (
                <span className="inline-block bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-100">
                  {skill.price}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/services" className="inline-flex items-center gap-2 bg-maroon text-white px-8 py-3 rounded-full font-bold hover:bg-[#7a0d2d] transition-all shadow-lg shadow-maroon/20">
            {t.viewAll} <ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="max-w-7xl mx-auto px-4 bg-gray-50 dark:bg-gray-800/30 py-20 rounded-3xl">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4 w-full" style={language === 'ar' ? { direction: 'rtl', justifyContent: 'flex-start' } : {}}>
            {language === 'ar' ? (
              <>
                <FolderOpen className="w-6 h-6 text-maroon shrink-0" />
                <h2 className="text-3xl font-bold text-maroon">{t.projects}</h2>
              </>
            ) : (
              <>
                <FolderOpen className="w-6 h-6 text-maroon shrink-0" />
                <h2 className="text-3xl font-bold text-maroon">{t.projects}</h2>
              </>
            )}
          </div>
          <div className={`w-20 h-1 bg-maroon rounded-full opacity-30 ${language === 'ar' ? 'ml-auto' : 'mr-auto'}`}></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {projects.filter(p => p.featured).sort((a,b) => (a.orderNum||0) - (b.orderNum||0)).map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-pink-200 dark:border-pink-900/50 shadow-[0_0_15px_rgba(236,72,153,0.1)] hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all group flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={project.mainImage || 'https://via.placeholder.com/400x200'}
                  alt={project.titleEn}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-maroon/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-anthracite dark:text-white mb-2 group-hover:text-maroon transition-colors">
                  {language === 'ar' ? project.titleAr : project.titleEn}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                  {language === 'ar' ? project.descAr : project.descEn}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-mono">#{tag}</span>
                  ))}
                </div>

                <Link
                  to={`/projects/${project.id}`}
                  className="mt-auto w-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-maroon hover:text-maroon py-2 rounded-xl flex items-center justify-center gap-2 font-bold transition-all text-sm"
                >
                  {t.readMore} <ChevronRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/projects" className="inline-flex items-center gap-2 bg-maroon text-white px-8 py-3 rounded-full font-bold hover:bg-[#7a0d2d] transition-all shadow-lg shadow-maroon/20">
            {t.viewAll} <ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="max-w-7xl mx-auto px-4">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4 w-full" style={language === 'ar' ? { direction: 'rtl', justifyContent: 'flex-start' } : {}}>
            {language === 'ar' ? (
              <>
                <Award className="w-6 h-6 text-maroon shrink-0" />
                <h2 className="text-3xl font-bold text-maroon">{t.certs}</h2>
              </>
            ) : (
              <>
                <Award className="w-6 h-6 text-maroon shrink-0" />
                <h2 className="text-3xl font-bold text-maroon">{t.certs}</h2>
              </>
            )}
          </div>
          <div className={`w-20 h-1 bg-maroon rounded-full opacity-30 ${language === 'ar' ? 'ml-auto' : 'mr-auto'}`}></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {certifications.filter(c => c.featured).sort((a,b) => (a.orderNum||0) - (b.orderNum||0)).map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedCert(cert)}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.1)] border-2 border-pink-200 dark:border-pink-900/50 hover:border-pink-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] cursor-pointer transition-all duration-300 group flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Simple Standard Design */}
              <div className="mb-4 p-4 rounded-full group-hover:scale-110 transition-transform">
                {cert.issuerLogo ? (
                  <img src={cert.issuerLogo} alt={cert.org} className="w-16 h-16 object-contain" />
                ) : (
                  <div className="bg-pink-50 p-4 rounded-full text-pink-600">
                    <Award className="w-8 h-8" />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-lg mb-1 text-anthracite dark:text-white">{cert.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{cert.org}</p>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full font-mono border border-gray-200 dark:border-gray-600">
                {cert.date}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/certifications" className="inline-flex items-center gap-2 bg-maroon text-white px-8 py-3 rounded-full font-bold hover:bg-[#7a0d2d] transition-all shadow-lg shadow-maroon/20">
            {t.viewAll} <ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </section>

      {/* Languages Section */}
      <section id="languages" className="max-w-4xl mx-auto px-4">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4 w-full" style={language === 'ar' ? { direction: 'rtl', justifyContent: 'flex-start' } : {}}>
            {language === 'ar' ? (
              <>
                <Languages className="w-6 h-6 text-maroon shrink-0" />
                <h2 className="text-2xl font-bold text-maroon">{t.languages}</h2>
              </>
            ) : (
              <>
                <Languages className="w-6 h-6 text-maroon shrink-0" />
                <h2 className="text-2xl font-bold text-maroon">{t.languages}</h2>
              </>
            )}
          </div>
          <div className={`w-20 h-1 bg-maroon rounded-full opacity-30 ${language === 'ar' ? 'ml-auto' : 'mr-auto'}`}></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {languagesList.map(lang => (
            <div key={lang.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-pink-200 dark:border-pink-900/50 shadow-[0_0_15px_rgba(236,72,153,0.1)] hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all text-center">
              <h3 className="font-bold text-lg text-maroon mb-1">
                {language === 'ar' ? lang.nameAr : lang.nameEn}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {language === 'ar' ? lang.levelAr : lang.levelEn}
              </p>
              <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${lang.percentage}%` }}
                  transition={{ duration: 1 }}
                  className="bg-gradient-to-r from-maroon to-lavender h-full rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-maroon" />
            <h2 className="text-3xl font-bold text-maroon">{t.endorsements}</h2>
          </div>
          <div className="w-20 h-1 bg-maroon mx-auto rounded-full opacity-30"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {testimonials.filter(t => t.approved).map((t, idx) => (
            <TestimonialCard key={t.id} t={t} idx={idx} language={language} onClick={setSelectedTestimonial} />
          ))}
        </div>

        {/* Add Review Form */}
        <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl border-2 border-pink-200 dark:border-pink-900/50 shadow-[0_0_15px_rgba(236,72,153,0.1)] hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-colors">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-anthracite dark:text-white mb-2">{t.addReview}</h3>
            <p className="text-sm text-gray-500">{t.reviewPlaceholder}</p>
          </div>

          {reviewSubmitted ? (
            <div className="bg-green-100 text-green-800 p-4 rounded-xl text-center flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8" />
              <p className="font-bold">{t.successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Names - EN + AR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all"
                  placeholder={language === 'ar' ? 'الاسم بالإنجليزية *' : 'Name in English *'}
                  value={newReview.nameEn}
                  onChange={e => setNewReview({ ...newReview, nameEn: e.target.value })}
                  required
                />
                <input
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-right focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all"
                  placeholder={language === 'ar' ? 'الاسم بالعربية *' : 'الاسم بالعربية *'}
                  value={newReview.nameAr}
                  onChange={e => setNewReview({ ...newReview, nameAr: e.target.value })}
                  required
                />
              </div>

              {/* Job Title - EN + AR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all"
                  placeholder={language === 'ar' ? 'المسمى الوظيفي (EN)' : 'Job Title (English)'}
                  value={newReview.titleEn}
                  onChange={e => setNewReview({ ...newReview, titleEn: e.target.value })}
                />
                <input
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-right focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all"
                  placeholder={language === 'ar' ? 'المسمى الوظيفي (AR)' : 'المسمى الوظيفي (عربي)'}
                  value={newReview.titleAr}
                  onChange={e => setNewReview({ ...newReview, titleAr: e.target.value })}
                />
              </div>

              {/* Company - EN + AR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all"
                  placeholder={language === 'ar' ? 'اسم الشركة (EN)' : 'Company Name (English)'}
                  value={newReview.companyEn}
                  onChange={e => setNewReview({ ...newReview, companyEn: e.target.value })}
                />
                <input
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-right focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all"
                  placeholder={language === 'ar' ? 'اسم الشركة (AR)' : 'اسم الشركة (عربي)'}
                  value={newReview.companyAr}
                  onChange={e => setNewReview({ ...newReview, companyAr: e.target.value })}
                />
              </div>

              {/* Country - EN + AR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all"
                  placeholder={language === 'ar' ? 'الدولة (EN) e.g. Palestine' : 'Country (English)'}
                  value={newReview.countryEn}
                  onChange={e => setNewReview({ ...newReview, countryEn: e.target.value })}
                />
                <input
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-right focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all"
                  placeholder={language === 'ar' ? 'الدولة (AR) مثال: فلسطين' : 'الدولة (عربي)'}
                  value={newReview.countryAr}
                  onChange={e => setNewReview({ ...newReview, countryAr: e.target.value })}
                />
              </div>

              {/* LinkedIn */}
              <input
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all"
                placeholder={t.linkedinPlaceholder}
                value={newReview.linkedin}
                onChange={e => setNewReview({ ...newReview, linkedin: e.target.value })}
              />

              {/* Photo upload */}
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 p-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center w-full" title="Upload Photo">
                  <Upload className="w-5 h-5 text-gray-500 dark:text-gray-300 mr-2" />
                  <span className="text-gray-500 dark:text-gray-300 text-sm">Upload Photo (Optional)</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleReviewImageUpload} />
                </label>
              </div>
              {newReview.image && <p className="text-xs text-green-600 text-center">Photo attached!</p>}

              {/* Testimonial text - EN + AR */}
              <textarea
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all min-h-[100px]"
                placeholder={language === 'ar' ? 'نص التوصية بالإنجليزية *' : 'Testimonial text in English *'}
                value={newReview.textEn}
                onChange={e => setNewReview({ ...newReview, textEn: e.target.value })}
                required
              />
              <textarea
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-right focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all min-h-[100px]"
                placeholder={language === 'ar' ? 'نص التوصية بالعربية *' : 'نص التوصية بالعربية *'}
                value={newReview.textAr}
                onChange={e => setNewReview({ ...newReview, textAr: e.target.value })}
                required
              />

              <button className="w-full bg-maroon text-white font-bold py-3 rounded-xl hover:bg-[#7a0d2d] transition-all shadow-lg shadow-maroon/20">
                {t.submit}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {/* Education Modal */}
        {selectedEdu && (
          <EducationModal
            edu={selectedEdu}
            language={language}
            onClose={() => setSelectedEdu(null)}
          />
        )}

        {/* Testimonial Modal */}
        {selectedTestimonial && (
          <TestimonialModal
            t={selectedTestimonial}
            language={language}
            onClose={() => setSelectedTestimonial(null)}
          />
        )}

        {/* Service Modal */}
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
                    {renderSkillIcon(selectedSkill)}
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

        {/* Certification Modal */}
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedCert(null)} className="absolute top-4 right-4 text-gray-400 hover:text-maroon z-10 bg-white/80 rounded-full p-1">
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto">
                <div className="text-center mb-6 pt-4">
                  <div className="w-16 h-16 bg-maroon/10 rounded-full flex items-center justify-center mx-auto mb-4 text-maroon overflow-hidden">
                    {selectedCert.issuerLogo ? (
                      <img src={selectedCert.issuerLogo} alt={selectedCert.org} className="w-full h-full object-contain p-1" />
                    ) : (
                      <Award className="w-8 h-8" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-anthracite dark:text-white">{selectedCert.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{selectedCert.org} • {selectedCert.date}</p>
                </div>

                {selectedCert.imageUrl && (
                  <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                    {selectedCert.imageUrl.startsWith('data:application/pdf') ? (
                      <object data={selectedCert.imageUrl} type="application/pdf" className="w-full h-[60vh] min-h-[400px]">
                        <p className="p-4 text-center text-gray-500">PDF cannot be displayed natively. <a href={selectedCert.imageUrl} download="Certificate.pdf" className="text-maroon underline">Download PDF</a></p>
                      </object>
                    ) : (
                      <img src={selectedCert.imageUrl} alt={selectedCert.name} className="w-full h-auto object-contain" />
                    )}
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center mb-6">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {language === 'ar' ? (selectedCert.descAr || 'تفاصيل الشهادة غير متوفرة.') : (selectedCert.descEn || 'Certificate details not available.')}
                  </p>
                </div>

                <div className="text-center pb-2">
                  <span className="inline-flex items-center gap-1 text-green-600 font-bold text-xs bg-green-100 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    {language === 'ar' ? 'تم التحقق من الشهادة' : 'Verified Credential'}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Testimonial Modal */}
        {selectedTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedTestimonial(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-8 shadow-2xl relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedTestimonial(null)} className="absolute top-4 right-4 text-gray-400 hover:text-maroon z-10">
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden mb-4 border-4 border-maroon/10">
                  {selectedTestimonial.image ? (
                    <img src={selectedTestimonial.image} alt={selectedTestimonial.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-gray-500">{selectedTestimonial.name[0]}</div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-anthracite dark:text-white">{selectedTestimonial.name}</h3>
                <p className="text-maroon font-medium">{selectedTestimonial.title}</p>
                {selectedTestimonial.country && <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mt-1">{selectedTestimonial.country}</p>}

                {selectedTestimonial.country && <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mt-1">{selectedTestimonial.country}</p>}
              </div>

              <div className="relative">
                <Quote className="absolute top-0 left-0 w-8 h-8 text-maroon/10 -translate-x-2 -translate-y-2" />
                <p className="text-gray-600 dark:text-gray-300 text-lg italic leading-relaxed text-center px-6">
                  "{language === 'ar' ? selectedTestimonial.textAr : selectedTestimonial.textEn}"
                </p>
              </div>

              <div className="mt-8 flex flex-col items-center gap-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {selectedTestimonial.linkedin && (
                  <a href={selectedTestimonial.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors">
                    <Linkedin className="w-5 h-5" />
                    {language === 'ar' ? 'التواصل عبر لينكد إن' : 'Connect on LinkedIn'}
                  </a>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Cropper Modal */}
      {
        cropperOpen && (
          <ImageCropper
            imageSrc={cropperImage}
            aspect={1}
            onCancel={() => setCropperOpen(false)}
            onCropComplete={(croppedImage) => {
              cropperCallback(croppedImage);
              setCropperOpen(false);
            }}
          />
        )
      }
    </div >
  );
};

export default Home;
