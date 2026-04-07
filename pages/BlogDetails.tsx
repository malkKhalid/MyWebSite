import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Calendar, Eye, User, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

const BlogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, blogs, incrementBlogViews } = useApp();
  const blog = blogs.find(b => b.id === id);

  useEffect(() => {
    if (blog) {
        incrementBlogViews(blog.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-center dark:text-white">
          <h2 className="text-2xl font-bold mb-4">{language === 'ar' ? 'المقال غير موجود' : 'Blog Post Not Found'}</h2>
          <Link to="/blog" className="text-maroon hover:underline">{language === 'ar' ? 'عودة للمدونة' : 'Back to Blog'}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
       <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-maroon mb-8 transition-colors">
        <ArrowLeft className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
        {language === 'ar' ? 'عودة للمدونة' : 'Back to Blog'}
      </Link>

      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-700"
      >
         <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 font-mono border-b border-gray-100 dark:border-gray-700 pb-6">
            <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-maroon" />
                <span>{blog.date}</span>
            </div>
            <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-maroon" />
                <span>{blog.views} {language === 'ar' ? 'مشاهدة' : 'Views'}</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
                <User className="w-4 h-4 text-maroon" />
                <span className="font-bold">{language === 'ar' ? 'بقلم:' : 'Written by:'} {blog.author}</span>
            </div>
         </div>

         <h1 className="text-3xl md:text-5xl font-bold text-anthracite dark:text-white mb-8 leading-tight">
             {language === 'ar' ? blog.titleAr : blog.titleEn}
         </h1>

         <div className="prose dark:prose-invert prose-lg max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
             {language === 'ar' ? blog.contentAr : blog.contentEn}
         </div>

         <div className="mt-12 pt-12 border-t border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-maroon text-white rounded-full flex items-center justify-center font-bold text-xl">
                     {blog.author.charAt(0)}
                 </div>
                 <div>
                     <p className="text-sm text-gray-400">{language === 'ar' ? 'كاتب المقال' : 'Article Author'}</p>
                     <p className="font-bold text-anthracite dark:text-white">{blog.author}</p>
                 </div>
             </div>
             
             <Link 
                to="/blog"
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-maroon hover:text-white rounded-xl transition-colors font-bold text-sm"
             >
                 {language === 'ar' ? 'قراءة المزيد من المقالات' : 'Read More Articles'}
             </Link>
         </div>

      </motion.article>
    </div>
  );
};

export default BlogDetails;
