import React from 'react';
//import './News.css'; // Optional CSS for styling

const newsArticles = [ 
  {
    id: 1,
    title: 'Tech Conference 2025 Announced',
    summary: 'Global tech leaders are set to gather in Lagos for the 2025 Tech Conference...',
    image: 'https://acybcneijroytxwmmgdx.supabase.co/storage/v1/object/public/news//tech%20confre.JPG',
  },
  {
    id: 2,
    title: 'New Electric Car Hits the Market',
    summary: 'The latest electric vehicle boasts a 600km range and fast charging capabilities...',
    image: 'https://acybcneijroytxwmmgdx.supabase.co/storage/v1/object/public/news//new%20electir.JPG',
  },
  {
    id: 3,
    title: 'Startup Raises $10M in Seed Funding',
    summary: 'A Nigerian fintech startup has raised funding to expand its mobile banking solutions...',
    image: 'https://acybcneijroytxwmmgdx.supabase.co/storage/v1/object/public/news//100%20miliio.JPG',
  },
];

const News = () => {
  return (
    <div className="news-container">
      <h2>Latest News</h2>
      <div className="news-list">
        {newsArticles.map((article) => (
          <div key={article.id} className="news-card">
                <a><img src={article.image} alt={article.title} /></a> 
            <div className="news-content">
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
