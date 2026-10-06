

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BlogPost, Testimonial, KnowledgeItem, PendingQuestion, Language, Skill, Project, Certification, AppSettings, SocialLink, LanguageItem, Notification, EducationItem, ExperienceCategory, ExperienceItem } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface AppContextType {
  language: Language;
  toggleLanguage: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;

  // Data
  settings: AppSettings;
  socialLinks: SocialLink[];
  languagesList: LanguageItem[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  educationList: EducationItem[];
  experienceCategories: ExperienceCategory[];
  experienceItems: ExperienceItem[];
  blogs: BlogPost[];
  testimonials: Testimonial[];
  knowledgeBase: KnowledgeItem[];
  pendingQuestions: PendingQuestion[];
  notifications: Notification[];
  totalVisits: number;

  // Actions
  updateSettings: (s: AppSettings) => void;
  updateSocialLinks: (links: SocialLink[]) => void;
  updateLanguagesList: (list: LanguageItem[]) => void;
  updateSkills: (skills: Skill[]) => void;
  updateProjects: (projects: Project[]) => void;
  updateCertifications: (certs: Certification[]) => void;

  addEducation: (edu: EducationItem) => void;
  updateEducation: (edu: EducationItem) => void;
  deleteEducation: (id: string) => void;

  updateExperienceCategories: (cats: ExperienceCategory[]) => void;
  updateExperienceItems: (items: ExperienceItem[]) => void;

  // Blog Actions
  addBlog: (blog: BlogPost) => void;
  updateBlog: (blog: BlogPost) => void;
  deleteBlog: (id: string) => void;
  incrementBlogViews: (id: string) => void;

  addTestimonial: (t: Testimonial) => void;
  approveTestimonial: (id: string) => void;
  deleteTestimonial: (id: string) => void;

  addKnowledge: (item: KnowledgeItem) => void;
  addPendingQuestion: (q: string) => void;
  resolvePendingQuestion: (id: string) => void;

  // Notification Actions
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;

  incrementVisits: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Default Fallback Data
const DEFAULT_SETTINGS: AppSettings = {
  siteNameEn: 'Malk All Banna',
  siteNameAr: 'ملك البنا',
  fullNameEn: 'Eng. Malk Khalid All Banna',
  fullNameAr: 'م. ملك خالد البنا',
  heroTitleEn: 'Security with Elegance',
  heroTitleAr: 'الأمان بلمسة من الأناقة',
  heroSubtitleEn: 'Information Security Engineer blending technical precision with intelligent solutions.',
  heroSubtitleAr: 'مهندس أمن معلومات يدمج بين الدقة التقنية والحلول الذكية.',
  aboutTextEn: 'I am Malk, a passionate Cybersecurity Engineer dedicated to protecting digital ecosystems from evolving threats. With expertise in security analysis, penetration testing, and intelligent defense systems, I blend technical precision with elegant solutions to safeguard the digital world.',
  aboutTextAr: 'أنا ملك البنا، مهندس أمن سيبراني متخصص في حماية الأصول الرقمية من التهديدات المتطورة. مع خبرة في التحليل الأمني واختبار الاختراق والأنظمة الدفاعية الذكية، أدمج بين الدقة التقنية والحلول الأنيقة لحماية العالم الرقمي.',

  primaryColorRGB: '219 39 119',
  contactEmail: 'malk@example.com',
  contactPhone: '',
  aiContext: ''
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Dynamic Data States
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [languagesList, setLanguagesList] = useState<LanguageItem[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [experienceCategories, setExperienceCategories] = useState<ExperienceCategory[]>([
    { id: '1', titleEn: 'Cybersecurity', titleAr: 'الأمن السيبراني' },
    { id: '2', titleEn: 'Web Development', titleAr: 'تطوير الويب' }
  ]);
  const [experienceItems, setExperienceItems] = useState<ExperienceItem[]>([
    {
      id: '1', categoryId: '1', company: 'TechSecure', titleEn: 'Security Analyst', titleAr: 'محلل أمني',
      duration: '2022 - Present', country: 'Saudi Arabia',
      descEn: 'Monitoring and analyzing security incidents.', descAr: 'مراقبة وتحليل الحوادث الأمنية.'
    }
  ]);

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>([]);
  const [pendingQuestions, setPendingQuestions] = useState<PendingQuestion[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalVisits, setTotalVisits] = useState(100);
  // --- Fetch Data on Mount ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          settingsRes, socialsRes, skillsRes, certsRes,
          projectsRes, blogsRes, eduRes, langsRes,
          notifRes, testRes, kbRes, expCatRes, expItemRes
        ] = await Promise.all([
          fetch(`${API_URL}/settings`),
          fetch(`${API_URL}/socials`),
          fetch(`${API_URL}/skills`),
          fetch(`${API_URL}/certifications`),
          fetch(`${API_URL}/projects`),
          fetch(`${API_URL}/blogs`),
          fetch(`${API_URL}/education`),
          fetch(`${API_URL}/languages`),
          fetch(`${API_URL}/notifications`),
          fetch(`${API_URL}/testimonials`),
          fetch(`${API_URL}/knowledge`),
          fetch(`${API_URL}/experience-categories`),
          fetch(`${API_URL}/experience-items`)
        ]);

        const s = await settingsRes.json();
        if (s) {
          setSettings(prev => ({ ...prev, ...s }));
          if (typeof s.totalVisits === 'number') setTotalVisits(s.totalVisits);
        }

        setSocialLinks(await socialsRes.json());
        setSkills(await skillsRes.json());
        setCertifications(await certsRes.json());
        setProjects(await projectsRes.json());
        setBlogs(await blogsRes.json());
        setEducationList(await eduRes.json());
        setLanguagesList(await langsRes.json());
        setNotifications(await notifRes.json());
        setTestimonials(await testRes.json());
        setKnowledgeBase(await kbRes.json());
        setExperienceCategories(await expCatRes.json());
        setExperienceItems(await expItemRes.json());

      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  // --- API Helpers ---
  const postData = async (endpoint: string, data: any) => {
    try {
      await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) { console.error(e); }
  };

  const deleteData = async (endpoint: string, id: string) => {
    try {
      await fetch(`${API_URL}/${endpoint}/${id}`, { method: 'DELETE' });
    } catch (e) { console.error(e); }
  };

  // Admin Actions
  const updateSettings = (s: AppSettings) => {
    setSettings(prev => ({ ...prev, ...s }));
    postData('settings', s);
  };

  const updateSocialLinks = (links: SocialLink[]) => {
    setSocialLinks(links);
    postData('socials', links);
  };

  const updateLanguagesList = (list: LanguageItem[]) => {
    setLanguagesList(list);
    postData('languages', list);
  };

  const updateSkills = (newSkills: Skill[]) => {
    setSkills(newSkills);
    postData('skills', newSkills);
  };

  const updateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    postData('projects', newProjects);
  };

  const updateCertifications = (newCerts: Certification[]) => {
    setCertifications(newCerts);
    postData('certifications', newCerts);
  };

  const addEducation = (edu: EducationItem) => {
    setEducationList([...educationList, edu]);
    postData('education', edu);
  };

  const updateEducation = (edu: EducationItem) => {
    setEducationList(prev => prev.map(e => e.id === edu.id ? edu : e));
    postData('education', edu);
  };

  const deleteEducation = (id: string) => {
    setEducationList(educationList.filter(e => e.id !== id));
    deleteData('education', id);
  };

  const updateExperienceCategories = (cats: ExperienceCategory[]) => {
    setExperienceCategories(cats);
    postData('experience-categories', cats);
  };

  const updateExperienceItems = (items: ExperienceItem[]) => {
    setExperienceItems(items);
    postData('experience-items', items);
  };

  // Blog Actions
  const addBlog = (blog: BlogPost) => {
    setBlogs(prev => [...prev, blog]);
    postData('blogs', blog);
  };

  const updateBlog = (updatedBlog: BlogPost) => {
    const blogWithDate = { ...updatedBlog, date: new Date().toISOString().split('T')[0] };
    setBlogs(prev => prev.map(b => b.id === updatedBlog.id ? blogWithDate : b));
    postData('blogs', blogWithDate);
  };

  const deleteBlog = (id: string) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
    deleteData('blogs', id);
  };

  const incrementBlogViews = (id: string) => {
    setBlogs(prev => prev.map(b => b.id === id ? { ...b, views: b.views + 1 } : b));
    // Ideally this should be a separate API call to avoid overwriting content
  };

  const addTestimonial = (t: Testimonial) => {
    setTestimonials([...testimonials, t]);
    postData('testimonials', t);

    // Add Notification
    const notif: Notification = {
      id: Date.now().toString(),
      type: 'review',
      content: `New review from ${t.name}`,
      date: new Date().toLocaleTimeString(),
      read: false,
      relatedId: t.id
    };
    setNotifications(prev => [notif, ...prev]);
    postData('notifications', notif);
  };

  const approveTestimonial = async (id: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, approved: true } : t));
    await fetch(`${API_URL}/testimonials/${id}/approve`, { method: 'PUT' });

    // Remove notification
    setNotifications(prev => prev.filter(n => n.relatedId !== id));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    deleteData('testimonials', id);
    setNotifications(prev => prev.filter(n => n.relatedId !== id));
  };

  const addKnowledge = (item: KnowledgeItem) => {
    setKnowledgeBase([...knowledgeBase, item]);
    postData('knowledge', item);
  };

  const addPendingQuestion = (q: string) => {
    const newQ: PendingQuestion = {
      id: Date.now().toString(),
      question: q,
      date: new Date().toISOString()
    };
    if (!pendingQuestions.some(existing => existing.question === q)) {
      setPendingQuestions(prev => [...prev, newQ]);
      // Add Notification
      const notif: Notification = {
        id: Date.now().toString(),
        type: 'question',
        content: `New AI Question: ${q.substring(0, 30)}...`,
        date: new Date().toLocaleTimeString(),
        read: false,
        relatedId: newQ.id
      };
      setNotifications(prev => [notif, ...prev]);
      postData('notifications', notif);
    }
  };

  const resolvePendingQuestion = (id: string) => {
    setPendingQuestions(prev => prev.filter(q => q.id !== id));
    setNotifications(prev => prev.filter(n => n.relatedId !== id));
    deleteData('notifications', id); // Assuming notification ID matches related ID logic or handle separately
  };

  const markNotificationAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await fetch(`${API_URL}/notifications/${id}/read`, { method: 'PUT' });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    deleteData('notifications', id);
  };

  const incrementVisits = async () => {
    try {
      const res = await fetch(`${API_URL}/visits/increment`, { method: 'POST' });
      const data = await res.json();
      if (typeof data.totalVisits === 'number') setTotalVisits(data.totalVisits);
    } catch (e) {
      setTotalVisits(prev => prev + 1);
    }
  };

  // Update HTML dir and class for dark mode
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Apply Primary Color Variable
  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', settings.primaryColorRGB);
  }, [settings.primaryColorRGB]);

  return (
    <AppContext.Provider value={{
      language, toggleLanguage, darkMode, toggleDarkMode,
      isAuthenticated, login, logout,
      settings, socialLinks, languagesList, skills, projects, certifications, educationList, experienceCategories, experienceItems,
      blogs, testimonials, knowledgeBase, pendingQuestions, notifications, totalVisits,
      updateSettings, updateSocialLinks, updateLanguagesList, updateSkills, updateCertifications, updateProjects,
      addEducation, deleteEducation, updateEducation, updateExperienceCategories, updateExperienceItems,
      addBlog, updateBlog, deleteBlog, incrementBlogViews,
      addTestimonial, approveTestimonial, deleteTestimonial,
      addKnowledge, addPendingQuestion, resolvePendingQuestion,
      markNotificationAsRead, deleteNotification,
      incrementVisits
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};