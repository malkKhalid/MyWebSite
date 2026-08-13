import { BlogPost, KnowledgeItem, Testimonial } from '../types';

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: '1',
    titleEn: 'The Rise of AI in Cyber Defense',
    titleAr: 'صعود الذكاء الاصطناعي في الدفاع السيبراني',
    excerptEn: 'How machine learning models are predicting threats before they happen.',
    excerptAr: 'كيف تتنبأ نماذج التعلم الآلي بالتهديدات قبل حدوثها.',
    contentEn: 'Full article content here...',
    contentAr: 'نص المقال الكامل هنا...',
    date: '2023-10-15',
    views: 1240,
    author: 'Eng. Malk Khalid All Banna',
  },
  {
    id: '2',
    titleEn: 'Zero Trust Architecture Explained',
    titleAr: 'شرح هندسة الثقة الصفرية',
    excerptEn: 'Why "Never Trust, Always Verify" is the new standard.',
    excerptAr: 'لماذا أصبح مبدأ "لا تثق أبدًا، تحقق دائمًا" هو المعيار الجديد.',
    contentEn: 'Full article content here...',
    contentAr: 'نص المقال الكامل هنا...',
    date: '2023-11-02',
    views: 980,
    author: 'Eng. Malk Khalid All Banna',
  },
  {
    id: '3',
    titleEn: 'Securing Cloud Infrastructure',
    titleAr: 'تأمين البنية التحتية السحابية',
    excerptEn: 'Best practices for AWS and Azure security configurations.',
    excerptAr: 'أفضل الممارسات لإعدادات الأمان في AWS و Azure.',
    contentEn: 'Full article content here...',
    contentAr: 'نص المقال الكامل هنا...',
    date: '2023-12-10',
    views: 1560,
    author: 'Eng. Malk Khalid All Banna',
  },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'James Carter',
    title: 'CTO at TechCorp',
    linkedin: '#',
    textEn: 'Malk provided exceptional security auditing for our fintech platform.',
    textAr: 'قدم ملك تدقيقًا أمنيًا استثنائيًا لمنصتنا المالية.',
    approved: true,
  },
  {
    id: '2',
    name: 'Layla Mahmoud',
    title: 'Senior DevOps Engineer',
    linkedin: '#',
    textEn: 'His understanding of DevSecOps pipelines is unmatched.',
    textAr: 'فهمه لخطوط أنابيب DevSecOps لا مثيل له.',
    approved: true,
  },
];

export const INITIAL_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: '1',
    question: 'skills',
    answer: 'Malk specializes in Penetration Testing, Cloud Security (AWS/Azure), DevSecOps, and Incident Response.',
  },
  {
    id: '2',
    question: 'experience',
    answer: 'He has over 8 years of experience working with Fortune 500 companies in the banking and healthcare sectors.',
  },
  {
    id: '3',
    question: 'certifications',
    answer: 'Malk holds CISSP, OSCP, and CEH certifications.',
  },
  {
    id: '4',
    question: 'contact',
    answer: 'You can contact Malk via the contact form on this website or via LinkedIn.',
  }
];