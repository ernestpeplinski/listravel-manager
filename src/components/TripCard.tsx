import type { Trip } from "../types/trip";
import styles from "../styles/TripManagement.module.scss";

interface TripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (tripId: string) => void;
  onDetails: (trip: Trip) => void;
}

export const TripCard = ({
  trip,
  onEdit,
  onDelete,
  onDetails,
}: TripCardProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const daysBetween = (start: Date, end: Date) => {
    const ms =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return ms;
  };

  const days = daysBetween(trip.startDate, trip.endDate);

  return (
    <div
      className={`${styles.tripCard} ${trip.cancelled ? styles.cancelled : ""}`}
    >
      {trip.cancelled && <div className={styles.cancelledBadge}>ODWOŁANE</div>}
      <div className={styles.tripImage}>
        <img
          src={trip.thumbnailUrl || trip.imageUrl}
          alt={trip.title}
          loading="lazy"
        />
      </div>
      <div className={styles.tripContent}>
        <h3 className={styles.tripTitle}>{trip.title}</h3>
        {trip.description && (
          <p className={styles.tripDescription}>{trip.description}</p>
        )}
        <div className={styles.tripDate}>
          <svg
            className={styles.tripDateIcon}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {formatDate(trip.startDate)} – {formatDate(trip.endDate)} ({days}{" "}
          {days === 1 ? "dzień" : days < 5 ? "dni" : "dni"})
        </div>
        <div className={styles.tripPrice}>
          Cena: {trip.price.toLocaleString("pl-PL")} zł
        </div>
        <button
          className={styles.detailsButton}
          onClick={() => onDetails(trip)}
        >
          Zobacz szczegóły
        </button>
      </div>
      <div className={styles.tripActions}>
        <button className={styles.editButton} onClick={() => onEdit(trip)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Edytuj
        </button>
        <button
          className={styles.deleteButton}
          onClick={() => trip.id && onDelete(trip.id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          Usuń
        </button>
      </div>
    </div>
  );
};
