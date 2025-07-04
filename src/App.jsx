import "./App.css";
import Navbar from "./Navbar.jsx";
import Home from "./Pages/Home.jsx";
import News from "./Pages/News.jsx";
import About from "./About.jsx";
import Login from "./Pages/login.jsx";
import Sidebar from "./Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { supabase } from "./supabaseClient";
import React, { useEffect, useState } from "react";
import Footer from "./Pages/footer.jsx";
import CarDetails from "./Pages/CarDetails.jsx";
import Mainpage from "./Mainpage";
import Contact from "./Pages/contact.jsx";
import SoldOut from "./Pages/soldOut"
import Register from "./Pages/Register";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function App() {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);


 
  return (
    <>
      <Navbar user={user} />
   
      <div className="app-wrapper">
        {/* <Sidebar /> */}

        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
         
          <Route path="about" element={<About />} />
          <Route path="news" element={<News />} />
          <Route path="login" element={<Login />} />
          <Route path="footer" element={<Footer />} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/" element={<Mainpage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sold" element={<SoldOut />} />
          <Route path="/register" element={<Register />} />
       
        </Routes>
          
      </div>
    </>
  );
}

export default App;
