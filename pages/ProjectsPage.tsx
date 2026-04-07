import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ProjectsPage: React.FC = () => {
  const { language, projects } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-anthracite dark:text-white mb-4">
          {language === 'ar' ? 'أعمالي ومشاريعي' : 'Projects & Portfolio'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {language === 'ar' 
            ? 'تصفح أحدث المشاريع التي قمت بتنفيذها بنجاح.' 
            : 'Browse through the successful projects I have delivered.'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...projects].sort((a,b) => (a.orderNum||0) - (b.orderNum||0)).map((project, idx) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
          >
            {/* Image Thumbnail */}
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
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.slice(0, 3).map((tag, tIdx) => (
                  <span key={tIdx} className="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>

              <Link 
                to={`/projects/${project.id}`}
                className="mt-auto w-full bg-gray-50 dark:bg-gray-700 hover:bg-maroon hover:text-white text-gray-700 dark:text-gray-200 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all text-sm"
              >
                {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                <ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;