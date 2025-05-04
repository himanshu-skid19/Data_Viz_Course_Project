import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'icons'; // Import from your icons folder

interface CarouselItem {
  id: string | number;
  imageUrl: string;
  title: string;
  body: string;
}

const mapping_link: { [key: string]: string } = {
  "1": "https://www.holidify.com/country/india/places-to-visit.html#packageModal",
  "2": "https://www.easemytrip.com/travel/beach-destinations-in-india.html",
  "3": "https://www.nivabupa.com/travel-insurance-articles/exploring-indias-best-adventure-destinations.html"
};


interface WindmillCarouselProps {
  items: CarouselItem[];
  interval?: number;
  showIndicators?: boolean;
  showControls?: boolean;
  autoPlay?: boolean;
}

const WindmillCarousel: React.FC<WindmillCarouselProps> = ({
  items,
  interval = 4000,
  showIndicators = true,
  showControls = true,
  autoPlay = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const itemCount = items.length;

  // Navigation functions
  const goToNext = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % itemCount);
  }, [itemCount]);

  const goToPrevious = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + itemCount) % itemCount);
  }, [itemCount]);

  const goToIndex = (index: number) => {
    setActiveIndex(index);
  };

  // Autoplay functionality
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPlaying) {
      timer = setInterval(goToNext, interval);
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isPlaying, interval, goToNext]);

  // Pause autoplay on hover
  const pauseAutoplay = () => {
    if (autoPlay) {
      setIsPlaying(false);
    }
  };

  const resumeAutoplay = () => {
    if (autoPlay) {
      setIsPlaying(true);
    }
  };

  // Touch event handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      goToNext();
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      goToPrevious();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToNext, goToPrevious]);

  return (
    <div 
      className="relative w-full h-[500px] overflow-hidden rounded-lg shadow-md"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured content carousel"
    >
      {/* Slides */}
      <div className="h-full">
        {items.map((item, index) => (
          <div
            //name = {item.title}
            key={item.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
              index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${items.length}`}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-70 text-white p-6 rounded-lg max-w-[80%] text-center">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="mb-4">{item.body}</p>

              <a 
  href={mapping_link[item.id]} 
  target="_blank" 
  rel="noopener noreferrer" 
  className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
>
  Visit Details
</a>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      {showControls && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-300 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-300 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === activeIndex
                  ? 'bg-white'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WindmillCarousel;