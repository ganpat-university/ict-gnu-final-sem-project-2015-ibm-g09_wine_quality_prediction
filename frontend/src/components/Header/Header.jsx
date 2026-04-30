import React, { useEffect, useState } from 'react'
import './Header.css'

function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // prevent background scroll when drawer is open
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        <div className="brand">OLIPOP</div>

        <nav className="nav-desktop" aria-label="Primary navigation">
          <a className="nav-link" href="/">Home</a>
          <a className="nav-link" href="/predict">Predict</a>
          <a className="nav-link" href="/discover">Discover</a>
          <a className="nav-link nav-login" href="/login">Login</a>
        </nav>

        <button
          className="menu-btn"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span className="hamburger" />
        </button>
      </div>

      <div className={`mobile-drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Mobile menu">
        <button className="drawer-close" aria-label="Close menu" onClick={() => setOpen(false)}>×</button>
        <nav className="nav-mobile">
          <a className="nav-link" href="/" onClick={() => setOpen(false)}>Home</a>
          <a className="nav-link" href="/predict" onClick={() => setOpen(false)}>Predict</a>
          <a className="nav-link" href="/discover" onClick={() => setOpen(false)}>Discover</a>
          <a className="nav-link nav-login" href="/login" onClick={() => setOpen(false)}>Login</a>
        </nav>
      </div>

      <div className={`drawer-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} aria-hidden={!open} />
    </header>
  )
}

export default Header