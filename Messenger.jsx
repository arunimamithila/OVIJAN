// src/pages/Messenger.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, Users, User, Search, 
  MessageCircle, ArrowLeft, Home,
  Phone, Video, 
  Smile, Paperclip, 
  CheckCheck, 
  Clock, 
  Trash2, Edit2,
  WifiOff,
  Plus
} from 'lucide-react';

// ─── Google Font Import ───────────────────────────────────────────────────────
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap';
document.head.appendChild(fontLink);

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  // Sidebar
  sidebarBg:       '#0d0f14',
  sidebarBorder:   'rgba(255,255,255,0.06)',
  sidebarText:     '#e2e8f0',
  sidebarMuted:    'rgba(255,255,255,0.35)',
  sidebarHover:    'rgba(255,255,255,0.07)',
  sidebarActive:   'rgba(99,102,241,0.18)',
  sidebarAccent:   '#6366f1',

  // Main canvas
  canvasBg:        '#f5f6fa',
  panelBg:         '#ffffff',
  panelBorder:     '#eceef3',

  // Messages
  ownBubbleBg:     'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  ownBubbleText:   '#ffffff',
  otherBubbleBg:   '#f0f2f8',
  otherBubbleText: '#1a1d27',

  // Typography
  textPrimary:     '#0f1117',
  textSecondary:   '#6b7280',
  textMuted:       '#9ca3af',

  // Accents
  accent:          '#6366f1',
  accentLight:     '#ede9fe',
  green:           '#10b981',
  red:             '#ef4444',
  redLight:        '#fef2f2',

  // Input
  inputBg:         '#f8f9fc',
  inputBorder:     '#e5e7eb',
  inputFocusBorder:'#6366f1',

  // Unread badge
  badgeBg:         '#6366f1',

  font:            "'DM Sans', sans-serif",
  fontMono:        "'DM Mono', monospace",
};

const Messenger = ({ userId, userName }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('global');
  const [globalMessages, setGlobalMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const editInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  const API_URL = 'http://127.0.0.1:8000/api/chat';
  
  // ─── Helper function to convert UTC timestamp to local time ─────────────────
  const toLocalTime = (timestamp) => {
    if (!timestamp) return null;
    if (timestamp instanceof Date) return timestamp;
    let dateString = timestamp;
    if (typeof timestamp === 'string') {
      if (timestamp.includes(' ') && !timestamp.includes('T')) {
        dateString = timestamp.replace(' ', 'T') + 'Z';
      }
      else if (!timestamp.includes('Z') && !timestamp.includes('+') && !timestamp.includes('-')) {
        dateString = timestamp + 'Z';
      }
    }
    const date = new Date(dateString);
    return date;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [globalMessages, privateMessages]);
  
  useEffect(() => {
    if (editingMessage && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingMessage]);
  
  useEffect(() => {
    const checkOnline = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', checkOnline);
    window.addEventListener('offline', checkOnline);
    return () => {
      window.removeEventListener('online', checkOnline);
      window.removeEventListener('offline', checkOnline);
    };
  }, []);
  
  const fetchGlobalMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/global-messages`);
      const data = await response.json();
      if (data.success) setGlobalMessages(data.messages || []);
    } catch (error) { console.error('Error fetching global messages:', error); }
  };
  
  const fetchConversations = async () => {
    try {
      const response = await fetch(`${API_URL}/conversations/${userId}`);
      const data = await response.json();
      if (data.success) setConversations(data.conversations || []);
    } catch (error) { console.error('Error fetching conversations:', error); }
  };
  
  const fetchPrivateMessages = async (conversationId) => {
    try {
      const response = await fetch(`${API_URL}/messages/${conversationId}`);
      const data = await response.json();
      if (data.success) setPrivateMessages(data.messages || []);
    } catch (error) { console.error('Error fetching private messages:', error); }
  };
  
  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      if (data.success) setAllUsers(data.users.filter(user => String(user.id) !== String(userId)));
    } catch (error) { console.error('Error fetching users:', error); }
  };
  
  const sendGlobalMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const response = await fetch(`${API_URL}/global-messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_id: userId, message: newMessage.trim() })
      });
      const data = await response.json();
      if (data.success) {
        setGlobalMessages([...globalMessages, data.message]);
        setNewMessage('');
        inputRef.current?.focus();
      }
    } catch (error) { console.error('Error sending message:', error); }
  };
  
  const startConversation = async (otherUser) => {
    try {
      const response = await fetch(`${API_URL}/conversation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user1_id: userId, user2_id: otherUser.id })
      });
      const data = await response.json();
      if (data.success) {
        setSelectedUser(otherUser);
        setSelectedConversation(data.conversation);
        await fetchPrivateMessages(data.conversation.id);
        setShowUserList(false);
        fetchConversations();
      }
    } catch (error) { console.error('Error starting conversation:', error); }
  };
  
  const sendPrivateMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: selectedConversation.id,
          sender_id: userId,
          receiver_id: selectedUser.id,
          message: newMessage.trim()
        })
      });
      const data = await response.json();
      if (data.success) {
        setPrivateMessages([...privateMessages, data.message]);
        setNewMessage('');
        inputRef.current?.focus();
        await fetch(`${API_URL}/read/${selectedConversation.id}/${userId}`, { method: 'PUT' });
      }
    } catch (error) { console.error('Error sending message:', error); }
  };
  
  const editMessage = async (messageId, newText, isGlobal = true) => {
    try {
      const response = await fetch(`${API_URL}/edit-message`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: messageId, message: newText, type: isGlobal ? 'global' : 'private', user_id: userId })
      });
      const data = await response.json();
      if (data.success) {
        if (isGlobal) {
          setGlobalMessages(globalMessages.map(msg => msg.id === messageId ? { ...msg, message: newText, is_edited: true } : msg));
        } else {
          setPrivateMessages(privateMessages.map(msg => msg.id === messageId ? { ...msg, message: newText, is_edited: true } : msg));
        }
        setEditingMessage(null);
        setEditText('');
      }
    } catch (error) { console.error('Error editing message:', error); }
  };
  
  const deleteMessageForEveryone = async (messageId, isGlobal = true) => {
    try {
      const response = await fetch(`${API_URL}/delete-message`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: messageId, type: isGlobal ? 'global' : 'private', user_id: userId, delete_for_everyone: true })
      });
      const data = await response.json();
      if (data.success) {
        if (isGlobal) {
          setGlobalMessages(globalMessages.filter(msg => msg.id !== messageId));
        } else {
          setPrivateMessages(privateMessages.filter(msg => msg.id !== messageId));
        }
        setShowDeleteConfirm(null);
      }
    } catch (error) { console.error('Error deleting message:', error); }
  };
  
  const selectConversation = async (conv) => {
    setSelectedUser({ id: conv.user_id, name: conv.user_name, email: conv.user_email });
    setSelectedConversation({ id: conv.id });
    await fetchPrivateMessages(conv.id);
    await fetch(`${API_URL}/read/${conv.id}/${userId}`, { method: 'PUT' });
    fetchConversations();
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedUser(null);
    setSelectedConversation(null);
    setShowUserList(false);
    if (tab === 'global') fetchGlobalMessages();
    else { fetchConversations(); fetchAllUsers(); }
  };
  
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = toLocalTime(timestamp);
    if (!date) return '';
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString();
  };
  
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = toLocalTime(timestamp);
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getRandomColor = (name) => {
    const colors = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#84cc16'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  useEffect(() => {
    if (userId) {
      fetchGlobalMessages();
      fetchConversations();
      fetchAllUsers();
    }
    const interval = setInterval(() => {
      if (activeTab === 'global') fetchGlobalMessages();
      else if (selectedConversation) fetchPrivateMessages(selectedConversation.id);
      if (activeTab === 'private') fetchConversations();
    }, 3000);
    return () => clearInterval(interval);
  }, [userId, activeTab, selectedConversation]);

  // ─── Avatar ───────────────────────────────────────────────────────────────────
  const Avatar = ({ name, size = 40, radius = '14px' }) => (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: `linear-gradient(135deg, ${getRandomColor(name || '?')} 0%, ${getRandomColor(name || '?')}cc 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: '700', fontSize: size * 0.4,
      fontFamily: T.font, letterSpacing: '-0.02em', userSelect: 'none',
    }}>
      {(name || '?').charAt(0).toUpperCase()}
    </div>
  );

  // ─── Delete Modal ─────────────────────────────────────────────────────────────
  const DeleteConfirmModal = ({ onClose, onConfirm, messageText }) => (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(10,10,20,0.55)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, animation: 'fadeBg 0.18s ease-out',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: '28px',
        padding: '32px', width: '420px', maxWidth: '92vw',
        boxShadow: '0 32px 64px -8px rgba(0,0,0,0.22)',
        animation: 'popUp 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        fontFamily: T.font,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: '#fef2f2', display: 'flex',
          alignItems: 'center', justifyContent: 'center', marginBottom: 20,
        }}>
          <Trash2 size={22} color="#ef4444" />
        </div>
        <h3 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 700, color: T.textPrimary }}>
          Delete message?
        </h3>
        <p style={{ margin: '0 0 20px', color: T.textSecondary, fontSize: 14, lineHeight: 1.6 }}>
          This will permanently remove the message for everyone. This cannot be undone.
        </p>
        <div style={{
          background: '#fafafa', borderRadius: 14, padding: '12px 16px',
          marginBottom: 24, borderLeft: `3px solid #ef4444`,
        }}>
          <p style={{ margin: 0, fontSize: 13, color: '#475569', fontStyle: 'italic', lineHeight: 1.5 }}>
            "{messageText?.substring(0, 100)}{messageText?.length > 100 ? '…' : ''}"
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: 'Cancel', bg: '#f1f5f9', color: '#64748b', hoverBg: '#e2e8f0', action: onClose },
            { label: 'Delete for Everyone', bg: '#ef4444', color: '#fff', hoverBg: '#dc2626', action: onConfirm },
          ].map(btn => (
            <button key={btn.label} onClick={btn.action} style={{
              flex: 1, padding: '12px', background: btn.bg, color: btn.color,
              border: 'none', borderRadius: 14, cursor: 'pointer',
              fontSize: 14, fontWeight: 600, fontFamily: T.font,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = btn.hoverBg; if (btn.bg === '#ef4444') e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = btn.bg; e.currentTarget.style.transform = 'none'; }}
            >{btn.label}</button>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── Message Bubble ───────────────────────────────────────────────────────────
  const MessageBubble = ({ message, isOwn, senderName, timestamp, isRead, messageId, isGlobal, originalMessage }) => {
    const [showActions, setShowActions] = useState(false);
    const isDeleted = message.is_deleted;
    const isEdited = message.is_edited;

    if (isDeleted && !isOwn) return null;
    if (isDeleted && isOwn) return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: T.textMuted, fontStyle: 'italic', background: '#f8f9fc', padding: '6px 14px', borderRadius: 20 }}>
          You deleted this message
        </span>
      </div>
    );

    return (
      <div
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start', marginBottom: 20, alignItems: 'flex-end', gap: 10 }}
      >
        {!isOwn && <Avatar name={senderName} size={34} radius="50%" />}

        <div style={{ maxWidth: '62%', minWidth: 80 }}>
          {!isOwn && (
            <p style={{ margin: '0 0 5px 4px', fontSize: 11, fontWeight: 600, color: '#000000', letterSpacing: '0.02em' }}>
              {senderName}
            </p>
          )}

          {editingMessage === messageId ? (
            <div style={{ background: '#fff', borderRadius: 18, padding: 14, border: `2px solid ${T.accent}`, boxShadow: '0 4px 20px rgba(99,102,241,0.15)' }}>
              <textarea
                ref={editInputRef}
                value={editText}
                onChange={e => setEditText(e.target.value)}
                onKeyPress={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); editMessage(messageId, editText, isGlobal); } }}
                style={{ width: '100%', padding: '8px 4px', border: 'none', fontSize: 14, outline: 'none', fontFamily: T.font, resize: 'vertical', background: 'transparent', color: T.textPrimary, lineHeight: 1.5 }}
                rows={2}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                {[
                  { label: 'Cancel', bg: '#f1f5f9', color: '#64748b', action: () => { setEditingMessage(null); setEditText(''); } },
                  { label: 'Save', bg: T.accent, color: '#fff', action: () => editMessage(messageId, editText, isGlobal) },
                ].map(b => (
                  <button key={b.label} onClick={b.action} style={{ padding: '7px 16px', background: b.bg, color: b.color, border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: T.font }}>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div style={{
                background: isOwn ? T.ownBubbleBg : T.otherBubbleBg,
                borderRadius: isOwn ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                padding: '11px 16px',
                boxShadow: isOwn ? '0 4px 16px rgba(99,102,241,0.25)' : '0 1px 4px rgba(0,0,0,0.05)',
              }}>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: isOwn ? T.ownBubbleText : T.otherBubbleText, wordBreak: 'break-word', fontFamily: T.font }}>
                  {message}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4, justifyContent: isOwn ? 'flex-end' : 'flex-start', paddingLeft: 4, paddingRight: 4 }}>
                <span style={{ fontSize: 10, color: T.textMuted, fontFamily: T.fontMono }}>{formatMessageTime(timestamp)}</span>
                {isOwn && (isRead ? <CheckCheck size={11} color={T.accent} /> : <Clock size={11} color={T.textMuted} />)}
                {isEdited && <span style={{ fontSize: 9, color: T.textMuted, fontStyle: 'italic' }}>edited</span>}
              </div>

              {isOwn && showActions && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end', animation: 'riseUp 0.15s ease-out' }}>
                  {[
                    {
                      icon: <Edit2 size={13} />, label: 'Edit',
                      style: { bg: '#fff', border: `1px solid ${T.inputBorder}`, color: T.textSecondary, hoverBg: T.accentLight, hoverColor: T.accent, hoverBorder: T.accent },
                      action: () => { setEditingMessage(messageId); setEditText(message); setShowActions(false); }
                    },
                    {
                      icon: <Trash2 size={13} />, label: 'Delete',
                      style: { bg: T.redLight, border: '1px solid #fee2e2', color: T.red, hoverBg: '#fee2e2', hoverColor: T.red, hoverBorder: '#fecaca' },
                      action: () => setShowDeleteConfirm({ id: messageId, isGlobal, text: message })
                    },
                  ].map(b => (
                    <button key={b.label} onClick={b.action} style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '5px 13px', background: b.style.bg, border: b.style.border,
                      borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                      color: b.style.color, fontFamily: T.font, transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = b.style.hoverBg; e.currentTarget.style.borderColor = b.style.hoverBorder; e.currentTarget.style.color = b.style.hoverColor; }}
                    onMouseLeave={e => { e.currentTarget.style.background = b.style.bg; e.currentTarget.style.borderColor = b.style.border.replace('1px solid ',''); e.currentTarget.style.color = b.style.color; }}
                    >
                      {b.icon}{b.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {isOwn && <Avatar name={userName} size={34} radius="50%" />}
      </div>
    );
  };

  // ─── Conversation Item - MODIFIED: All text changed to black ─────────────────
  const ConversationItem = ({ conv, isSelected, onClick }) => {
    const now = new Date();
    const messageDate = toLocalTime(conv.last_message_time);
    if (!messageDate) return null;
    const isToday = messageDate.toDateString() === now.toDateString();
    return (
      <button onClick={onClick} style={{
        width: '100%', padding: '12px 14px',
        background: isSelected ? T.sidebarActive : 'transparent',
        border: isSelected ? `1px solid rgba(99,102,241,0.3)` : '1px solid transparent',
        borderRadius: 14, cursor: 'pointer', marginBottom: 4, textAlign: 'left',
        transition: 'all 0.15s', fontFamily: T.font,
      }}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = T.sidebarHover; }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ position: 'relative' }}>
            <Avatar name={conv.user_name} size={44} radius="50%" />
            <div style={{ position: 'absolute', bottom: 2, right: 2, width: 9, height: 9, borderRadius: '50%', background: T.green, border: '2px solid #0d0f14' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
              {/* User name - changed to black */}
              <p style={{ margin: 0, fontWeight: conv.unread_count > 0 ? 700 : 500, fontSize: 14, color: '#000000', letterSpacing: '-0.01em' }}>
                {conv.user_name}
              </p>
              {/* Time - changed to black */}
              <span style={{ fontSize: 10, color: '#000000', fontFamily: T.fontMono, fontWeight: 500 }}>
                {isToday ? formatMessageTime(conv.last_message_time) : messageDate.toLocaleDateString()}
              </span>
            </div>
            {/* Message preview - changed to black */}
            <p style={{ margin: 0, fontSize: 12, color: '#000000', fontWeight: conv.unread_count > 0 ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {conv.last_message || 'Start a conversation'}
            </p>
          </div>
          {conv.unread_count > 0 && (
            <div style={{ minWidth: 20, height: 20, background: T.badgeBg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{conv.unread_count}</span>
            </div>
          )}
        </div>
      </button>
    );
  };

  // ─── Empty State ──────────────────────────────────────────────────────────────
  const EmptyState = ({ icon: Icon, title, subtitle }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', gap: 12, padding: 40 }}>
      <div style={{ width: 72, height: 72, background: '#f0f2f8', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={32} color="#c7cce0" />
      </div>
      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: T.textPrimary, fontFamily: T.font }}>{title}</h3>
      <p style={{ margin: 0, color: T.textSecondary, fontSize: 13, fontFamily: T.font }}>{subtitle}</p>
    </div>
  );

  // ─── Icon Button ──────────────────────────────────────────────────────────────
  const IconBtn = ({ children, onClick, style: extra = {} }) => (
    <button onClick={onClick} style={{
      width: 38, height: 38, borderRadius: '50%',
      background: '#f0f2f8', border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.15s', ...extra
    }}
    onMouseEnter={e => e.currentTarget.style.background = '#e5e8f2'}
    onMouseLeave={e => e.currentTarget.style.background = extra.background || '#f0f2f8'}
    >{children}</button>
  );

  // ─── Tabs (sidebar section) ───────────────────────────────────────────────────
  const totalUnread = conversations.reduce((s, c) => s + (c.unread_count || 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: T.canvasBg, display: 'flex', fontFamily: T.font }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <div style={{
        width: 280, background: T.sidebarBg, height: '100vh',
        position: 'fixed', left: 0, top: 0, display: 'flex',
        flexDirection: 'column', overflow: 'hidden',
        borderRight: `1px solid ${T.sidebarBorder}`,
      }}>

        {/* Logo */}
        <div style={{ padding: '24px 22px 20px', borderBottom: `1px solid ${T.sidebarBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, background: `linear-gradient(135deg, ${T.accent}, #4f46e5)`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18, boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>O</div>
            <div>
              <p style={{ margin: 0, color: T.sidebarText, fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em' }}>Ovijan Chat</p>
              <p style={{ margin: 0, color: T.green, fontSize: 11, fontWeight: 500 }}>● Connected</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ padding: '16px 16px 0' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ width: '100%', padding: '10px 14px', background: T.sidebarHover, border: 'none', borderRadius: 12, color: T.sidebarText, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500, fontFamily: T.font, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.paddingLeft = '18px'; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.sidebarHover; e.currentTarget.style.paddingLeft = '14px'; }}
          >
            <Home size={17} /> Dashboard
          </button>
        </div>

        {/* Chat type tabs */}
        <div style={{ padding: '14px 16px 6px' }}>
          <p style={{ margin: '0 0 10px 4px', fontSize: 10, fontWeight: 700, color: T.sidebarMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Channels</p>
          {[
            { id: 'global', icon: <Users size={16} />, label: 'Global Chat', badge: null },
            { id: 'private', icon: <MessageCircle size={16} />, label: 'Messages', badge: totalUnread },
          ].map(tab => (
            <button key={tab.id} onClick={() => handleTabChange(tab.id)} style={{
              width: '100%', padding: '10px 14px', background: activeTab === tab.id ? T.sidebarActive : 'transparent',
              border: activeTab === tab.id ? `1px solid rgba(99,102,241,0.25)` : '1px solid transparent',
              borderRadius: 12, color: activeTab === tab.id ? '#a5b4fc' : T.sidebarMuted,
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              fontSize: 14, fontWeight: activeTab === tab.id ? 600 : 400, fontFamily: T.font,
              transition: 'all 0.15s', marginBottom: 4,
            }}
            onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.background = T.sidebarHover; e.currentTarget.style.color = T.sidebarText; }}
            onMouseLeave={e => { if (activeTab !== tab.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.sidebarMuted; } }}
            >
              {tab.icon}
              <span style={{ flex: 1 }}>{tab.label}</span>
              {tab.badge > 0 && (
                <span style={{ background: T.badgeBg, color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>{tab.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* User profile at bottom */}
        <div style={{ marginTop: 'auto', padding: '16px 18px', borderTop: `1px solid ${T.sidebarBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <Avatar name={userName} size={38} radius="50%" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, color: T.sidebarText, fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</p>
              <p style={{ margin: '2px 0 0', color: T.green, fontSize: 11, fontWeight: 500 }}>● Active now</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Area ──────────────────────────────────────────────────────────── */}
      <div style={{ marginLeft: 280, flex: 1, display: 'flex', height: '100vh', padding: 20, gap: 0 }}>
        <div style={{ flex: 1, display: 'flex', borderRadius: 24, overflow: 'hidden', background: T.panelBg, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: `1px solid ${T.panelBorder}` }}>

          {/* ── Conversations panel (private tab, no user selected) ────────── */}
          {activeTab === 'private' && !selectedUser && (
            <div style={{ width: 340, borderRight: `1px solid ${T.panelBorder}`, display: 'flex', flexDirection: 'column', background: '#fafbfe' }}>
              {/* Panel header */}
              <div style={{ padding: '22px 20px 14px', borderBottom: `1px solid ${T.panelBorder}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.textPrimary, letterSpacing: '-0.02em' }}>Messages</h2>
                  <button
                    onClick={() => setShowUserList(!showUserList)}
                    style={{ width: 34, height: 34, borderRadius: 10, background: showUserList ? T.accent : T.accentLight, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = T.accent}
                    onMouseLeave={e => e.currentTarget.style.background = showUserList ? T.accent : T.accentLight}
                  >
                    <Plus size={17} color={showUserList ? '#fff' : T.accent} />
                  </button>
                </div>
                {/* Search */}
                <div style={{ position: 'relative', background: '#fff', borderRadius: 12, border: `1px solid ${T.inputBorder}` }}>
                  <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }} />
                  <input
                    type="text" placeholder="Search…" value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px 9px 36px', border: 'none', borderRadius: 12, fontSize: 13, outline: 'none', fontFamily: T.font, background: 'transparent', color: T.textPrimary }}
                  />
                </div>
              </div>

              {/* New chat user list */}
              {showUserList && (
                <div style={{ padding: '10px 14px 6px', borderBottom: `1px solid ${T.panelBorder}`, maxHeight: 260, overflowY: 'auto', background: '#fff' }}>
                  <p style={{ margin: '0 0 8px 2px', fontSize: 10, fontWeight: 700, color: T.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>All Users</p>
                  {allUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                    <button key={user.id} onClick={() => startConversation(user)} style={{ width: '100%', padding: '10px 12px', background: '#fafbfe', border: 'none', borderRadius: 12, cursor: 'pointer', marginBottom: 6, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 11, transition: 'background 0.15s', fontFamily: T.font }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0f2f8'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fafbfe'}
                    >
                      <Avatar name={user.name} size={38} radius="50%" />
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: T.textPrimary }}>{user.name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: T.textMuted }}>{user.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Conversation list */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px 10px' }}>
                {conversations.length === 0
                  ? <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                      <MessageCircle size={36} color="#c7cce0" />
                      <p style={{ marginTop: 12, color: T.textMuted, fontSize: 13, fontFamily: T.font }}>No conversations yet</p>
                    </div>
                  : conversations.map(conv => (
                      <ConversationItem key={conv.id} conv={conv} isSelected={selectedUser?.id === conv.user_id} onClick={() => selectConversation(conv)} />
                    ))
                }
              </div>
            </div>
          )}

          {/* ── Chat Column ───────────────────────────────────────────────── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Top bar */}
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${T.panelBorder}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 70 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {selectedUser && (
                  <button
                    onClick={() => { setSelectedUser(null); setSelectedConversation(null); setPrivateMessages([]); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: T.textSecondary, padding: '6px 10px', borderRadius: 10, fontSize: 13, fontFamily: T.font, fontWeight: 500, transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f0f2f8'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                  >
                    <ArrowLeft size={17} /> Back
                  </button>
                )}
                {selectedUser && <Avatar name={selectedUser.name} size={42} radius="50%" />}
                <div>
                  <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: T.textPrimary, letterSpacing: '-0.02em' }}>
                    {activeTab === 'global' && !selectedUser ? 'Global Community' : selectedUser ? selectedUser.name : 'Messages'}
                  </h2>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: T.textSecondary, fontWeight: 400 }}>
                    {activeTab === 'global' && !selectedUser
                      ? `${globalMessages.length} messages · everyone`
                      : selectedUser ? <span style={{ color: T.green, fontWeight: 500 }}>● Online</span>
                      : 'Start a private conversation'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {!isOnline && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: '#fef2f2', borderRadius: 20 }}>
                    <WifiOff size={13} color={T.red} />
                    <span style={{ fontSize: 12, color: T.red, fontWeight: 600, fontFamily: T.font }}>Offline</span>
                  </div>
                )}
                {selectedUser && (
                  <>
                    <IconBtn><Phone size={16} color={T.textSecondary} /></IconBtn>
                    <IconBtn><Video size={16} color={T.textSecondary} /></IconBtn>
                  </>
                )}
              </div>
            </div>

            {/* Messages area */}
            <div ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', background: '#fafbfe' }}>
              {activeTab === 'global' && !selectedUser && (
                globalMessages.length === 0
                  ? <EmptyState icon={MessageCircle} title="Global Chat" subtitle="Be the first to start a conversation!" />
                  : globalMessages.map((msg, idx) => (
                      <MessageBubble key={idx} message={msg.message} isOwn={String(msg.sender_id) === String(userId)}
                        senderName={msg.sender_name} timestamp={msg.created_at} isRead={true}
                        messageId={msg.id} isGlobal={true} originalMessage={msg.message} />
                    ))
              )}
              {selectedUser && (
                privateMessages.length === 0
                  ? <EmptyState icon={MessageCircle} title={`Say hi to ${selectedUser.name}!`} subtitle="Send a message to start the conversation" />
                  : privateMessages.map((msg, idx) => (
                      <MessageBubble key={idx} message={msg.message} isOwn={String(msg.sender_id) === String(userId)}
                        senderName={selectedUser.name} timestamp={msg.created_at} isRead={msg.is_read}
                        messageId={msg.id} isGlobal={false} originalMessage={msg.message} />
                    ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div style={{ padding: '14px 20px', borderTop: `1px solid ${T.panelBorder}`, background: '#fff' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: T.inputBg, borderRadius: 20, padding: '8px 10px 8px 14px', border: `1.5px solid ${T.inputBorder}`, transition: 'border-color 0.15s' }}
                onFocusCapture={e => e.currentTarget.style.borderColor = T.inputFocusBorder}
                onBlurCapture={e => e.currentTarget.style.borderColor = T.inputBorder}
              >
                <div style={{ display: 'flex', gap: 4 }}>
                  <IconBtn style={{ width: 34, height: 34, background: 'transparent' }}>
                    <Smile size={18} color={T.textMuted} />
                  </IconBtn>
                  <IconBtn style={{ width: 34, height: 34, background: 'transparent' }}>
                    <Paperclip size={17} color={T.textMuted} />
                  </IconBtn>
                </div>

                <textarea
                  ref={inputRef}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (activeTab === 'global') sendGlobalMessage();
                      if (selectedUser) sendPrivateMessage();
                    }
                  }}
                  placeholder="Write a message…"
                  rows={1}
                  style={{ flex: 1, padding: '8px 4px', border: 'none', fontSize: 14, outline: 'none', fontFamily: T.font, resize: 'none', background: 'transparent', color: T.textPrimary, lineHeight: 1.5 }}
                />

                <button
                  onClick={() => { if (activeTab === 'global') sendGlobalMessage(); if (selectedUser) sendPrivateMessage(); }}
                  disabled={!newMessage.trim()}
                  style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: newMessage.trim() ? T.accent : '#e5e7eb',
                    border: 'none', cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.18s', flexShrink: 0,
                    boxShadow: newMessage.trim() ? '0 4px 14px rgba(99,102,241,0.35)' : 'none',
                  }}
                  onMouseEnter={e => { if (newMessage.trim()) { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.background = '#4f46e5'; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; if (newMessage.trim()) e.currentTarget.style.background = T.accent; }}
                >
                  <Send size={16} color="#fff" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          onClose={() => setShowDeleteConfirm(null)}
          onConfirm={() => deleteMessageForEveryone(showDeleteConfirm.id, showDeleteConfirm.isGlobal)}
          messageText={showDeleteConfirm.text}
        />
      )}

      {/* CSS */}
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #dde0ec; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #b8bcce; }
        @keyframes fadeBg { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popUp { from { opacity: 0; transform: scale(0.88) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes riseUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        textarea::placeholder { color: #9ca3af; }
        input::placeholder { color: #9ca3af; }
      `}</style>
    </div>
  );
};

export default Messenger;