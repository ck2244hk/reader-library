import { useState } from 'react'
import './Session.css'

export default function Session({ session, onBack }) {
  const [loaded, setLoaded] = useState(false)
  const base = import.meta.env.BASE_URL
  const src = `${base}${session.file}`

  return (
    <div className="session-view">
      <div className="sv-bar">
        <button className="sv-back" onClick={onBack}>
          ← Library
        </button>
        <div className="sv-title-wrap">
          <span className="sv-diamond">◆</span>
          <span className="sv-title">{session.title}</span>
        </div>
        <a
          className="sv-source"
          href={session.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Source ↗
        </a>
      </div>

      {!loaded && (
        <div className="sv-loading">
          <span className="sv-loading-dot" />
          <span className="sv-loading-dot" style={{ animationDelay: '0.15s' }} />
          <span className="sv-loading-dot" style={{ animationDelay: '0.3s' }} />
        </div>
      )}

      <iframe
        src={src}
        title={session.title}
        className="sv-frame"
        style={{ opacity: loaded ? 1 : 0 }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
