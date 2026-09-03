import { useState } from "react";
import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  padding: "8px 14px",
  borderRadius: "8px",
  color: isActive ? "#0b1120" : "#e6e9f0",
  background: isActive ? "#3fd0c9" : "transparent",
  fontWeight: 600,
  fontSize: "14px",
});

export default function Navbar() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header
      style={{
        borderBottom:
          "1px solid var(--color-border)",
        background:
          "var(--color-surface)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          minHeight: "64px",
          position: "relative",
        }}
      >
        {/* Logo */}

        <NavLink
          to="/"
          onClick={closeMenu}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: 700,
            fontSize: "17px",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background:
                "var(--color-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#062421",
              fontSize: "16px",
            }}
          >
            🛡️
          </div>

          <span>Vaani Shield</span>
        </NavLink>

        {/* Desktop Navigation */}

        <nav
          className="desktop-nav"
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          <NavLink
            to="/"
            style={linkStyle}
            end
          >
            Home
          </NavLink>

          <NavLink
            to="/detect"
            style={linkStyle}
          >
            Detect
          </NavLink>

          <NavLink
            to="/history"
            style={linkStyle}
          >
            History
          </NavLink>

          <NavLink
            to="/about"
            style={linkStyle}
          >
            About
          </NavLink>
        </nav>

        {/* Mobile Menu Button */}

        <button
          className="mobile-menu-button"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle navigation menu"
          style={{
            background: "transparent",
            color:
              "var(--color-text-primary)",
            fontSize: "24px",
            padding: "6px",
            cursor: "pointer",
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Mobile Navigation */}

        {menuOpen && (
          <nav
            className="mobile-nav"
            style={{
              position: "absolute",
              top: "64px",
              left: 0,
              right: 0,
              background:
                "var(--color-surface)",
              border:
                "1px solid var(--color-border)",
              borderRadius: "0 0 14px 14px",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <NavLink
              to="/"
              style={linkStyle}
              end
              onClick={closeMenu}
            >
              Home
            </NavLink>

            <NavLink
              to="/detect"
              style={linkStyle}
              onClick={closeMenu}
            >
              Detect
            </NavLink>

            <NavLink
              to="/history"
              style={linkStyle}
              onClick={closeMenu}
            >
              History
            </NavLink>

            <NavLink
              to="/about"
              style={linkStyle}
              onClick={closeMenu}
            >
              About
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}