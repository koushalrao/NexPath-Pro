import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Home() {
  const { user, setToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const result  = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const res = await api.post("/auth/google-login", { idToken });
      localStorage.setItem("nexpath_token", res.data.token);
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Sign in failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Built for CS students in India
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Your career starts<br />
          <span className="text-purple-500">here.</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-xl mb-10">
          Mentoro helps you find internships, discover hackathons, review your resume with AI, and get career advice — all in one place.
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center gap-3 px-6 py-3 bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl w-full">
          {[
            { icon: "💼", label: "Live Internships", desc: "Real remote jobs updated daily" },
            { icon: "🏆", label: "Hackathons",       desc: "Top events with prizes" },
            { icon: "🤖", label: "AI Advisor",       desc: "Career guidance powered by Claude" },
            { icon: "📄", label: "Resume Review",    desc: "ATS score + AI feedback" },
          ].map((f) => (
            <div key={f.label} className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-left">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-sm font-medium text-white mb-1">{f.label}</div>
              <div className="text-xs text-gray-500">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}