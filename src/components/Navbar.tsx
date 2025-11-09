import type { User } from "firebase/auth";
import logo from "../assets/logo_1000x1000.png";

interface NavbarProps {
  user: User;
  onLogout: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navbar = ({ user, onLogout, activeTab, onTabChange }: NavbarProps) => {
  return (
    <div>
      {/* Header */}
      <header
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #e0e0e0",
          padding: "12px 15px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "1400px",
            margin: "0 auto",
            gap: "10px",
          }}
        >
          {/* Logo i tytuł */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              minWidth: 0,
              flex: "1",
            }}
          >
            <img
              src={logo}
              alt="Lis Travel Logo"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "contain",
                flexShrink: 0,
              }}
            />
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(16px, 4vw, 24px)",
                whiteSpace: "nowrap",
                color: "#333",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Lis Travel
            </h1>
          </div>

          {/* Info użytkownika i przycisk wylogowania */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: "clamp(11px, 2.5vw, 14px)",
                color: "#666",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "120px",
                display: "none",
              }}
              className="user-email"
            >
              {user.displayName || user.email}
            </span>
            <button
              onClick={onLogout}
              style={{
                padding: "6px 12px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "clamp(12px, 2.5vw, 14px)",
                transition: "background-color 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#c82333")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#dc3545")
              }
            >
              Wyloguj
            </button>
          </div>
        </div>
        <style>{`
          @media (min-width: 480px) {
            .user-email {
              display: block !important;
            }
          }
        `}</style>
      </header>

      {/* Navigation Bar */}
      <nav
        style={{
          backgroundColor: "#f8f9fa",
          boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <button
            onClick={() => onTabChange("trips")}
            style={{
              background: "none",
              border: "none",
              padding: "12px 20px",
              fontSize: "clamp(14px, 3vw, 16px)",
              cursor: "pointer",
              color: activeTab === "trips" ? "#4285f4" : "#555",
              fontWeight: activeTab === "trips" ? "600" : "400",
              borderBottom:
                activeTab === "trips"
                  ? "3px solid #4285f4"
                  : "3px solid transparent",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            Zarządzanie wycieczkami
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
