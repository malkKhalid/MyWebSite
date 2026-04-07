
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, FileText, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, projects } = useApp();
  const project = projects.find(p => p.id === id);
  const [showPdf, setShowPdf] = useState(false);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <Link to="/projects" className="text-maroon hover:underline">Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/projects" className="inline-flex items-center gap-2 text-gray-500 hover:text-maroon mb-8 transition-colors">
        <ArrowLeft className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
        {language === 'ar' ? 'عودة للمشاريع' : 'Back to Projects'}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Images */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
        >
            {/* Main Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
                <img src={project.mainImage} alt="Main" className="w-full h-auto object-cover" />
            </div>

            {/* Gallery (if exists) */}
            {project.galleryImages && project.galleryImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                    {project.galleryImages.map((img, idx) => (
                        <div key={idx} className="rounded-xl overflow-hidden shadow-sm h-32">
                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                        </div>
                    ))}
                </div>
            )}
        </motion.div>

        {/* Right Column: Info & PDF Action */}
        <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="space-y-8"
        >
            <div>
                <h1 className="text-4xl font-bold text-anthracite dark:text-white mb-4">
                    {language === 'ar' ? project.titleAr : project.titleEn}
                </h1>
                <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, idx) => (
                        <span key={idx} className="bg-maroon/5 text-maroon px-3 py-1 rounded-full text-sm font-mono border border-maroon/10">
                            #{tag}
                        </span>
                    ))}
                </div>
                
                {/* Description */}
                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p className="text-lg font-medium mb-4">{language === 'ar' ? project.descAr : project.descEn}</p>
                    <hr className="my-6 border-gray-200 dark:border-gray-700" />
                    <p className="whitespace-pre-line">
                        {language === 'ar' ? (project.longDescAr || project.descAr) : (project.longDescEn || project.descEn)}
                    </p>
                </div>
            </div>

            {/* Preview Button */}
            {project.pdfUrl && (
                <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={() => setShowPdf(true)}
                        className="w-full bg-maroon text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-maroon/90 transition-all shadow-lg shadow-maroon/20 text-lg"
                    >
                        <Eye className="w-6 h-6" />
                        {language === 'ar' ? 'معاينة ملف المشروع (PDF)' : 'Preview Project File (PDF)'}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-2">
                        {language === 'ar' ? 'اضغط لعرض كافة صفحات المشروع' : 'Click to view all project pages'}
                    </p>
                </div>
            )}
        </motion.div>
      </div>

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {showPdf && project.pdfUrl && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setShowPdf(false)}
            >
                <motion.div 
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    className="bg-white dark:bg-gray-800 w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden flex flex-col relative"
                    onClick={e => e.stopPropagation()}
                >
                     {/* Header */}
                    <div className="bg-maroon text-white p-4 flex justify-between items-center shadow-md z-10">
                         <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            <span className="font-bold">{language === 'ar' ? 'معاينة: ' : 'Preview: '}{language === 'ar' ? project.titleAr : project.titleEn}</span>
                         </div>
                         <button onClick={() => setShowPdf(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                             <X className="w-6 h-6" />
                         </button>
                    </div>

                    {/* PDF Content */}
                    <div className="flex-1 bg-gray-100 relative">
                        <iframe 
                            src={`${project.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                            className="w-full h-full"
                            title="PDF Preview"
                        />
                         {/* Overlay to intercept clicks if we want to prevent direct interaction, but usually specific iframe config is enough */}
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetails;
