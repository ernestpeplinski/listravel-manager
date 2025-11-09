import { useState } from "react";

interface Trip {
  id: string;
  name: string;
  date: string;
  participants: number;
}

const TripManagement = () => {
  const [trips] = useState<Trip[]>([
    // Przykładowe dane - później będą z Firestore
  ]);

  return (
    <div style={{ padding: "15px" }}>
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Nagłówek sekcji */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(20px, 5vw, 28px)",
              color: "#333",
            }}
          >
            Zarządzanie wycieczkami
          </h2>
          <button
            style={{
              padding: "12px 24px",
              backgroundColor: "#4285f4",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "clamp(14px, 3vw, 16px)",
              fontWeight: "500",
              transition: "background-color 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#3367d6")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#4285f4")
            }
          >
            + Dodaj wycieczkę
          </button>
        </div>

        {/* Lista wycieczek */}
        {trips.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              border: "2px dashed #dee2e6",
            }}
          >
            <p
              style={{
                fontSize: "clamp(14px, 3.5vw, 18px)",
                color: "#6c757d",
                margin: 0,
              }}
            >
              Brak wycieczek. Dodaj pierwszą wycieczkę, aby rozpocząć.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
              gap: "15px",
            }}
          >
            {trips.map((trip, index) => (
              <div
                key={trip.id || index}
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <h3>{trip.name}</h3>
                <p>Data: {trip.date}</p>
                <p>Uczestnicy: {trip.participants}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripManagement;
