import '../styles/globals.css'
import 'tailwindcss/tailwind.css';
import { Carousel } from "react-bootstrap";
//import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/Bootstrap.module.css";
import React from 'react'
import { Windmill } from '@roketid/windmill-react-ui'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic';

// Use dynamic import with SSR disabled for the ChatbotWidget
const ChatbotWidget = dynamic(() => import('../components/ChatbotWidget'), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  // suppress useLayoutEffect warnings when running outside a browser
  if (!process.browser) React.useLayoutEffect = React.useEffect;

  return (
    <Windmill usePreferences={true}>
      <Component {...pageProps} />
      <ChatbotWidget />
    </Windmill>
  )
}
export default MyApp