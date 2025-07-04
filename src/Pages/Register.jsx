// src/Pages/Register.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
//import "./Register.css"; // Your external CSS

function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendEmail, setResendEmail] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const { _, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone_number: phone },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Registered! Please check your email to confirm your account.");
      setResendEmail(email); // Save email for resend
      navigate("/login"); // Optional: Or stay here to allow resend
    }
  };

  const handleResend = async () => {
    if (!resendEmail) {
      toast.error("Enter your email to resend verification.");
      return;
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: resendEmail,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Verification email resent. Check your inbox!");
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      <form onSubmit={handleRegister} className="register-form">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Re-enter Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" className="register-btn">
          Register
        </button>
      </form>

      <button onClick={handleResend} className="resend-btn">
        Resend Confirmation Email
      </button>
    </div>
  );
}

export default Register;
