import React from "react";
import WindmillCarousel from "./WindmillCarousel";

// Using the items data from your JSON file
import items from "../public/items.json";

export default function BootstrapCarousel() {
  // Extract the bootstrap items from your JSON
  const { items: { bootstrap } } = items;
  
  return (
    <div className="mb-8">
      <WindmillCarousel 
        items={bootstrap} 
        interval={4000}
        showIndicators={true}
        showControls={true}
        autoPlay={true}
      />
    </div>
  );
}