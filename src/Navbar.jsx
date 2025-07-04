import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { toast } from "sonner";

function Navbar() {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setFullName(user.user_metadata?.full_name || "");
      }
    };

    fetchUser();

    // Auth state listener to update name on login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast.success("Signed out");
      setUser(null);
      setFullName("");
      navigate("/login");
    } else {
      toast.error("Sign out failed");
    }
  };

  const handlerentcar = () => {
    toast("Let us know your choice of car. We are a call away. Just contact us");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/"><h3 className="navbar-brand">🚗 LEOS AUTOS</h3></a>
        <Link to="/" className="nav-link">🏠 Home</Link>
        <Link to="/about" className="nav-link">ℹ️ About</Link>
        <Link to="/contact" className="nav-link">📞 Contact</Link>
        <Link to="/sold" className="nav-link">Sold Cars</Link>

        <div className="nav-dropdown">
          <select
            onChange={(e) => {
              const url = e.target.value;
              if (url === "rent") handlerentcar();
              else if (url) window.open(url, "_blank");
            }}
            defaultValue=""
            className="nav-select"
          >
            <option value="">More Cars ⬇</option>
            <option value="rent">Rent a Car</option>
            <option value="https://jiji.ng/cars">JIJI</option>
            <option value="https://www.copart.com/content/us/en/landing-page/nigeria">Copart</option>
            <option value="https://www.iaai.com/marketing/auction-vehicles-in-nigeria">IAAI</option>
          </select>
        </div>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <span className="signed-in">👋 Welcome{fullName ? `, ${fullName}` : ""}</span>
            <button className="nav-btn" onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <>
            <button className="nav-btn" onClick={() => navigate("/login")}>Login</button>
            <Link to="/register" className="nav-link register-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
