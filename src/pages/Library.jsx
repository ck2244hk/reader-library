import { useState, useMemo } from 'react'
import './Library.css'

export default function Library({ sessions, onOpen }) {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState(null)

  const allTags = useMemo(() => {
    const set = new Set()
    sessions.forEach(s => s.tags?.forEach(t => set.add(t)))
    return [...set].sort()
  }, [sessions])

  const filtered = useMemo(() => {
    return sessions.filter(s => {
      const matchSearch = !search ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.url.toLowerCase().includes(search.toLowerCase()) ||
        s.excerpt?.toLowerCase().includes(search.toLowerCase())
      const matchTag = !activeTag || s.tags?.includes(activeTag)
      return matchSearch && matchTag
    })
  }, [sessions, search, activeTag])

  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="library">
      <header className="lib-header">
        <div className="lib-header-inner">
          <div className="lib-brand">
            <span className="lib-brand-icon">◆</span>
            <div>
              <h1 className="lib-title">Reader Library</h1>
              <p className="lib-subtitle">Your learning sessions</p>
            </div>
          </div>
          <div className="lib-stats">
            <div className="lib-stat">
              <span className="lib-stat-num">{sessions.length}</span>
              <span className="lib-stat-label">Sessions</span>
            </div>
            <div className="lib-stat">
              <span className="lib-stat-num">{sessions.reduce((a, s) => a + (s.questionCount || 0), 0)}</span>
              <span className="lib-stat-label">Questions</span>
            </div>
            <div className="lib-stat">
              <span className="lib-stat-num">{allTags.length}</span>
              <span className="lib-stat-label">Topics</span>
            </div>
          </div>
        </div>
      </header>

      <div className="lib-toolbar">
        <div className="lib-search-wrap">
          <span className="lib-search-icon">⌕</span>
          <input
            className="lib-search"
            type="text"
            placeholder="Search sessions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="lib-search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
        <div className="lib-tags">
          <button
            className={`lib-tag ${!activeTag ? 'active' : ''}`}
            onClick={() => setActiveTag(null)}
          >All</button>
          {allTags.map(tag => (
            <button
              key={tag}
              className={`lib-tag ${activeTag === tag ? 'active' : ''}`}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            >{tag}</button>
          ))}
        </div>
      </div>

      <main className="lib-grid-wrap">
        {sorted.length === 0 ? (
          <div className="lib-empty">
            <span className="lib-empty-icon">◇</span>
            <p>No sessions found</p>
            <span className="lib-empty-sub">Try a different search or tag</span>
          </div>
        ) : (
          <div className="lib-grid">
            {sorted.map((session, i) => (
              <SessionCard
                key={session.id}
                session={session}
                onOpen={onOpen}
                index={i}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="lib-footer">
        <span className="lib-footer-mono">web-reader-learn</span>
        <span className="lib-footer-dot">·</span>
        <span>Drop new HTML sessions into <code>/sessions</code> and update <code>sessions.json</code></span>
      </footer>
    </div>
  )
}

function SessionCard({ session, onOpen, index }) {
  const date = new Date(session.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  return (
    <article
      className="session-card"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => onOpen(session)}
    >
      <div className="sc-top">
        <div className="sc-meta">
          <time className="sc-date">{date}</time>
          {session.questionCount && (
            <span className="sc-qcount">{session.questionCount} questions</span>
          )}
        </div>
        <span className="sc-arrow">→</span>
      </div>

      <h2 className="sc-title">{session.title}</h2>

      {session.excerpt && (
        <p className="sc-excerpt">{session.excerpt}</p>
      )}

      <div className="sc-bottom">
        <span className="sc-url">{new URL(session.url).hostname}</span>
        <div className="sc-tags">
          {session.tags?.map(tag => (
            <span key={tag} className="sc-tag">{tag}</span>
          ))}
        </div>
      </div>
    </article>
  )
}
