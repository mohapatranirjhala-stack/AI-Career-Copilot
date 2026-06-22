
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
console.log(
  "GROQ KEY EXISTS:",
  !!process.env.GROQ_API_KEY
);

export async function POST(
  request: Request
) {
  try {
    const {
      resumeText,
      jobDescription,
      missingSkills,
    } = await request.json();

    const completion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `
Generate a complete mock interview.

Resume:
${resumeText}

Job Description:
${jobDescription}

Missing Skills:
${missingSkills}

Create:

1. Technical Round (5 questions)

2. Aptitude Round (5 MCQs)

3. Communication & Behavioral Round (5 questions)

4. HR Round (5 questions)

Return ONLY valid JSON.

Format:

{
  "technical": [],
  "aptitude": [],
  "behavioral": [],
  "hr": []
}
`,
          },
        ],

        model:
          "llama-3.3-70b-versatile",
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
  "MOCK INTERVIEW RESPONSE:"
);

console.log(cleaned);

const parsedData =
  JSON.parse(cleaned);
  console.log("PARSED DATA");
console.log(parsedData);

return Response.json(
  parsedData
);
  }catch (error: any) {
  console.error(error);

  return Response.json(
    {
      error:
        error.message ||
        "Failed",
    },
    {
      status: error.status || 500,
    }
  );
}
}