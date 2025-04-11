// components/ChatbotWidget.tsx
'use client';

import React, { useState, useContext } from 'react';
import { WindmillContext } from '@roketid/windmill-react-ui';
import styles from '../styles/ChatbotWidget.module.css';

// Define the message type
interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const ChatbotWidget: React.FC = () => {
  const windmillContext = useContext(WindmillContext);
  // Check if mode is dark (if mode is undefined, default to checking if the theme or document has dark mode)
  const isDarkMode = windmillContext?.mode === 'dark' || 
                    document.documentElement.classList.contains('dark') ||
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to the chat
    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and show loading state
    const query = input.trim();
    setInput('');
    setLoading(true);

    try {
      // Connect to your Express server at port 5000
      const response = await fetch('http://localhost:5000/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle the response format from your Express server
      const recommendation = data.recommendations || 'No recommendations found';
      
      // Add bot response to the chat
      const botMessage: Message = { 
        sender: 'bot', 
        text: recommendation
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'Sorry, I encountered an error processing your request. Please try again later.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format recommendation text
  const formatRecommendationText = (text: string, isBot: boolean) => {
    if (!isBot) return text;
    
    // Try to detect numbered recommendations and format them
    const formattedText = text.replace(/(\d+\.\s[^:]+:)/g, '<strong>$1</strong>');
    
    // Return as a simple string for now - we'll use dangerouslySetInnerHTML to render formatted text
    return formattedText;
  };

  return (
    <div className={`${styles.chatbotContainer} ${isMaximized ? styles.maximized : ''} ${isDarkMode ? styles.dark : ''}`}>
      {!isOpen ? (
        <div className={styles.chatbotIcon} onClick={() => setIsOpen(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        </div>
      ) : (
        <div className={styles.chatbotWidget}>
          <div className={styles.chatHeader}>
            <span>Travel Assistant</span>
            <div className={styles.chatHeaderIcons}>
              {isMaximized ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.icon}
                  onClick={() => setIsMaximized(false)}
                >
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.icon}
                  onClick={() => setIsMaximized(true)}
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.icon}
                onClick={() => setIsOpen(false)}
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
          </div>

          <div className={styles.chatMessages}>
            {messages.length === 0 && (
              <div className={`${styles.message} ${styles.bot}`}>
                Hello! I'm your travel assistant. Ask me about travel recommendations or destinations.
              </div>
            )}
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`${styles.message} ${styles[msg.sender]}`}
                dangerouslySetInnerHTML={{ 
                  __html: formatRecommendationText(msg.text, msg.sender === 'bot') 
                }}
              />
            ))}
            {loading && <div className={`${styles.message} ${styles.bot}`}>Thinking...</div>}
          </div>

          <div className={styles.chatInput}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about travel recommendations..."
              disabled={loading}
            />
            <button 
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className={loading ? styles.buttonDisabled : ''}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;