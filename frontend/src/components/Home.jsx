import ExcelAnalyzerNavbar from "./navbar";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden text-white flex flex-col">
      {/* Excel-inspired Grid Background */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="grid grid-cols-12 gap-px h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-green-400"></div>
          ))}
        </div>
      </div>

      {/* Floating Excel Elements */}
      <div className="absolute top-32 right-20 w-40 h-40 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg -rotate-12 blur-sm z-0"></div>
      <div className="absolute bottom-20 left-32 w-28 h-28 bg-gradient-to-r from-green-400/10 to-teal-400/10 rounded-lg rotate-12 blur-sm z-0"></div>
      <div className="absolute top-1/3 left-20 w-20 h-20 bg-green-500/20 rounded-full blur-xl z-0"></div>

      {/* Navbar at the top */}
      <div className="relative z-10 w-full">
        <ExcelAnalyzerNavbar />
      </div>

     
    </div>
  );
}

export default Home;
