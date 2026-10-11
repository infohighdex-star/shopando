import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message } = await request.json();
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch from Gemini');
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'لا يوجد رد';
    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}