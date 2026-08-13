

export interface BlogPost {
  id: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  contentEn: string;
  contentAr: string;
  date: string;
  views: number;
  author: string;
}

export interface Testimonial {
  id: string;
  name: string; // legacy support
  nameEn: string;
  nameAr: string;
  title: string; // legacy support
  titleEn: string;
  titleAr: string;
  companyEn?: string;
  companyAr?: string;
  linkedin: string;
  image?: string; // Base64 Image
  textEn: string;
  textAr: string;
  country: string; // legacy support
  countryEn: string;
  countryAr: string;
  approved: boolean;
}

export interface KnowledgeItem {
  id: string;
  question: string;
  answer: string;
}

export interface PendingQuestion {
  id: string;
  question: string;
  date: string;
}

// New Notification Type
export interface Notification {
  id: string;
  type: 'question' | 'review';
  content: string;
  date: string;
  read: boolean;
  relatedId?: string; // ID of the pending question or review
}

export interface Skill {
  id: string;
  iconName: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  detailsEn?: string;
  detailsAr?: string;
  price?: string;
  image?: string; // Base64 Image
}

export interface Project {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  longDescEn?: string;
  longDescAr?: string;
  tags: string[];
  mainImage: string;
  galleryImages?: string[];
  pdfUrl?: string;
  orderNum?: number;
  featured?: boolean;
}

export interface Certification {
  id: string;
  name: string;
  org: string;
  date: string;
  credentialId?: string;
  descEn?: string;
  descAr?: string;
  imageUrl?: string; // Base64 Image or PDF of the certificate
  issuerLogo?: string; // Base64 Image of the issuer logo
  orderNum?: number;
  featured?: boolean;
}

export interface EducationItem {
  id: string;
  degreeEn: string;
  degreeAr: string;
  institutionEn: string;
  institutionAr: string;
  date: string;
  gradeEn?: string;
  gradeAr?: string;
  institutionLogo?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  degreeImage?: string;
  orderNum?: number;
}

export interface SocialLink {
  id: string;
  platform: 'facebook' | 'linkedin' | 'instagram' | 'whatsapp' | 'telegram' | 'email' | 'website' | 'github';
  url: string;
  customIcon?: string; // Base64 Custom Icon
  isActive: boolean;
}

export interface LanguageItem {
  id: string;
  nameEn: string;
  nameAr: string;
  levelEn: string;
  levelAr: string;
  percentage: number;
}

export interface AppSettings {
  siteNameEn: string;
  siteNameAr: string;
  fullNameEn?: string;
  fullNameAr?: string;
  heroTitleEn: string;
  heroTitleAr: string;
  heroSubtitleEn: string;
  heroSubtitleAr: string;
  aboutTextEn: string;
  aboutTextAr: string;
  logoImage?: string; // Base64 or URL
  siteSubtitleEn?: string;
  siteSubtitleAr?: string;
  primaryColorRGB: string;
  contactEmail: string;
  contactPhone: string;
  aiContext: string; // The text content from uploaded file for AI
  copyrightOwnerName?: string; // Owner name for copyright
  profileImage?: string; // Base64 or URL for profile image
}

export type Language = 'en' | 'ar';

export interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export interface ExperienceCategory {
  id: string;
  titleEn: string;
  titleAr: string;
  orderNum?: number;
}

export interface ExperienceItem {
  id: string;
  categoryId: string;
  company: string;
  logo?: string;
  titleEn: string;
  titleAr: string;
  duration: string;
  country: string;
  descEn: string;
  descAr: string;
  orderNum?: number;
  featured?: boolean;
}