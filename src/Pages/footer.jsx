import React from "react";
import { Link } from "react-router-dom";
import {
  SiToyota,
  SiHonda,
  SiMercedes,
  SiBmw,
  SiFord,
  SiNissan,
  SiAudi,
  SiHyundai,
  SiKia,
  SiVolkswagen
} from "react-icons/si";

function Footer() {

const brands = [
  { name: "Toyota", icon: <SiToyota /> },
  { name: "Honda", icon: <SiHonda /> },
  { name: "Mercedes", icon: <SiMercedes /> },
  { name: "BMW", icon: <SiBmw /> },
  { name: "Ford", icon: <SiFord /> },
  { name: "Nissan", icon: <SiNissan /> },
  { name: "Audi", icon: <SiAudi /> },
  { name: "Hyundai", icon: <SiHyundai /> },
  { name: "Kia", icon: <SiKia /> },
  { name: "Volkswagen", icon: <SiVolkswagen /> },
];

  return (
    <>
    
     <footer className="footer">
      <h4>Popular Car Brands</h4>
      <ul className="brand-list">
        {brands.map((brand) => (
          <li key={brand.name} className="brand-item">
            <Link to={`/search?q=${encodeURIComponent(brand.name)}`}>
              <span className="brand-icon">{brand.icon}</span>
              <span className="brand-name">{brand.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p>© {new Date().getFullYear()} Leos AUTOS. All rights reserved.</p>
    </footer>
    </>
  );
}

export default Footer;
