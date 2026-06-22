
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
Resume:
${resumeText}

Job Description:
${jobDescription}

Generate a complete interview preparation kit.

Return ONLY valid JSON.

Format:

{
  "questions": "Interview Questions in plain text",

  "technical": [
    {
      "question": "",
      "expected_answer": ""
    }
  ],

  "aptitude": [
    {
      "question": "",
      "expected_answer": ""
    }
  ],

  "behavioral": [
    {
      "question": "",
      "expected_answer": ""
    }
  ],

  "hr": [
    {
      "question": "",
      "expected_answer": ""
    }
  ]
}

Rules:

1. Generate 10 interview questions inside "questions".
2. Generate 5 Technical questions.
3. Generate 5 Aptitude questions.
4. Generate 5 Behavioral questions.
5. Generate 5 HR questions.
6. Every round question must contain:
   - question
   - expected_answer
7. Return JSON only.
No markdown.
No explanation.
No code block.
`,
          },
        ],

        model:
          "llama-3.3-70b-versatile",

        temperature: 0.5,
      });

    const response =
      completion.choices[0]
        .message.content || "";

    const cleaned =
      response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    console.log(
      "INTERVIEW KIT RESPONSE:"
    );

    console.log(cleaned);

    const parsedData =
      JSON.parse(cleaned);

    return NextResponse.json(
      parsedData
    );
  } catch (error) {
    console.error(
      "INTERVIEW KIT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to generate interview kit",
      },
      {
        status: 500,
      }
    );
  }
}