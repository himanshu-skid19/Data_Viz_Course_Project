// components/BootstrapCarousel.tsx

import { useState } from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Using the items data from your JSON file
// Make sure this file exists at this path with correct format
import { items } from "../public/items.json";

export default function BootstrapCarousel() {
  const { bootstrap } = items;
  const [index, setIndex] = useState(0);
  
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  
  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      {bootstrap.map((item) => (
        <Carousel.Item 
          key={item.id} 
          interval={4000}
          // Direct style instead of CSS module
          style={{ height: "400px" }}
        >
          <img 
            src={item.imageUrl} 
            alt="slides" 
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover" 
            }}
          />
          <Carousel.Caption 
            // Direct style instead of CSS module
            style={{ 
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              padding: "20px",
              borderRadius: "8px"
            }}
          >
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <button className="btn btn-danger">Visit Details</button>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}