import ResumeUpload from "../components/ResumeUpload";
import Sidebar from "../components/Slidebar"
import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 min-h-screen">

        <Navbar />

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold">
              ATS Score
            </h3>

            <p className="text-5xl font-extrabold mt-4 text-green-600">
  82%
</p>

<p className="mt-2 text-gray-500">
  Excellent Resume Score
</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold">
              Resume Status
            </h3>

            <p className="text-2xl mt-4">
              Uploaded Sucessfully 
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold">
              Job Matches
            </h3>

            <p className="text-2xl mt-4">
              12 Matching Opportunities 
            </p>
          </div>

        </div>

        <div className="bg-white rounded-xl shadow-lg mt-8 p-6">
          <h3 className="text-xl font-bold mb-4">
            Recent Activity
          </h3>

          <ul className="space-y-3">
            <li>Resume uploaded successfully</li>
            <li>ATS score generated</li>
            <li>3 new job matches found</li>
          </ul>
        </div>
        <ResumeUpload />

      </div>

    </div>
  );
}