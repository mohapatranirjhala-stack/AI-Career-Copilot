
"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

import { db }
from "@/lib/firebase";

export default function ResumeUpload() {
 const [fileName, setFileName] = useState("");
const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [coverLetter, setCoverLetter] =
  useState("");
  const [improvement, setImprovement] =
  useState("");
  const [extracting, setExtracting] =
  useState(false);
  const [aiAnalysis, setAiAnalysis] =
  useState("");
  const [roadmap, setRoadmap] =
  useState("");
  
  const [
  interviewQuestions,
  setInterviewQuestions,
] = useState("");
const [
  mockInterview,
  setMockInterview
] = useState<any>(null);
const [answers, setAnswers] = useState<{[key:string]:string}>({});
const [
  evaluations,
  setEvaluations,
] = useState<any>({});
const [history, setHistory] =
  useState<any[]>([]);
  const [jobDescription, setJobDescription] =
  useState("");
  const [resumeText, setResumeText] = useState("");
  const handleFileChange = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file =
    event.target.files?.[0];

  if (!file) return;

  setFileName(file.name);

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const response =
    await fetch(
      "/api/extract-pdf",
      {
        method: "POST",
        body: formData,
      }
    );

  const data =
    await response.json();

  setResumeText(
    data.extractedText
  );
};
const handleAnalyze = async () => {
  if (!resumeText.trim()) {
    alert("Please paste resume text");
    return;
  }
 

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resumeText,
      jobDescription
    }),
  });

  const data = await response.json();

  setAnalysis(data);
};
 const generateCoverLetter = async () => {
  const response = await fetch(
    "/api/cover-letter",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        resumeText,
        jobDescription,
      }),
    }
  );

  const data =
    await response.json();

  setCoverLetter(
    data.coverLetter
  );
};
const downloadReport = () => {
  if (!analysis) {
    alert("Analyze resume first");
    return;
  }

  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(20);
  doc.text("AI Career Copilot Report", 20, y);

  y += 20;

  doc.setFontSize(12);

  doc.text(`ATS Score: ${analysis.score}%`, 20, y);
  y += 10;

  doc.text(
    `Job Match Score: ${analysis.matchScore}%`,
    20,
    y
  );
  y += 20;

  doc.text("Matched Skills:", 20, y);
  y += 10;

  analysis.matchedSkills?.forEach(
    (skill: string) => {
      doc.text(`• ${skill}`, 25, y);
      y += 8;
    }
  );

  y += 10;

  doc.text("Missing Skills:", 20, y);
  y += 10;

  analysis.weaknesses?.forEach(
    (skill: string) => {
      doc.text(`• ${skill}`, 25, y);
      y += 8;
    }
  );

  y += 10;

  doc.text("Suggestions:", 20, y);
  y += 10;

  analysis.suggestions?.forEach(
    (item: string) => {
      doc.text(`• ${item}`, 25, y);
      y += 8;
    }
  );
y += 10;


doc.addPage();
y = 20;
doc.text("AI Resume Analysis:", 20, y);
y += 10;

const analysisLines =
  doc.splitTextToSize(
    aiAnalysis,
    170
  );

analysisLines.forEach((line: string) => {
  if (y > 270) {
    doc.addPage();
    y = 20;
  }

  doc.text(line, 20, y);
  y += 6;
});

y += analysisLines.length * 6;
doc.addPage();
y = 20;

y += 10;


doc.text(
  "AI Cover Letter:",
  20,
  y
);

y += 10;

const coverLetterLines =
  doc.splitTextToSize(
    coverLetter,
    170
  );
  

coverLetterLines.forEach(
  (line: string) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.text(line, 20, y);
    y += 6;
  }
  
);
if (roadmap) {
  doc.addPage();

  y = 20;

  doc.text(
    "AI Learning Roadmap",
    20,
    y
  );

  y += 10;

  const roadmapLines =
    doc.splitTextToSize(
      roadmap,
      170
    );

  roadmapLines.forEach(
    (line: string) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.text(
        line,
        20,
        y
      );

      y += 6;
    }
  );
}
  doc.save("ATS_Report.pdf");
};
const saveReport =
  async () => {
    if (!analysis) {
      alert(
        "Analyze resume first"
      );
      return;
    }

    try {
      await addDoc(
        collection(
          db,
          "resumeReports"
        ),
        {
          fileName,

          atsScore:
            analysis.score,

          matchScore:
            analysis.matchScore,

          strengths:
            analysis.strengths,

          weaknesses:
            analysis.weaknesses,

          suggestions:
            analysis.suggestions,

          aiAnalysis,

          coverLetter,

          interviewQuestions,

          roadmap,

          improvement,

          createdAt:
            new Date(),
        }
      );

      alert(
        "Report Saved Successfully"
      );
    } catch (error) {
      console.error(error);
    }
  };
  const loadHistory =
  async () => {
    const snapshot =
      await getDocs(
        collection(
          db,
          "resumeReports"
        )
      );

    const reports =
      snapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

    setHistory(
      reports
    );
  };
const improveResume =
  async () => {
    const response =
      await fetch(
        "/api/improve-resume",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            resumeText,
          }),
        }
      );

    const data =
      await response.json();

    setImprovement(
      data.improvement
    );
  };
const getAIAnalysis =
  async () => {
    const response = await fetch(
      "/api/ai-analysis",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
        }),
      }
    );

    const data =
      await response.json();

    setAiAnalysis(
      data.analysis
    );
  };
  const generateMockInterview =
  async () => {

    const response =
      await fetch(
        "/api/mock-interview",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            resumeText,
            jobDescription,

            missingSkills:
              analysis?.missingJobSkills,
          }),
        }
      );

    const data =
      await response.json();
    console.log(mockInterview);

    setMockInterview(
      data
    );
};
const evaluateAnswer =
  async (
    question: string,
    idealAnswer: string,
    candidateAnswer: string,
    key: string
  ) => {

    const response =
      await fetch(
        "/api/evaluate-answer",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              question,
              idealAnswer,
              candidateAnswer,
            }),
        }
      );

    const data =
      await response.json();

    setEvaluations(
      (prev: any) => ({
        ...prev,

        [key]: data,
      })
    );
};
const scores =
  Object.values(
    evaluations
  ).map(
    (item: any) =>
      item.score
  );


  const generateQuestions =
  async () => {
    const response =
      await fetch(
        "/api/interview-questions",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            resumeText,
            jobDescription,
          }),
        }
      );

    const data =
      await response.json();

    setInterviewQuestions(
      data.questions
    );
  };
  const generateRoadmap =
  async () => {
    if (!analysis) {
      alert(
        "Analyze resume first"
      );
      return;
    }

    const response =
      await fetch(
        "/api/learning-roadmap",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            missingSkills:
              analysis.missingJobSkills ||
              analysis.weaknesses ||
              [],
            jobDescription,
          }),
        }
      );

    const data =
      await response.json();

    setRoadmap(
      data.roadmap
    );
  };
  const overallScore =
  scores.length > 0
    ? (
        scores.reduce(
          (a, b) => a + b,
          0
        ) / scores.length
      ).toFixed(1)
    : 0;
    const renderInterviewRound = (
title: string,
color: string,
roundKey: string,
questions: any[]
) => (

  <div className="mb-8">
    <h3
      className={`text-xl font-bold mb-4 ${color}`}
    >
      {title}
    </h3>{questions?.map(
  (item: any, index: number) => (
    <div
      key={index}
      className="mb-5 bg-white p-5 rounded-xl shadow-sm border"
    >
      <p className="font-medium">
        <strong>
          Q{index + 1}:
        </strong>{" "}
        {item.question}
      </p>

      <textarea
        className="w-full mt-3 border rounded-lg p-3"
        rows={4}
        placeholder="Write your answer..."
        value={
          answers[
            `${roundKey}-${index}`
          ] || ""
        }
        onChange={(e) =>
          setAnswers({
            ...answers,
            [`${roundKey}-${index}`]:
              e.target.value,
          })
        }
      />

      <button
        onClick={() =>
          evaluateAnswer(
            item.question,
            item.expected_answer,
            answers[
              `${roundKey}-${index}`
            ],
            `${roundKey}-${index}`
          )
        }
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Submit Answer
      </button>

      {evaluations[
        `${roundKey}-${index}`
      ] && (
        <div className="mt-4 bg-green-50 p-4 rounded-lg">

          <p className="font-bold text-green-700">
            Score:
            {
              evaluations[
                `${roundKey}-${index}`
              ].score
            }
            /10
          </p>

          <p className="mt-2">
            Feedback:
            {
              evaluations[
                `${roundKey}-${index}`
              ].feedback
            }
          </p>

          <div className="mt-3 bg-white p-3 rounded border">
            <p className="font-semibold">
              Ideal Answer
            </p>

            <p className="mt-1">
              {
                evaluations[
                  `${roundKey}-${index}`
                ].idealAnswer
              }
            </p>
          </div>
        </div>
      )}
    </div>
  )
)}

  </div>
);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Upload Resume
      </h2>

      <label
  className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer inline-block"
>
  Upload Resume

  <input
    type="file"
    accept=".pdf"
    onChange={handleFileChange}
    className="hidden"
  />
</label>

      {fileName && (
  <>
    <p className="mt-4 text-green-600 font-semibold">
      ✅ {fileName}
    </p>
    <textarea
  value={resumeText}
  onChange={(e) => setResumeText(e.target.value)}
  placeholder="Paste your resume content here..."
  className="w-full border border-gray-300 rounded-lg p-3 mt-4"
  rows={10}
/>
<textarea
  value={jobDescription}
  onChange={(e) =>
    setJobDescription(e.target.value)
  }
  placeholder="Paste Job Description here..."
  className="w-full border border-gray-300 rounded-lg p-3 mt-4"
  rows={8}
/>

    <button
  onClick={handleAnalyze}
  className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg"
>
  Analyze Resume
</button>
<button
  onClick={generateCoverLetter}
  className="mt-4 ml-4 bg-purple-600 text-white px-6 py-3 rounded-lg"
>
  Generate Cover Letter
</button>
<button
  onClick={downloadReport}
  className="mt-4 ml-4 bg-red-600 text-white px-6 py-3 rounded-lg"
>
  Download ATS Report
</button>
<button
  onClick={improveResume}
  className="mt-4 ml-4 bg-indigo-600 text-white px-6 py-3 rounded-lg"
>
  Improve Resume
</button>
<button
  onClick={getAIAnalysis}
  className="mt-4 ml-4 bg-indigo-600 text-white px-6 py-3 rounded-lg"
>
  AI Analysis
</button>
<button
  onClick={
    generateMockInterview
  }
  className="mt-4 ml-4 bg-orange-600 text-white px-6 py-3 rounded-lg"
>
  Mock Interview
</button>
<button
  onClick={generateQuestions}
  className="mt-4 ml-4 bg-orange-600 text-white px-6 py-3 rounded-lg"
>
  Interview Questions
</button>
<button
  onClick={generateRoadmap}
  className="mt-4 ml-4 bg-teal-600 text-white px-6 py-3 rounded-lg"
>
  Learning Roadmap
</button>
<button
  onClick={saveReport}
  className="mt-4 ml-4 bg-cyan-600 text-white px-6 py-3 rounded-lg"
>
  Save Report
</button>

<button
  onClick={loadHistory}
  className="mt-4 ml-4 bg-gray-700 text-white px-6 py-3 rounded-lg"
>
  View History
</button>
{analysis && (
  <div className="mt-6 bg-white shadow-lg rounded-xl p-6">

    <h2 className="text-2xl font-bold mb-4">
      ATS Analysis Report
    </h2>

    <div className="mb-6">
      <p className="text-gray-600">
        ATS Score
      </p>

      <p
  className={`text-6xl font-extrabold ${
    analysis.score >= 80
      ? "text-green-600"
      : analysis.score >= 60
      ? "text-yellow-500"
      : "text-red-600"
  }`}

>
  {analysis.score}%
</p>
<p className="mt-2 text-gray-600">
  Skills Detected:
  {analysis.strengths.length}
</p>
<div className="w-full bg-gray-200 rounded-full h-4 mt-4">
  <div
    className="bg-green-600 h-4 rounded-full"
    style={{
      width: `${analysis.score}%`,
    }}
  />
</div>
    </div>
    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
  <h3 className="font-bold text-lg mb-3">
    ATS Factors
  </h3>

  <p>
    {analysis.atsFactors.projectsFound
      ? "✅"
      : "❌"} Projects Found
  </p>

  <p>
    {analysis.atsFactors.githubFound
      ? "✅"
      : "❌"} GitHub Found
  </p>

  <p>
    {analysis.atsFactors.linkedinFound
      ? "✅"
      : "❌"} LinkedIn Found
  </p>

  <p>
    {analysis.atsFactors.internshipFound
      ? "✅"
      : "❌"} Internship Found
  </p>

  <p>
    {analysis.atsFactors.achievementsFound
      ? "✅"
      : "❌"} Achievements Found
  </p>
</div>
<div className="mt-6 bg-blue-50 p-4 rounded-lg">
  <h3 className="font-bold text-lg mb-3">
    Job Match Analysis
  </h3>

  <p>
    Match Score:
    {analysis.matchScore}%
  </p>
  <p>
  Matched Skills:
  {analysis.matchedSkills?.length}
</p>

<p>
  Missing Skills:
  {analysis.missingJobSkills?.length}
</p>

  <div className="mt-3">
    <h4 className="font-semibold">
      Matched Skills
    </h4>

    {analysis.matchedSkills?.map(
      (
        skill: string,
        index: number
      ) => (
        <p key={index}>
          ✅ {skill}
        </p>
      )
    )}
  </div>
  <div className="mt-4">
  <h4 className="font-semibold">
    Missing Job Skills
  </h4>

  {analysis.missingJobSkills?.map(
    (
      skill: string,
      index: number
    ) => (
      <p key={index}>
        ❌ {skill}
      </p>
    )
  )}
</div>
</div>

    <div className="grid md:grid-cols-2 gap-6">

      <div>
        <h3 className="text-xl font-bold mb-3">
          Strengths
        </h3>

        {analysis.strengths.map(
          (item: string, index: number) => (
            <p key={index}>
              ✅ {item}
            </p>
          )
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold mb-3">
          Missing Skills
        </h3>

        {analysis.weaknesses.map(
          (item: string, index: number) => (
            <p key={index}>
              ❌ {item}
            </p>
          )
        )}
      </div>

    </div>
    <div className="mt-6">
  <h3 className="text-xl font-bold mb-3">
    Suggestions
  </h3>

  {analysis.suggestions?.map(
    (item: string, index: number) => (
      <p key={index}>
        💡 {item}
      </p>
    )
  )}
  {scores.length > 0 && (
  <div className="bg-blue-50 p-6 rounded-xl mt-6">

    <h2 className="text-2xl font-bold">
      Interview Score
    </h2>

    <p className="text-5xl font-bold text-blue-700">
      {overallScore}/10
    </p>

  </div>
)}
  {mockInterview && (

  <div className="mt-6 bg-yellow-50 p-6 rounded-lg"><h2 className="text-2xl font-bold mb-6">
  AI Mock Interview
</h2>

{renderInterviewRound(
  "Technical Round",
  "text-blue-700",
  "technical",
  mockInterview.technical
)}

{renderInterviewRound(
  "Aptitude Round",
  "text-green-700",
  "aptitude",
  mockInterview.aptitude
)}

{renderInterviewRound(
  "Behavioral Round",
  "text-purple-700",
  "behavioral",
  mockInterview.behavioral
)}

{renderInterviewRound(
  "HR Round",
  "text-red-700",
  "hr",
  mockInterview.hr
)}

{scores.length > 0 && (
  <div className="bg-blue-50 p-6 rounded-xl mt-8 border">

    <h2 className="text-2xl font-bold">
      Final Interview Score
    </h2>

    <p className="text-5xl font-bold text-blue-700 mt-3">
      {overallScore}/10
    </p>

    <p className="mt-4 text-lg font-medium">

      {Number(overallScore) >= 9
        ? "🏆 Excellent"
        : Number(overallScore) >= 8
        ? "⭐ Very Good"
        : Number(overallScore) >= 7
        ? "👍 Good"
        : Number(overallScore) >= 6
        ? "⚠ Average"
        : "❌ Needs Improvement"}

    </p>

  </div>
)}

  </div>
)}
</div>
{coverLetter && (
  <div className="mt-6 bg-purple-50 p-4 rounded-lg">
    <h3 className="text-xl font-bold mb-3">
      Cover Letter
    </h3>

    <pre className="whitespace-pre-wrap">
      {coverLetter}
    </pre>
  </div>
)}
{improvement && (
  <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
    <h3 className="text-xl font-bold mb-3">
      Resume Improvement AI
    </h3>

    <pre className="whitespace-pre-wrap">
      {improvement}
    </pre>
  </div>
)}
{aiAnalysis && (
  <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
    <h3 className="text-xl font-bold mb-3">
      AI Resume Analysis
    </h3>

    <pre className="whitespace-pre-wrap">
      {aiAnalysis}
    </pre>
  </div>
)}
{interviewQuestions && (
  <div className="mt-6 bg-orange-50 p-4 rounded-lg">
    <h3 className="text-xl font-bold mb-3">
      AI Interview Questions
    </h3>

    <pre className="whitespace-pre-wrap">
      {interviewQuestions}
    </pre>
  </div>
)}
{roadmap && (
  <div className="mt-6 bg-teal-50 p-4 rounded-lg">
    <h3 className="text-xl font-bold mb-3">
      AI Learning Roadmap
    </h3>

    <pre className="whitespace-pre-wrap">
      {roadmap}
    </pre>
  </div>
)}
{history.length > 0 && (
  <div className="mt-8 bg-gray-50 p-4 rounded-lg">

    <h3 className="text-2xl font-bold mb-4">
      Resume History
    </h3>

    {history.map(
      (report: any) => (
        <div
          key={report.id}
          className="border rounded-lg p-4 mb-4 bg-white"
        >
          <p>
            Resume:
            {report.fileName}
          </p>

          <p>
            ATS Score:
            {report.atsScore}%
          </p>

          <p>
            Match Score:
            {report.matchScore}%
          </p>

          <p>
            Date:
            {new Date(
              report.createdAt?.seconds *
                1000
            ).toLocaleString()}
          </p>

          <details className="mt-3">
            <summary>
              View Full Report
            </summary>

            <pre className="whitespace-pre-wrap mt-3">
              {report.aiAnalysis}
            </pre>

            <pre className="whitespace-pre-wrap mt-3">
              {report.coverLetter}
            </pre>

            <pre className="whitespace-pre-wrap mt-3">
              {report.interviewQuestions}
            </pre>

            <pre className="whitespace-pre-wrap mt-3">
              {report.roadmap}
            </pre>

            <pre className="whitespace-pre-wrap mt-3">
              {report.improvement}
            </pre>
          </details>
        </div>
      )
    )}
  </div>
)}

  </div>
)}
  </>
)}
    </div>
  );
}