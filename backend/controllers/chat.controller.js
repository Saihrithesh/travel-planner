import OpenAI from 'openai';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

const getManualApiKey = () => {
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('OPENAI_API_KEY=')) {
          let val = trimmed.substring('OPENAI_API_KEY='.length).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
          }
          if (val) return val;
        }
      }
    }
  } catch (err) {
    console.error('Failed to manually read .env file:', err.message);
  }
  return null;
};

export const sendMessage = catchAsync(async (req, res, next) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return next(new AppError('Please provide a messages array in the request body', 400));
  }

  const apiKey = getManualApiKey() || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return next(new AppError('API key is missing in server environment variables (set OPENAI_API_KEY, GEMINI_API_KEY, or GOOGLE_API_KEY)', 500));
  }

  const systemPromptContent = `You are Roamy, a helpful and polite travel assistant AI. Your job is to help travelers.

Your capabilities include:
- Planning trips, itineraries, hotels, attractions, budgets, transportation, restaurants, visa rules, weather advice, packing lists, and travel FAQs.

Response Guidelines:
1. Always answer politely.
2. KEEP ALL RESPONSES EXTREMELY SHORT, CURATED, AND CONCISE. Avoid long introductory or concluding paragraphs, and get straight to the point.
3. Deliver information in brief bullet-point summaries and compact, high-density markdown tables. Avoid blocks of text.
4. If the user doesn't specify enough details (like destination or duration), ask a single, short follow-up question to gather the missing info.
5. Do NOT answer unrelated questions outside of travel. Politely decline and redirect to travel.`;

  let completionMessage;

  // If the key does not start with 'sk-', treat it as a Google Gemini API key
  const isGemini = !apiKey.startsWith('sk-');

  if (isGemini) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      
      const contents = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

      const geminiResponse = await axios.post(url, {
        systemInstruction: {
          parts: [{ text: systemPromptContent }]
        },
        contents
      });

      const aiText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!aiText) {
        throw new Error('Gemini API returned an empty response');
      }

      completionMessage = {
        role: 'assistant',
        content: aiText
      };
    } catch (err) {
      console.error('Gemini API request failed:', err.response?.data || err.message);
      return next(new AppError('Failed to generate response from Gemini AI. Please check your API key validity.', 500));
    }
  } else {
    // OpenAI client fallback
    const openai = new OpenAI({
      apiKey
    });

    const systemMessage = {
      role: 'system',
      content: systemPromptContent
    };

    const sanitizedMessages = messages.filter(msg => msg.role !== 'system');
    const openaiMessages = [systemMessage, ...sanitizedMessages];

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: openaiMessages
      });
      completionMessage = completion.choices[0].message;
    } catch (err) {
      console.warn('gpt-4o-mini request failed, attempting fallback to gpt-3.5-turbo. Error:', err.message);
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: openaiMessages
        });
        completionMessage = completion.choices[0].message;
      } catch (fallbackErr) {
        console.error('All OpenAI models failed:', fallbackErr.message);
        return next(new AppError('Failed to generate response from OpenAI models', 500));
      }
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      message: completionMessage
    }
  });
});
