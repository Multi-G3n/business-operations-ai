import { useEffect, useState } from 'react'
import './App.css'

export type InventoryTransaction = {
  id: number
  productName: string
  sku: string
  type: 'Stock In' | 'Stock Out'
  quantity: number
  reason: string
  date: string
}

type CardTheme = 'garden' | 'classic' | 'sunset'

type Invitation = {
  partnerOne: string
  partnerTwo: string
  hostLine: string
  date: string
  time: string
  venue: string
  message: string
  theme: CardTheme
}

const defaultInvitation: Invitation = {
  partnerOne: 'Amelia',
  partnerTwo: 'Oliver',
  hostLine: 'Together with their families',
  date: '2027-06-12',
  time: '17:30',
  venue: 'The Glasshouse, Kuala Lumpur',
  message: 'A day filled with love, laughter, and a little bit of magic. We would be delighted to celebrate with you.',
  theme: 'garden',
}

const storageKey = 'wedding-card-studio.invitation'

function loadInvitation(): Invitation {
  try {
    const stored = window.localStorage.getItem(storageKey)
    if (stored) return { ...defaultInvitation, ...JSON.parse(stored) as Partial<Invitation> }
  } catch {
    // Start with the sample invitation if saved browser data is unavailable.
  }

  return defaultInvitation
}

function App() {
  const [invitation, setInvitation] = useState<Invitation>(loadInvitation)
  const [savedMessage, setSavedMessage] = useState('Saved in this browser')

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(invitation))
    } catch {
      setSavedMessage('Unable to save in this browser')
      return
    }

    setSavedMessage('Saved in this browser')
  }, [invitation])

  function updateInvitation<K extends keyof Invitation>(key: K, value: Invitation[K]) {
    setInvitation((current) => ({ ...current, [key]: value }))
  }

  function resetInvitation() {
    setInvitation(defaultInvitation)
  }

  const dateLabel = invitation.date
    ? new Date(`${invitation.date}T12:00:00`).toLocaleDateString('en-MY', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Your wedding date'

  return (
    <main className="studio-shell">
      <header className="studio-header">
        <a className="brand" href="#top" aria-label="Ever After home">
          <span className="brand-mark" aria-hidden="true">✳</span>
          <span>ever after<span className="brand-period">.</span></span>
        </a>
        <div className="header-note"><span className="status-dot" /> Invitation studio</div>
      </header>

      <section className="intro" id="top">
        <p className="eyebrow">A little something made by you</p>
        <h1>Your day, your <em>story.</em></h1>
        <p className="intro-copy">Create a wedding invitation that feels like the two of you. Make it yours, one detail at a time.</p>
      </section>

      <section className="workspace" aria-label="Wedding invitation editor">
        <div className="editor-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">01 / Make it yours</p>
              <h2>The details</h2>
            </div>
            <span className="step-count">1 of 1</span>
          </div>

          <div className="form-section">
            <h3>The happy couple</h3>
            <div className="field-row">
              <label className="field">
                <span>First name</span>
                <input value={invitation.partnerOne} onChange={(event) => updateInvitation('partnerOne', event.target.value)} placeholder="Amelia" />
              </label>
              <label className="field">
                <span>Second name</span>
                <input value={invitation.partnerTwo} onChange={(event) => updateInvitation('partnerTwo', event.target.value)} placeholder="Oliver" />
              </label>
            </div>
            <label className="field">
              <span>Opening line</span>
              <input value={invitation.hostLine} onChange={(event) => updateInvitation('hostLine', event.target.value)} placeholder="Together with their families" />
            </label>
          </div>

          <div className="form-section">
            <h3>When & where</h3>
            <div className="field-row">
              <label className="field">
                <span>Date</span>
                <input type="date" value={invitation.date} onChange={(event) => updateInvitation('date', event.target.value)} />
              </label>
              <label className="field">
                <span>Time</span>
                <input type="time" value={invitation.time} onChange={(event) => updateInvitation('time', event.target.value)} />
              </label>
            </div>
            <label className="field">
              <span>Venue</span>
              <input value={invitation.venue} onChange={(event) => updateInvitation('venue', event.target.value)} placeholder="Venue name and location" />
            </label>
          </div>

          <div className="form-section">
            <h3>A note to your guests</h3>
            <label className="field">
              <span>Invitation message</span>
              <textarea value={invitation.message} onChange={(event) => updateInvitation('message', event.target.value)} rows={3} maxLength={180} />
              <span className="character-count">{invitation.message.length}/180</span>
            </label>
          </div>

          <div className="form-section theme-section">
            <div className="theme-heading">
              <h3>Choose a feeling</h3>
              <span>Theme</span>
            </div>
            <div className="theme-options" role="group" aria-label="Card theme">
              <button className={`theme-option garden-swatch ${invitation.theme === 'garden' ? 'selected' : ''}`} onClick={() => updateInvitation('theme', 'garden')} aria-pressed={invitation.theme === 'garden'}>
                <span className="swatch" /> Garden
              </button>
              <button className={`theme-option classic-swatch ${invitation.theme === 'classic' ? 'selected' : ''}`} onClick={() => updateInvitation('theme', 'classic')} aria-pressed={invitation.theme === 'classic'}>
                <span className="swatch" /> Classic
              </button>
              <button className={`theme-option sunset-swatch ${invitation.theme === 'sunset' ? 'selected' : ''}`} onClick={() => updateInvitation('theme', 'sunset')} aria-pressed={invitation.theme === 'sunset'}>
                <span className="swatch" /> Sunset
              </button>
            </div>
          </div>

          <div className="editor-footer">
            <span className="save-state"><span className="save-dot" />{savedMessage}</span>
            <button className="reset-button" onClick={resetInvitation}>Reset sample</button>
          </div>
        </div>

        <aside className="preview-panel" aria-label="Live invitation preview">
          <div className="preview-heading">
            <div>
              <p className="eyebrow">02 / The finished feeling</p>
              <h2>A little preview</h2>
            </div>
            <span className="live-pill"><span /> LIVE</span>
          </div>

          <div className="card-stage">
            <article className={`invitation-card theme-${invitation.theme}`}>
              <div className="card-border">
                <div className="card-decoration" aria-hidden="true"><span>✳</span><i>✧</i></div>
                <p className="card-hostline">{invitation.hostLine || 'Together with their families'}</p>
                <p className="card-invite">joyfully invite you to celebrate</p>
                <h2 className="couple-names">
                  <span>{invitation.partnerOne || 'Your name'}</span>
                  <i>&</i>
                  <span>{invitation.partnerTwo || 'Your love'}</span>
                </h2>
                <span className="card-rule" />
                <p className="card-date">{dateLabel}</p>
                <p className="card-time">{invitation.time ? new Date(`2000-01-01T${invitation.time}`).toLocaleTimeString('en-MY', { hour: 'numeric', minute: '2-digit' }) : 'Your ceremony time'}</p>
                <p className="card-venue">{invitation.venue || 'Your venue'}</p>
                <p className="card-message">{invitation.message || 'Add a personal note for your guests.'}</p>
                <div className="card-bottom-mark" aria-hidden="true">✳</div>
              </div>
            </article>
          </div>
          <p className="preview-caption">A keepsake for the beginning of forever.</p>
        </aside>
      </section>

      <footer className="page-footer">
        <span>Made for the moments that matter.</span>
        <span>EVER AFTER STUDIO <i>·</i> 2026</span>
      </footer>
    </main>
  )
}

export default App
