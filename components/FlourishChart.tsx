// components/FlourishChart.tsx 
import React, { useState, useEffect, useRef } from 'react';

// Extend window interface to add Flourish properties
declare global {
  interface Window {
    Flourish?: {
      reload: () => void;
    };
    FlourishLoaded?: boolean;
  }
}

interface FlourishChartProps {
  src: string;
  title?: string;
  className?: string;
}

const FlourishChart: React.FC<FlourishChartProps> = ({ src, title, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  // Normalize the src to ensure consistent formatting
  const normalizedSrc = src.includes('visualisation/') 
    ? src 
    : `visualisation/${src}`;
  
  // Extract the visualization ID for noscript fallback
  const vizId = normalizedSrc.split('/').pop() || '';

  // Function to initialize or reinitialize Flourish
  const initializeFlourishVisualization = () => {
    if (!containerRef.current) return;
    
    // Ensure the container has the correct data-src attribute
    const flourishDiv = containerRef.current.querySelector('.flourish-embed');
    if (flourishDiv) {
      flourishDiv.setAttribute('data-src', normalizedSrc);
    }
    
    // If script is loaded, trigger Flourish reload
    if (window.FlourishLoaded) {
      // Add a small timeout to ensure DOM is ready
      setTimeout(() => {
        if (window.Flourish && typeof window.Flourish.reload === 'function') {
          window.Flourish.reload();
        }
      }, 100);
    }
    
    // If script isn't loaded yet, set it up
    if (!scriptLoaded) {
      const scriptId = 'flourish-embed-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://public.flourish.studio/resources/embed.js';
        script.async = true;
        script.onload = () => {
          setScriptLoaded(true);
          window.FlourishLoaded = true;
        };
        document.body.appendChild(script);
      } else {
        setScriptLoaded(true);
      }
    }
  };

  // Set up intersection observer to detect when chart is visible
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1 } // Trigger when at least 10% of the element is visible
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Initialize when component mounts or src changes
  useEffect(() => {
    // Force recreation of the flourish-embed div when src changes
    if (containerRef.current) {
      // Clear the container
      const oldFlourish = containerRef.current.querySelector('.flourish-embed');
      if (oldFlourish) {
        oldFlourish.remove();
      }
      
      // Create a new div with the correct attributes
      const newFlourish = document.createElement('div');
      newFlourish.className = 'flourish-embed flourish-chart';
      newFlourish.setAttribute('data-src', normalizedSrc);
      newFlourish.setAttribute('data-height', '100%');
      newFlourish.setAttribute('data-width', '100%');
      
      // Add noscript fallback
      const noscript = document.createElement('noscript');
      const img = document.createElement('img');
      img.src = `https://public.flourish.studio/visualisation/${vizId}/thumbnail`;
      img.width = 100;
      img.alt = title || "Flourish visualization";
      noscript.appendChild(img);
      newFlourish.appendChild(noscript);
      
      // Add to container
      containerRef.current.appendChild(newFlourish);
      
      // Always initialize, not just when visible
      setTimeout(initializeFlourishVisualization, 0);
    }
  }, [normalizedSrc, title]); // Re-run when src or title changes

  // Reinitialize when component becomes visible
  useEffect(() => {
    if (isVisible) {
      initializeFlourishVisualization();
    }
    // Also initialize after a delay if not visible, as a fallback
    else {
      const fallbackTimer = setTimeout(() => {
        initializeFlourishVisualization();
      }, 1000);
      
      return () => clearTimeout(fallbackTimer);
    }
  }, [isVisible]);

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isVisible) {
        initializeFlourishVisualization();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also reinitialize on window focus
    const handleFocus = () => {
      if (isVisible) {
        initializeFlourishVisualization();
      }
    };
    
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isVisible]);

  useEffect(() => {
    // This effect ensures the chart is initialized when the component updates
    // This helps with route changes and layout shifts
    const updateTimer = setTimeout(() => {
      initializeFlourishVisualization();
    }, 500);
    
    return () => clearTimeout(updateTimer);
  }, []);

  return (
    <div ref={containerRef} className={`w-full h-full ${className || ''}`}></div>
  );
};

export default FlourishChart;