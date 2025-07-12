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

  const handleRentCar = () => {
    toast("Let us know your choice of car. We are a call away. Just contact us");
  };
  const handleCarReg = () => {
    toast("Contact us using the contact page for car registration details.");
  };
  

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="nav-logo">🚗 LEOS AUTOS</Link>
        <Link to="/home" className="nav-link">🏠 Home</Link>
        <Link to="/about" className="nav-link">ℹ️ About</Link>
        <Link to="/contact" className="nav-link">📞 Contact</Link>
        <Link to="/sold" className="nav-link">✅ Sold Cars</Link>
        <div className="nav-dropdown">
          <select
            onChange={(e) => {
              const url = e.target.value;
              if (url === "rent") handleRentCar();
              else if (url) window.open(url, "_blank");
            }}
            onClick={(e) => {
              if (e.target.value === "reg") {
                e.preventDefault();
                handleCarReg();
              }
            }}
            defaultValue=""
            className="nav-select"
          >
            <option value="">More Options ⬇</option>
            <option value="rent">Rent a Car</option>
            <option value="reg">Car Reg</option>
            <option value="https://jiji.ng/cars">JIJI</option>
            <option value="https://www.copart.com/content/us/en/landing-page/nigeria">Copart</option>
            <option value="https://www.iaai.com/marketing/auction-vehicles-in-nigeria">IAAI</option>
          </select>
        </div>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-user">👋 Welcome{fullName ? `, ${fullName}` : ""}</span>
            <button
              className="nav-btn logged-in"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button
              className="nav-btn logged-out"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <Link to="/register" className="nav-link nav-register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
