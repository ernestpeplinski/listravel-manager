import { useAuth } from "./hooks/useAuth";
import Login from "./components/Login";
import logo from "./assets/logo_1000x1000.png";

function App() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <img
            src={logo}
            alt="Lis Travel Logo"
            style={{ width: "50px", height: "50px", objectFit: "contain" }}
          />
          <h1 style={{ margin: 0 }}>Lis Travel Menadzer</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span>Witaj, {user.displayName || user.email}</span>
          <button
            onClick={logout}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Wyloguj
          </button>
        </div>
      </div>

      <div>
        <p>
          Tutaj będzie treść aplikacji dostępna dla zalogowanych użytkowników.
        </p>
      </div>
    </div>
  );
}

export default App;
