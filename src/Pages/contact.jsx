/* eslint-disable no-unused-vars */

import { motion } from "motion/react";

function Contact() {
  return (
    
      <motion.div
        className="contact-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="contact-title">Contact Our Sales Team</h1>
        <p className="contact-subtitle">
          We’d love to hear from you! Reach out using any of the options below.
        </p>

        <div className="contact-card-container">
          {/* Phone */}
          <div className="contact-card">
            <h3>📞 Call Us</h3>
            <p>
              Speak directly with our team for quick answers and availability.
            </p>
            <a href="tel:+2347032531338" className="contact-link">
              +2347032531338
            </a>
          </div>

          {/* WhatsApp */}
          <div className="contact-card">
            <h3>💬 WhatsApp</h3>
            <p>Chat with us on WhatsApp for easy, instant support.</p>
            <a
              href="https://wa.me/+2347032531338"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              Message on WhatsApp
            </a>
          </div>

          {/* Email */}
          <div className="contact-card">
            <h3>📧 Email</h3>
            <p>Send us a detailed inquiry and we’ll respond promptly.</p>
            <a href="mailto:omoruyilucky@gmail.com" className="contact-link">
              charlichal2@gmail.com
            </a>
          </div>
        </div>

        <div className="contact-footer">
          🚗✨ We’re here to help you find your perfect car!
        </div>
      </motion.div>
    
  );
}

export default Contact;
