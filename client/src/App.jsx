import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home      from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Jobs      from "./pages/Jobs";
import Events    from "./pages/Events";
import AI        from "./pages/AI";
import Resume    from "./pages/Resume";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/jobs"     element={<Jobs />} />
          <Route path="/events"   element={<Events />} />
          <Route path="/ai"       element={<ProtectedRoute><AI /></ProtectedRoute>} />
          <Route path="/resume"   element={<ProtectedRoute><Resume /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;