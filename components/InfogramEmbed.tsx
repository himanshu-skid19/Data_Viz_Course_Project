// components/InfogramEmbed.tsx
import React, { useEffect } from 'react';

interface InfogramEmbedProps {
  dataId: string;
  dataType?: string;
  dataTitle?: string;
  height?: string;
  className?: string;
}

const InfogramEmbed: React.FC<InfogramEmbedProps> = ({
  dataId,
  dataType = 'interactive',
  dataTitle = '',
  height = '500px',
  className,
}) => {
  // Only run on client-side
  useEffect(() => {
    // Define a global callback that Infogram can use
    window.onInfographicLoad = function() {
      console.log('Infogram loaded successfully');
    };

    // Create and load the Infogram script
    const script = document.createElement('script');
    script.src = 'https://e.infogram.com/js/dist/embed.js?mnO';
    script.async = true;
    script.type = 'text/javascript';
    
    // Add script to document
    document.head.appendChild(script);
    
    // Clean up on unmount
    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Direct iframe embed approach
  const iframeSrc = `https://e.infogram.com/${dataId}?src=embed`;
  
  return (
    <div 
      className={`infogram-embed-container ${className || ''}`}
      style={{ width: '100%', height, position: 'relative' }}
    >
      <iframe 
        title={dataTitle || `Infogram: ${dataId}`}
        src={iframeSrc}
        frameBorder="0" 
        allowFullScreen
        style={{
          border: 'none',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      ></iframe>
      <div style={{ 
        position: 'absolute', 
        bottom: '10px', 
        left: '0', 
        right: '0', 
        textAlign: 'center',
        fontSize: '11px', 
        color: '#999'
      }}>
        <a 
          href={`https://infogram.com/${dataId}`} 
          style={{ color: '#999', textDecoration: 'none' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          {dataTitle || 'View on Infogram'}
        </a>
      </div>
    </div>
  );
};

// Add type definition for window
declare global {
  interface Window {
    onInfographicLoad?: () => void;
  }
}

export default InfogramEmbed;