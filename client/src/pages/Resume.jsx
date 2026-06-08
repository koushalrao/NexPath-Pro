import { useState, useRef } from "react";
import api from "../api/axios";

export default function Resume() {
  const [file, setFile]         = useState(null);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setResult(null); setError(""); }
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("resume", file);
      const res = await api.post("/resume/analyze", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s) =>
    s >= 75 ? "text-green-400" : s >= 50 ? "text-amber-400" : "text-red-400";

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Resume Reviewer</h1>
          <p className="text-gray-500">Upload your resume for ATS score and AI feedback</p>
        </div>

        {/* Upload area */}
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-800 hover:border-purple-500 rounded-xl p-10 text-center cursor-pointer transition-colors mb-6"
        >
          <input ref={inputRef} type="file" accept=".pdf,.docx" onChange={handleFile} className="hidden" />
          <div className="text-4xl mb-3">📄</div>
          {file ? (
            <div>
              <p className="text-white font-medium">{file.name}</p>
              <p className="text-gray-500 text-sm mt-1">{(file.size / 1024).toFixed(0)} KB · Click to change</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 font-medium">Drop your resume here or click to browse</p>
              <p className="text-gray-600 text-sm mt-1">PDF or DOCX · Max 5MB</p>
            </div>
          )}
        </div>

        {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        <button
          onClick={analyze}
          disabled={!file || loading}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-8"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-5">

            {/* ATS Score */}
            {result.atsScore !== null && result.atsScore !== undefined && (
              <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 text-center">
                <div className={`text-6xl font-bold mb-2 ${scoreColor(result.atsScore)}`}>
                  {result.atsScore}
                </div>
                <div className="text-gray-500 text-sm">ATS Score / 100</div>
                <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${result.atsScore >= 75 ? "bg-green-500" : result.atsScore >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                    style={{ width: `${result.atsScore}%` }}
                  />
                </div>
              </div>
            )}

            {/* Summary */}
            {result.summary && (
              <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Summary</h3>
                <p className="text-gray-200 text-sm leading-relaxed">{result.summary}</p>
              </div>
            )}

            {/* Strengths */}
            {result.strengths?.length > 0 && (
              <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
                <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">Strengths</h3>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-green-400 mt-0.5">✓</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {result.improvements?.length > 0 && (
              <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
                <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3">Improvements</h3>
                <ul className="space-y-2">
                  {result.improvements.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-amber-400 mt-0.5">→</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Keywords */}
            {result.missingKeywords?.length > 0 && (
              <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
                <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((k) => (
                    <span key={k} className="text-xs px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}