import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'GOOGLE_GENERATIVE_AI_API_KEY is not configured in .env' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { messages } = body;

    const result = streamText({
      model: google('gemini-2.5-flash'),
      messages: messages || [],
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Error in suggest-messages route:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to generate AI response.',
        error: error?.message || 'Unknown error occurred.',
      },
      { status: 500 }
    );
  }
}
