
import Groq from "groq-sdk";
export const dynamic = "force-dynamic";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(
  request: Request
) {
  const body =
    await request.json();

  const {
    resumeText,
    jobDescription,
  } = body;

  const completion =
    await groq.chat.completions.create({
      model:
        "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `
Generate a professional cover letter.

Resume:
${resumeText}

Job Description:
${jobDescription}

Use information from resume.
Keep it concise.
          `,
        },
      ],
    });

  return Response.json({
    coverLetter:
      completion.choices[0].message
        .content,
  });
}