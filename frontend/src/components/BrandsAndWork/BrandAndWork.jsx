import React from "react";
import "./BrandAndWork.css";

function BrandsAndWork() {
  return (
    <section className="brands-section">
      <div className="brands-container">

        {/* Trusted By */}
        <p className="trusted-text">TRUSTED BY WINE BRANDS & RETAILERS</p>

        <div className="brand-logos">
          <span>Vineyard Select</span>
          <span>Grand Reserve</span>
          <span>Oak Barrel Co.</span>
          <span>Crimson Cellars</span>
          <span>Silver Grape</span>
          <span>Heritage Wines</span>
        </div>

        {/* What We Do */}
        <div className="what-we-do">
          <h2>What We Do</h2>

          <p>
            Our AI-driven system analyzes wine chemistry using trained
            machine learning models. We evaluate acidity, alcohol,
            density, and key composition metrics to predict wine quality
            with precision.
          </p>

          <div className="features">
            <div className="feature">✔ Data-Driven Predictions</div>
            <div className="feature">✔ Scientific Accuracy</div>
            <div className="feature">✔ Fast Real-Time Results</div>
            <div className="feature">✔ Transparent Model Insights</div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default BrandsAndWork;
