
export async function POST(request: Request) {
  const body = await request.json();

  const resumeText =
    body.resumeText.toLowerCase();
    const jobDescription =
  body.jobDescription.toLowerCase();

  const skillDatabase = [
    "react",
    "javascript",
    "typescript",
    "node",
    "firebase",
    "android",
    "kotlin",
    "java",
    "git",
    "github",
    "mysql",
    "mongodb",
    "docker",
    "aws",
    "html",
    "css",
    "next.js",
    "rest api",
    "python",
    "c++",
  ];

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  skillDatabase.forEach((skill) => {
    if (resumeText.includes(skill)) {
      strengths.push(skill);
    } else {
      weaknesses.push(skill);
    }
  });

  let score = 0;

// Skills (40 points max)
score += Math.round(
  (strengths.length / skillDatabase.length) * 40
);

// Projects
if (resumeText.includes("project")) {
  score += 15;
}

// GitHub
if (resumeText.includes("github")) {
  score += 10;
}

// LinkedIn
if (resumeText.includes("linkedin")) {
  score += 10;
}

// Internship
const hasInternship =
  /\bintern\b/.test(resumeText) ||
  /\binternship\b/.test(resumeText);

if (hasInternship) {
  score += 15;
}

// Achievements
if (
  resumeText.includes("achievement") ||
  resumeText.includes("award") ||
  resumeText.includes("hackathon")
) {
  score += 10;
}

if (score > 100) score = 100;

  const suggestions: string[] = [];

if (!resumeText.includes("project")) {
  suggestions.push(
    "Add project descriptions with measurable impact."
  );
}

if (!resumeText.includes("github")) {
  suggestions.push(
    "Include GitHub profile link."
  );
}

if (!resumeText.includes("linkedin")) {
  suggestions.push(
    "Include LinkedIn profile link."
  );
}

if (!hasInternship) {
  suggestions.push(
    "Add internship, open-source contributions, or practical experience."
  );
} {
  
}

if (strengths.length < 8) {
  suggestions.push(
    "Expand your technical skill set."
  );
  
}
const atsFactors = {
  projectsFound: resumeText.includes("project"),
  githubFound: resumeText.includes("github"),
  linkedinFound: resumeText.includes("linkedin"),
  internshipFound: hasInternship,
  achievementsFound:
    resumeText.includes("achievement") ||
    resumeText.includes("award") ||
    resumeText.includes("hackathon"),
};

const matchedSkills = strengths.filter(
  (skill) =>
    jobDescription.includes(
      skill.toLowerCase()
    )
);
const missingJobSkills =
  skillDatabase.filter(
    (skill) =>
      jobDescription.includes(skill) &&
      !resumeText.includes(skill)
  );

const totalSkills =
  matchedSkills.length +
  missingJobSkills.length;

const matchScore =
  totalSkills === 0
    ? 0
    : Math.round(
        (matchedSkills.length /
          totalSkills) *
          100
      );


  return Response.json({
  score,
  strengths,
  weaknesses: weaknesses.slice(0, 5),
  suggestions,
  atsFactors,
  matchScore,
  matchedSkills,
  missingJobSkills
});
}