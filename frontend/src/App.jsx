import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";
import AuthPage from "./pages/authPage";
import DashboardPage from "./pages/DashboardPage";
import EntryDetailPage from "./pages/EntryDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/entry/:id" element={<EntryDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
