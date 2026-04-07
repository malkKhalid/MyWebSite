import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Blog: React.FC = () => {
  const { language, blogs } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-anthracite dark:text-white mb-4">
          {language === 'ar' ? 'المدونة التقنية' : 'Tech Blog'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {language === 'ar' 
            ? 'أفكار حول الأمن السيبراني، الذكاء الاصطناعي، ومستقبل الدفاع الرقمي.' 
            : 'Thoughts on Cybersecurity, AI, and the future of digital defense.'}
        </p>
      </motion.div>

      <div className="space-y-12">
        {blogs.map((blog, idx) => (
          <motion.article 
            key={blog.id}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-maroon/30 transition-colors group"
          >
            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4 font-mono">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center gap-2 text-lavender font-bold">
                <Eye className="w-4 h-4" />
                <span>{blog.views} {language === 'ar' ? 'مشاهدة' : 'Views'}</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-maroon mb-4 group-hover:underline decoration-2 underline-offset-4">
              <Link to={`/blog/${blog.id}`}>
                 {language === 'ar' ? blog.titleAr : blog.titleEn}
              </Link>
            </h2>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              {language === 'ar' ? blog.excerptAr : blog.excerptEn}
            </p>

            <Link 
              to={`/blog/${blog.id}`}
              className="text-sm font-bold uppercase tracking-widest text-anthracite dark:text-white hover:text-maroon transition-colors"
            >
              {language === 'ar' ? 'قراءة المزيد' : 'Read Full Article'}
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default Blog;