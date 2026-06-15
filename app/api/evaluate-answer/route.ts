
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const {
      question,
      idealAnswer,
      candidateAnswer,
    } = await req.json();

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "system",
            content: `
You are a Senior Software Engineering Interviewer.

Your task:

1. Evaluate the candidate answer.
2. Give a score out of 10.
3. Give detailed feedback.
4. Generate a professional ideal answer.

IMPORTANT:

Return ONLY valid JSON.

Format:

{
  "score": 8,
  "feedback": "Detailed feedback",
  "idealAnswer": "Complete interview-ready answer"
}

Rules:

- score must be between 1 and 10
- feedback must explain strengths and weaknesses
- idealAnswer must be a complete answer
- idealAnswer should sound like a top candidate in an interview
- do not return markdown
- do not return explanation outside JSON
            `,
          },

          {
            role: "user",
            content: `
Interview Question:

${question}

Reference Answer:

${idealAnswer}

Candidate Answer:

${candidateAnswer}

Evaluate now.
            `,
          },
        ],

        temperature: 0.4,
      });

    const content =
      completion.choices[0].message.content || "";

    const result =
      JSON.parse(content);

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "Evaluation Error:",
      error
    );

    return NextResponse.json(
      {
        score: 0,
        feedback:
          "Unable to evaluate answer.",
        idealAnswer:
          "No ideal answer generated.",
      },
      { status: 500 }
    );
  }
}