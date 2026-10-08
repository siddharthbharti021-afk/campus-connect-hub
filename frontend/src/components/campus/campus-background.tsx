"use client";

import React, { useEffect, useRef } from "react";

export function CampusBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(pointer: fine)");
    let frame = 0;

    const reset = () => {
      if (ref.current) {
        ref.current.style.setProperty("--pointer-x", "0px");
        ref.current.style.setProperty("--pointer-y", "0px");
      }
    };

    const move = (event: MouseEvent) => {
      if (media.matches || !pointer.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        ref.current?.style.setProperty(
          "--pointer-x",
          `${((event.clientX / window.innerWidth) - 0.5) * 38}px`
        );
        ref.current?.style.setProperty(
          "--pointer-y",
          `${((event.clientY / window.innerHeight) - 0.5) * 30}px`
        );
      });
    };

    const preference = () => {
      cancelAnimationFrame(frame);
      reset();
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("blur", reset);
    media.addEventListener("change", preference);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("blur", reset);
      media.removeEventListener("change", preference);
    };
  }, []);

  return (
    <div ref={ref} className="campus-background" aria-hidden="true">
      <div className="dot-grid" />
      <div className="orb-layer">
        {["green", "blue", "purple", "orange"].map((color) => (
          <div key={color} className={`orb orb-${color}`} />
        ))}
      </div>
      <div className="floating-items">
        {["🍟", "☕", "✏️", "🥟", "📚", "🎒"].map((item, index) => (
          <span key={item} className={`floating-item item-${index}`}>
            {item}
          </span>
        ))}
      </div>
      {[0, 1, 2].map((index) => (
        <svg
          key={index}
          className={`background-plane plane-${index}`}
          viewBox="0 0 64 48"
        >
          <path d="M3 22 60 4 39 43 27 29 3 22Z" />
          <path d="m27 29 33-25-40 21m7 4-5 13 11-7" />
        </svg>
      ))}
    </div>
  );
}
