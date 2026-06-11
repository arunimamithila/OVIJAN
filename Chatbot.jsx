import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = ({ userId, userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [typingMessages, setTypingMessages] = useState(new Map()); // Track typing animation for each message
  const messagesEndRef = useRef(null);

  // Typing animation function
  const typeMessage = async (messageId, fullText, speed = 30) => {
    const words = fullText.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? words[i] : ' ' + words[i]);
      setTypingMessages(prev => new Map(prev).set(messageId, currentText));
      
      // Dynamic speed: slower for punctuation, faster for common words
      const delay = words[i].includes('.') || words[i].includes('?') || words[i].includes('!') ? speed * 3 : speed;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // Mark typing as complete
    setTypingMessages(prev => {
      const newMap = new Map(prev);
      newMap.delete(messageId);
      return newMap;
    });
  };

  // Fetch user profile from database
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/chat/user-profile/${userId}`);
        const data = await response.json();
        
        if (data.success) {
          setUserProfile(data.profile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, [userId]);

  // Add welcome message when profile is loaded
  useEffect(() => {
    const addWelcomeMessage = async () => {
      if (userProfile && messages.length === 0) {
        const welcomeName = userProfile.name || userName || 'Student';
        const welcomeText = `Hello ${welcomeName}! 👋 I'm your AI university advisor. I can see you're a ${userProfile.user_role || 'student'}${userProfile.education_level ? ` with ${userProfile.education_level} background` : ''}. How can I help you with your study abroad journey today?`;
        
        const welcomeMsg = {
          id: Date.now(),
          type: 'bot',
          text: welcomeText,
          timestamp: new Date(),
          isTyping: true
        };
        
        setMessages([welcomeMsg]);
        await typeMessage(welcomeMsg.id, welcomeText);
      } else if (!userProfile && messages.length === 0 && !userName) {
        const welcomeText = `Hello ${userName || 'Student'}! 👋 I'm your AI university advisor. Ask me anything about university recommendations, admission requirements, scholarships, or visa processes!`;
        
        const welcomeMsg = {
          id: Date.now(),
          type: 'bot',
          text: welcomeText,
          timestamp: new Date(),
          isTyping: true
        };
        
        setMessages([welcomeMsg]);
        await typeMessage(welcomeMsg.id, welcomeText);
      }
    };
    
    addWelcomeMessage();
  }, [userProfile]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingMessages]);

  const sendMessageToAI = async (userMessage) => {
    setIsLoading(true);
    
    // Build complete profile for AI
    const profileForAI = {
      name: userProfile?.name || userName || 'Student',
      email: userProfile?.email || '',
      education_level: userProfile?.education_level || '',
      preferred_countries: userProfile?.preferred_countries || [],
      user_role: userProfile?.user_role || 'student',
      ssc_result: userProfile?.ssc_result || null,
      hsc_result: userProfile?.hsc_result || null
    };
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          user_id: userId,
          student_profile: profileForAI
        })
      });

      const data = await response.json();

      if (data.success) {
        const botMessage = {
          id: Date.now(),
          type: 'bot',
          text: data.reply,
          timestamp: new Date(),
          isTyping: true
        };
        
        setMessages(prev => [...prev, botMessage]);
        await typeMessage(botMessage.id, data.reply);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now(),
        type: 'bot',
        text: "I'm here to help! Could you please tell me more about your educational background and which countries you're interested in? This will help me give you better recommendations. 🎓",
        timestamp: new Date(),
        isTyping: true
      };
      setMessages(prev => [...prev, errorMessage]);
      await typeMessage(errorMessage.id, errorMessage.text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessageObj = {
      id: Date.now(),
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessageObj]);
    const messageToSend = inputMessage;
    setInputMessage('');
    await sendMessageToAI(messageToSend);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Professional quick reply suggestions with icons
  const quickReplies = [
    { text: "🎓 Recommend universities", action: "Recommend universities for me" },
    { text: "💰 Scholarship opportunities", action: "What scholarships are available for me?" },
    { text: "📄 Visa requirements", action: "Tell me about visa requirements" },
    { text: "💵 Tuition fees", action: "What are the tuition fees?" },
    { text: "📝 Admission requirements", action: "What are the admission requirements?" }
  ];

  // Add CSS animations to document head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 0.3; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1); }
      }
      
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .typing-cursor {
        display: inline-block;
        width: 2px;
        height: 16px;
        background-color: #10b981;
        margin-left: 2px;
        animation: pulse 1s infinite;
        vertical-align: middle;
      }
      
      .message-bubble {
        animation: slideIn 0.3s ease-out;
      }
      
      .quick-reply-btn {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .quick-reply-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
      }
      
      /* Smooth scrollbar */
      ::-webkit-scrollbar {
        width: 6px;
      }
      
      ::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '30px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
          zIndex: 1000,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <MessageCircle size={28} color="white" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: isMinimized ? '380px' : '450px',
        height: isMinimized ? '60px' : '680px',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '18px 20px',
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
      onClick={() => setIsMinimized(!isMinimized)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={18} color="white" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>AI University Advisor</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                animation: 'pulse 1.5s infinite'
              }} />
              <p style={{ margin: 0, fontSize: '11px', opacity: 0.8 }}>
                {userProfile?.name ? `Assisting ${userProfile.name.split(' ')[0]}` : 'Ready to help'}
              </p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '10px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            {isMinimized ? <Maximize2 size={16} color="white" /> : <Minimize2 size={16} color="white" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '10px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <X size={16} color="white" />
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      {!isMinimized && (
        <>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            background: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {messages.map((msg) => {
              const displayText = typingMessages.get(msg.id) || msg.text;
              const isTyping = typingMessages.has(msg.id);
              
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex',
                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}
                >
                  {msg.type === 'bot' && (
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
                    }}>
                      <Bot size={18} color="white" />
                    </div>
                  )}
                  <div style={{
                    maxWidth: '72%',
                    background: msg.type === 'user' ? 'linear-gradient(135deg, #10b981, #059669)' : 'white',
                    color: msg.type === 'user' ? 'white' : '#0f172a',
                    padding: '14px 18px',
                    borderRadius: msg.type === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                    boxShadow: msg.type === 'user' ? '0 4px 12px rgba(16,185,129,0.25)' : '0 2px 8px rgba(0,0,0,0.05)',
                    border: msg.type === 'bot' ? '1px solid #e2e8f0' : 'none',
                    transition: 'all 0.2s'
                  }}>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '14px', 
                      lineHeight: '1.6', 
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}>
                      {displayText}
                      {isTyping && <span className="typing-cursor" />}
                    </p>
                    {!isTyping && (
                      <p style={{
                        margin: '8px 0 0',
                        fontSize: '10px',
                        color: msg.type === 'user' ? 'rgba(255,255,255,0.6)' : '#94a3b8',
                        textAlign: 'right',
                        letterSpacing: '0.3px'
                      }}>
                        {formatTime(msg.timestamp)}
                      </p>
                    )}
                  </div>
                  {msg.type === 'user' && (
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      <User size={18} color="white" />
                    </div>
                  )}
                </motion.div>
              );
            })}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px' }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
                }}>
                  <Bot size={18} color="white" />
                </div>
                <div style={{
                  background: 'white',
                  padding: '14px 20px',
                  borderRadius: '20px 20px 20px 6px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#10b981',
                    borderRadius: '50%',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }} />
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#10b981',
                    borderRadius: '50%',
                    animation: 'pulse 1.5s ease-in-out infinite 0.3s'
                  }} />
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#10b981',
                    borderRadius: '50%',
                    animation: 'pulse 1.5s ease-in-out infinite 0.6s'
                  }} />
                </div>
              </motion.div>
            )}
            
            {/* Quick Reply Suggestions */}
            {messages.length <= 2 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ marginTop: '8px' }}
              >
                <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px', fontWeight: '500' }}>
                  Suggested questions:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputMessage(reply.action);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      className="quick-reply-btn"
                      style={{
                        padding: '8px 14px',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '24px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        color: '#0f172a'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#10b981';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor = '#10b981';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.color = '#0f172a';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #e2e8f0',
            background: 'white',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-end'
          }}>
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about universities, scholarships, visas..."
              disabled={isLoading}
              rows={1}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                fontSize: '13px',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                resize: 'none',
                outline: 'none',
                transition: 'all 0.2s',
                lineHeight: '1.5'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              style={{
                padding: '12px 16px',
                background: inputMessage.trim() && !isLoading ? 'linear-gradient(135deg, #10b981, #059669)' : '#e2e8f0',
                border: 'none',
                borderRadius: '16px',
                cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                transform: inputMessage.trim() && !isLoading ? 'scale(1)' : 'scale(0.95)'
              }}
              onMouseEnter={(e) => {
                if (inputMessage.trim() && !isLoading) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (inputMessage.trim() && !isLoading) {
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              <Send size={18} color={inputMessage.trim() && !isLoading ? 'white' : '#94a3b8'} />
            </button>
          </div>
          
          {/* Profile Info Bar */}
          {userProfile && (
            <div style={{
              padding: '10px 20px',
              borderTop: '1px solid #e2e8f0',
              background: '#f8fafc',
              fontSize: '11px',
              color: '#64748b',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🎓</span> {userProfile.education_level || 'Education level not set'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🌍</span> {userProfile.preferred_countries?.length > 0 ? userProfile.preferred_countries.join(', ') : 'No country preference'}
              </span>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Chatbot;