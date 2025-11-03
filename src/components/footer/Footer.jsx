import React from 'react';
import './Footer.css';

/**
 * A minimal footer component.  It stays at the bottom of the
 * document and contains copyright information and a simple call
 * to action (e.g. contact email).  Feel free to expand this
 * section with social links or additional pages.
 */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>&copy; {new Date().getFullYear()} Marco Franco. All rights reserved.</p>
        <p>
          Built with&nbsp;
          <span role="img" aria-label="love">
            ❤
          </span>
          &nbsp;using&nbsp;React &amp; Vite.
        </p>
      </div>
    </footer>
  );
}