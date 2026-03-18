import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // ← add Navigate
import { AuthProvider } from "./context/AuthContext.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import HomePage from "./pages/Homepage.jsx";
import AuthPage from "./pages/authPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import EntryDetailPage from "./pages/EntryDetailPage.jsx";
import CreateEntryPage from "./pages/CreateEntryPage.jsx";
import EditEntryPage from "./pages/EditEntryPage.jsx";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading && !user)
    // ← && not &
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "#faf7f2" }}
      >
        <p style={{ color: "#a08c72", fontFamily: "Georgia, serif" }}>
          Loading...
        </p>
      </div>
    );
  return user ? children : <Navigate to="/auth" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#faf7f2" }} />
    );
  if (user) return <Navigate to="/dashboard" />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />{" "}
          {/* ← uppercase */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/entry/:id"
            element={
              <ProtectedRoute>
                <EntryDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateEntryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/entry/:id/edit"
            element={
              <ProtectedRoute>
                <EditEntryPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
