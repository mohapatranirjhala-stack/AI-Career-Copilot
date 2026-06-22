import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="flex justify-between items-center px-10 py-6">
  <h2 className="text-2xl font-bold text-blue-600">
    CareerCopilot
  </h2>

  <div className="space-x-6">
    <button>Features</button>
    <button>Pricing</button>
    <button>Login</button>
  </div>
</nav>
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        
        <h1 className="text-6xl font-extrabold text-gray-900 mb-6">
  Land Your Dream Job With AI
</h1>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Analyze resumes, optimize ATS scores, generate cover letters,
match job descriptions, and prepare for interviews using AI.
        </p>

       

<Link href="/login">
  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
    Get Started Free
  </button>
</Link>

      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="p-6 rounded-2xl shadow-lg bg-white">
            <h3 className="text-xl font-bold mb-3">
              Resume Analysis
            </h3>
            <p>
              Upload your resume and receive detailed AI feedback.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow-lg bg-white">
            <h3 className="text-xl font-bold mb-3">
              ATS Score
            </h3>
            <p>
              Evaluate how well your resume performs against ATS systems.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow-lg bg-white">
            <h3 className="text-xl font-bold mb-3">
              AI Interview
            </h3>
            <p>
              Practice mock interviews with intelligent AI feedback.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}