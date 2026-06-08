import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/user/dashboard")
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const memberSince = data?.user?.createdAt
    ? new Date(data.user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : "June 2026";

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center gap-4 mb-10">
          <img src={user?.photoURL} alt="" className="w-14 h-14 rounded-full border-2 border-purple-500" />
          <div>
            <h1 className="text-2xl font-bold text-white">Hey, {user?.displayName?.split(" ")[0]} 👋</h1>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Saved Jobs",   value: data?.savedJobs?.length  || 0, color: "text-purple-400" },
            { label: "Saved Events", value: data?.savedEvents?.length || 0, color: "text-blue-400"  },
            { label: "Resume Score", value: "—",                            color: "text-green-400" },
            { label: "Member Since", value: memberSince,                    color: "text-amber-400" },
          ].map((s) => (
            <div key={s.label} className="p-5 rounded-xl bg-gray-900 border border-gray-800">
              <div className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Saved Jobs</h2>
            <Link to="/jobs" className="text-sm text-purple-400 hover:text-purple-300">Browse more</Link>
          </div>
          {data?.savedJobs?.length === 0 ? (
            <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 border-dashed text-center text-gray-600 text-sm">
              No saved jobs yet.{" "}
              <Link to="/jobs" className="text-purple-400 hover:underline">Find internships</Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {data?.savedJobs?.map((job) => (
                <div key={job._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-900 border border-gray-800">
                  <div>
                    <div className="text-sm font-medium text-white">{job.title}</div>
                    <div className="text-xs text-gray-500">{job.company} · {job.location}</div>
                  </div>
                  <a href={job.url} target="_blank" rel="noreferrer"
                    className="text-xs px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors">
                    Apply
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Saved Events</h2>
            <Link to="/events" className="text-sm text-blue-400 hover:text-blue-300">Browse more</Link>
          </div>
          {data?.savedEvents?.length === 0 ? (
            <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 border-dashed text-center text-gray-600 text-sm">
              No saved events yet.{" "}
              <Link to="/events" className="text-blue-400 hover:underline">Find hackathons</Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {data?.savedEvents?.map((event) => (
                <div key={event._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-900 border border-gray-800">
                  <div>
                    <div className="text-sm font-medium text-white">{event.title}</div>
                    <div className="text-xs text-gray-500">{event.organizer} · Deadline: {event.deadline}</div>
                  </div>
                  <a href={event.url} target="_blank" rel="noreferrer"
                    className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors">
                    Register
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Find Internships",  to: "/jobs",   color: "bg-purple-600 hover:bg-purple-500" },
            { label: "Browse Hackathons", to: "/events", color: "bg-blue-600 hover:bg-blue-500"    },
            { label: "Review Resume",     to: "/resume", color: "bg-green-600 hover:bg-green-500"  },
          ].map((a) => (
            <Link key={a.label} to={a.to}
              className={`p-4 rounded-xl text-center text-sm font-medium text-white transition-colors ${a.color}`}>
              {a.label}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}