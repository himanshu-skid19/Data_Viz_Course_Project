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

  // Function to initialize or reinitialize Flourish
  const initializeFlourishVisualization = () => {
    if (!containerRef.current) return;
    
    // If script is loaded and Flourish exists in window, reload it
    if (scriptLoaded && window.Flourish && typeof window.Flourish.reload === 'function') {
      window.Flourish.reload();
      return;
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

  // Initialize when component mounts
  useEffect(() => {
    initializeFlourishVisualization();
  }, []);

  // Reinitialize when component becomes visible
  useEffect(() => {
    if (isVisible) {
      initializeFlourishVisualization();
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

  return (
    <div ref={containerRef} className={`w-full h-full ${className || ''}`}>
      <div 
        className="flourish-embed flourish-chart" 
        data-src={src}
        data-height="100%"
        data-width="100%"
      >
        <noscript>
          <img 
            src={`https://public.flourish.studio/visualisation/${src.split('/').pop()}/thumbnail`} 
            width="100%" 
            alt={title || "Flourish visualization"} 
          />
        </noscript>
      </div>
    </div>
  );
};

export default FlourishChart;