

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award, CheckCircle, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Certification } from '../types';

const CertificationsPage: React.FC = () => {
  const { language, certifications } = useApp();
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-off-white dark:bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-anthracite dark:text-white mb-4">
          {language === 'ar' ? 'الشهادات المعتمدة' : 'Professional Certifications'}
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...certifications].sort((a,b) => (a.orderNum||0) - (b.orderNum||0)).map((cert, idx) => (
          <motion.div 
            key={cert.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedCert(cert)}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-maroon flex flex-col items-start hover:shadow-md transition-shadow cursor-pointer"
          >
             <div className="flex items-center gap-3 mb-3 w-full">
                {cert.issuerLogo
                  ? <img src={cert.issuerLogo} alt={cert.org} className="w-10 h-10 object-contain rounded border bg-white p-0.5 shrink-0" />
                  : <Award className="w-6 h-6 text-maroon shrink-0" />
                }
                <h3 className="font-bold text-lg text-gray-800 dark:text-white flex-1">{cert.name}</h3>
             </div>
             <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 w-full mb-2">
               <span className="font-semibold">{cert.org}</span>
               <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
               <span>{cert.date}</span>
             </div>
             <div className="mt-auto pt-3 flex items-center gap-1 text-xs text-green-600 font-bold">
               <CheckCircle className="w-3 h-3" />
               {language === 'ar' ? 'معتمدة وصالحة' : 'Verified & Active'}
             </div>
          </motion.div>
        ))}
      </div>

       {/* Certification Modal */}
      <AnimatePresence>
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
                    <div className="flex flex-col items-center text-center mb-6 pt-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 p-2 shadow-sm">
                        {selectedCert.issuerLogo 
                          ? <img src={selectedCert.issuerLogo} alt={selectedCert.org} className="w-full h-full object-contain" />
                          : <Award className="w-8 h-8 text-maroon" />
                        }
                      </div>
                     <h3 className="text-xl font-bold text-anthracite dark:text-white">{selectedCert.name}</h3>
                     <p className="text-gray-500 dark:text-gray-400">{selectedCert.org} • {selectedCert.date}</p>
                   </div>
                   
                   {/* Certificate Image */}
                   {selectedCert.imageUrl && (
                       <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                           {selectedCert.imageUrl.startsWith('data:application/pdf') ? (
                             <object data={selectedCert.imageUrl} type="application/pdf" className="w-full h-[60vh] min-h-[400px]">
                               <p className="p-4 text-center text-gray-500">PDF cannot be displayed natively. <a href={selectedCert.imageUrl} download="Certificate.pdf" className="text-maroon underline">Download PDF</a></p>
                             </object>
                           ) : (
                             <img src={selectedCert.imageUrl} alt={selectedCert.name} className="w-full h-auto object-cover max-h-60" />
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
      </AnimatePresence>
    </div>
  );
};

export default CertificationsPage;