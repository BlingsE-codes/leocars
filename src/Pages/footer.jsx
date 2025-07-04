import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div>
          <h3 style={{ marginBottom: "10px" }}>🚗 CarHub</h3>
          <p>Your trusted platform for buying, hiring and selling cars in Lagos.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul style={listStyle}>
            <li><Link to="/" style={linkStyle}>Home</Link></li>
            <li><Link to="/about" style={linkStyle}>About</Link></li>
            <li><Link to="/news" style={linkStyle}>News</Link></li>
            <li><Link to="/contact" style={linkStyle}>Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4>Follow Us</h4>
          <ul style={listStyle}>
            <li><a href="https://facebook.com" target="_blank" rel="noreferrer" style={linkStyle}>Facebook</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer" style={linkStyle}>Instagram</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noreferrer" style={linkStyle}>Twitter</a></li>
          </ul>
        </div>
      </div>

      <p style={{ textAlign: "center", marginTop: "20px", color: "#aaa", fontSize: "14px" }}>
        &copy; {new Date().getFullYear()} CarHub. All rights reserved.
      </p>
    </footer>
  );
}

const footerStyle = {
  backgroundColor: "#111",
  color: "white",
  padding: "40px 20px 20px",
  marginTop: "40px"
};

const containerStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  gap: "30px",
  maxWidth: "1000px",
  margin: "auto"
};

const listStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0
};

const linkStyle = {
  color: "#ccc",
  textDecoration: "none",
  fontSize: "15px"
};

export default Footer;
