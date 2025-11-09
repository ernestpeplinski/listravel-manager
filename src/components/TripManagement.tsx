import { useState } from "react";
import { useTrips } from "../hooks/useTrips";
import { TripForm } from "./TripForm";
import { TripCard } from "./TripCard";
import { ConfirmDialog } from "./ConfirmDialog";
import type { Trip } from "../types/trip";
import styles from "../styles/TripManagement.module.scss";

type ConfirmAction =
  | { type: "delete"; tripId: string }
  | { type: "cancel"; tripId: string; cancelled: boolean }
  | null;

const TripManagement = () => {
  const { trips, loading, error, addTrip, updateTrip, deleteTrip } = useTrips();
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>(undefined);
  const [detailsTrip, setDetailsTrip] = useState<Trip | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

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
    setConfirmAction({ type: "delete", tripId });
  };

  const handleToggleCancel = async (tripId: string, cancelled: boolean) => {
    setConfirmAction({ type: "cancel", tripId, cancelled });
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;

    if (confirmAction.type === "delete") {
      await deleteTrip(confirmAction.tripId);
    } else if (confirmAction.type === "cancel") {
      await updateTrip(confirmAction.tripId, {
        cancelled: confirmAction.cancelled,
      });
    }

    setConfirmAction(null);
  };

  const getDialogProps = () => {
    if (!confirmAction) return null;

    if (confirmAction.type === "delete") {
      return {
        title: "Usuń wycieczkę",
        message:
          "Czy na pewno chcesz usunąć tę wycieczkę? Ta operacja jest nieodwracalna.",
        confirmText: "Usuń",
        variant: "danger" as const,
      };
    } else {
      return {
        title: confirmAction.cancelled
          ? "Odwołaj wycieczkę"
          : "Przywróć wycieczkę",
        message: confirmAction.cancelled
          ? "Czy na pewno chcesz odwołać tę wycieczkę? Zostanie oznaczona jako odwołana."
          : "Czy na pewno chcesz przywrócić tę wycieczkę?",
        confirmText: confirmAction.cancelled ? "Odwołaj" : "Przywróć",
        variant: "warning" as const,
      };
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
        <div className={styles.imageModal} onClick={() => setDetailsTrip(null)}>
          <img
            src={detailsTrip.imageUrl}
            alt={detailsTrip.title}
            className={styles.imageModalContent}
          />
        </div>
      )}

      {confirmAction && (
        <ConfirmDialog
          isOpen={true}
          {...getDialogProps()!}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
};

export default TripManagement;
