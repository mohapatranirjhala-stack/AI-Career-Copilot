
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
      missingSkills,
      jobDescription,
    } = await request.json();

    const completion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `
You are an expert Software Engineering Career Mentor.

Missing Skills:
${missingSkills.join(", ")}

Job Description:
${jobDescription}

For EACH missing skill provide:

Skill Name

Why This Skill Matters

Official Documentation

Best Free YouTube Resources

Best Free Courses

Practice Platforms

Project Ideas:
- Beginner
- Intermediate
- Advanced

Interview Topics

Interview Questions

Then create:

30-Day Learning Plan

60-Day Learning Plan

90-Day Learning Plan

Return plain text only.
Do not use markdown.
Do not use tables.
`,
          },
        ],
        model:
          "llama-3.3-70b-versatile",
      });

    return NextResponse.json({
      roadmap:
        completion.choices[0].message
          .content,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to generate roadmap",
      },
      { status: 500 }
    );
  }
}