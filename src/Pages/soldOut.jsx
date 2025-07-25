/* eslint-disable no-unused-vars */


import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
//import "./SoldOut.css";

function formatNumberWithCommas(value) {
  // Remove all non-digit chars first
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "";
  return Number(numericValue).toLocaleString();
}


function SoldOut() {
  const [soldCars, setSoldCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soldPrice, setSoldPrice] = useState("");


  useEffect(() => {
    fetchSoldCars();
  }, []);

  const fetchSoldCars = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("sold_cars").select("*").order("sold_date", { ascending: false });

    if (error) {
      console.error("Error fetching sold cars:", error);
    } else {
      setSoldCars(data);
    }
    setLoading(false);
  };

  
const totalRevenue = soldCars.reduce((total, car) => total + Number(car.price || 0), 0)

  if (loading) return (
  <div className="loading-container">
    <span className="car-icon">🚗</span>
    <p>Loading sold cars...</p>
  </div>
);

  return (
    <motion.div
      className="sold-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="sold-title">🎉 Sold Cars</h1>
      <p className="sold-subtitle">
        These cars have been successfully sold!
      </p>

        {soldCars.length === 0 ? (
        <p className="sold-empty">No sold cars yet 🚗✨</p>
      ) : (
        <>
          <div className="sold-list">
            {soldCars.map((car) => (
              <div key={car.id} className="sold-card">
                <img
                  src={car.image_urls[0]}
                  alt={`${car.make} ${car.model}`}
                  className="sold-image"
                />
                <div className="sold-info">
                  <h3>{car.make} {car.model}</h3>
                  <p>₦ {formatNumberWithCommas(car.price).toLocaleString()}</p>
                  <p>Year: {car.year}</p>
                  <p>Chassis: {car.chassis}</p>
                  <p>Sold on: {new Date(car.sold_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="sold-count">
            Total Sold Cars: {soldCars.length} 
            {soldCars.length > 0 && (
              <span className="sold-price">,<br></br>
                Total Revenue: ₦{(totalRevenue)}
              </span>
            )}
          </p>
        </>
      )}

      <Link to="/" className="sold-back">← Back to Home</Link>
    </motion.div>
  );
}

export default SoldOut;
