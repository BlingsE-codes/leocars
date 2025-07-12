import React from "react";
//import './Sidebar.css'; // ✅ Add this!

function Sidebar() {
  return (
    <div className="sidebar">
      <h3 className="ad-title">🚗 Sponsored Ads</h3>
      <section className="ads-section">
        <div className="ad-card">
          <img
            src="https://acybcneijroytxwmmgdx.supabase.co/storage/v1/object/public/ads-images//leo%20car%20docu.jpg"
            alt="Ad"
          />
          <p>Need to register your car?</p>
          <div className="coming-soon">🚧 We handle that perfectly for you 🚧</div>
          <button>Apply Now</button>
        </div>

        <div className="ad-card">
          <img
            src="https://acybcneijroytxwmmgdx.supabase.co/storage/v1/object/public/ads-images//carinuranceleo.png"
            alt="Ad"
          />
          <p>Affordable car insurance from ₦5,000/month</p>
          <div className="coming-soon">🚧 Coming Soon 🚧</div>
          <button>Get Quote</button>
        </div>

        <div className="ad-card">
          <img
            src="https://acybcneijroytxwmmgdx.supabase.co/storage/v1/object/public/ads-images//leo-car-logo.jpg"
            alt="Ad"
          />
          <p>Trusted mechanics in Lagos!</p>
          <div className="coming-soon">🚧 We treat our clients as VIP 🚧</div>
          <button>Find One</button>
        </div>
      </section>
    </div>
  );
}

export default Sidebar;
