export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-3xl p-10 max-w-2xl w-full border border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              VeriSure
            </h1>
            <p className="text-slate-500 mt-2">
              Enterprise Background Verification Platform
            </p>
          </div>

          <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-medium">
            Active
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <h2 className="text-slate-500 text-sm">
              Total Candidates
            </h2>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              248
            </p>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200">
            <h2 className="text-emerald-700 text-sm">
              Verified
            </h2>
            <p className="text-3xl font-bold text-emerald-700 mt-2">
              193
            </p>
          </div>

          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
            <h2 className="text-amber-700 text-sm">
              Pending
            </h2>
            <p className="text-3xl font-bold text-amber-700 mt-2">
              41
            </p>
          </div>

          <div className="bg-red-50 rounded-2xl p-5 border border-red-200">
            <h2 className="text-red-700 text-sm">
              Failed
            </h2>
            <p className="text-3xl font-bold text-red-700 mt-2">
              14
            </p>
          </div>
        </div>

        <button className="w-full mt-8 bg-slate-900 hover:bg-slate-800 transition text-white py-4 rounded-2xl font-semibold">
          Start Verification
        </button>
      </div>
    </main>
  );
}