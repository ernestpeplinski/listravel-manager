import { useState } from "react";
import styles from "../styles/TripManagement.module.scss";

interface Trip {
  id: string;
  name: string;
  date: string;
  participants: number;
}

const TripManagement = () => {
  const [trips] = useState<Trip[]>([]);

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Zarządzanie wycieczkami</h2>
          <button className={styles.addButton}>+ Dodaj wycieczkę</button>
        </div>

        {trips.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>
              Brak wycieczek. Dodaj pierwszą wycieczkę, aby rozpocząć.
            </p>
          </div>
        ) : (
          <div className={styles.tripGrid}>
            {trips.map((trip, index) => (
              <div key={trip.id || index} className={styles.tripCard}>
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
