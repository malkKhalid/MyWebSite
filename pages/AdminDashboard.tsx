
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Brain, ThumbsUp, Plus, Trash2, HelpCircle, Layout, Share2, Languages, Briefcase, Award, Save, Palette, FileText, Upload, Image as ImageIcon, BookOpen, Bell, Check, X, GraduationCap, Edit } from 'lucide-react';
import { AppSettings, Skill, SocialLink, LanguageItem, Certification, Project, BlogPost, EducationItem, ExperienceCategory, ExperienceItem } from '../types';
import ImageCropper from '../components/ImageCropper';

const AdminDashboard: React.FC = () => {
    const {
        logout, language,
        settings, updateSettings,
        socialLinks, updateSocialLinks,
        skills, updateSkills,
        certifications, updateCertifications,
        languagesList, updateLanguagesList,
        projects, updateProjects,
        blogs, addBlog, updateBlog, deleteBlog,
        knowledgeBase, addKnowledge,
        educationList, addEducation, deleteEducation, updateEducation,
        notifications, markNotificationAsRead, deleteNotification,
        testimonials, approveTestimonial, deleteTestimonial,
        resolvePendingQuestion,
        experienceCategories, updateExperienceCategories,
        experienceItems, updateExperienceItems
    } = useApp();

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'settings' | 'notifications' | 'socials' | 'languages' | 'services' | 'projects' | 'certs' | 'education' | 'blog' | 'ai' | 'reviews' | 'experience'>('notifications');

    // Local state for forms
    const [tempSettings, setTempSettings] = useState<AppSettings>(settings);

    // Keep the form in sync with the latest saved settings (fixes fields being reset when data loads asynchronously)
    useEffect(() => {
        setTempSettings(settings);
    }, [settings]);
    const [newSocial, setNewSocial] = useState({ platform: 'website', url: '', customIcon: '' });
    const [newSkill, setNewSkill] = useState<Partial<Skill>>({ iconName: 'Shield' });
    const [newLang, setNewLang] = useState<Partial<LanguageItem>>({ percentage: 50 });
    const [newCert, setNewCert] = useState<Partial<Certification>>({});
    const [newEdu, setNewEdu] = useState<Partial<EducationItem>>({});
    const [newProject, setNewProject] = useState<Partial<Project>>({ tags: [], galleryImages: [] });
    const [newBlog, setNewBlog] = useState<Partial<BlogPost>>({ views: 40 });
    const [tagsInput, setTagsInput] = useState('');

    // AI form
    const [newKnowledge, setNewKnowledge] = useState({ q: '', a: '' });

    // Experience State
    const [newExpCat, setNewExpCat] = useState<Partial<ExperienceCategory>>({});
    const [newExpItem, setNewExpItem] = useState<Partial<ExperienceItem>>({});
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    // Image Cropper State
    const [cropperOpen, setCropperOpen] = useState(false);
    const [cropperImage, setCropperImage] = useState<string>('');
    const [cropperCallback, setCropperCallback] = useState<(base64: string) => void>(() => { });
    const [cropperAspect, setCropperAspect] = useState(1);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSaveSettings = () => {
        updateSettings(tempSettings);
        document.documentElement.style.setProperty('--color-primary', tempSettings.primaryColorRGB);
        alert('Settings Saved Successfully!');
    };

    const handleAddSocial = () => {
        if (newSocial.url) {
            if ((newSocial as any).id) {
                updateSocialLinks(socialLinks.map(l => l.id === (newSocial as any).id ? { ...l, ...newSocial } : l) as any);
                alert('Social Link Updated!');
            } else {
                updateSocialLinks([...socialLinks, {
                    id: Date.now().toString(),
                    platform: newSocial.platform as any,
                    url: newSocial.url,
                    customIcon: newSocial.customIcon,
                    isActive: true
                }]);
                alert('Social Link Added Successfully!');
            }
            setNewSocial({ platform: 'website', url: '', customIcon: '' });
        }
    };

    const detectPlatform = (url: string) => {
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes('facebook.com')) return 'facebook';
        if (lowerUrl.includes('linkedin.com')) return 'linkedin';
        if (lowerUrl.includes('instagram.com')) return 'instagram';
        if (lowerUrl.includes('wa.me') || lowerUrl.includes('whatsapp.com')) return 'whatsapp';
        if (lowerUrl.includes('t.me') || lowerUrl.includes('telegram.org')) return 'telegram';
        if (lowerUrl.includes('github.com')) return 'github';
        if (lowerUrl.includes('mailto:')) return 'email';
        return 'website';
    };

    const handleDeleteSocial = (id: string) => {
        if (window.confirm('Are you sure?')) {
            updateSocialLinks(socialLinks.filter(l => l.id !== id));
            alert('Social Link Deleted!');
        }
    };

    const handleAddSkill = () => {
        if (newSkill.titleEn && newSkill.titleAr) {
            if (newSkill.id) {
                updateSkills(skills.map(s => s.id === newSkill.id ? { ...s, ...newSkill } as Skill : s));
                alert('Service Updated!');
            } else {
                updateSkills([...skills, {
                    id: Date.now().toString(),
                    iconName: newSkill.iconName || 'Shield',
                    titleEn: newSkill.titleEn!,
                    titleAr: newSkill.titleAr!,
                    descEn: newSkill.descEn || '',
                    descAr: newSkill.descAr || '',
                    detailsEn: newSkill.detailsEn,
                    detailsAr: newSkill.detailsAr,
                    price: newSkill.price,
                    image: newSkill.image
                }]);
                alert('Service Added Successfully!');
            }
            setNewSkill({ iconName: 'Shield' });
        }
    };

    const handleDeleteSkill = (id: string) => {
        if (window.confirm('Are you sure?')) {
            updateSkills(skills.filter(s => s.id !== id));
            alert('Service Deleted!');
        }
    };

    const handleAddLang = () => {
        if (newLang.nameEn) {
            if (newLang.id) {
                updateLanguagesList(languagesList.map(l => l.id === newLang.id ? { ...l, ...newLang } as LanguageItem : l));
                alert('Language Updated!');
            } else {
                updateLanguagesList([...languagesList, {
                    id: Date.now().toString(),
                    nameEn: newLang.nameEn || '',
                    nameAr: newLang.nameAr || '',
                    levelEn: newLang.levelEn || '',
                    levelAr: newLang.levelAr || '',
                    percentage: newLang.percentage || 50
                }]);
                alert('Language Added Successfully!');
            }
            setNewLang({ percentage: 50 });
        }
    };

    const handleDeleteLang = (id: string) => {
        if (window.confirm('Are you sure?')) {
            updateLanguagesList(languagesList.filter(l => l.id !== id));
            alert('Language Deleted!');
        }
    };

    const handleEditLang = (lang: LanguageItem) => {
        setNewLang(lang);
    };

    const handleAddCert = () => {
        if (newCert.name) {
            if (newCert.id) {
                updateCertifications(certifications.map(c => c.id === newCert.id ? { ...c, ...newCert } as Certification : c));
                alert('Certification Updated!');
            } else {
                updateCertifications([...certifications, {
                    id: Date.now().toString(),
                    name: newCert.name,
                    org: newCert.org || '',
                    date: newCert.date || '',
                    descEn: newCert.descEn,
                    descAr: newCert.descAr,
                    imageUrl: newCert.imageUrl,
                    issuerLogo: newCert.issuerLogo,
                    featured: newCert.featured || false,
                    orderNum: newCert.orderNum || 0
                }]);
                alert('Certification Added Successfully!');
            }
            setNewCert({});
        }
    };

    const handleDeleteCert = (id: string) => {
        if (window.confirm('Are you sure?')) {
            updateCertifications(certifications.filter(c => c.id !== id));
            alert('Certification Deleted!');
        }
    };

    const handleEditCert = (cert: Certification) => {
        setNewCert(cert);
    };

    const handleAddEdu = () => {
        if (newEdu.degreeEn) {
            if (newEdu.id) {
                updateEducation({
                    id: newEdu.id,
                    degreeEn: newEdu.degreeEn,
                    degreeAr: newEdu.degreeAr || newEdu.degreeEn,
                    institutionEn: newEdu.institutionEn || '',
                    institutionAr: newEdu.institutionAr || '',
                    date: newEdu.date || '',
                    gradeEn: newEdu.gradeEn,
                    gradeAr: newEdu.gradeAr,
                    institutionLogo: newEdu.institutionLogo,
                    descriptionEn: newEdu.descriptionEn,
                    descriptionAr: newEdu.descriptionAr,
                    degreeImage: newEdu.degreeImage,
                    orderNum: newEdu.orderNum || 0
                });
                alert('Education Updated Successfully!');
            } else {
                addEducation({
                    id: Date.now().toString(),
                    degreeEn: newEdu.degreeEn!,
                    degreeAr: newEdu.degreeAr || newEdu.degreeEn!,
                    institutionEn: newEdu.institutionEn || '',
                    institutionAr: newEdu.institutionAr || '',
                    date: newEdu.date || '',
                    gradeEn: newEdu.gradeEn,
                    gradeAr: newEdu.gradeAr,
                    institutionLogo: newEdu.institutionLogo,
                    descriptionEn: newEdu.descriptionEn,
                    descriptionAr: newEdu.descriptionAr,
                    degreeImage: newEdu.degreeImage,
                    orderNum: newEdu.orderNum || 0
                });
                alert('Education Added Successfully!');
            }
            setNewEdu({});
        }
    };

    const handleEditEdu = (edu: EducationItem) => {
        setNewEdu(edu);
    };

    const handleDeleteEdu = (id: string) => {
        if (window.confirm('Are you sure?')) {
            deleteEducation(id);
            alert('Education Deleted!');
        }
    };

    // Helper for File Upload to Base64 with Cropping
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void, aspect: number = 1) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setCropperImage(reader.result);
                    setCropperCallback(() => callback); // Wrap in function to avoid immediate execution issues
                    setCropperAspect(aspect);
                    setCropperOpen(true);
                }
            };
            reader.readAsDataURL(file);
        }
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    const handleTextFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target?.result === 'string') {
                    setTempSettings({ ...tempSettings, aiContext: e.target.result });
                    alert('Context File Loaded! Don\'t forget to click Save Context.');
                }
            };
            reader.readAsText(file);
        }
    };

    // Raw upload helper: converts file directly to base64 WITHOUT cropping
    const handleRawFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    callback(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    const handleAddProject = () => {
        if (newProject.titleEn) {
            const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t !== '');

            if (newProject.id) {
                updateProjects(projects.map(p => p.id === newProject.id ? { ...p, ...newProject, tags } as Project : p));
                alert('Project Updated!');
            } else {
                updateProjects([...projects, {
                    id: Date.now().toString(),
                    titleEn: newProject.titleEn!,
                    titleAr: newProject.titleAr || '',
                    descEn: newProject.descEn || '',
                    descAr: newProject.descAr || '',
                    longDescEn: newProject.longDescEn,
                    longDescAr: newProject.longDescAr,
                    mainImage: newProject.mainImage || '',
                    pdfUrl: newProject.pdfUrl,
                    tags: tags,
                    galleryImages: newProject.galleryImages
                }]);
                alert('Project Added Successfully!');
            }
            setNewProject({ tags: [], galleryImages: [] });
            setTagsInput('');
        }
    };

    const handleDeleteProject = (id: string) => {
        if (window.confirm('Are you sure?')) {
            updateProjects(projects.filter(p => p.id !== id));
            alert('Project Deleted!');
        }
    };

    const handleEditProject = (project: Project) => {
        setNewProject(project);
        setTagsInput(project.tags.join(', '));
    };

    const handleAddBlog = () => {
        if (newBlog.titleEn) {
            if (newBlog.id) {
                updateBlog(newBlog as BlogPost);
                alert('Blog Updated Successfully!');
            } else {
                addBlog({
                    id: Date.now().toString(),
                    titleEn: newBlog.titleEn || '',
                    titleAr: newBlog.titleAr || '',
                    excerptEn: newBlog.excerptEn || '',
                    excerptAr: newBlog.excerptAr || '',
                    contentEn: newBlog.contentEn || '',
                    contentAr: newBlog.contentAr || '',
                    date: new Date().toISOString().split('T')[0],
                    views: 40,
                    author: newBlog.author || 'Admin'
                });
                alert('Blog Published Successfully!');
            }
            setNewBlog({ views: 40 });
        }
    };

    const handleEditBlog = (blog: BlogPost) => {
        setNewBlog(blog);
    };

    const handleDeleteBlog = (id: string) => {
        if (window.confirm('Are you sure?')) {
            deleteBlog(id);
            alert('Blog Deleted!');
        }
    };

    // AI Logic
    const handleAddKnowledge = (e: React.FormEvent) => {
        e.preventDefault();
        if (newKnowledge.q && newKnowledge.a) {
            addKnowledge({
                id: Date.now().toString(),
                question: newKnowledge.q,
                answer: newKnowledge.a
            });
            setNewKnowledge({ q: '', a: '' });
            alert('Knowledge Added Successfully!');
        }
    };


    // Experience Handlers
    const handleAddExpCat = () => {
        if (newExpCat.titleEn) {
            if (newExpCat.id) {
                updateExperienceCategories(experienceCategories.map(c => c.id === newExpCat.id ? { ...c, ...newExpCat } as ExperienceCategory : c));
                alert('Category Updated!');
            } else {
                updateExperienceCategories([...experienceCategories, {
                    id: Date.now().toString(),
                    titleEn: newExpCat.titleEn!,
                    titleAr: newExpCat.titleAr || newExpCat.titleEn!,
                    orderNum: newExpCat.orderNum || 0
                }]);
                alert('Category Added!');
            }
            setNewExpCat({});
        }
    };

    const handleDeleteExpCat = (id: string) => {
        if (window.confirm('Delete category and all its items?')) {
            updateExperienceCategories(experienceCategories.filter(c => c.id !== id));
            updateExperienceItems(experienceItems.filter(i => i.categoryId !== id));
        }
    };

    const handleAddExpItem = () => {
        if (newExpItem.titleEn && newExpItem.categoryId) {
            if (newExpItem.id) {
                updateExperienceItems(experienceItems.map(i => i.id === newExpItem.id ? { ...i, ...newExpItem } as ExperienceItem : i));
                alert('Experience Updated!');
            } else {
                updateExperienceItems([...experienceItems, {
                    id: Date.now().toString(),
                    categoryId: newExpItem.categoryId!,
                    company: newExpItem.company || '',
                    titleEn: newExpItem.titleEn!,
                    titleAr: newExpItem.titleAr || '',
                    duration: newExpItem.duration || '',
                    country: newExpItem.country || '',
                    descEn: newExpItem.descEn || '',
                    descAr: newExpItem.descAr || '',
                    logo: newExpItem.logo
                }]);
                alert('Experience Added!');
            }
            setNewExpItem({});
        }
    };

    const handleDeleteExpItem = (id: string) => {
        if (window.confirm('Are you sure?')) {
            updateExperienceItems(experienceItems.filter(i => i.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col text-gray-900">
            {/* Admin Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="bg-maroon p-2 rounded text-white"><Layout className="w-5 h-5" /></div>
                    <h1 className="text-xl font-bold text-gray-800">Control Panel</h1>
                </div>
                <button onClick={handleLogout} className="text-sm bg-gray-800 text-white hover:bg-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto hidden md:block">
                    <nav className="p-4 space-y-1">
                        {[
                            { id: 'notifications', icon: Bell, label: 'Notifications' },
                            { id: 'settings', icon: Palette, label: 'General Settings' },
                            { id: 'education', icon: GraduationCap, label: 'Education' },
                            { id: 'experience', icon: Briefcase, label: 'Experience' },
                            { id: 'projects', icon: Layout, label: 'Projects & PDF' },
                            { id: 'services', icon: Briefcase, label: 'Services & Skills' },
                            { id: 'certs', icon: Award, label: 'Certifications' },
                            { id: 'blog', icon: BookOpen, label: 'Blog Posts' },
                            { id: 'languages', icon: Languages, label: 'Languages' },
                            { id: 'socials', icon: Share2, label: 'Social Links' },
                            { id: 'reviews', icon: ThumbsUp, label: 'Testimonials' },
                            { id: 'ai', icon: Brain, label: 'AI & Training' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id ? 'bg-maroon/10 text-maroon' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <item.icon className="w-5 h-5" />
                                <div className="flex-1 text-left">{item.label}</div>
                                {item.id === 'notifications' && notifications.filter(n => !n.read).length > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{notifications.filter(n => !n.read).length}</span>
                                )}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto">

                        {/* NOTIFICATIONS TAB */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900">Notification Center</h2>
                                    <span className="bg-gray-100 px-3 py-1 rounded text-sm">{notifications.length} Total</span>
                                </div>

                                <div className="space-y-4">
                                    {notifications.length === 0 && <p className="text-gray-500 italic">No notifications.</p>}
                                    {notifications.map(n => {
                                        const relatedReview = n.type === 'review' ? testimonials.find(t => t.id === n.relatedId) : null;
                                        return (
                                            <div key={n.id} className={`p-4 rounded-lg border flex gap-4 ${n.read ? 'bg-gray-50 border-gray-200' : 'bg-white border-maroon/30 shadow-sm'}`}>
                                                <div className={`mt-1 p-2 rounded-full ${n.type === 'question' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                                    {n.type === 'question' ? <HelpCircle className="w-5 h-5" /> : <ThumbsUp className="w-5 h-5" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <h4 className="font-bold text-gray-800 capitalize">{n.type} Alert</h4>
                                                        <span className="text-xs text-gray-400">{n.date}</span>
                                                    </div>
                                                    <p className="text-gray-600 my-1">{n.content}</p>

                                                    {/* Expanded Details for Reviews */}
                                                    {n.type === 'review' && relatedReview && (
                                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-2 text-sm">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                                                <p><strong>Name (EN):</strong> {relatedReview.nameEn}</p>
                                                                <p><strong>Name (AR):</strong> {relatedReview.nameAr}</p>
                                                                <p><strong>Title (EN):</strong> {relatedReview.titleEn}</p>
                                                                <p><strong>Title (AR):</strong> {relatedReview.titleAr}</p>
                                                                <p><strong>Company (EN):</strong> {relatedReview.companyEn}</p>
                                                                <p><strong>Company (AR):</strong> {relatedReview.companyAr}</p>
                                                                <p><strong>Country (EN):</strong> {relatedReview.countryEn}</p>
                                                                <p><strong>Country (AR):</strong> {relatedReview.countryAr}</p>
                                                            </div>
                                                            <p className="mt-1"><strong>LinkedIn:</strong> <a href={relatedReview.linkedin} target="_blank" className="text-blue-500 underline">{relatedReview.linkedin}</a></p>
                                                            <hr className="my-2" />
                                                            <p className="mt-1 font-bold">Feedback (EN):</p>
                                                            <p className="text-gray-600 mb-2">{relatedReview.textEn}</p>
                                                            <p className="mt-1 font-bold">Feedback (AR):</p>
                                                            <p className="text-gray-600">{relatedReview.textAr}</p>
                                                        </div>
                                                    )}

                                                    <div className="flex gap-2 mt-3">
                                                        {n.type === 'review' && (
                                                            <button onClick={() => { approveTestimonial(n.relatedId!); alert('Review Approved!'); }} className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">Approve Review</button>
                                                        )}
                                                        {n.type === 'question' && (
                                                            <button onClick={() => { resolvePendingQuestion(n.relatedId!); alert('Question Resolved!'); }} className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">Resolve</button>
                                                        )}
                                                        {!n.read && <button onClick={() => markNotificationAsRead(n.id)} className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded">Mark Read</button>}
                                                        <button onClick={() => deleteNotification(n.id)} className="px-3 py-1 text-red-500 hover:bg-red-50 text-xs rounded">Dismiss</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* SETTINGS TAB */}
                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900">General Settings</h2>
                                    <button onClick={handleSaveSettings} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700">
                                        <Save className="w-4 h-4" /> Save Changes
                                    </button>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                                    <h3 className="font-bold border-b pb-2 text-gray-800">Site Identity</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Site Name (EN)</label>
                                            <input value={tempSettings.siteNameEn} onChange={e => setTempSettings({ ...tempSettings, siteNameEn: e.target.value })} className="w-full border p-2 rounded bg-white text-gray-900" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Site Name (AR)</label>
                                            <input value={tempSettings.siteNameAr} onChange={e => setTempSettings({ ...tempSettings, siteNameAr: e.target.value })} className="w-full border p-2 rounded text-right bg-white text-gray-900" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Full Name (EN)</label>
                                            <input value={tempSettings.fullNameEn || ''} onChange={e => setTempSettings({ ...tempSettings, fullNameEn: e.target.value })} className="w-full border p-2 rounded bg-white text-gray-900" placeholder="e.g. Eng. Malk Khalid All Banna" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Full Name (AR)</label>
                                            <input value={tempSettings.fullNameAr || ''} onChange={e => setTempSettings({ ...tempSettings, fullNameAr: e.target.value })} className="w-full border p-2 rounded text-right bg-white text-gray-900" placeholder="مثال: م. ملك خالد البنا" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Site Subtitle (EN)</label>
                                            <input value={tempSettings.siteSubtitleEn || ''} onChange={e => setTempSettings({ ...tempSettings, siteSubtitleEn: e.target.value })} className="w-full border p-2 rounded bg-white text-gray-900" placeholder="e.g. CYBER SECURITY" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Site Subtitle (AR)</label>
                                            <input value={tempSettings.siteSubtitleAr || ''} onChange={e => setTempSettings({ ...tempSettings, siteSubtitleAr: e.target.value })} className="w-full border p-2 rounded text-right bg-white text-gray-900" placeholder="مثال: الأمن السيبراني" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Hero Title (EN) - under your name</label>
                                            <input value={tempSettings.heroTitleEn || ''} onChange={e => setTempSettings({ ...tempSettings, heroTitleEn: e.target.value })} className="w-full border p-2 rounded bg-white text-gray-900" placeholder="e.g. Security with Elegance" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Hero Title (AR) - تحت الاسم</label>
                                            <input value={tempSettings.heroTitleAr || ''} onChange={e => setTempSettings({ ...tempSettings, heroTitleAr: e.target.value })} className="w-full border p-2 rounded text-right bg-white text-gray-900" placeholder="مثال: الأمان بلمسة من الأناقة" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Hero Subtitle (EN)</label>
                                            <textarea value={tempSettings.heroSubtitleEn || ''} onChange={e => setTempSettings({ ...tempSettings, heroSubtitleEn: e.target.value })} className="w-full border p-2 rounded bg-white text-gray-900 h-20" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Hero Subtitle (AR)</label>
                                            <textarea value={tempSettings.heroSubtitleAr || ''} onChange={e => setTempSettings({ ...tempSettings, heroSubtitleAr: e.target.value })} className="w-full border p-2 rounded text-right bg-white text-gray-900 h-20" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Profile Image</label>
                                            <div className="flex items-center gap-2">
                                                <label className="cursor-pointer bg-gray-100 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-200 flex items-center gap-2 flex-1">
                                                    <Upload className="w-4 h-4" /> Upload Profile
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (base64) => setTempSettings({ ...tempSettings, profileImage: base64 }), 3 / 4)} />
                                                </label>
                                                {tempSettings.profileImage && <img src={tempSettings.profileImage} className="w-10 h-10 rounded-full object-cover border" />}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Site Logo</label>
                                            <div className="flex items-center gap-2">
                                                <label className="cursor-pointer bg-gray-100 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-200 flex items-center gap-2 flex-1">
                                                    <Upload className="w-4 h-4" /> Upload Logo
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (base64) => setTempSettings({ ...tempSettings, logoImage: base64 }))} />
                                                </label>
                                                {tempSettings.logoImage && <img src={tempSettings.logoImage} className="w-10 h-10 object-contain border rounded bg-gray-50" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                                    <h3 className="font-bold border-b pb-2 text-gray-800">Theme & Contact</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Primary Color (RGB)</label>
                                            <div className="flex gap-2">
                                                <input
                                                    value={tempSettings.primaryColorRGB}
                                                    onChange={e => setTempSettings({ ...tempSettings, primaryColorRGB: e.target.value })}
                                                    className="w-full border p-2 rounded bg-white text-gray-900"
                                                    placeholder="e.g. 148 16 55"
                                                />
                                                <div className="w-10 h-10 rounded border" style={{ backgroundColor: `rgb(${tempSettings.primaryColorRGB})` }}></div>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">Format: R G B (e.g., 255 0 0 for red)</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">WhatsApp Number</label>
                                            <input value={tempSettings.contactPhone} onChange={e => setTempSettings({ ...tempSettings, contactPhone: e.target.value })} className="w-full border p-2 rounded bg-white text-gray-900" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">Copyright Owner Name</label>
                                        <input
                                            value={tempSettings.copyrightOwnerName || ''}
                                            onChange={e => setTempSettings({ ...tempSettings, copyrightOwnerName: e.target.value })}
                                            className="w-full border p-2 rounded bg-white text-gray-900"
                                            placeholder="e.g. Malek Albanna"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">This name will appear in the footer copyright notice</p>
                                    </div>

                                    <div className="col-span-1 md:col-span-2 border-t pt-4 mt-4">
                                        <h4 className="font-bold text-gray-700 mb-2">About Me Section</h4>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-500 mb-1">About Me (EN)</label>
                                                <textarea
                                                    value={tempSettings.aboutTextEn}
                                                    onChange={e => setTempSettings({ ...tempSettings, aboutTextEn: e.target.value })}
                                                    className="w-full border p-2 rounded bg-white text-gray-900 h-24"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-500 mb-1">About Me (AR)</label>
                                                <textarea
                                                    value={tempSettings.aboutTextAr}
                                                    onChange={e => setTempSettings({ ...tempSettings, aboutTextAr: e.target.value })}
                                                    className="w-full border p-2 rounded text-right bg-white text-gray-900 h-24"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* EDUCATION TAB */}
                        {activeTab === 'education' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Education Management</h2>

                                {/* Add/Edit Form */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <h3 className="font-bold border-b pb-2 text-gray-800 mb-4">{(newEdu as any).id ? 'Edit' : 'Add New'} Education</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Degree (EN)</label>
                                            <input className="w-full border p-2 rounded bg-white text-gray-900" value={newEdu.degreeEn || ''} onChange={e => setNewEdu({ ...newEdu, degreeEn: e.target.value })} placeholder="e.g. Bachelor of Science" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Degree (AR)</label>
                                            <input className="w-full border p-2 rounded bg-white text-gray-900 text-right" value={newEdu.degreeAr || ''} onChange={e => setNewEdu({ ...newEdu, degreeAr: e.target.value })} placeholder="مثال: بكالوريوس ..." />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Institution (EN)</label>
                                            <input className="w-full border p-2 rounded bg-white text-gray-900" value={newEdu.institutionEn || ''} onChange={e => setNewEdu({ ...newEdu, institutionEn: e.target.value })} placeholder="University Name" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Institution (AR)</label>
                                            <input className="w-full border p-2 rounded bg-white text-gray-900 text-right" value={newEdu.institutionAr || ''} onChange={e => setNewEdu({ ...newEdu, institutionAr: e.target.value })} placeholder="اسم الجامعة" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Date/Year</label>
                                            <input className="w-full border p-2 rounded bg-white text-gray-900" value={newEdu.date || ''} onChange={e => setNewEdu({ ...newEdu, date: e.target.value })} placeholder="2020 - 2024" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Grade (EN)</label>
                                            <input className="w-full border p-2 rounded bg-white text-gray-900" value={newEdu.gradeEn || ''} onChange={e => setNewEdu({ ...newEdu, gradeEn: e.target.value })} placeholder="GPA: 3.8/4" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Grade (AR)</label>
                                            <input className="w-full border p-2 rounded bg-white text-gray-900 text-right" value={newEdu.gradeAr || ''} onChange={e => setNewEdu({ ...newEdu, gradeAr: e.target.value })} placeholder="المعدل: 3.8/4" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Description (EN)</label>
                                            <textarea className="w-full border p-2 rounded bg-white text-gray-900 h-24" value={newEdu.descriptionEn || ''} onChange={e => setNewEdu({ ...newEdu, descriptionEn: e.target.value })} placeholder="Brief summary..." />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Description (AR)</label>
                                            <textarea className="w-full border p-2 rounded bg-white text-gray-900 h-24 text-right" value={newEdu.descriptionAr || ''} onChange={e => setNewEdu({ ...newEdu, descriptionAr: e.target.value })} placeholder="وصف مختصر..." />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Institution Logo</label>
                                            <div className="flex items-center gap-2">
                                                <label className="cursor-pointer bg-gray-100 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-200 flex items-center gap-2 flex-1 justify-center">
                                                    <Upload className="w-4 h-4" /> Upload Logo
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (base64) => setNewEdu(prev => ({ ...prev, institutionLogo: base64 })))} />
                                                </label>
                                                {newEdu.institutionLogo && <img src={newEdu.institutionLogo} className="w-10 h-10 object-contain border rounded bg-white" />}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-500 mb-1">Degree Certificate</label>
                                            <div className="flex items-center gap-2">
                                                <label className="cursor-pointer bg-gray-100 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-200 flex items-center gap-2 flex-1 justify-center">
                                                    <Upload className="w-4 h-4" /> Upload Certificate
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleRawFileUpload(e, (base64) => setNewEdu(prev => ({ ...prev, degreeImage: base64 })))} />
                                                </label>
                                                {newEdu.degreeImage && <img src={newEdu.degreeImage} className="w-10 h-10 object-contain border rounded" />}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <label className="text-sm font-bold text-gray-700">Display Order:</label>
                                            <input type="number" className="border p-2 rounded bg-white text-gray-900 w-24" value={newEdu.orderNum || 0} onChange={e => setNewEdu({ ...newEdu, orderNum: parseInt(e.target.value) || 0 })} />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        {(newEdu as any).id && <button onClick={() => setNewEdu({})} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>}
                                        <button onClick={handleAddEdu} className="bg-maroon text-white px-6 py-2 rounded hover:bg-pink-700 transition-colors">
                                            {(newEdu as any).id ? 'Update Education' : 'Add Education'}
                                        </button>
                                    </div>
                                </div>

                                {/* List of Education Items */}
                                <div className="space-y-4">
                                    {[...educationList].sort((a,b) => (a.orderNum||0) - (b.orderNum||0)).map(edu => (
                                        <div key={edu.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                                            <div className="flex items-center gap-4 w-full md:w-auto">
                                                <div className="w-12 h-12 bg-gray-50 rounded-lg p-2 border flex items-center justify-center shrink-0">
                                                    {edu.institutionLogo ? (
                                                        <img src={edu.institutionLogo} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <GraduationCap className="w-6 h-6 text-gray-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{edu.degreeEn} <span className="text-xs text-maroon ml-2">Order: {edu.orderNum || 0}</span></h4>
                                                    <p className="text-sm text-gray-500">{edu.institutionEn} • {edu.date}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button onClick={() => handleEditEdu(edu)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDeleteEdu(edu.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {educationList.length === 0 && (
                                        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                                            <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p>No education history added yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* SOCIALS TAB */}
                        {activeTab === 'socials' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Social Links</h2>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Platform</label>
                                            <select className="border p-2 rounded bg-white text-gray-900 w-full" value={newSocial.platform} onChange={e => setNewSocial({ ...newSocial, platform: e.target.value })}>
                                                <option value="facebook">Facebook</option>
                                                <option value="linkedin">LinkedIn</option>
                                                <option value="instagram">Instagram</option>
                                                <option value="whatsapp">WhatsApp</option>
                                                <option value="email">Email</option>
                                                <option value="github">GitHub</option>
                                                <option value="website">Website</option>
                                                <option value="telegram">Telegram</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">URL</label>
                                            <input
                                                placeholder="https://..."
                                                className="border p-2 rounded w-full bg-white text-gray-900"
                                                value={newSocial.url}
                                                onChange={e => {
                                                    const url = e.target.value;
                                                    setNewSocial({ ...newSocial, url, platform: detectPlatform(url) });
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 cursor-pointer border border-dashed border-gray-300 p-3 rounded">
                                            <ImageIcon className="w-4 h-4" /> Upload Custom Icon (Optional)
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, (base64) => setNewSocial({ ...newSocial, customIcon: base64 }))}
                                                className="hidden"
                                            />
                                        </label>
                                        {newSocial.customIcon && <p className="text-xs text-green-600">Custom Icon Loaded!</p>}
                                    </div>

                                    <button onClick={handleAddSocial} className="bg-maroon text-white px-4 py-2 rounded">{(newSocial as any).id ? 'Update' : 'Add'} Link</button>
                                </div>
                                <div className="space-y-2">
                                    {socialLinks.map(link => (
                                        <div key={link.id} className="bg-white p-4 border rounded-lg flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                {link.customIcon ? (
                                                    <img src={link.customIcon} alt="icon" className="w-6 h-6 object-contain" />
                                                ) : (
                                                    <span className="font-bold capitalize text-gray-900">{link.platform}</span>
                                                )}
                                                <span className="text-xs text-gray-500 truncate max-w-xs">{link.url}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setNewSocial(link as any)} className="text-blue-500 hover:bg-blue-50 p-2 rounded"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => handleDeleteSocial(link.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* AI & REVIEWS */}
                        {activeTab === 'ai' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900">AI Assistant Training</h2>
                                    <button onClick={handleSaveSettings} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700">
                                        <Save className="w-4 h-4" /> Save Context
                                    </button>
                                </div>

                                {/* File Upload Context */}
                                <div className="bg-white p-6 rounded-xl border mb-6">
                                    <h3 className="font-bold text-gray-800 mb-2">Primary Context Source</h3>
                                    <p className="text-sm text-gray-500 mb-4">Upload a Resume or text file containing your experience. The AI will read this to answer questions about you.</p>

                                    <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                        <span className="text-gray-600 font-medium">Click to upload Resume/Bio (Text File)</span>
                                        <input type="file" accept=".txt,.md,.json" className="hidden" onChange={handleTextFileUpload} />
                                    </label>

                                    <div className="mt-4">
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Parsed Context Data (Editable):</label>
                                        <textarea
                                            className="w-full h-40 border p-2 rounded bg-gray-50 text-gray-900 text-xs font-mono"
                                            value={tempSettings.aiContext}
                                            onChange={e => setTempSettings({ ...tempSettings, aiContext: e.target.value })}
                                            placeholder="Uploaded text will appear here..."
                                        />
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border">
                                    <h3 className="font-bold text-gray-800 mb-4">Manual Q&A Overrides</h3>
                                    <form onSubmit={handleAddKnowledge} className="mb-6">
                                        <input className="w-full border p-2 rounded mb-2 bg-white text-gray-900" placeholder="Question" value={newKnowledge.q} onChange={e => setNewKnowledge({ ...newKnowledge, q: e.target.value })} />
                                        <textarea className="w-full border p-2 rounded mb-2 bg-white text-gray-900" placeholder="Answer" value={newKnowledge.a} onChange={e => setNewKnowledge({ ...newKnowledge, a: e.target.value })} />
                                        <button className="bg-maroon text-white px-4 py-2 rounded">Add Fact</button>
                                    </form>
                                    <div className="space-y-2">
                                        {knowledgeBase.map(k => (
                                            <div key={k.id} className="bg-white p-4 border rounded">
                                                <p className="font-bold text-sm text-gray-900">Q: {k.question}</p>
                                                <p className="text-gray-600 text-sm">A: {k.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* REVIEWS */}
                        {activeTab === 'reviews' && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-gray-900">Testimonials</h2>
                                <div className="space-y-4">
                                    {testimonials.map(t => (
                                        <div key={t.id} className={`bg-white p-4 border rounded flex justify-between items-start ${t.approved ? 'border-green-200' : 'border-yellow-200 bg-yellow-50'}`}>
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                                                    {t.image ? <img src={t.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{t.name[0]}</div>}
                                                </div>
                                                <div>
                                                    <div className="flex flex-wrap gap-2 mb-1">
                                                        <p className="font-bold text-gray-900">{t.nameEn} / {t.nameAr}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mb-1">
                                                        <strong>Title:</strong> {t.titleEn} / {t.titleAr}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mb-1">
                                                        <strong>Company:</strong> {t.companyEn} / {t.companyAr}
                                                    </p>
                                                    <p className="text-xs font-bold text-maroon uppercase tracking-wider mb-1">
                                                        {t.countryEn} / {t.countryAr}
                                                    </p>
                                                    <a href={t.linkedin} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline block mb-1">{t.linkedin}</a>
                                                    <div className="bg-gray-50 p-2 rounded border mt-2 text-xs">
                                                        <p className="mb-2"><span className="font-bold">EN:</span> {t.textEn}</p>
                                                        <p><span className="font-bold">AR:</span> {t.textAr}</p>
                                                    </div>
                                                    <div className="mt-2">
                                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${t.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {t.approved ? 'Live' : 'Pending Approval'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {!t.approved && <button onClick={() => { approveTestimonial(t.id); alert('Review Approved!'); }} className="text-green-600 border p-1 rounded hover:bg-green-50"><Check className="w-4 h-4" /></button>}
                                                <button onClick={() => { deleteTestimonial(t.id); alert('Review Deleted!'); }} className="text-red-600 border p-1 rounded hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* EXPERIENCE TAB */}
                        {activeTab === 'experience' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Experience & Fields</h2>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left Column: Categories */}
                                    <div className="lg:col-span-1 space-y-6">
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                            <h3 className="font-bold text-gray-800 mb-2">Manage Fields</h3>
                                            <div className="space-y-2 mb-4">
                                                <input placeholder="Field Name (EN)" className="w-full border p-2 rounded bg-white text-gray-900" value={newExpCat.titleEn || ''} onChange={e => setNewExpCat({ ...newExpCat, titleEn: e.target.value })} />
                                                <input placeholder="Field Name (AR)" className="w-full border p-2 rounded text-right bg-white text-gray-900" value={newExpCat.titleAr || ''} onChange={e => setNewExpCat({ ...newExpCat, titleAr: e.target.value })} />
                                                <div className="flex items-center gap-4 border p-2 rounded bg-gray-50">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Order:</label>
                                                    <input type="number" className="w-full border p-1 rounded bg-white text-gray-900" value={newExpCat.orderNum || 0} onChange={e => setNewExpCat({ ...newExpCat, orderNum: parseInt(e.target.value) || 0 })} />
                                                </div>
                                                <button onClick={handleAddExpCat} className="w-full bg-maroon text-white py-2 rounded">
                                                    {newExpCat.id ? 'Update Field' : 'Add Field'}
                                                </button>
                                                {newExpCat.id && <button onClick={() => setNewExpCat({})} className="w-full bg-gray-200 text-gray-700 py-2 rounded">Cancel</button>}
                                            </div>

                                            <div className="space-y-2">
                                                {[...experienceCategories].sort((a,b) => (a.orderNum||0) - (b.orderNum||0)).map(cat => (
                                                    <div
                                                        key={cat.id}
                                                        onClick={() => {
                                                            setSelectedCategoryId(cat.id);
                                                            setNewExpItem(prev => ({ ...prev, categoryId: cat.id }));
                                                        }}
                                                        className={`flex justify-between items-center p-2 rounded border cursor-pointer transition-colors ${selectedCategoryId === cat.id ? 'bg-maroon/10 border-maroon' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                                                    >
                                                        <div>
                                                            <p className={`font-bold text-sm ${selectedCategoryId === cat.id ? 'text-maroon' : 'text-gray-900'}`}>{cat.titleEn} <span className="text-[10px] opacity-60">#{cat.orderNum || 0}</span></p>
                                                            <p className="text-xs text-gray-500">{cat.titleAr}</p>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <button onClick={(e) => { e.stopPropagation(); setNewExpCat(cat); }} className="text-blue-500 p-1"><Edit className="w-3 h-3" /></button>
                                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteExpCat(cat.id); }} className="text-red-500 p-1"><Trash2 className="w-3 h-3" /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => {
                                                        setSelectedCategoryId(null);
                                                        setNewExpItem(prev => ({ ...prev, categoryId: '' }));
                                                    }}
                                                    className={`w-full text-center text-xs py-2 rounded border ${!selectedCategoryId ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                                >
                                                    Show All Items
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Items */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">
                                                {newExpItem.id ? 'Edit Experience' : (selectedCategoryId ? `Add Experience to "${experienceCategories.find(c => c.id === selectedCategoryId)?.titleEn}"` : 'Add Experience')}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Field</label>
                                                    <select
                                                        className="w-full border p-2 rounded bg-white text-gray-900"
                                                        value={newExpItem.categoryId || ''}
                                                        onChange={e => setNewExpItem({ ...newExpItem, categoryId: e.target.value })}
                                                    >
                                                        <option value="">-- Select Field --</option>
                                                        {experienceCategories.map(c => <option key={c.id} value={c.id}>{c.titleEn}</option>)}
                                                    </select>
                                                </div>
                                                <input placeholder="Job Title (EN)" className="border p-2 rounded bg-white text-gray-900" value={newExpItem.titleEn || ''} onChange={e => setNewExpItem({ ...newExpItem, titleEn: e.target.value })} />
                                                <input placeholder="Job Title (AR)" className="border p-2 rounded text-right bg-white text-gray-900" value={newExpItem.titleAr || ''} onChange={e => setNewExpItem({ ...newExpItem, titleAr: e.target.value })} />
                                                <input placeholder="Company Name" className="border p-2 rounded bg-white text-gray-900" value={newExpItem.company || ''} onChange={e => setNewExpItem({ ...newExpItem, company: e.target.value })} />
                                                <input placeholder="Duration (e.g. 2020 - 2022)" className="border p-2 rounded bg-white text-gray-900" value={newExpItem.duration || ''} onChange={e => setNewExpItem({ ...newExpItem, duration: e.target.value })} />
                                                <input placeholder="Country" className="border p-2 rounded bg-white text-gray-900" value={newExpItem.country || ''} onChange={e => setNewExpItem({ ...newExpItem, country: e.target.value })} />

                                                <div className="flex items-center gap-2">
                                                    <label className="cursor-pointer bg-gray-100 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-200 flex items-center gap-2 flex-1">
                                                        <ImageIcon className="w-4 h-4" /> Company Logo
                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (base64) => setNewExpItem({ ...newExpItem, logo: base64 }))} />
                                                    </label>
                                                    {newExpItem.logo && <img src={newExpItem.logo} className="w-10 h-10 object-contain border rounded" />}
                                                </div>

                                                <textarea placeholder="Description (EN)" className="border p-2 rounded bg-white text-gray-900 md:col-span-2" value={newExpItem.descEn || ''} onChange={e => setNewExpItem({ ...newExpItem, descEn: e.target.value })} />
                                                <textarea placeholder="Description (AR)" className="border p-2 rounded text-right bg-white text-gray-900 md:col-span-2" value={newExpItem.descAr || ''} onChange={e => setNewExpItem({ ...newExpItem, descAr: e.target.value })} />
                                                
                                                <div className="flex items-center gap-4 md:col-span-2 border p-3 rounded bg-gray-50 border-gray-200">
                                                    <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                                                        <input type="checkbox" checked={!!newExpItem.featured} onChange={e => setNewExpItem({ ...newExpItem, featured: e.target.checked })} className="w-5 h-5 text-maroon rounded" />
                                                        Show on Homepage
                                                    </label>
                                                    <label className="flex items-center gap-2 font-bold text-gray-700 ml-6">
                                                        Order Position:
                                                        <input type="number" value={newExpItem.orderNum || 0} onChange={e => setNewExpItem({ ...newExpItem, orderNum: parseInt(e.target.value) || 0 })} className="border p-1 w-20 rounded text-center" />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={handleAddExpItem} className="bg-maroon text-white px-4 py-2 rounded">{newExpItem.id ? 'Update' : 'Add'} Experience</button>
                                                {newExpItem.id && <button onClick={() => setNewExpItem({})} className="bg-gray-200 text-gray-700 px-4 py-2 rounded">Cancel</button>}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {experienceItems.filter(i => !selectedCategoryId || i.categoryId === selectedCategoryId).sort((a,b) => (a.orderNum||0) - (b.orderNum||0)).map(item => {
                                                const cat = experienceCategories.find(c => c.id === item.categoryId);
                                                return (
                                                    <div key={item.id} className="bg-white p-4 border rounded-lg flex justify-between items-start">
                                                        <div className="flex gap-4">
                                                            {item.logo ? <img src={item.logo} className="w-12 h-12 object-contain rounded border" /> : <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center"><Briefcase className="w-6 h-6 text-gray-400" /></div>}
                                                            <div>
                                                                <h4 className="font-bold text-gray-900">
                                                                    {item.titleEn} <span className="text-gray-500 font-normal">at {item.company}</span>
                                                                    {item.featured && <span className="ml-2 inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] rounded-full uppercase tracking-wider font-bold">Featured - {item.orderNum || 0}</span>}
                                                                </h4>
                                                                <p className="text-xs text-maroon font-bold uppercase tracking-wider">{cat?.titleEn}</p>
                                                                <p className="text-sm text-gray-500">{item.duration} • {item.country}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => setNewExpItem(item)} className="text-blue-500 hover:bg-blue-50 p-2 rounded"><Edit className="w-4 h-4" /></button>
                                                            <button onClick={() => handleDeleteExpItem(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}



                        {/* CERTIFICATIONS TAB */}
                        {activeTab === 'certs' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                                    <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Add New Certification</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <input placeholder="Certification Name" className="border p-2 rounded bg-white text-gray-900" value={newCert.name || ''} onChange={e => setNewCert({ ...newCert, name: e.target.value })} />
                                        <input placeholder="Organization" className="border p-2 rounded bg-white text-gray-900" value={newCert.org || ''} onChange={e => setNewCert({ ...newCert, org: e.target.value })} />
                                        <input placeholder="Date (e.g. 2023)" className="border p-2 rounded bg-white text-gray-900" value={newCert.date || ''} onChange={e => setNewCert({ ...newCert, date: e.target.value })} />
                                        <div className="flex items-center gap-2">
                                            <label className="cursor-pointer bg-gray-100 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-200 flex items-center gap-2 flex-1">
                                                <ImageIcon className="w-4 h-4" /> Upload Certificate (Image)
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleRawFileUpload(e, (base64) => setNewCert({ ...newCert, imageUrl: base64 }))} />
                                            </label>
                                            {newCert.imageUrl && <img src={newCert.imageUrl} alt="cert preview" className="w-12 h-12 object-contain rounded border" />}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="cursor-pointer bg-gray-100 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-200 flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4" /> Issuer Logo
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleRawFileUpload(e, (base64) => setNewCert({ ...newCert, issuerLogo: base64 }))} />
                                            </label>
                                            {newCert.issuerLogo && <img src={newCert.issuerLogo} alt="preview" className="w-10 h-10 object-contain rounded border" />}
                                        </div>
                                        <textarea placeholder="Description (EN)" className="border p-2 rounded bg-white text-gray-900" value={newCert.descEn || ''} onChange={e => setNewCert({ ...newCert, descEn: e.target.value })} />
                                        <textarea placeholder="Description (AR)" className="border p-2 rounded text-right bg-white text-gray-900" value={newCert.descAr || ''} onChange={e => setNewCert({ ...newCert, descAr: e.target.value })} />

                                        <div className="flex items-center gap-4 md:col-span-2 border p-3 rounded bg-gray-50 border-gray-200">
                                            <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                                                <input type="checkbox" checked={!!newCert.featured} onChange={e => setNewCert({ ...newCert, featured: e.target.checked })} className="w-5 h-5 text-maroon rounded" />
                                                Show on Homepage
                                            </label>
                                            <label className="flex items-center gap-2 font-bold text-gray-700 ml-6">
                                                Order Position:
                                                <input type="number" value={newCert.orderNum || 0} onChange={e => setNewCert({ ...newCert, orderNum: parseInt(e.target.value) || 0 })} className="border p-1 w-20 rounded text-center" />
                                            </label>
                                        </div>
                                    </div>
                                    <button onClick={handleAddCert} className="bg-maroon text-white px-4 py-2 rounded">Add Certification</button>
                                </div>

                                <div className="space-y-2">
                                    {certifications.map(c => (
                                        <div key={c.id} className="bg-white p-4 border rounded-lg flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                {c.issuerLogo
                                                    ? <img src={c.issuerLogo} alt={c.org} className="w-12 h-12 object-contain rounded border bg-white p-1" />
                                                    : <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center"><Award className="w-6 h-6 text-gray-400" /></div>
                                                }
                                                <div>
                                                    <p className="font-bold text-gray-900">
                                                        {c.name}
                                                        {c.featured && <span className="ml-2 inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] rounded-full uppercase tracking-wider font-bold">Featured - {c.orderNum || 0}</span>}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{c.org} ({c.date})</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEditCert(c)} className="text-blue-500 hover:bg-blue-50 p-2 rounded"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => handleDeleteCert(c.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SERVICES TAB */}
                        {activeTab === 'services' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Services & Skills</h2>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                                    <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Add New Service</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <input placeholder="Title (EN)" className="border p-2 rounded bg-white text-gray-900" value={newSkill.titleEn || ''} onChange={e => setNewSkill({ ...newSkill, titleEn: e.target.value })} />
                                        <input placeholder="Title (AR)" className="border p-2 rounded text-right bg-white text-gray-900" value={newSkill.titleAr || ''} onChange={e => setNewSkill({ ...newSkill, titleAr: e.target.value })} />
                                        <input placeholder="Price (e.g. $500)" className="border p-2 rounded bg-white text-gray-900" value={newSkill.price || ''} onChange={e => setNewSkill({ ...newSkill, price: e.target.value })} />
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Icon</label>
                                            <div className="flex items-center gap-2">
                                                <select className="border p-2 rounded bg-white text-gray-900 flex-1" value={newSkill.iconName} onChange={e => setNewSkill({ ...newSkill, iconName: e.target.value })}>
                                                    <option value="Shield">Shield Icon</option>
                                                    <option value="Lock">Lock Icon</option>
                                                    <option value="Terminal">Terminal Icon</option>
                                                    <option value="Eye">Eye Icon</option>
                                                    <option value="Code">Code Icon</option>
                                                    <option value="Wifi">Wifi Icon</option>
                                                </select>
                                                <label className="cursor-pointer bg-gray-100 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-200 flex items-center gap-1 shrink-0" title="Upload Custom Icon">
                                                    <ImageIcon className="w-4 h-4" /> Upload
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleRawFileUpload(e, (base64) => setNewSkill({ ...newSkill, image: base64 }))} />
                                                </label>
                                            </div>
                                            {newSkill.image && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <img src={newSkill.image} alt="icon preview" className="w-10 h-10 object-contain rounded border bg-white" />
                                                    <button onClick={() => setNewSkill({ ...newSkill, image: '' })} className="text-red-500 text-xs font-bold hover:underline">Remove Custom Icon</button>
                                                </div>
                                            )}
                                        </div>
                                        <textarea placeholder="Description (EN)" className="border p-2 rounded bg-white text-gray-900" value={newSkill.descEn || ''} onChange={e => setNewSkill({ ...newSkill, descEn: e.target.value })} />
                                        <textarea placeholder="Description (AR)" className="border p-2 rounded text-right bg-white text-gray-900" value={newSkill.descAr || ''} onChange={e => setNewSkill({ ...newSkill, descAr: e.target.value })} />
                                        <textarea placeholder="Details (EN)" className="border p-2 rounded bg-white text-gray-900 md:col-span-2" value={newSkill.detailsEn || ''} onChange={e => setNewSkill({ ...newSkill, detailsEn: e.target.value })} />
                                        <textarea placeholder="Details (AR)" className="border p-2 rounded text-right bg-white text-gray-900 md:col-span-2" value={newSkill.detailsAr || ''} onChange={e => setNewSkill({ ...newSkill, detailsAr: e.target.value })} />
                                    </div>
                                    <button onClick={handleAddSkill} className="bg-maroon text-white px-4 py-2 rounded">Add Service</button>
                                </div>

                                <div className="space-y-2">
                                    {skills.map(s => (
                                        <div key={s.id} className="bg-white p-4 border rounded-lg flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                {s.image
                                                    ? <img src={s.image} alt="icon" className="w-10 h-10 object-contain rounded border bg-white p-1" />
                                                    : <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400"><ImageIcon className="w-5 h-5" /></div>
                                                }
                                                <div>
                                                    <p className="font-bold text-gray-900">{s.titleEn} / {s.titleAr}</p>
                                                    <p className="text-sm text-gray-500">{s.price}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setNewSkill(s)} className="text-blue-500 hover:bg-blue-50 p-2 rounded"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => handleDeleteSkill(s.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PROJECTS TAB */}
                        {activeTab === 'projects' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Projects & PDF</h2>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                                    <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Add New Project</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <input placeholder="Title (EN)" className="border p-2 rounded bg-white text-gray-900" value={newProject.titleEn || ''} onChange={e => setNewProject({ ...newProject, titleEn: e.target.value })} />
                                        <input placeholder="Title (AR)" className="border p-2 rounded text-right bg-white text-gray-900" value={newProject.titleAr || ''} onChange={e => setNewProject({ ...newProject, titleAr: e.target.value })} />

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Main Cover Image</label>
                                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (base64) => setNewProject({ ...newProject, mainImage: base64 }))} />
                                            {newProject.mainImage && <img src={newProject.mainImage} className="mt-2 h-20 rounded border" alt="preview" />}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Project PDF File</label>
                                            <input type="file" accept="application/pdf" onChange={(e) => handleFileUpload(e, (base64) => setNewProject({ ...newProject, pdfUrl: base64 }))} />
                                            {newProject.pdfUrl && <p className="text-xs text-green-600 mt-1">PDF Loaded</p>}
                                        </div>

                                        <textarea placeholder="Short Desc (EN)" className="border p-2 rounded bg-white text-gray-900" value={newProject.descEn || ''} onChange={e => setNewProject({ ...newProject, descEn: e.target.value })} />
                                        <textarea placeholder="Short Desc (AR)" className="border p-2 rounded text-right bg-white text-gray-900" value={newProject.descAr || ''} onChange={e => setNewProject({ ...newProject, descAr: e.target.value })} />

                                        <textarea placeholder="Long Desc (EN)" className="border p-2 rounded bg-white text-gray-900 md:col-span-2 h-24" value={newProject.longDescEn || ''} onChange={e => setNewProject({ ...newProject, longDescEn: e.target.value })} />
                                        <textarea placeholder="Long Desc (AR)" className="border p-2 rounded text-right bg-white text-gray-900 md:col-span-2 h-24" value={newProject.longDescAr || ''} onChange={e => setNewProject({ ...newProject, longDescAr: e.target.value })} />

                                        <input placeholder="Tags (comma separated)" className="border p-2 rounded bg-white text-gray-900 md:col-span-2" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />

                                        <div className="flex items-center gap-4 md:col-span-2 border p-3 rounded bg-gray-50 border-gray-200">
                                            <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                                                <input type="checkbox" checked={!!newProject.featured} onChange={e => setNewProject({ ...newProject, featured: e.target.checked })} className="w-5 h-5 text-maroon rounded" />
                                                Show on Homepage
                                            </label>
                                            <label className="flex items-center gap-2 font-bold text-gray-700 ml-6">
                                                Order Position:
                                                <input type="number" value={newProject.orderNum || 0} onChange={e => setNewProject({ ...newProject, orderNum: parseInt(e.target.value) || 0 })} className="border p-1 w-20 rounded text-center" />
                                            </label>
                                        </div>
                                    </div>
                                    <button onClick={handleAddProject} className="bg-maroon text-white px-4 py-2 rounded">Add Project</button>
                                </div>

                                <div className="space-y-2">
                                    {projects.map(p => (
                                        <div key={p.id} className="bg-white p-4 border rounded-lg flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                {p.mainImage && <img src={p.mainImage} className="w-12 h-12 object-cover rounded" alt="thumb" />}
                                                <div>
                                                    <p className="font-bold text-gray-900">
                                                        {p.titleEn}
                                                        {p.featured && <span className="ml-2 inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] rounded-full uppercase tracking-wider font-bold">Featured - {p.orderNum || 0}</span>}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{p.tags.join(', ')}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEditProject(p)} className="text-blue-500 hover:bg-blue-50 p-2 rounded"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => handleDeleteProject(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* BLOG TAB */}
                        {activeTab === 'blog' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                                    <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">{newBlog.id ? 'Edit Post' : 'Add New Post'}</h3>
                                    <div className="grid grid-cols-1 gap-4 mb-4">
                                        <input placeholder="Title (EN)" className="border p-2 rounded bg-white text-gray-900" value={newBlog.titleEn || ''} onChange={e => setNewBlog({ ...newBlog, titleEn: e.target.value })} />
                                        <input placeholder="Title (AR)" className="border p-2 rounded text-right bg-white text-gray-900" value={newBlog.titleAr || ''} onChange={e => setNewBlog({ ...newBlog, titleAr: e.target.value })} />

                                        <input placeholder="Author Name" className="border p-2 rounded bg-white text-gray-900" value={newBlog.author || ''} onChange={e => setNewBlog({ ...newBlog, author: e.target.value })} />

                                        <textarea placeholder="Excerpt (EN)" className="border p-2 rounded bg-white text-gray-900" value={newBlog.excerptEn || ''} onChange={e => setNewBlog({ ...newBlog, excerptEn: e.target.value })} />
                                        <textarea placeholder="Excerpt (AR)" className="border p-2 rounded text-right bg-white text-gray-900" value={newBlog.excerptAr || ''} onChange={e => setNewBlog({ ...newBlog, excerptAr: e.target.value })} />

                                        <textarea placeholder="Content (EN)" className="border p-2 rounded bg-white text-gray-900 h-40" value={newBlog.contentEn || ''} onChange={e => setNewBlog({ ...newBlog, contentEn: e.target.value })} />
                                        <textarea placeholder="Content (AR)" className="border p-2 rounded text-right bg-white text-gray-900 h-40" value={newBlog.contentAr || ''} onChange={e => setNewBlog({ ...newBlog, contentAr: e.target.value })} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={handleAddBlog} className="bg-maroon text-white px-4 py-2 rounded">{newBlog.id ? 'Update Post' : 'Publish Post'}</button>
                                        {newBlog.id && <button onClick={() => setNewBlog({ views: 40 })} className="bg-gray-200 text-gray-700 px-4 py-2 rounded">Cancel</button>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {blogs.map(b => (
                                        <div key={b.id} className="bg-white p-4 border rounded-lg flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-gray-900">{b.titleEn}</p>
                                                <p className="text-xs text-gray-500">Views: {b.views} • Author: {b.author}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEditBlog(b)} className="text-blue-500 hover:bg-blue-50 p-2 rounded"><FileText className="w-4 h-4" /></button>
                                                <button onClick={() => handleDeleteBlog(b.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* LANGUAGES TAB */}
                        {activeTab === 'languages' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Languages</h2>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <input placeholder="Language (EN)" className="border p-2 rounded bg-white text-gray-900" value={newLang.nameEn || ''} onChange={e => setNewLang({ ...newLang, nameEn: e.target.value })} />
                                        <input placeholder="Language (AR)" className="border p-2 rounded text-right bg-white text-gray-900" value={newLang.nameAr || ''} onChange={e => setNewLang({ ...newLang, nameAr: e.target.value })} />
                                        <input placeholder="Level (EN) e.g. Native" className="border p-2 rounded bg-white text-gray-900" value={newLang.levelEn || ''} onChange={e => setNewLang({ ...newLang, levelEn: e.target.value })} />
                                        <input placeholder="Level (AR) e.g. متقدم" className="border p-2 rounded text-right bg-white text-gray-900" value={newLang.levelAr || ''} onChange={e => setNewLang({ ...newLang, levelAr: e.target.value })} />
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Proficiency (%)</label>
                                            <input type="number" className="border p-2 rounded bg-white text-gray-900 w-full" value={newLang.percentage || 0} onChange={e => setNewLang({ ...newLang, percentage: parseInt(e.target.value) })} />
                                        </div>
                                    </div>
                                    <button onClick={handleAddLang} className="bg-maroon text-white px-4 py-2 rounded">Add Language</button>
                                </div>

                                <div className="space-y-2">
                                    {languagesList.map(l => (
                                        <div key={l.id} className="bg-white p-4 border rounded-lg flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-gray-900">{l.nameEn} ({l.levelEn})</p>
                                                <div className="w-24 bg-gray-200 h-1.5 rounded-full mt-1">
                                                    <div className="bg-maroon h-full rounded-full" style={{ width: `${l.percentage}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEditLang(l)} className="text-blue-500 hover:bg-blue-50 p-2 rounded"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => handleDeleteLang(l.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </main>
            </div >

            {/* Image Cropper Modal */}
            {cropperOpen && (
                <ImageCropper
                    imageSrc={cropperImage}
                    aspect={cropperAspect}
                    onCancel={() => setCropperOpen(false)}
                    onCropComplete={(croppedImage) => {
                        cropperCallback(croppedImage);
                        setCropperOpen(false);
                    }}
                />
            )}
        </div >
    );
};

export default AdminDashboard;