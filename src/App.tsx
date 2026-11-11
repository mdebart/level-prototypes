import { Suspense, useEffect } from 'react'
import { HashRouter, Link, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { prototypes } from './prototypes/registry'
import s from './App.module.css'

function useEmbed() {
  const { search } = useLocation()
  const embed = new URLSearchParams(search).get('embed') === '1'
  useEffect(() => { document.body.classList.toggle('is-embed', embed) }, [embed])
  return embed
}

function Gallery() {
  return (
    <main className={s.gallery}>
      <h1 className="lv-h2">Level App Prototypes</h1>
      <p className={`lv-body2 ${s.muted}`}>Coded from the 📚 App Component Library. Each prototype can be embedded with <code>?embed=1</code>.</p>
      <ul className={s.list}>
        {prototypes.map((p) => (
          <li key={p.slug}>
            <Link to={`/p/${p.slug}`} className={s.card}>
              <span className="lv-body1">{p.title}</span>
              <span className={`lv-body3 ${s.muted}`}>{p.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

function PrototypePage() {
  const { slug } = useParams()
  const embed = useEmbed()
  const proto = prototypes.find((p) => p.slug === slug)
  if (!proto) return <p className={s.gallery}>Not found.</p>
  const { Component } = proto
  return (
    <div className={embed ? s.embed : s.page}>
      {!embed && (
        <header className={s.bar}>
          <Link to="/" className="lv-body2">← All prototypes</Link>
          <span className="lv-body2">{proto.title}</span>
          <a href={proto.figma} target="_blank" rel="noreferrer" className="lv-body2">Figma ↗</a>
        </header>
      )}
      <div className={s.viewport}>
        <Suspense fallback={null}><Component /></Suspense>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/p/:slug" element={<PrototypePage />} />
      </Routes>
    </HashRouter>
  )
}
