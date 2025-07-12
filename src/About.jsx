
import profileImg from "../src/assets/leo-car-logo.jpg";
import { FaFacebook, FaTiktok, FaInstagram, FaEnvelope } from "react-icons/fa";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-image">
        <img className="profile-img" src={profileImg} alt="About Us CEO" />
      </div>

      <div className="about-text">
        <h1>About Us</h1>
        <p>
          Welcome to Loes Autos! We're passionate about providing excellent service and
          innovation that makes life easier. Our goal is to bring you quality, simplicity, and
          support.
        </p>
        <p>
          Founded in 2019, we've helped thousands of users manage their needs more efficiently.
          We believe in transparency, innovation, and customer success.
        </p>

        <div className="about-contact">
          <h3>Contact Us</h3>
          <p>Email: <a href="mailto:omoruyilucky@gmail.com" target="_blank" rel="noopener noreferrer">omoruyilucky@gmail.com</a><br></br><br></br>
          </p>
          
             <a href="tel:+2347032531338" className="contact-link">
              +2347032531338
            </a><br></br><br></br>
              <a href="tel:+2349013288752" className="contact-link">
              +2349013288782
            </a>
          <p>Address: 512 Road behind old Nitel Festac, Lagos, Nigeria</p>
        </div>

        <p className="about-follow">
          Follow us on our social platforms and reach out any time — we’d love to hear from you!
        </p>

        <div className="floating-tab">
          <ul>
            <li>
              <a href="https://www.tiktok.com/@yourprofile" target="_blank" rel="noopener noreferrer">
                <FaTiktok /> TikTok
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
                <FaFacebook /> Facebook
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
                <FaInstagram /> Instagram
              </a>
            </li>
            <li>
              <a href="mailto:omoruyilucky@gmail.com" target="_blank" rel="noopener noreferrer">
                <FaEnvelope /> Email Us
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;

