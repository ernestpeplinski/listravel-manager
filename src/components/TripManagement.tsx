import { useState } from "react";
import { useTrips } from "../hooks/useTrips";
import { TripForm } from "./TripForm";
import { TripCard } from "./TripCard";
import type { Trip } from "../types/trip";
import styles from "../styles/TripManagement.module.scss";

const TripManagement = () => {
  const { trips, loading, error, addTrip, updateTrip, deleteTrip } = useTrips();
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>(undefined);
  const [detailsTrip, setDetailsTrip] = useState<Trip | null>(null);

  const handleAddClick = () => {
    setEditingTrip(undefined);
    setShowForm(true);
  };

  const handleEditClick = (trip: Trip) => {
    setEditingTrip(trip);
    setShowForm(true);
  };

  const handleDetailsClick = (trip: Trip) => {
    setDetailsTrip(trip);
  };

  const handleFormSubmit = async (tripData: Omit<Trip, "id">) => {
    if (editingTrip?.id) {
      const success = await updateTrip(editingTrip.id, tripData);
      if (success) setShowForm(false);
      return success;
    } else {
      const id = await addTrip(tripData);
      if (id) setShowForm(false);
      return id;
    }
  };

  const handleDeleteClick = async (tripId: string) => {
    if (
      window.confirm(
        "Czy na pewno chcesz usunąć tę wycieczkę? Ta operacja jest nieodwracalna."
      )
    ) {
      await deleteTrip(tripId);
    }
  };

  const handleToggleCancel = async (tripId: string, cancelled: boolean) => {
    const message = cancelled
      ? "Czy na pewno chcesz odwołać tę wycieczkę? Zostanie oznaczona jako odwołana."
      : "Czy na pewno chcesz przywrócić tę wycieczkę?";

    if (window.confirm(message)) {
      await updateTrip(tripId, { cancelled });
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <p className={styles.loading}>Ładowanie wycieczek...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Zarządzanie wycieczkami</h2>
          <button className={styles.addButton} onClick={handleAddClick}>
            + Dodaj wycieczkę
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {trips.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>
              Brak wycieczek. Dodaj pierwszą wycieczkę, aby rozpocząć.
            </p>
          </div>
        ) : (
          <div className={styles.tripGrid}>
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onDetails={handleDetailsClick}
                onToggleCancel={handleToggleCancel}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <TripForm
          trip={editingTrip}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {detailsTrip && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setDetailsTrip(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <strong>{detailsTrip.title}</strong>
              <button
                className={styles.modalClose}
                aria-label="Zamknij"
                onClick={() => setDetailsTrip(null)}
              >
                ×
              </button>
            </div>
            <img
              className={styles.modalImg}
              src={detailsTrip.imageUrl}
              alt={detailsTrip.title}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TripManagement;
