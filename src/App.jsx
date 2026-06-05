import { useState, useEffect } from 'react'
import Library from './pages/Library.jsx'
import Session from './pages/Session.jsx'

export default function App() {
  const [sessions, setSessions] = useState([])
  const [activeSession, setActiveSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const base = import.meta.env.BASE_URL
    fetch(`${base}sessions.json`)
      .then(r => r.json())
      .then(data => {
        setSessions(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  if (activeSession) {
    return (
      <Session
        session={activeSession}
        onBack={() => setActiveSession(null)}
      />
    )
  }

  return (
    <Library
      sessions={sessions}
      onOpen={setActiveSession}
    />
  )
}

function Loader() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      color: 'var(--text-muted)',
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '12px',
      letterSpacing: '0.1em',
    }}>
      <span style={{ color: 'var(--gold)' }}>◆</span> LOADING LIBRARY
    </div>
  )
}
