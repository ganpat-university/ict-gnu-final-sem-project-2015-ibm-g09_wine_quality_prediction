import React, { useEffect, useState } from "react";
import "./History.css";
import { useAuth } from "../../context/AuthContext";
import { Clock, Wine, ChevronDown, ChevronUp } from "lucide-react";

function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/history/${user.uid}`);
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setHistory(data.history || []);
      } catch (err) {
        setError(`Could not load history. Please check if the backend is live at ${import.meta.env.VITE_API_BASE_URL}`);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const getQualityLabel = (score) => {
    if (score >= 8) return { label: "Excellent", color: "#a0c878" };
    if (score >= 6) return { label: "Good", color: "#e0b84d" };
    if (score >= 5) return { label: "Average", color: "#e08c4d" };
    return { label: "Poor", color: "#e05252" };
  };

  const toggleExpand = (idx) => {
    setExpanded(expanded === idx ? null : idx);
  };

  if (loading) {
    return (
      <div className="history-page">
        <div className="history-loading">Loading your predictions...</div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Prediction History</h1>
        <p>All your past wine quality predictions, saved to your account.</p>
      </div>

      {error && <div className="history-error">{error}</div>}

      {!error && history.length === 0 && (
        <div className="history-empty">
          <Wine size={48} strokeWidth={1} />
          <p>No predictions yet. Head to the <a href="/predict">Predict</a> page to get started.</p>
        </div>
      )}

      <div className="history-list">
        {history.map((record, idx) => {
          const quality = getQualityLabel(record.quality);
          return (
            <div className="history-card" key={idx}>
              <div className="history-card-header" onClick={() => toggleExpand(idx)}>
                <div className="history-card-left">
                  <span className="history-score" style={{ color: quality.color }}>
                    {record.quality}/10
                  </span>
                  <span className="history-quality-label" style={{ color: quality.color }}>
                    {quality.label}
                  </span>
                </div>
                <div className="history-card-right">
                  <span className="history-timestamp">
                    <Clock size={14} />
                    {record.timestamp}
                  </span>
                  {expanded === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {expanded === idx && record.features && (
                <div className="history-card-details">
                  <div className="history-features-grid">
                    {Object.entries(record.features).map(([key, val]) => (
                      <div className="history-feature-item" key={key}>
                        <span className="history-feature-key">{key}</span>
                        <span className="history-feature-val">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default History;
