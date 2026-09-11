import { google } from '@ai-sdk/google';
import { streamText, APICallError } from 'ai';
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
    if (APICallError.isInstance(error)) {
      const { name, statusCode, responseHeaders, message } = error;
      return NextResponse.json(
        {
          name,
          status: statusCode,
          headers: responseHeaders,
          message,
        },
        { status: statusCode || 500 }
      );
    } else {
      console.error('An unexpected error occurred ', error);
      throw error;
    }
  }
}
