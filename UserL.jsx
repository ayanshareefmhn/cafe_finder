import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signin = () => {
  const [form, setForm] = useState({ userEmail: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ React Router navigation hook

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:5000/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log("🔹 Login API Response:", data);

    // ✅ Save token if received
    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.userEmail);
      window.dispatchEvent(new Event("storage"));

      console.log("✅ Saved token:", data.token);

      setMessage("Login successful 🎉");
      setTimeout(() => navigate("/"), 1000);
    } else {
      setMessage(data.message || "Invalid credentials");
    }
  } catch (err) {
    console.error("❌ Login Error:", err);
    setMessage("Error signing in ❌");
  }
};


  return (
    <div className="signup-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="userEmail"
          placeholder="Email"
          value={form.userEmail}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}

      {/* 🔹 Add Signup Redirect */}
      <p style={{ marginTop: "15px" }}>
        Don’t have an account?{" "}
        <span
          style={{
            color: "#ff6f61",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => navigate("/signup")}
        >
          Sign up here
        </span>
      </p>
    </div>
  );
};

export default Signin;
