import React from 'react'
import PageTitle from 'example/components/Typography/PageTitle'
import Layout from 'example/containers/Layout'

// Either import the CanvaEmbed component
// import CanvaEmbed from '../../components/CanvaEmbed'

// Or define it inline if you haven't created the component yet
const CanvaEmbed = ({ 
  designId, 
  designViewId, 
  title = 'Canva Design',
  author = '',
  aspectRatioPercent = 250,
  showAttribution = true 
}) => {
  const embedUrl = `https://www.canva.com/design/${designId}/${designViewId}/view?embed`;
  const attributionUrl = `https://www.canva.com/design/${designId}/${designViewId}/view?utm_content=${designId}&utm_campaign=designshare&utm_medium=embeds&utm_source=link`;

  return (
    <>
      <div 
        style={{
          position: 'relative',
          width: '100%',
          height: 0,
          paddingTop: `${aspectRatioPercent}%`,
          paddingBottom: 0,
          boxShadow: '0 2px 8px 0 rgba(63,69,81,0.16)',
          marginTop: '1.6em',
          marginBottom: showAttribution ? '0.9em' : '1.6em',
          overflow: 'hidden',
          borderRadius: '8px',
          willChange: 'transform',
        }}
      >
        <iframe
          loading="lazy"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            border: 'none',
            padding: 0,
            margin: 0,
          }}
          src={embedUrl}
          title={title}
          allowFullScreen={true}
          allow="fullscreen"
        ></iframe>
      </div>
      
      {showAttribution && (
        <a 
          href={attributionUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            fontSize: '0.8rem',
            color: '#666',
            textDecoration: 'none',
            marginBottom: '1.6em',
          }}
        >
          {title} {author && `by ${author}`}
        </a>
      )}
    </>
  );
};

function Cards() {
  return (
    <Layout>
      <PageTitle>Canva Infographic</PageTitle>

      {/* Canva Embed */}
      <CanvaEmbed
        designId="DAGmcMCk_C0"
        designViewId="mdcNmv2t2mVypvC54mSIsw"
        title="Brown and Cream Scrapbook Ancient History Infographic"
        author="Rishita Agarwal"
        aspectRatioPercent={250}
        showAttribution={true}
      />
    </Layout>
  )
}

export default Cards