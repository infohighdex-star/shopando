import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { query, mode } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        reply: 'عذراً، مفتاح GEMINI_API_KEY غير موجود في ملف .env.local' 
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    if (!query || query.trim() === '') {
      return NextResponse.json({ success: false, message: 'الاستعلام فارغ' });
    }

    if (mode === 'chat') {
      const prompt = `
        أنت مساعد ذكي ولطيف لمتجر Shopando الإلكتروني الشامل والمطور بواسطة شركة HEADIX.
        أجب على سؤال المستخدم بشكل طبيعي، واشرح له مواصفات المنتجات والأنظمة المتاحة في المتجر.
        سؤال المستخدم: "${query}"
      `;

      // استخدام النموذج الحديث والمطلوب من جوجل
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return NextResponse.json({
        success: true,
        reply: response.text,
      });
    }

    return NextResponse.json({ success: true, reply: 'جاهز' });

  } catch (error: any) {
    console.error('❌ Gemini API Runtime Error:', error?.message || error);
    return NextResponse.json(
      { 
        success: false, 
        reply: `عذراً، تعذر الاتصال بـ Gemini API. السبب: ${error?.message || 'مشكلة في الاتصال'}` 
      },
      { status: 500 }
    );
  }
}