import { KnowledgeItem } from "../types";

const API_URL = 'http://localhost:3001/api';

export const generateAIResponse = async (
  userQuestion: string,
  knowledgeBase: KnowledgeItem[],
  language: 'en' | 'ar',
  uploadedContext: string
): Promise<{ text: string; confidence: boolean }> => {
  try {
    const response = await fetch(`${API_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: userQuestion,
        language,
        context: uploadedContext
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("AI Service Error:", error);
    return {
      text: language === 'ar' ? 'حدث خطأ في الاتصال بالخادم.' : 'Server connection error.',
      confidence: false
    };
  }
};
