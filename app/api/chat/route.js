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

    const systemInstruction = `
أنت مساعد الذكاء الاصطناعي الرسمي لمتجر "Shopando" المستقل.
دورك هو مساعدة الزوار والرد على استفساراتهم حول متجر Shopando ومنتجاته بشكل ودود، موثوق، ومحترف.

المنتجات والخدمات المتاحة في Shopando:
- نظام Shopando الذكي للمتاجر ($299): نظام إدارة متكامل ومتقدم للمتاجر مع لوحة تحكم سحابية.
- سكربت متجر إلكتروني متكامل ($199): حماية عالية وجاهز لربط بوابات الدفع.
- سماعات لاسلكية عازلة للصوت Pro ($149): عزل نشط ANC وبطارية تدوم 40 ساعة.
- ساعة ذكية متطورة Ultra ($220): هيكل مقاوم للصدأ وشاشة AMOLED.
- سترة شتوية أنيقة مقاومة للماء ($89): عزل حراري مزدوج ومقاومة كاملة للماء والرياح.
- ماكينة تحضير القهوة الذكية ($130): ضغط 20 بار ومطحنة حبوب مدمجة.

ملاحظة هامة:
- لا تذكر أي شركات خارجية أو أسماء مطورين أو أطراف أخرى مطلقاً.
- الإجابات والمساعدة والدعم يتم تقديمها حصراً وبشكل مباشر من فريق متجر Shopando المستقل.
    `;

    // الاستدعام المباشر لنموذج gemini-3.8-flash المعتمد
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