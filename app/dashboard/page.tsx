
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import Sidebar from "../components/Slidebar";
import Navbar from "../components/Navbar";
import ResumeUpload from "../components/ResumeUpload";
import StatsCard from "../dashboard/StatsCard";
import ATSPieChart from "./ATSPieChart";
import SkillsBarChart
from "./SkillsBarChart";
import {
  getAnalysis,
  getApplications,
  saveApplication,
  updateApplicationStatus,
  getResumeHistory
} from "../../lib/firestoreHelpers";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";



export default function Dashboard() {
  const router = useRouter();
  const [resumeFile, setResumeFile] = useState(null);
  const [jobs,
setJobs] =
useState<any[]>([]);

  const [resumeAnalysis, setResumeAnalysis] =
    useState<any>(null);

  const [atsScore, setAtsScore] =
    useState<number | null>(null);

  const [history, setHistory] =
    useState<any[]>([]);
    const [strengths, setStrengths] =
  useState<string[]>([]);
  const [roleRoadmap,
setRoleRoadmap] =
useState("");
const [applyLinks,
setApplyLinks] =
useState<any>(null);


const [weaknesses, setWeaknesses] =
  useState<string[]>([]);

const [suggestions, setSuggestions] =
  useState<string[]>([]);
  const [recommendedRoles,
setRecommendedRoles] =
useState<any[]>([]);
const [applications,
setApplications] =
useState<any[]>([]);
const [showApplicationForm,
setShowApplicationForm] =
useState(false);
const [marketTrendData,
setMarketTrendData] =
useState<any[]>([]);

const [companyName,
setCompanyName] =
useState("");
const [isFallbackMode, setIsFallbackMode] =
  useState(false);

const [apiWarning, setApiWarning] =
  useState("");

const [roleName,
setRoleName] =
useState("");
const [
  resumeHistory,
  setResumeHistory,
  
] = useState<any[]>([]);

  const [activeTab, setActiveTab] =
    useState("dashboard");
    const [matchedSkills, setMatchedSkills] =
  useState<string[]>([]);
  const [marketInsights, setMarketInsights] =
  useState({
    ai: 0,
    cloud: 0,
    devops: 0,
    data: 0,
    fullstack: 0,
  });
  const [topSkills, setTopSkills] =
  useState<
    { skill: string; count: number }[]
  >([]);
  const [skillLeaderboard, setSkillLeaderboard] =
  useState<
    { skill: string; count: number }[]
  >([]);
  const [missingSkills, setMissingSkills] =
  useState<string[]>([]);
  useEffect(() => {

  const unsubscribe =
    onAuthStateChanged(
      auth,
      async (user) => {
        console.log("USER UID");
console.log(user?.uid);

        if (!user) {

          router.push("/login");
          return;

        }

        const analysis =
          await getAnalysis(
            user.uid
          );
        console.log("ANALYSIS DATA");
console.log(analysis);

  console.log(resumeAnalysis);  

        if (analysis) {

          setResumeAnalysis(
            analysis
          );

          setAtsScore(
  analysis.score || 0
);

setMatchedSkills(
  analysis.matchedSkills || []
);

setMissingSkills(
  analysis.missingJobSkills || []
);
setStrengths(
  analysis.strengths || []
);

setWeaknesses(
  analysis.weaknesses || []
);

setSuggestions(
  analysis.suggestions || []
);
const roleResponse =
  await fetch(
    "/api/recommend-role",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        strengths:
          analysis.strengths || [],
      }),
    }
  );

const roles =
  await roleResponse.json();

console.log(
  "TYPE OF ROLES:"
);

console.log(
  Array.isArray(roles)
);

console.log(
  "FULL ROLES OBJECT:"
);

console.log(
  JSON.stringify(
    roles,
    null,
    2
  )
);

console.log(
  "Roles API RESPONSE:"
  
);
console.log(roles)

setRecommendedRoles(
  roles
);
console.log(
  "SETTING RECOMMENDED ROLES"
);


        }
        const apps =
  await getApplications(
    user.uid
  );
console.log(
  "APPLICATIONS FROM FIRESTORE"
);

console.log(apps);
setApplications(apps);
const history =
  await getResumeHistory();

setResumeHistory(
  history
);
console.log("HISTORY DATA");
console.log(history);

console.log(
  "HISTORY LENGTH"
);
console.log(
  history.length
);
console.log(
  "HISTORY"
);
        

      }
      
    );
    

  return () => unsubscribe();
  

}, [router]);
useEffect(() => {
  console.log(
  "LOAD JOBS TRIGGERED"
);

console.log(
  "CURRENT ROLES:",
  recommendedRoles
);

  const loadJobs =
    async () => {

      if (
        recommendedRoles.length === 0
      )
        {

  console.log(
    "NO ROLES AVAILABLE"
  );

  return;

}
console.log("LOAD JOBS STARTED");
console.log("ROLE SENT:", recommendedRoles[0]?.role);
      const response =
        await fetch(
          "/api/job-recommendations",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              role:
                recommendedRoles[0]
                  .role,
            }),
          }
        );

      const result =
  await response.json();

if (
  result.fallback
) {

  setIsFallbackMode(true);

  setApiWarning(
    "Live job feed unavailable due to API quota limits. Showing demonstration data."
  );

} else {

  setIsFallbackMode(false);

  setApiWarning("");

}

const data =
  result.jobs;
        console.log("JOB API RESPONSE");
console.log(data);
console.log("NUMBER OF JOBS");
console.log(data?.length);

      setJobs(
  data.map((job: any) => ({
    id :job.job_id,
    title: job.job_title,
    company: job.employer_name,
    location:
      job.job_city ||
      job.job_country,
    applyLink:
      job.job_apply_link,
  }))
);
const insights = {
  ai: 0,
  cloud: 0,
  devops: 0,
  data: 0,
  fullstack: 0,
};

data.forEach((job: any) => {

  const title =
    job.job_title?.toLowerCase() || "";

  if (
    title.includes("ai") ||
    title.includes("ml") ||
    title.includes("machine learning")
  )
    insights.ai++;

  if (
    title.includes("cloud") ||
    title.includes("aws") ||
    title.includes("azure")
  )
    insights.cloud++;

  if (
    title.includes("devops") ||
    title.includes("sre")
  )
    insights.devops++;

  if (
    title.includes("data")
  )
    insights.data++;

  if (
    title.includes("full stack") ||
    title.includes("frontend") ||
    title.includes("backend")
  )
    insights.fullstack++;

});

setMarketInsights(insights);
const skillCounter:
  Record<string, number> = {};

const trackedSkills = [

  "AWS",
  "Azure",
  "GCP",

  "React",
  "Next.js",
  "TypeScript",

  "Node.js",
  "Python",
  "Java",

  "Docker",
  "Kubernetes",

  "Terraform",

  "SQL",
  "MongoDB",

  "DevOps",
  "CI/CD",

];

data.forEach(
  (job: any) => {

    const text = `
      ${job.job_title || ""}
      ${job.job_description || ""}
    `.toLowerCase();

    trackedSkills.forEach(
      (skill) => {

        if (
          text.includes(
            skill.toLowerCase()
          )
        ) {

          skillCounter[
            skill
          ] =
            (
              skillCounter[
                skill
              ] || 0
            ) + 1;

        }

      }
    );

  }
);

const marketRankedSkills =
  Object.entries(
    skillCounter
  )
    .map(
      ([skill, count]) => ({
        skill,
        count,
      })
    )
    .sort(
      (a, b) =>
        Number(b.count) -
        Number(a.count)
    )
    .slice(0, 5);
if (
  result.fallback
) {

  const fallbackSkills = [

    {
      skill: "AWS",
      count: 45,
    },

    {
      skill: "React",
      count: 42,
    },

    {
      skill: "TypeScript",
      count: 38,
    },

    {
      skill: "Docker",
      count: 32,
    },

    {
      skill: "Python",
      count: 28,
    },

  ];

  setTopSkills(
    fallbackSkills
  );

  setSkillLeaderboard(
    fallbackSkills
  );

} else {

  setTopSkills(
    marketRankedSkills
  );

  setSkillLeaderboard(
    marketRankedSkills
  );

}


console.log(
  "TOP SKILLS"
);

console.log(
  marketRankedSkills
);
    };
    const loadMarketAnalytics =
  async () => {

    const response =
      await fetch(
        "/api/job-recommendations",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            role:
              recommendedRoles[0]
                ?.role ||
              "Software Engineer",
          }),
        }
      );

    const result =
  await response.json();

const jobs =
  result.jobs || [];

    const counts = {

      ai: 0,

      cloud: 0,

      devops: 0,

      data: 0,

      fullstack: 0,

    };
console.log("MARKET JOBS");
console.log(jobs);
    jobs.forEach(
      (job: any) => {

        const text = `
          ${job.job_title}
          ${job.job_description}
        `.toLowerCase();

        if (
          text.includes("ai") ||
          text.includes("machine learning") ||
          text.includes("llm") ||
          text.includes("generative ai")
        )
          counts.ai++;

        if (
          text.includes("aws") ||
          text.includes("azure") ||
          text.includes("gcp") ||
          text.includes("cloud")
        )
          counts.cloud++;

        if (
          text.includes("docker") ||
          text.includes("kubernetes") ||
          text.includes("terraform") ||
          text.includes("devops")
        )
          counts.devops++;

        if (
          text.includes("sql") ||
          text.includes("spark") ||
          text.includes("etl") ||
          text.includes("airflow")
        )
          counts.data++;

        if (
          text.includes("react") ||
          text.includes("node") ||
          text.includes("next.js") ||
          text.includes("typescript")
        )
          counts.fullstack++;

      }
    );

    const results = [

      {
        domain: "AI / ML",
        jobs: counts.ai,
      },

      {
        domain: "Cloud",
        jobs: counts.cloud,
      },

      {
        domain: "DevOps",
        jobs: counts.devops,
      },

      {
        domain: "Data",
        jobs: counts.data,
      },

      {
        domain: "Full Stack",
        jobs: counts.fullstack,
      },

    ].sort(
      (a, b) =>
        b.jobs - a.jobs
    );
  
  

   if (
  result.fallback
) {

  setMarketTrendData([

    {
      domain: "AI / ML",
      jobs: 40,
    },

    {
      domain: "Cloud",
      jobs: 35,
    },

    {
      domain: "Full Stack",
      jobs: 30,
    },

    {
      domain: "DevOps",
      jobs: 25,
    },

    {
      domain: "Data",
      jobs: 20,
    },

  ]);

} else {

  setMarketTrendData(
    results
  );

}

  };
  
console.log(
  "Recommended Roles:",
  recommendedRoles
);

console.log(
  "Resume Analysis:",
  resumeAnalysis
);
  if (
  recommendedRoles.length > 0
) {
  loadJobs();
  loadMarketAnalytics();
}
  

}, [recommendedRoles]);
useEffect(() => {

  if (
    recommendedRoles.length === 0
  )
    return;

  const role =
    recommendedRoles[0].role;

  setApplyLinks({

    linkedin:
      `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
        role
      )}`,

    indeed:
      `https://in.indeed.com/jobs?q=${encodeURIComponent(
        role
      )}`,

    naukri:
      `https://www.naukri.com/${role
        .replace(/\s+/g, "-")
        .toLowerCase()}-jobs`

  });

}, [recommendedRoles]);
const readiness =
Math.round(
(atsScore || 0) * 0.9
);
const [overallScore, setOverallScore] =
  useState(0);

 console.log("Dashboard ATS");
console.log(atsScore);

  
  console.log(
  "ATS SCORE:",
  atsScore
);

console.log(
  "RESUME ANALYSIS:",
  resumeAnalysis
);

const generateRoleRoadmap =
async () => {

  if (
    recommendedRoles.length === 0
  )
    return;

  const response =
    await fetch(
      "/api/role-roadmap",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          role:
            recommendedRoles[0]
              .role,

          missingSkills:
            recommendedRoles[0]
              .missing,
        }),
      }
    );

  const data =
    await response.json();

  setRoleRoadmap(
    data.roadmap
  );
};
const totalApplications =
  applications.length;

const totalInterviews =
  applications.filter(
    app =>
      app.status === "Interview"
  ).length;

const totalOffers =
  applications.filter(
    app =>
      app.status === "Offer"
  ).length;

const interviewRate =
  totalApplications === 0
    ? 0
    : Math.round(
        (totalInterviews /
          totalApplications) *
          100
      );

const offerRate =
  totalApplications === 0
    ? 0
    : Number(
        (
          (totalOffers /
            totalApplications) *
          100
        ).toFixed(1)
      );
      const applicationScore =
  Math.min(
    100,
    totalApplications * 5
  );

const offerScore =
  totalOffers > 0
    ? 100
    : totalInterviews > 0
    ? 70
    : 30;

const careerHealthScore =
  Math.round(
    (
      (atsScore || 0) * 0.4 +
      applicationScore * 0.2 +
      offerScore * 0.2 +
      readiness * 0.2
    )
  );
  const handleStatusChange =
  async (
    applicationId: string,
    status: string
  ) => {

    if (!auth.currentUser)
      return;

    await updateApplicationStatus(
      auth.currentUser.uid,
      applicationId,
      status
    );

    const apps =
      await getApplications(
        auth.currentUser.uid
      );

    setApplications(apps);

  };
  <p className="text-red-500">
  Resume History Count:
  {resumeHistory.length}
</p>
useEffect(() => {
  console.log("RESUME HISTORY");
  console.log(resumeHistory);
  console.log("COUNT");
  console.log(resumeHistory.length);
}, [resumeHistory]);

const handleAddApplication =
  async () => {

    if (
      !auth.currentUser
    )
      return;

    await saveApplication(
      auth.currentUser.uid,
      {

        company:
          companyName,

        role:
          roleName,

        status:
          "Applied",

        appliedDate:
          new Date()
            .toISOString(),

      }
    );

    const apps =
      await getApplications(
        auth.currentUser.uid
      );

    setApplications(apps);

    setCompanyName("");
    setRoleName("");

    setShowApplicationForm(
      false
    );

  };
  const chartData =
  marketTrendData.map(
    (item) => ({
      domain: item.domain,
      jobs: item.jobs,
    })
  );
  const mostValuableSkill =

  topSkills.length > 0

    ? topSkills[0]

    : {
        skill: "AWS",
        count: 45,
      };
   console.log(
  "resumeAnalysis state:",
  resumeAnalysis
);

console.log(
  "recommendedRoles state:",
  recommendedRoles
);

console.log(
  "First recommended role:",
  recommendedRoles?.[0]
);
 

  return (
    <div className="flex">

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 p-6 bg-gray-100 min-h-screen">

        <Navbar />

        {/* DASHBOARD HOME */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">

           <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-2xl mb-8">

  <h1 className="text-4xl font-bold">
    Ready For Your Next Opportunity?
  </h1>

  <p className="mt-3 text-blue-100">
    Build your career with AI-powered resume analysis,
    mock interviews and personalized roadmaps.
  </p>

  <div className="mt-6 space-y-2">

    <p>
      📄 ATS Score:
      <span className="font-bold ml-2">
        {atsScore || 0}%
      </span>
    </p>

    <p>
      🚀 Career Readiness:
      <span className="font-bold ml-2">
        {readiness}%
      </span>
    </p>

  </div>

  <div className="w-full bg-blue-300 h-2 rounded-full mt-5">

    <div
      className="bg-green-400 h-2 rounded-full"
      style={{
        width: `${readiness}%`,
      }}
    />

  </div>

  <p className="mt-4 text-sm text-blue-100">
    Keep improving to become interview-ready.
  </p>

</div>
            <div className="grid md:grid-cols-4 gap-4 mb-8">

              <StatsCard
                title="ATS Score"
                value={`${atsScore || 0}%`}
                icon="📄"
              />

              <StatsCard
                title="Resume Status"
                value={resumeAnalysis ? "Ready" : "Pending"}
                icon="✅"
              />

              <StatsCard
                title="History Records"
                value={resumeHistory.length}
                icon="📊"
              />

              <StatsCard
                title="Career Readiness"
                value={
                  atsScore
                    ? `${Math.min(
                      100,
                      Math.round(
                        atsScore * 0.9
                      )
                    )}%`
                    : "--"
                }
                icon="🚀"
              />

            </div>
            
            <div className="grid md:grid-cols-4 gap-4 mb-8">

              <button className="bg-white shadow rounded-xl p-5 hover:shadow-lg">
                📄 Analyze Resume
              </button>

              <button className="bg-white shadow rounded-xl p-5 hover:shadow-lg">
                🎤 Mock Interview
              </button>

              <button className="bg-white shadow rounded-xl p-5 hover:shadow-lg">
                🗺 Learning Roadmap
              </button>

              <button className="bg-white shadow rounded-xl p-5 hover:shadow-lg">
                📊 View History
              </button>
            </div>  

            






            

            {/* TOP KPI ROW */}

<div className="grid md:grid-cols-3 gap-6">

  {/* ATS */}
  <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="font-bold text-lg mb-4">
      ATS Performance
    </h3>

    {(atsScore ?? 0) > 0 ? (
      <ATSPieChart atsScore={atsScore ?? 0} />
    ) : (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Upload a resume to generate ATS score
      </div>
    )}
  </div>

  {/* Career Readiness */}
  <div className="bg-white p-6 rounded-xl shadow">

    <h3 className="font-bold text-lg">
      🚀 Career Readiness
    </h3>

    <p className="mt-4 text-sm text-gray-600">

  {readiness >= 80 &&
    "Ready for applications"}

  {readiness >= 60 &&
    readiness < 80 &&
    "Few improvements needed"}

  {readiness < 60 &&
    "Build skills before applying"}

</p>

    <div className="w-full bg-gray-200 rounded-full h-3 mt-5">
      <div
        className="bg-green-500 h-3 rounded-full"
        style={{
          width: `${readiness}%`,
        }}
      />
    </div>

    <p className="text-gray-500 mt-3">
      Based on ATS score and interview performance
    </p>

  </div>

  {/* Next Action */}
  <div className="bg-white p-6 rounded-xl shadow">

    <h3 className="font-bold text-lg mb-3">
      Next Action
    </h3>

    <p className="text-xl font-semibold">
      {!resumeAnalysis
        ? "📄 Upload Resume"
        : matchedSkills.length === 0
        ? "📊 Analyze Resume"
        : "🎤 Generate Interview Kit"}
    </p>

    <p className="text-gray-500 mt-3">
      Recommended by AI
    </p>

  </div>

</div>

{/* ROLE + JOBS */}

<div className="grid md:grid-cols-2 gap-6 mt-6">

  {/* Best Role */}
  <div className="bg-white p-6 rounded-xl shadow">

    <h3 className="font-bold text-lg mb-4">
      🎯 Best Matched Role
    </h3>

    {recommendedRoles.length > 0 ? (

      <>
        <p className="text-2xl font-bold text-blue-600">
          {recommendedRoles[0].role}
        </p>

        <p className="mt-2 text-gray-600">
          {recommendedRoles[0].match}% Match
        </p>

        <p className="text-gray-500 mt-2">
          {recommendedRoles[0].reason}
        </p>

        <p className="font-semibold mt-4">
          Missing Skills
        </p>

        <div className="flex flex-wrap gap-2 mt-3">

          {recommendedRoles[0].missing.map(
            (skill: string) => (
              <span
                key={skill}
                className="
                px-3 py-1
                bg-red-100
                text-red-700
                rounded-full
                text-sm
                "
              >
                {skill}
              </span>
            )
          )}

        </div>

        {applyLinks && (

          <div className="mt-5">

            <p className="font-semibold mb-2">
              🚀 Apply Now
            </p>

            <div className="flex gap-2 flex-wrap">

              <a
                href={applyLinks.linkedin}
                target="_blank"
                className="bg-blue-600 text-white px-3 py-2 rounded-lg"
              >
                LinkedIn
              </a>

              <a
                href={applyLinks.indeed}
                target="_blank"
                className="bg-purple-600 text-white px-3 py-2 rounded-lg"
              >
                Indeed
              </a>

              <a
                href={applyLinks.naukri}
                target="_blank"
                className="bg-green-600 text-white px-3 py-2 rounded-lg"
              >
                Naukri
              </a>

            </div>
            


<div
  className="
  mt-6
  bg-blue-50
  p-3
  rounded-lg
  "
>

  <p className="font-semibold">
    🤖 Career Recommendation
  </p>

  <p className="text-sm text-gray-600">

    Focus on the top 3 skills currently appearing most frequently across live job listings.

  </p>

</div>
<div className="mt-6">

  <p className="mb-3">
  Skills Found: {topSkills.length}
</p>

{topSkills.map(
  (item) => (

    <div
      key={item.skill}
      className="mb-3"
    >

      <div className="flex justify-between mb-1">

        <span>
          {item.skill}
        </span>

        <span>
          {Math.round(
  (item.count / jobs.length) * 100
)}%
        </span>

      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">

        <div
          className="
          bg-blue-500
          h-3
          rounded-full
          "
          style={{
            width: `${
              (item.count /
                topSkills[0].count) *
              100
            }%`
          }}
        />

      </div>

    </div>

  )
)}
<hr className="my-6" />
  <h4
  className="
  font-bold
  mt-8
  mb-4
  "
>
  📈 Current Job Market Analytics
</h4>

  <p className="text-sm">

    AI, Cloud and DevOps are currently among the most actively hiring tech domains based on live job listings.


  </p>
  <h4 className="font-bold mt-8 mb-4">
  📈 Technology Domain Demand
</h4>

<ResponsiveContainer
  width="100%"
  height={250}
>

  <LineChart
    data={chartData}
  >

    <CartesianGrid
      strokeDasharray="3 3"
    />

    <XAxis
      dataKey="domain"
    />

    <YAxis />

    <Tooltip />

    <Line
      type="monotone"
      dataKey="jobs"
      strokeWidth={3}
    />

  </LineChart>

</ResponsiveContainer>
  

</div>


          </div>
          

        )}

      </>

    ) : (

      <p>
        Analyze a resume to get role recommendations
      </p>

    )}

  </div>

  {/* Recommended Jobs */}

  <div
  className="
  bg-white
  rounded-xl
  shadow
  p-6
  sticky top-6
  max-h-[700px]
  overflow-y-auto
  
  "
>
{
  apiWarning && (

    <div
      className="
      mb-4
      rounded-lg
      border
      border-yellow-500
      bg-yellow-50
      p-3
      text-sm
      "
    >

      ⚠️ {apiWarning}

    </div>

  )
}
    <h3 className="font-bold text-lg mb-4">
      💼 Recommended Jobs
    </h3>

    {jobs.map((job,index) => (

      <div
       key={`${job.title}-${job.company}-${index}`}
        className="border-b py-3"
      >

<p className="font-semibold">
  {job.title}
</p>

<p className="text-gray-500">
  {job.company}
</p>

<p className="text-sm">
  {job.location}
</p>

<a
  href={job.applyLink}
  target="_blank"
  rel="noopener noreferrer"
  className="
  inline-block
  mt-2
  bg-blue-600
  text-white
  px-3
  py-2
  rounded-lg
  "
>
  Apply Now
</a>
       

      </div>

    ))}

  </div>

</div>

{/* SKILLS + AI */}

<div className="grid md:grid-cols-2 gap-6 mt-6">

  <div className="bg-white p-6 rounded-xl shadow">

    <h3 className="font-bold text-lg mb-4">
      Skills Analysis
    </h3>

    {matchedSkills.length > 0 ? (
      <SkillsBarChart skills={matchedSkills} />
    ) : (
      <p className="text-gray-500">
        Analyze a resume to view skills.
      </p>
    )}

  </div>

  <div className="bg-white p-6 rounded-xl shadow">

    <h3 className="font-bold text-lg mb-4">
      🔥 AI Recommendations
    </h3>

    <div className="space-y-3">

  {Array.isArray(
  resumeAnalysis?.suggestions
) &&
  resumeAnalysis.suggestions.map(
    (
      item: string,
      index: number
    ) => (
      <div
        key={index}
        className="
        bg-yellow-50
        p-3
        rounded-lg
        "
      >
        💡 {item}
      </div>
    )
  )}

</div>
  </div>

</div>

{/* OTHER ROLES + STRENGTHS */}

<div className="grid md:grid-cols-2 gap-6 mt-6">

  <div className="bg-white p-6 rounded-xl shadow">

    <h3 className="font-bold text-lg mb-4">
      🔥 Other Recommended Roles
    </h3>

    {recommendedRoles
      .slice(1)
      .map((role) => (

        <div
          key={role.role}
          className="
          flex
          justify-between
          py-2
          border-b
          "
        >

          <span>
            {role.role}
          </span>

          <span>
            {role.match}%
          </span>

        </div>

      ))}

  </div>

  <div className="bg-white p-6 rounded-xl shadow">

  <h3 className="font-bold text-lg mb-4">
    📌 Application Tracker
  </h3>

  <div className="space-y-3">

    <div className="flex justify-between">
      <span>Applied</span>
      <span className="font-bold">
        {applications.filter(
          app => app.status === "Applied"
        ).length}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Interview</span>
      <span className="font-bold text-blue-600">
        {applications.filter(
          app => app.status === "Interview"
        ).length}
      </span>
    </div>

    <div className="flex justify-between">
  <span>Rejected</span>
  <span className="font-bold text-red-600">
    {applications.filter(
      app => app.status === "Rejected"
    ).length}
  </span>
</div>

    <div className="flex justify-between">
      <span>Offer</span>
      <span className="font-bold text-green-600">
        {applications.filter(
          app => app.status === "Offer"
        ).length}
      </span>
    </div>

  </div>
  <button
  onClick={() =>
    setShowApplicationForm(
      !showApplicationForm
    )
  }
  className="
  mt-4
  bg-blue-600
  text-white
  px-4
  py-2
  rounded-lg
  "
>
  ➕ Add Application
</button>
{showApplicationForm && (

  <div className="mt-4 space-y-3">

    <input
      type="text"
      placeholder="Company Name"
      value={companyName}
      onChange={(e) =>
        setCompanyName(
          e.target.value
        )
      }
      className="
      w-full
      border
      p-2
      rounded-lg
      "
    />

    <input
      type="text"
      placeholder="Role"
      value={roleName}
      onChange={(e) =>
        setRoleName(
          e.target.value
        )
      }
      className="
      w-full
      border
      p-2
      rounded-lg
      "
    />

    <button
      onClick={handleAddApplication}
      className="
      bg-green-600
      text-white
      px-4
      py-2
      rounded-lg
      "
    >
      Save Application
    </button>

  </div>

)}

</div>
<div
  className="
  bg-white
  rounded-xl
  shadow
  p-6
  h-[650px]
  overflow-y-auto
  "
>

  <h3 className="font-bold text-lg mb-4">
    📋 My Applications
  </h3>

  {applications.length === 0 ? (

    <p className="text-gray-500">
      No tracked applications
    </p>

  ) : (

    applications.map((app) => (

      <div
  key={app.id}
  className="
  border-b
  py-3
  "
>

  <p className="font-semibold">
    {app.role}
  </p>

  <p className="text-gray-500">
    {app.company}
  </p>

  <p className="text-sm">
    Status:
    {app.status}
  </p>

  {app.status ===
    "Pending" && (
      

    <button
      onClick={() =>
        handleStatusChange(
          app.id,
          "Applied"
        )
      }
      className="
      mt-2
      bg-green-600
      text-white
      px-3
      py-1
      rounded-lg
      "
    >
      ✓ I Applied
    </button>

  )}
  <div className="flex gap-2 mt-2 flex-wrap">
    <button
  onClick={() =>
    handleStatusChange(
      app.id,
      "Applied"
    )
  }
  className="
  px-2 py-1
  bg-gray-500
  text-white
  rounded
  "
>
  Applied
</button>

  <button
    onClick={() =>
      handleStatusChange(
        app.id,
        "Interview"
      )
    }
  >
    Interview
  </button>

  <button
    onClick={() =>
      handleStatusChange(
        app.id,
        "Rejected"
      )
    }
  >
    Rejected
  </button>
  

  <button
    onClick={() =>
      handleStatusChange(
        app.id,
        "Offer"
      )
    }
  >
    Offer
  </button>

</div>

</div>

    ))

  )}

</div>
  

{/* Resume Strengths */}

<div
  className="
  bg-white
  rounded-xl
  shadow
  p-6
  h-[650px]
  overflow-y-auto
  "
>

  <h3 className="font-bold text-lg mb-4">
    💪 Resume Strengths
  </h3>

  <div className="flex flex-wrap gap-2 mt-3">

    {resumeAnalysis?.strengths?.map(
      (skill: string) => (

        <span
          key={skill}
          className="
          px-3 py-1
          bg-green-100
          text-green-700
          rounded-full
          text-sm
          "
        >
          {skill}
        </span>

      )
    )}

  </div>
  <h4 className="font-bold mt-6 mb-3">
  🚀 Skill Gap Analysis
</h4>

{missingSkills?.map((skill) => (
  <div
    key={skill}
    className="
    flex
    justify-between
    mb-2
    "
  >
    <span>{skill}</span>

    <span className="text-red-500">
      Missing
    </span>
  </div>

  
))}

<div className="mt-6">
  <h4 className="font-bold mb-3">
    📄 ATS Breakdown
  </h4>

  <div className="space-y-2">

    <div className="flex justify-between">
      <span>Keywords</span>
      <span>85%</span>
    </div>

    <div className="flex justify-between">
      <span>Formatting</span>
      <span>92%</span>
    </div>

    <div className="flex justify-between">
      <span>Skills Coverage</span>
      <span>78%</span>
    </div>

  </div>
  <div className="mt-6">

  <h4 className="font-bold mb-3">
    🔥 Most Valuable Skill
  </h4>

  {mostValuableSkill && (

    <div
      className="
      bg-orange-50
      p-4
      rounded-lg
      "
    >

      <p className="font-semibold text-lg">
        {mostValuableSkill.skill}
      </p>

      <p
        className="
        text-sm
        text-gray-600
        mt-1
        "
      >

        Appears in

        {" "}

        {mostValuableSkill.count}

        {" "}

        current job listings.

      </p>

    </div>

  )}

</div>
<div className="mt-6">

  <h4 className="font-bold mb-3">
    🤖 Market Insight
  </h4>

  <div
    className="
    bg-blue-50
    p-4
    rounded-lg
    "
  >

    <p className="text-sm">

      {mostValuableSkill
        ? `${mostValuableSkill.skill} is currently the strongest market signal in your profile.`
        : "No market insight available."}

    </p>

  </div>

</div>
</div>

</div>

{/* Career Growth Analytics */}

<div className="bg-white p-6 rounded-xl shadow">

  <h3 className="font-bold text-lg mb-4">
    📈 Career Growth Analytics
  </h3>

  <div className="space-y-3">

    <div className="flex justify-between">
      <span>ATS Score</span>
      <span className="font-bold">
        {atsScore}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Career Readiness</span>
      <span className="font-bold">
        {readiness}%
      </span>
    </div>

    <div className="flex justify-between">
      <span>Applications</span>
      <span className="font-bold">
        {totalApplications}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Offers</span>
      <span className="font-bold text-green-600">
        {totalOffers}
      </span>
    </div>

  </div>

  <div className="mt-6">

    <p className="font-semibold mb-2">
      Career Health Score
    </p>

    <div className="w-full bg-gray-200 rounded-full h-4">

      <div
        className="bg-green-500 h-4 rounded-full"
        style={{
          width: `${careerHealthScore}%`
        }}
      />

    </div>

    <p className="mt-2 font-bold text-green-600">
      {careerHealthScore}/100
    </p>

  </div>

  <div
    className="
    mt-5
    bg-blue-50
    p-3
    rounded-lg
    "
  >

    <p className="font-semibold">
      🤖 AI Insight
    </p>

    <p className="text-sm text-gray-600">

      {careerHealthScore >= 80
        ? "You are job-market ready. Focus on interview performance."
        : careerHealthScore >= 60
        ? "Strong profile. Improve missing skills and increase applications."
        : "Your profile needs strengthening. Focus on ATS score and projects."}

    </p>

  </div>

</div>



  {/* Recommendations */}
  <div className="bg-white p-6 rounded-xl shadow">

    <h3 className="font-bold text-lg mb-4">
      🔥 AI Recommendations
    </h3>

    {missingSkills.length > 0 ? (

      <ul className="space-y-3">

        <div className="bg-white p-6 rounded-xl shadow">

  <h3 className="font-bold text-lg mb-4">
    🎯 Improvement Suggestions
  </h3>

  <p className="text-gray-700">
    {resumeAnalysis?.suggestions ||
      "Analyze a resume to get recommendations"}
  </p>

</div>

      </ul>

    ) : (

      <div>
    <p className="text-green-600 font-medium">
      ✅ Your resume currently covers all required skills.
    </p>

    <p className="text-gray-500 mt-2">
      Upload a job description to get personalized recommendations.
    </p>
  </div>



    )}

  </div>

  

</div>
<div className="bg-white p-6 rounded-xl shadow">

  <h3 className="font-bold text-lg mb-4">
    Recent Activity
  </h3>

  <div className="space-y-3">

    <p>📄 Resume Analyzed</p>

    <p>🎤 Interview Kit Generated</p>

    <p>🗺 Roadmap Generated</p>

    <p>📄 Cover Letter Generated</p>

  </div>

</div>
          


    {/* QUICK INSIGHT PANEL */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="font-bold text-lg mb-3">
            🤖 AI Insights
          </h3>

          <p>
            Upload and analyze your resume to unlock
            AI-powered recommendations.
          </p>

        </div>

      </div>
)}

      {activeTab !== "dashboard" && (
        <ResumeUpload
  section={activeTab}
  resumeFile={resumeFile}
  setResumeFile={setResumeFile}
  resumeAnalysis={resumeAnalysis}
  setResumeAnalysis={setResumeAnalysis}
  atsScore={atsScore}
  setAtsScore={setAtsScore}

  matchedSkills={matchedSkills}
  setMatchedSkills={setMatchedSkills}

  missingSkills={missingSkills}
  setMissingSkills={setMissingSkills}

  overallScore={overallScore}
  setOverallScore={setOverallScore}
/>
      )}





    </div>

    </div >
  );
}