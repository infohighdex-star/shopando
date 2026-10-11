import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'مفتاح GEMINI_API_KEY غير معرف على Render' },
        { status: 500 }
      );
    }

    // تعليمات النظام والسياق الخاص بمتجر Shopando
    const systemInstruction = `
أنت مساعد الذكاء الاصطناعي الرسمي والخاص بمتجر "Shopando" الشامل والمطور بواسطة شركة HEADIX.
دورك هو مساعدة الزوار والرد على استفساراتهم حول متجر Shopando بشكل ودود وموثوق ومحترف.

بيانات وإرشادات المتجر:
1. متجر Shopando هو متجر إلكتروني موثوق وآمن 100% يضم منتجات مادية وأنظمة برمجية متطورة.
2. المنتجات والأنظمة المتاحة في المتجر حالياً:
   - نظام Shopando الذكي للمتاجر (بسعر $299): نظام إدارة متكامل ولوحة تحكم HEADIX.
   - سكربت متجر إلكتروني متكامل (بسعر $199): حماية عالية وجاهز لربط بوابات الدفع.
   - سماعات لاسلكية عازلة للصوت Pro (بسعر $149): عزل نشط ANC وبطارية 40 ساعة.
   - ساعة ذكية متطورة Ultra (بسعر $220): هيكل مقاوم للصدأ وشاشة AMOLED.
   - سترة شتوية أنيقة مقاومة للماء (بسعر $89): عزل حراري مزدوج ومقاومة للمياه.
   - ماكينة تحضير القهوة الذكية (بسعر $130): ضغط 20 بار ومطحنة حبوب مدمجة.

إذا سُئلت عن مدى موثوقية المتجر، أكّد للعميل أن المتجر موثوق ويضمن جودة المنتجات وحماية بيانات المستخدمين مع دعم فني متكامل من شركة HEADIX.
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `${systemInstruction}\n\nسؤال المستخدم: ${message}` }
              ]
            }
          ]
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'خطأ في الاستجابة من Gemini API' },
        { status: response.status }
      );
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'لم يتم استلام رد من النموذج.';
    return NextResponse.json({ reply });

  } catch (error) {
    return NextResponse.json(
      { error: error?.message || 'حدث خطأ غير متوقع في السيرفر' },
      { status: 500 }
    );
  }
}