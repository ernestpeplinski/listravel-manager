import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { isAuthorizedFirestore } from "../utils/firestoreAuth";
import logo from "../assets/logo_1000x1000.png";

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const authorized = await isAuthorizedFirestore(result.user.email);

      if (!authorized) {
        await signOut(auth);
        alert(
          "Nie masz uprawnień do dostępu do tej aplikacji. Skontaktuj się z administratorem."
        );
        return;
      }

      console.log("Zalogowano:", result.user);
    } catch (error) {
      console.error("Błąd logowania:", error);
      alert("Nie udało się zalogować. Spróbuj ponownie.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <img
        src={logo}
        alt="Lis Travel Logo"
        style={{
          width: "120px",
          height: "120px",
          objectFit: "contain",
          marginBottom: "20px",
        }}
      />
      <h1>Lis Travel Menadzer</h1>
      <p style={{ marginTop: "20px", marginBottom: "30px" }}>
        Zaloguj się, aby uzyskać dostęp
      </p>
      <button
        onClick={handleGoogleLogin}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: "#4285f4",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <svg
          width="18"
          height="18"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
        Zaloguj przez Google
      </button>
    </div>
  );
};

export default Login;
