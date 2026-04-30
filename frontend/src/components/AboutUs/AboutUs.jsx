import React from "react";
import "./AboutUs.css";

function AboutUs() {
  return (
    <section className="about-section">
      <div className="about-container">
        
        <div className="about-left">
          <h1>Why Choose Us</h1>

          <p>
            We use advanced machine learning models trained on real wine
            chemistry data to predict quality with accuracy and clarity.
          </p>

          <p>
            Our system evaluates acidity, alcohol content, and multiple
            scientific parameters to generate intelligent predictions.
            Smart decisions begin with smart data.
          </p>
        </div>

        <div className="about-right">
          <img src="/wine.jpg" alt="Wine Prediction" />
        </div>

      </div>
    </section>
  );
}

export default AboutUs;
