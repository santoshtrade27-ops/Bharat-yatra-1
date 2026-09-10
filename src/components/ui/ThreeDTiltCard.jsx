import { useRef, useState } from "react";

export default function ThreeDTiltCard({
  children,
  className = "",
  maxTilt = 12, // Maximum tilt angle in degrees
  scale = 1.02, // Hover scale factor
  glare = true,
  depth = "20px",
  onClick,
  ...props
}) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotateX = ((mouseY - height / 2) / (height / 2)) * -maxTilt;
    const rotateY = ((mouseX - width / 2) / (width / 2)) * maxTilt;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
    );

    if (glare) {
      const glareX = (mouseX / width) * 100;
      const glareY = (mouseY / height) * 100;
      setGlarePosition({ x: glareX, y: glareY, opacity: 0.25 });
    }
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    if (glare) {
      setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform,
        transition: "transform 0.15s cubic-bezier(0.03, 0.98, 0.52, 0.99)",
        transformStyle: "preserve-3d",
      }}
      className={`relative transform-style-3d cursor-pointer select-none transition-shadow ${className}`}
      {...props}
    >
      <div style={{ transform: `translateZ(${depth})`, transformStyle: "preserve-3d" }}>
        {children}
      </div>

      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden transition-opacity duration-300"
          style={{ opacity: glarePosition.opacity }}
        >
          <div
            className="w-full h-full"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 70%)`,
            }}
          />
        </div>
      )}
    </div>
  );
}
