
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
  saveApplication
} from "../../lib/firestoreHelpers";


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

  const [activeTab, setActiveTab] =
    useState("dashboard");
    const [matchedSkills, setMatchedSkills] =
  useState<string[]>([]);
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

setRecommendedRoles(
  analysis.recommendedRoles || []
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
        

      }
      
    );
    

  return () => unsubscribe();
  

}, [router]);
useEffect(() => {

  const loadJobs =
    async () => {

      if (
        recommendedRoles.length === 0
      )
        return;

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

      const data =
        await response.json();

      setJobs(data);
    };

  loadJobs();

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
                value={history.length}
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

  <div className="bg-white p-6 rounded-xl shadow">

    <h3 className="font-bold text-lg mb-4">
      💼 Recommended Jobs
    </h3>

    {jobs.map((job) => (

      <div
        key={job.title}
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
        <button
  onClick={async () => {

    if (!auth.currentUser) return;

    await saveApplication(
      auth.currentUser.uid,
      {
        role: job.title,
        company: job.company,
        status: "Applied",
        createdAt: new Date().toISOString(),
      }
    );

    const apps =
      await getApplications(
        auth.currentUser.uid
      );

    setApplications(apps);

    alert("Application tracked");

  }}

  className="
  mt-2
  bg-green-600
  text-white
  px-3
  py-1
  rounded-lg
  "
>
  Track Application
</button>

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

</div>
<div className="bg-white p-6 rounded-xl shadow">

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
          {" "}
          {app.status}
        </p>

      </div>

    ))

  )}

</div>
  

{/* Resume Strengths */}

<div className="bg-white p-6 rounded-xl shadow">

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