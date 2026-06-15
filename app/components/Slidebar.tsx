
export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-blue-700 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">
        AI Career Copilot
      </h1>

      <ul className="space-y-6">
        <li className="cursor-pointer hover:text-blue-200">
          Dashboard
        </li>

        <li className="cursor-pointer hover:text-blue-200">
          Resume Analysis
        </li>

        <li className="cursor-pointer hover:text-blue-200">
          Job Matches
        </li>

        <li className="cursor-pointer hover:text-blue-200">
          Mock Interview
        </li>

        <li className="cursor-pointer hover:text-blue-200">
          Settings
        </li>
      </ul>
    </div>
  );
}