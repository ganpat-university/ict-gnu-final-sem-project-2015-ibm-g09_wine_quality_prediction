export function VariantNavigation({
  currentVariantIndex,
  totalVariants,
  isLoading,
  onPrevious,
  onNext,
  accentColor,
}) {
  return (
    <div className="scroll-video-variant-nav">
      <div
        className="variant-index"
        style={{ color: accentColor }}
      >
        {String(currentVariantIndex + 1).padStart(2, "0")}
      </div>

      <div className="variant-controls">
        <button
          className="variant-btn prev"
          onClick={onPrevious}
          disabled={isLoading}
        >
          <span>PREV</span>
          <span className="arrow">↑</span>
        </button>

        <div className="variant-divider"></div>

        <button
          className="variant-btn next"
          onClick={onNext}
          disabled={isLoading}
        >
          <span>NEXT</span>
          <span className="arrow">↓</span>
        </button>
      </div>

      {isLoading && (
        <div className="variant-loading-container">
          <div className="variant-loading-spinner">⏳</div>
          <span className="variant-loading-text">Loading...</span>
        </div>
      )}
    </div>
  );
}
