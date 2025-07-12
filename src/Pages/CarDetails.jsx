import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { motion } from "motion/react";


function formatNumberWithCommas(value) {
  // Remove all non-digit chars first
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "";
  return Number(numericValue).toLocaleString();
}


function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchCar = async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Car not found:", error);
        navigate("/");
        return;
      }
      setCar(data);
      setCurrentImageIndex(0); // safe initialize
      setLoading(false);
    };

    fetchCar();
  }, [id, navigate]);

  const handlePrev = () => {
    if (!car?.image_urls?.length) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? car.image_urls.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    if (!car?.image_urls?.length) return;
    setCurrentImageIndex((prev) =>
      prev === car.image_urls.length - 1 ? 0 : prev + 1
    );
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="dot-spinner"></div>
        <p>Loading car...</p>
      </div>
    );

  if (!car)
    return (
      <div className="loading-container">
        <span className="car-icon">🚗 💥</span>
        <p>Car not found.</p>
      </div>
    );

  return (
    <div className="car-details-container">
      <motion.div
        className="car-details"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.button
          type="button"
          onClick={() => navigate("/")}
          className="back-button"
          whileHover={{ scale: 1.05 }}
        >
          ← Back to Home
        </motion.button>

        <motion.h1
          className="car-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {car.make} {car.model}
        </motion.h1>

        <motion.p
          className="car-price"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          ₦ {formatNumberWithCommas(car.price).toLocaleString()}
        </motion.p>

        <motion.div
          className="car-image-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <img
            src={car.image_urls[currentImageIndex]}
            alt={`car-${currentImageIndex}`}
            className="car-image"
          />

          {car.image_urls.length > 1 && (
            <div className="image-nav-controls">
              <button
                type="button"
                onClick={handlePrev}
                className="image-nav-button"
              >
                prev
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="image-nav-button"
              >
                Next
              </button>
            </div>
          )}
        </motion.div>

        <motion.div
          className="car-info-cta"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="car-info-box">
            <p><span>Make:</span> {car.make}</p>
            <p><span>Model:</span> {car.model}</p>
            <p><span>Year:</span> {car.year}</p>
            <p><span>Chassis:</span> {car.chassis}</p>
            <p><span>Condition:</span> {car.condition}</p>
            <p><span>Shift:</span> {car.shift}</p>
            <p><span>Comment:</span> {car.Comment || "No comment"}</p>
          </div>

          <motion.div
            className="car-cta-box"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3>Interested?</h3>
            <p>Contact our sales team to schedule a test drive.</p>
            <motion.a
              href="tel:+2347032531338"
              className="contact-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Chat The Seller
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CarDetails;
