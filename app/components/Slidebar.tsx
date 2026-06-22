
"use client";

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function Sidebar({
  activeTab,
  setActiveTab,
}: SidebarProps) {
  return (
    <div className="w-64 min-h-screen bg-blue-700 text-white p-6">

      <h1 className="text-2xl font-bold mb-10">
        AI Career Copilot
      </h1>

      <ul className="space-y-4">

        <li
          onClick={() =>
            setActiveTab("dashboard")
          }
          className={`cursor-pointer p-3 rounded-lg ${
            activeTab === "dashboard"
              ? "bg-white text-blue-700 font-bold"
              : "hover:bg-blue-600"
          }`}
        >
          Dashboard
        </li>

        <li
          onClick={() =>
            setActiveTab("resume")
          }
          className={`cursor-pointer p-3 rounded-lg ${
            activeTab === "resume"
              ? "bg-white text-blue-700 font-bold"
              : "hover:bg-blue-600"
          }`}
        >
          Resume Analysis
        </li>

        <li
          onClick={() =>
            setActiveTab("interview")
          }
          className={`cursor-pointer p-3 rounded-lg ${
            activeTab === "interview"
              ? "bg-white text-blue-700 font-bold"
              : "hover:bg-blue-600"
          }`}
        >
          Mock Interview
        </li>

        <li
          onClick={() =>
            setActiveTab("roadmap")
          }
          className={`cursor-pointer p-3 rounded-lg ${
            activeTab === "roadmap"
              ? "bg-white text-blue-700 font-bold"
              : "hover:bg-blue-600"
          }`}
        >
          Learning Roadmap
        </li>

        <li
          onClick={() =>
            setActiveTab("history")
          }
          className={`cursor-pointer p-3 rounded-lg ${
            activeTab === "history"
              ? "bg-white text-blue-700 font-bold"
              : "hover:bg-blue-600"
          }`}
        >
          History
        </li>

      </ul>
    </div>
  );
}