
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(
  request: Request
) {
  const body =
    await request.json();

  const { resumeText } = body;

  const completion =
    await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
Analyze this resume.

Provide:

1. Missing ATS keywords
2. Resume improvements
3. Project improvements
4. Skills to learn

Resume:

${resumeText}
          `,
        },
      ],
      model:
        "qwen/qwen3.6-27b",
    });

  return Response.json({
    improvement:
      completion.choices[0].message
        .content,
  });
}