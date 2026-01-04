import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import CafeMap from "../components/MapContainer";
import FavoritesPage from "../components/FavoritesPage";
import Signup from "../components/UserS";  // ✅ Correct import (SignUp page)
import Signin from "../components/UserL";  // ✅ For login page
import Profile from "../components/Profile"; // ✅ User profile page

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Router>
      <Navbar onSearch={setSearchTerm} />
      <Routes>
        {/* 🏠 Home Page */}
        <Route path="/" element={<CafeMap searchTerm={searchTerm} />} />

        {/* ❤️ Favorites Page */}
        <Route path="/favorites" element={<FavoritesPage />} />

        {/* 👤 Clerk Authentication */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        {/* 🧑 User Profile Page */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
