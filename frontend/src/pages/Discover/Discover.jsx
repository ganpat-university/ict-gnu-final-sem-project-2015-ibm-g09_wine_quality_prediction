import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Heart, Share2, Info } from 'lucide-react';
import './Discover.css';

const Discover = () => {
  const randomWines = [
    {
      id: 1,
      name: "Vintage Merlot 2018",
      region: "Bordeaux, France",
      rating: 4.8,
      quality: 8,
      price: "$45",
      image: "https://images.unsplash.com/photo-1510850477540-13bd1450c188?auto=format&fit=crop&q=80&w=800",
      description: "A rich, full-bodied red with notes of black cherry and plum."
    },
    {
      id: 2,
      name: "Crisp Chardonnay 2021",
      region: "Napa Valley, USA",
      rating: 4.5,
      quality: 7,
      price: "$32",
      image: "https://images.unsplash.com/photo-1559158068-930a7af797c4?auto=format&fit=crop&q=80&w=800",
      description: "Elegantly balanced with citrus notes and a hint of vanilla oak."
    },
    {
      id: 3,
      name: "Nebbiolo Reserve",
      region: "Piedmont, Italy",
      rating: 4.9,
      quality: 9,
      price: "$78",
      image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800",
      description: "Powerful tannins with complex floral and earthy aromas."
    },
    {
      id: 4,
      name: "Rosé D'Anjou",
      region: "Loire Valley, France",
      rating: 4.2,
      quality: 6,
      price: "$18",
      image: "https://images.unsplash.com/photo-1558001239-474330be63e3?auto=format&fit=crop&q=80&w=800",
      description: "Fresh and fruity with strawberry and summer berry notes."
    },
    {
      id: 5,
      name: "Old Vine Zinfandel",
      region: "Sonoma, USA",
      rating: 4.7,
      quality: 8,
      price: "$55",
      image: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&q=80&w=800",
      description: "Bold and spicy with layers of dark fruit and pepper."
    },
    {
      id: 6,
      name: "Riesling Spätlese",
      region: "Mosel, Germany",
      rating: 4.6,
      quality: 7,
      price: "$28",
      image: "https://images.unsplash.com/photo-1566393028639-d108a42c46a7?auto=format&fit=crop&q=80&w=800",
      description: "Delicate sweetness balanced by vibrant acidity."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="discover-page">
      <div className="discover-hero">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Discover <span className="text-wine">Excellence</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Explore top-rated wines and community predictions from around the globe.
        </motion.p>
        
        <motion.div 
          className="search-bar-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input type="text" placeholder="Search for wines, regions, or vintages..." />
          </div>
          <button className="filter-btn">
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </motion.div>
      </div>

      <motion.div 
        className="discover-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {randomWines.map((wine) => (
          <motion.div 
            key={wine.id} 
            className="wine-card"
            variants={cardVariants}
            whileHover={{ y: -10 }}
          >
            <div className="wine-image-container">
              <img src={wine.image} alt={wine.name} />
              <div className="wine-overlay">
                <button className="icon-btn"><Heart size={18} /></button>
                <button className="icon-btn"><Share2 size={18} /></button>
              </div>
              <div className="quality-badge">
                {wine.quality}/10
              </div>
            </div>
            <div className="wine-info">
              <div className="wine-header">
                <h3>{wine.name}</h3>
                <div className="wine-rating">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span>{wine.rating}</span>
                </div>
              </div>
              <p className="wine-region">{wine.region}</p>
              <p className="wine-desc">{wine.description}</p>
              <div className="wine-footer">
                <span className="wine-price">{wine.price}</span>
                <button className="details-btn">
                  <Info size={16} />
                  <span>Details</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Discover;
