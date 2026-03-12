import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage.jsx";
import AuthPage from "./pages/authPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import EntryDetailPage from "./pages/EntryDetailPage.jsx";
import CreateEntryPage from "./pages/CreateEntryPage.jsx";
import CameraTest from "./pages/CameraTest.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/entry/:id" element={<EntryDetailPage />} />
        <Route path="/create" element={<CreateEntryPage />} />
        <Route path="/test" element={<CameraTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
