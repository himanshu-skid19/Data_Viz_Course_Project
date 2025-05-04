// components/IframeFlourishChart.tsx
import React from 'react';

interface IframeFlourishChartProps {
  src: string;
  className?: string;
}

const IframeFlourishChart: React.FC<IframeFlourishChartProps> = ({ src, className }) => {
  // Clean up the source to get just the ID
  const visualizationId = src.includes('/') ? src.split('/').pop() : src;
  
  // Create direct iframe URL to Flourish
  const iframeUrl = `https://flo.uri.sh/visualisation/${visualizationId}/embed`;
  
  return (
    <div className={`w-full h-full ${className || ''}`}>
      <iframe
        src={iframeUrl}
        frameBorder="0"
        scrolling="no"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '350px',
        }}
        title={`flourish-chart-${visualizationId}`}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default IframeFlourishChart;