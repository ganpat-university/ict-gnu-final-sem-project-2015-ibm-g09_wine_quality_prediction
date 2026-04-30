import { Range } from "react-range";
import { useState } from "react";
import "./Slider.css";

export default function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  accent = "#30D158",
  precision = 0
}) {
  const [dragging, setDragging] = useState(false);
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="slider-wrapper">
      <Range
        values={[value]}
        min={min}
        max={max}
        step={step}
        onChange={(vals) => onChange(vals[0])}
        onFinalChange={() => setDragging(false)}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className={`slider-track ${dragging ? "dragging" : ""}`}
            onPointerDown={() => setDragging(true)}
          >
            <div
              className="slider-fill"
              style={{
                width: `${percent}%`,
                background: accent
              }}
            />
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className={`slider-thumb liquid-glass ${
              dragging ? "dragging" : ""
            }`}
          >
            <span className="slider-value">
              {value.toFixed(precision)}
            </span>
          </div>
        )}
      />
    </div>
  );
}
