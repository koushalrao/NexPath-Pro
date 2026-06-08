import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [savedIds, setSavedIds] = useState(new Set());
  const [saving, setSaving]     = useState(null);

  useEffect(() => {
    api.get(`/events?status=${filter}`)
      .then((r) => setEvents(r.data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const handleSave = async (event) => {
    if (!user) return alert("Please sign in to save events.");
    setSaving(event.id);
    try {
      await api.post("/events/save", {
        eventId:   event.id,
        title:     event.title,
        organizer: event.organizer,
        url:       event.url,
        deadline:  event.deadline,
      });
      setSavedIds((prev) => new Set([...prev, event.id]));
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  const statusColor = (s) =>
    s === "open" ? "text-green-400 bg-green-400/10 border-green-400/20"
                 : "text-amber-400 bg-amber-400/10 border-amber-400/20";

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Hackathons & Events</h1>
          <p className="text-gray-500">Curated competitions with real prizes</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-8">
          {["all", "open", "upcoming"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors
                ${filter === f
                  ? "bg-purple-600 text-white"
                  : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"}`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {events.map((event) => (
              <div key={event.id} className="p-5 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-white leading-snug pr-4">{event.title}</h3>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border capitalize ${statusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">{event.organizer}</p>
                <p className="text-sm text-gray-400 mb-4 flex-1">{event.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags?.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                  <div>
                    <div className="text-xs text-gray-600">Deadline</div>
                    <div className="text-sm text-white">{event.deadline}</div>
                  </div>
                  <div className="text-sm font-medium text-green-400">{event.prize}</div>
                </div>

                <div className="flex gap-2 mt-4">
                  <a href={event.url} target="_blank" rel="noreferrer"
                    className="flex-1 text-sm py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-center transition-colors">
                    Register
                  </a>
                  <button
                    onClick={() => handleSave(event)}
                    disabled={saving === event.id || savedIds.has(event.id)}
                    className="text-sm px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white transition-all disabled:opacity-50"
                  >
                    {savedIds.has(event.id) ? "Saved ✓" : saving === event.id ? "..." : "Save"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}