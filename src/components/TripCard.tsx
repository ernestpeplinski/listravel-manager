import type { Trip } from "../types/trip";
import styles from "../styles/TripManagement.module.scss";

interface TripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (tripId: string) => void;
}

export const TripCard = ({ trip, onEdit, onDelete }: TripCardProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      className={`${styles.tripCard} ${trip.cancelled ? styles.cancelled : ""}`}
    >
      <div className={styles.tripImage}>
        <img src={trip.thumbnailUrl || trip.imageUrl} alt={trip.title} />
        {trip.cancelled && (
          <div className={styles.cancelledBadge}>ODWOŁANA</div>
        )}
      </div>
      <div className={styles.tripContent}>
        <h3 className={styles.tripTitle}>{trip.title}</h3>
        <p className={styles.tripDate}>
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </p>
        <p className={styles.tripDescription}>{trip.description}</p>
        <p className={styles.tripPrice}>{trip.price} PLN</p>
      </div>
      <div className={styles.tripActions}>
        <button className={styles.editButton} onClick={() => onEdit(trip)}>
          Edytuj
        </button>
        <button
          className={styles.deleteButton}
          onClick={() => trip.id && onDelete(trip.id)}
        >
          Usuń
        </button>
      </div>
    </div>
  );
};
