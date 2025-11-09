import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import TripManagement from "./components/TripManagement";

function App() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("trips");

  if (!user) {
    return <Login />;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Navbar
        user={user}
        onLogout={logout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content area */}
      <main>{activeTab === "trips" && <TripManagement />}</main>
    </div>
  );
}

export default App;
