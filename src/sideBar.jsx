import React from 'react';
//import './Sidebar.css'; // ✅ Add this!

function Sidebar() {
  return (
    <div className="sidebar">
      <h3>🚗 Sponsored Ads</h3>

      <div className="ad-card">
        <img src="https://acybcneijroytxwmmgdx.supabase.co/storage/v1/object/public/ads-images//carloanleo.png" alt="Ad" />
        <p>Need a loan for your car?</p>
        <div className="coming-soon">🚧 Coming Soon 🚧</div>
        <button>Apply Now</button>
      </div>

      <div className="ad-card">
        <img src="https://acybcneijroytxwmmgdx.supabase.co/storage/v1/object/public/ads-images//carinuranceleo.png" alt="Ad" />
        <p>Affordable car insurance from ₦5,000/month</p>
        <div className="coming-soon">🚧 Coming Soon 🚧</div>
        <button>Get Quote</button>
      </div>

      <div className="ad-card">
        <img src="https://acybcneijroytxwmmgdx.supabase.co/storage/v1/object/public/ads-images//carmechanicleos-small.png" alt="Ad" />
        <p>Trusted mechanics in Lagos!</p>
        <div className="coming-soon">🚧 Coming Soon 🚧</div>
        <button>Find One</button>
      </div>
    </div>
  );
}

export default Sidebar;
