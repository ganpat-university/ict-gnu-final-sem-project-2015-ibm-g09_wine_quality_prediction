import { useRef, useState } from "react";
import { DRINK_VARIANTS} from "../../constants/drinks";
import { useFrameSequenceCanvas } from "../../hooks/useFrameSequenceCanvas";
import { VariantNavigation } from "./VariantNavigation";
import { Link } from "react-router-dom";
import "./ScrollVideo.css";

export default function ScrollVideo() {
	const canvasRef = useRef(null);
	const containerRef = useRef(null);
	const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
	const [isVariantLoading, setIsVariantLoading] = useState(false);

	const currentVariant = DRINK_VARIANTS[currentVariantIndex];

	// Sync canvas frame with scroll position, using variant's frame range
	useFrameSequenceCanvas(
		canvasRef,
		currentVariant.frameStart,
		currentVariant.frameEnd,
		currentVariant.framePath

	);

	const handleVariantChange = (direction) => {
		let newIndex = currentVariantIndex + direction;
		if (newIndex < 0) newIndex = DRINK_VARIANTS.length - 1;
		if (newIndex >= DRINK_VARIANTS.length) newIndex = 0;

		setIsVariantLoading(true);
		setCurrentVariantIndex(newIndex);
		window.scrollTo({ top: 0, behavior: "smooth" });
		
		// Simulate variant transition delay
		setTimeout(() => setIsVariantLoading(false), 500);
	};

	return (
		<div className="scroll-video-wrapper">
			<div className="scroll-video-container" ref={containerRef}>
				{/* Canvas background - displays frame sequences on scroll */}
				<canvas
					ref={canvasRef}
					className="scroll-video-canvas"
				/>

				{/* Text layer */}
				<div className="scroll-video-text-block">
					<div className="scroll-video-text-left">{currentVariant.name}</div>
					<div className="scroll-video-lower"  >{currentVariant.subtitle}</div>
					
					<div className="scroll-video-para">{currentVariant.description}</div>

					{/* Predict CTA */}
					<div className="scroll-video-cta">
						<Link to="/predict" className="predict-cta-btn" style={{ background: currentVariant.accentColor }}>
							Predict Quality
						</Link>
					</div>

					{/* Variant Navigation */}
					<VariantNavigation
						currentVariantIndex={currentVariantIndex}
						totalVariants={DRINK_VARIANTS.length}
						isLoading={isVariantLoading}
						onPrevious={() => handleVariantChange(-1)}
						onNext={() => handleVariantChange(1)}
						accentColor={currentVariant.accentColor}
					/>
				</div>

			</div>
		</div>
	);
}




