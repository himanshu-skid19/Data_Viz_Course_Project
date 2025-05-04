import React from 'react';
import Layout from 'example/containers/Layout';
import InfogramEmbed from '../../components/InfogramEmbed';

function InfogramChart() {
  return (
    <Layout>
      {/* Full-page Infogram Embed */}
      <div 
        className="w-full h-screen" 
        style={{ 
          height: "calc(100vh - 80px)", // Adjust based on your header height
          margin: 0,
          padding: 0,
          overflow: 'hidden'
        }}
      >
        <InfogramEmbed
          dataId="9270796b-5b21-4fde-b962-a632008687a4"
          dataType="interactive"
          dataTitle="Double Comparison"
          height="100%"
          className="w-full h-full"
        />
      </div>
    </Layout>
  );
}

export default InfogramChart;