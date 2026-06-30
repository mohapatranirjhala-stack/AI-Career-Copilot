
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const resumeText = body.resumeText;
    const jobDescription =
      body.jobDescription;

    const completion =
      await groq.chat.completions.create({
        model: "qwen/qwen3.6-27b",

        messages: [
          {
            role: "system",
            content:
              "You are an ATS resume reviewer.",
          },
          {
            role: "user",
            content: `
Analyze this resume:

${resumeText}

Job Description:

${jobDescription}

Provide:
1. Resume strengths
2. Resume weaknesses
3. ATS improvement suggestions
4. Missing skills
`,
          },
        ],
      });

    return Response.json({
      success: true,
      analysis:
        completion.choices[0].message
          .content,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      message: "AI analysis failed",
    });
  }
}