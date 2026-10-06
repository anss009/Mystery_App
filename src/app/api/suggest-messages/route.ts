import { google } from '@ai-sdk/google';
import { streamText, APICallError } from 'ai';
import { NextResponse } from 'next/server';

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST() {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'GOOGLE_GENERATIVE_AI_API_KEY is not configured in .env' },
        { status: 500 }
      );
    }

    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = streamText({
      model: google('gemini-3.5-flash-lite'),
      prompt,
      maxOutputTokens: 300,
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    if (APICallError.isInstance(error)) {
      console.error('Gemini API Error:', error.message);
      return NextResponse.json(
        {
          success: false,
          name: error.name,
          message: error.message,
        },
        { status: error.statusCode || 500 }
      );
    } else {
      console.error('An unexpected server error occurred:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'An unexpected error occurred while processing your request.',
        },
        { status: 500 }
      );
    }
  }
}
