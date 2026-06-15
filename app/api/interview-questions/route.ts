
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(
  request: Request
) {
  try {
    const {
      resumeText,
      jobDescription,
    } = await request.json();

    const completion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `
Generate interview questions based on:

Resume:
${resumeText}

Job Description:
${jobDescription}

Return:

Technical Questions:
• question

Project Questions:
• question

HR Questions:
• question

Missing Skill Questions:
• question

Return plain text only.
`,
          },
        ],
        model:
          "llama-3.3-70b-versatile",
      });

    return NextResponse.json({
      questions:
        completion.choices[0].message
          .content,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Failed to generate questions",
      },
      { status: 500 }
    );
  }
}