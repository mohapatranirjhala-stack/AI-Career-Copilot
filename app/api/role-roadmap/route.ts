
export async function POST(
  request: Request
) {

  const body =
    await request.json();

  const role =
    body.role;

  const missingSkills =
    body.missingSkills || [];

  const roadmap = `

Week 1
Learn ${missingSkills[0] || "Core Fundamentals"}

Week 2
Build small projects using ${missingSkills[0] || "your new skill"}

Week 3
Learn ${missingSkills[1] || "Advanced Concepts"}

Week 4
Build a complete ${role} portfolio project

`;

  return Response.json({
    roadmap
  });

}