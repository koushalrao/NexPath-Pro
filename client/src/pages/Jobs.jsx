import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("developer");
  const [savedIds, setSavedIds] = useState(new Set());
  const [saving, setSaving]     = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/jobs?search=${search}`);
      setJobs(res.data.jobs || []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSave = async (job) => {
    if (!user) return alert("Please sign in to save jobs.");
    setSaving(job.id);
    try {
      await api.post("/jobs/save", {
        jobId:    String(job.id),
        title:    job.title,
        company:  job.company,
        location: job.location,
        url:      job.url,
        tags:     job.tags,
      });
      setSavedIds((prev) => new Set([...prev, job.id]));
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Internships & Jobs</h1>
          <p className="text-gray-500">Live remote opportunities updated daily</p>
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
            placeholder="Search role, skill, company..."
            className="flex-1 px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button
            onClick={fetchJobs}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors"
          >
            Search
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-600">No jobs found. Try a different search.</div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div key={job.id} className="p-5 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      {job.companyLogo && (
                        <img src={job.companyLogo} alt="" className="w-8 h-8 rounded object-contain bg-white p-0.5" />
                      )}
                      <h3 className="font-semibold text-white truncate">{job.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{job.company} · {job.location}</p>
                    <div className="flex flex-wrap gap-2">
                      {job.tags?.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <a href={job.url} target="_blank" rel="noreferrer"
                      className="text-sm px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-center transition-colors">
                      Apply
                    </a>
                    <button
                      onClick={() => handleSave(job)}
                      disabled={saving === job.id || savedIds.has(job.id)}
                      className="text-sm px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      {savedIds.has(job.id) ? "Saved ✓" : saving === job.id ? "..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}