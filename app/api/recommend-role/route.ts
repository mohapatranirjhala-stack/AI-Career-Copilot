
import { roles } from "@/app/data/roles";

export async function POST(req: Request) {
  const body = await req.json();

  const strengths = body.strengths || [];

  const recommendations = roles.map((roleObj) => {
    const matched = roleObj.skills.filter(
      (skill) => strengths.includes(skill)
    );

    const missing = roleObj.skills.filter(
      (skill) => !strengths.includes(skill)
    );

    const match = Math.round(
      (matched.length / roleObj.skills.length) * 100
    );

    return {
  role: roleObj.role,
  match,
  missing,
  reason:
    matched.length >= 3
      ? "Strong skill alignment"
      : "Potential growth role"
};
  });

  recommendations.sort(
    (a, b) => b.match - a.match
  );

  return Response.json(recommendations);
  
}