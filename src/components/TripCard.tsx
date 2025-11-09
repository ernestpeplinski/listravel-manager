import type { Trip } from "../types/trip";
import styles from "../styles/TripManagement.module.scss";

interface TripCardProps {
  trip: Trip | Omit<Trip, "id">;
  onEdit?: (trip: Trip) => void;
  onDelete?: (tripId: string) => void;
  onDetails?: (trip: Trip | Omit<Trip, "id">) => void;
  onToggleCancel?: (tripId: string, cancelled: boolean) => void;
  previewMode?: boolean;
}

export const TripCard = ({
  trip,
  onEdit,
  onDelete,
  onDetails,
  onToggleCancel,
  previewMode = false,
}: TripCardProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const daysBetween = (start: Date, end: Date) => {
    const ms =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return ms;
  };

  const daysUntilTrip = (startDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isTripOngoing = (startDate: Date, endDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    return today >= start && today <= end;
  };

  const formatDaysUntil = (days: number) => {
    if (days < 0) return null;
    if (days === 0) return "Dziś";
    if (days === 1) return "Jutro";
    if (days < 7) return `Za ${days} dni`;

    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;

    let weeksText = "";
    if (weeks === 1) {
      weeksText = "1 tydzień";
    } else if (weeks < 5) {
      weeksText = `${weeks} tygodnie`;
    } else {
      weeksText = `${weeks} tygodni`;
    }

    if (remainingDays === 0) {
      return `Za ${days} dni (${weeksText})`;
    } else if (remainingDays === 1) {
      return `Za ${days} dni (${weeksText}, 1 dzień)`;
    } else {
      return `Za ${days} dni (${weeksText}, ${remainingDays} dni)`;
    }
  };

  const days = daysBetween(trip.startDate, trip.endDate);
  const daysUntil = daysUntilTrip(trip.startDate);
  const isOngoing = isTripOngoing(trip.startDate, trip.endDate);
  const daysUntilText = isOngoing ? null : formatDaysUntil(daysUntil);
  const tripId = "id" in trip ? trip.id : undefined;

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
          onClick={() => onDetails?.(trip)}
        >
          Zobacz szczegóły
        </button>
      </div>
      {!previewMode && (
        <div className={styles.tripActions}>
          <div className={styles.tripMeta}>
            {isOngoing && !trip.cancelled && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Status:</span>
                <span className={styles.metaValueOngoing}>
                  W trakcie trwania
                </span>
              </div>
            )}
            {daysUntilText && !trip.cancelled && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Rozpoczęcie:</span>
                <span className={styles.metaValueUpcoming}>
                  {daysUntilText}
                </span>
              </div>
            )}
            {trip.createdAt && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Utworzono:</span>
                <span className={styles.metaValue}>
                  {formatDateTime(trip.createdAt)}
                  {trip.createdBy && (
                    <span className={styles.metaBy}>
                      {" "}
                      przez {trip.createdBy}
                    </span>
                  )}
                </span>
              </div>
            )}
            {trip.updatedAt && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Ostatnia modyfikacja:</span>
                <span className={styles.metaValue}>
                  {formatDateTime(trip.updatedAt)}
                  {trip.updatedBy && (
                    <span className={styles.metaBy}>
                      {" "}
                      przez {trip.updatedBy}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
          <div className={styles.actionButtons}>
            <button
              className={styles.editButton}
              onClick={() => onEdit?.(trip as Trip)}
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
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edytuj
            </button>
            <button
              className={styles.cancelButton}
              onClick={() =>
                tripId && onToggleCancel?.(tripId, !trip.cancelled)
              }
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {trip.cancelled ? "Przywróć" : "Odwołaj"}
            </button>
            <button
              className={styles.deleteButton}
              onClick={() => tripId && onDelete?.(tripId)}
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
      )}
    </div>
  );
};
