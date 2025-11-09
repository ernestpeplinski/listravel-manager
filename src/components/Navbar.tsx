import type { User } from "firebase/auth";
import logo from "../assets/logo_1000x1000.png";
import styles from "../styles/Navbar.module.scss";

interface NavbarProps {
  user: User;
  onLogout: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navbar = ({ user, onLogout, activeTab, onTabChange }: NavbarProps) => {
  return (
    <div className={styles.navbar}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.logoSection}>
            <img src={logo} alt="Lis Travel Logo" className={styles.logo} />
            <h1 className={styles.title}>Lis Travel</h1>
          </div>

          <div className={styles.userSection}>
            <span className={styles.userEmail}>
              {user.displayName || user.email}
            </span>
            <button onClick={onLogout} className={styles.logoutButton}>
              Wyloguj
            </button>
          </div>
        </div>
      </header>

      <nav className={styles.navSection}>
        <div className={styles.navContainer}>
          <button
            onClick={() => onTabChange("trips")}
            className={`${styles.navButton} ${
              activeTab === "trips" ? styles.active : ""
            }`}
          >
            Zarządzanie wycieczkami
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
