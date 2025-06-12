"use client";

import { useState, useEffect, SetStateAction } from "react";
import Image from "next/image";

const images = [
  "/banner1.png",
  "/banner1.png",
  "/banner1.png",
];

export default function CompactFullScreenCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: SetStateAction<number>) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[90vh] max-h-[800px] overflow-hidden rounded-b-xl shadow-xl">
      {/* Slides container */}
      <div
        className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-black/15"></div>
            
            {/* Content area */}
            <div className="absolute inset-0 flex items-center justify-center text-center px-8">
                {/* <div className="text-white max-w-3xl">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Title Here</h1>
                  <p className="text-lg md:text-xl mb-6">Description or call to action</p>
                  <button className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition-all text-sm md:text-base">
                    Learn More
                  </button>
                </div> */}
            </div>
          </div>
        ))}
      </div>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-white w-4" 
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      <button 
        onClick={() => setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all duration-300 z-10"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={() => setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all duration-300 z-10"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}