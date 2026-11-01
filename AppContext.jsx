// ════════════════════════════════════════════════════════════════════════════
// AppContext.jsx — Global shared state
// ════════════════════════════════════════════════════════════════════════════

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { STAGE, AGE } from '../constants';

// ──────────────────── LESSON 4 ────────────────────
// TODO: Import omdbSearch and omdbDetails from '../utils/api'
// ──────────────────── STUBS: delete after adding real code ────────────────
// (no stub needed — add the real import above when ready)
// ──────────────────── END ─────────────────────────

const AppContext = createContext(null);

export function AppProvider({ children }) {

  // ── Theme ──────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => localStorage.getItem('cv_theme') || 'dark');
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : '';
    localStorage.setItem('cv_theme', theme);
  }, [theme]);

  // ── User profile ───────────────────────────────────────────────────────
  const [userName,       setUserName]       = useState('');
  const [userAge,        setUserAge]        = useState(AGE.ADULT);
  const [userMood,       setUserMood]       = useState('');
  const [userCategories, setUserCategories] = useState([]);
  const [userLanguage,   setUserLanguage]   = useState(['Any Language']);

  const userAgeRef = useRef(AGE.ADULT);
  useEffect(() => { userAgeRef.current = userAge; }, [userAge]);

  // ── Chat state ─────────────────────────────────────────────────────────
  const [stage,       setStage]       = useState(STAGE.NAME);
  const [chatMsgs,    setChatMsgs]    = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const msgCounter = useRef(0);
  const newId = () => `msg-${++msgCounter.current}`;

  const addMsg = useCallback((role, content) =>
    setChatMsgs(prev => [...prev, { id: newId(), role, content }]), []);

  const resetModalRef = useRef(null);
  const resetChat = useCallback(() => {
    setChatMsgs([]);
    setUserName(''); setUserAge(AGE.ADULT); userAgeRef.current = AGE.ADULT;
    setUserMood(''); setUserCategories([]); setUserLanguage(['Any Language']);
    setIsBotTyping(false); setStage(STAGE.NAME);
    if (resetModalRef.current) resetModalRef.current();
  }, []);

  // ── callAI stub (Lesson 3) — scripted replies only ─────────────────────
  const callAI = useCallback(async (userMessage) => {
    await new Promise(r => setTimeout(r, 500));
    if (userMessage.toLowerCase().includes('name'))
      return "Great to meet you! How are you feeling today?";
    if (userMessage.toLowerCase().includes('feeling') || userMessage.toLowerCase().includes('mood'))
      return "Sounds good! Let's set up your preferences.";
    return "Got it!";
  }, []);

  const switchAge = useCallback((newAge) => {
    setUserAge(newAge);
    userAgeRef.current = newAge;
    addMsg('bot', `Switched to ${{ [AGE.KIDS]: '🔥 Trending mode', [AGE.TEEN]: '🎞️ Nostalgic mode', [AGE.ADULT]: '⭐ Popular mode' }[newAge]}!`);
  }, [addMsg]);


  // ──────────────────── LESSON 4 ────────────────────
  // TODO: Write searchForStrip(query) — call omdbSearch and return up to 12 results
  // TODO: Add selectedMovie and showModal state
  // TODO: Wire up resetModalRef so resetChat can close the modal
  // TODO: Write openMovie(movie) — set selectedMovie, open modal, fetch full details
  // ──────────────────── STUBS: delete after adding real code ────────────────
  const searchForStrip = useCallback(async () => [], []);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal,     setShowModal]     = useState(false);
  resetModalRef.current = () => setShowModal(false);
  const openMovie = useCallback((movie) => { setSelectedMovie(movie); setShowModal(true); }, []);
  // ──────────────────── END ─────────────────────────


  const value = {
    theme, setTheme,
    userName, setUserName, userAge, setUserAge,
    userMood, setUserMood, userCategories, setUserCategories,
    userLanguage, setUserLanguage,
    stage, setStage, chatMsgs, setChatMsgs, addMsg,
    isBotTyping, setIsBotTyping, resetChat,
    callAI, switchAge,
    // ──────────────────── LESSON 4 ────────────────────
    // TODO: add searchForStrip, selectedMovie, showModal, setShowModal, openMovie
    // ──────────────────── STUBS: delete after adding real code ────────────────
    searchForStrip, selectedMovie, showModal, setShowModal, openMovie,
    // ──────────────────── END ─────────────────────────
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside <AppProvider>');
  return ctx;
}
