import React, { useEffect, useState } from "react";

const Profile = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/signup");

    // You can decode token to show user info
    const payload = JSON.parse(atob(token.split(".")[1]));
    setEmail(payload.email || "Verified User");
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome to your Profile</h2>
      <p>Email: {email}</p>
    </div>
  );
};

export default Profile;
