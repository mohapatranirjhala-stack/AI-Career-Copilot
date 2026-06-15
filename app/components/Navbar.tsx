
export default function Navbar() {
  return (
    <div className="flex justify-between items-center bg-white shadow p-4 rounded-xl mb-6">
      <h2 className="text-2xl font-bold">
        Dashboard
      </h2>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600"></div>

        <span>
          Student User
        </span>
      </div>
    </div>
  );
}