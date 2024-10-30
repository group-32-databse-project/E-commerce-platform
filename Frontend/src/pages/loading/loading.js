import React, { useState, useEffect } from "react";
import {
  Zap,
  Star,
  Sparkles,
  Circle,
  Triangle,
  Square,
  Hexagon,
} from "lucide-react";

const Loading = () => {
  const [time, setTime] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 16);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Generate particles with different shapes
  const particles = [...Array(20)].map((_, i) => {
    const ParticleIcon = [Star, Circle, Triangle, Square, Hexagon][i % 5];
    const angle = (i / 20) * Math.PI * 2 + time / 50;
    const radius = 150 + Math.sin(time / 30 + i) * 30;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const scale = 0.5 + Math.sin(time / 20 + i * 0.5) * 0.3;
    console.log(isHovering);

    return (
      <div
        key={i}
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `calc(50% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
          transform: `scale(${scale}) rotate(${time * 2 + i * 30}deg)`,
          transition: "all 0.1s ease-out",
        }}
      >
        <ParticleIcon
          className={`text-${
            ["pink", "purple", "blue", "green", "yellow"][i % 5]
          }-${400 + (i % 3) * 200}`}
          size={24}
        />
      </div>
    );
  });

  // Generate orbital rings
  const rings = [...Array(3)].map((_, i) => (
    <div
      key={i}
      className="absolute rounded-full border-2 border-dashed opacity-20"
      style={{
        width: `${300 + i * 100}px`,
        height: `${300 + i * 100}px`,
        borderColor: `rgb(${Math.sin(time / 30 + i) * 127 + 128}, ${
          Math.cos(time / 40 + i) * 127 + 128
        }, ${Math.sin(time / 50 + i) * 127 + 128})`,
        transform: `rotate(${time + i * 30}deg)`,
      }}
    />
  ));

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center overflow-hidden relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background sparkles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-pulse"
          style={{
            left: `${Math.sin(time / 50 + i) * 50 + 50}%`,
            top: `${Math.cos(time / 60 + i) * 50 + 50}%`,
            animation: `pulse ${1 + (i % 3)}s infinite`,
            transform: `scale(${0.5 + Math.sin(time / 40 + i) * 0.3})`,
          }}
        >
          <Sparkles className="text-purple-300 opacity-30" size={16} />
        </div>
      ))}

      {/* Animated rings */}
      {rings}

      {/* Central sphere */}
      <div
        className="relative z-10 rounded-full p-8"
        style={{
          transform: `translate(${mousePosition.x * 20}px, ${
            mousePosition.y * 20
          }px)`,
        }}
      >
        <div className="relative">
          {/* Energy core */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-full blur-lg animate-pulse"
            style={{
              transform: `scale(${1.2 + Math.sin(time / 20) * 0.2})`,
            }}
          />

          {/* Central icon */}
          <div
            className="relative bg-white rounded-full p-6 shadow-xl"
            style={{
              transform: `scale(${1 + Math.sin(time / 30) * 0.1})`,
            }}
          >
            <Zap
              className="text-yellow-500 animate-bounce"
              size={64}
              style={{
                filter: "drop-shadow(0 0 10px rgba(234, 179, 8, 0.8))",
                transform: `rotate(${Math.sin(time / 40) * 20}deg)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Orbiting particles */}
      {particles}

      {/* Loading text with glitch effect */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
        <h2
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4"
          style={{
            transform: `skew(${Math.sin(time / 30) * 5}deg)`,
          }}
        >
          Loading Experience
        </h2>
        <div className="flex gap-2 items-center justify-center">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{
                transform: `scale(${0.8 + Math.sin(time / 20 + i) * 0.4})`,
                opacity: 0.5 + Math.sin(time / 15 + i) * 0.5,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
