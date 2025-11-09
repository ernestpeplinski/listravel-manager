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
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");

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

  // Podział wycieczek na nadchodzące i archiwalne
  const now = new Date();
  const upcomingTrips = trips
    .filter((trip) => !trip.cancelled && trip.endDate >= now)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const archivedTrips = trips
    .filter((trip) => trip.cancelled || trip.endDate < now)
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

  // Grupowanie wycieczek według miesiąca i roku
  const groupTripsByMonth = (trips: Trip[]) => {
    const groups: { [key: string]: Trip[] } = {};

    trips.forEach((trip) => {
      const date = trip.startDate;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(trip);
    });

    return groups;
  };

  const formatMonthYear = (key: string) => {
    const [year, month] = key.split("-");
    const monthNames = [
      "Styczeń",
      "Luty",
      "Marzec",
      "Kwiecień",
      "Maj",
      "Czerwiec",
      "Lipiec",
      "Sierpień",
      "Wrzesień",
      "Październik",
      "Listopad",
      "Grudzień",
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const upcomingGrouped = groupTripsByMonth(upcomingTrips);
  const archivedGrouped = groupTripsByMonth(archivedTrips);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderCompactView = (trips: Trip[], monthKey: string) => {
    return (
      <div key={monthKey} className={styles.compactMonthGroup}>
        <h4 className={styles.monthTitle}>{formatMonthYear(monthKey)}</h4>
        <div className={styles.compactList}>
          {trips.map((trip) => (
            <div
              key={trip.id}
              className={`${styles.compactItem} ${
                trip.cancelled ? styles.compactItemCancelled : ""
              }`}
            >
              <div className={styles.compactMain}>
                <div className={styles.compactImage}>
                  <img
                    src={trip.thumbnailUrl || trip.imageUrl}
                    alt={trip.title}
                  />
                  {trip.cancelled && (
                    <span className={styles.compactCancelledBadge}>
                      ODWOŁANE
                    </span>
                  )}
                </div>
                <div className={styles.compactContent}>
                  <h5 className={styles.compactTitle}>{trip.title}</h5>
                  <div className={styles.compactDetails}>
                    <span className={styles.compactDate}>
                      {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                    </span>
                    <span className={styles.compactPrice}>
                      {trip.price.toLocaleString("pl-PL")} zł
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.compactActions}>
                <button
                  className={styles.compactButton}
                  onClick={() => handleDetailsClick(trip)}
                  title="Szczegóły"
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
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </button>
                <button
                  className={styles.compactButton}
                  onClick={() => handleEditClick(trip)}
                  title="Edytuj"
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
                </button>
                <button
                  className={styles.compactButton}
                  onClick={() =>
                    trip.id && handleToggleCancel(trip.id, !trip.cancelled)
                  }
                  title={trip.cancelled ? "Przywróć" : "Odwołaj"}
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
                </button>
                <button
                  className={`${styles.compactButton} ${styles.compactButtonDanger}`}
                  onClick={() => trip.id && handleDeleteClick(trip.id)}
                  title="Usuń"
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
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
          <div className={styles.headerActions}>
            <button
              className={styles.viewModeButton}
              onClick={() =>
                setViewMode(viewMode === "grid" ? "compact" : "grid")
              }
              title={
                viewMode === "grid" ? "Widok kompaktowy" : "Widok kafelkowy"
              }
            >
              {viewMode === "grid" ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                  <span className={styles.viewModeText}>Kompaktowy</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  <span className={styles.viewModeText}>Kafelkowy</span>
                </>
              )}
            </button>
            <button className={styles.addButton} onClick={handleAddClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Dodaj wycieczkę
            </button>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {trips.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>
              Brak wycieczek. Dodaj pierwszą wycieczkę, aby rozpocząć.
            </p>
          </div>
        ) : (
          <>
            {/* Nadchodzące wycieczki */}
            {upcomingTrips.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Nadchodzące wycieczki</h3>
                {viewMode === "compact" ? (
                  <>
                    {Object.keys(upcomingGrouped)
                      .sort()
                      .map((monthKey) =>
                        renderCompactView(upcomingGrouped[monthKey], monthKey)
                      )}
                  </>
                ) : (
                  <>
                    {Object.keys(upcomingGrouped)
                      .sort()
                      .map((monthKey) => (
                        <div key={monthKey} className={styles.monthGroup}>
                          <h4 className={styles.monthTitle}>
                            {formatMonthYear(monthKey)}
                          </h4>
                          <div className={styles.tripGrid}>
                            {upcomingGrouped[monthKey].map((trip) => (
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
                        </div>
                      ))}
                  </>
                )}
              </div>
            )}

            {/* Archiwalne wycieczki */}
            {archivedTrips.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Archiwalne wycieczki</h3>
                {viewMode === "compact" ? (
                  <>
                    {Object.keys(archivedGrouped)
                      .sort()
                      .reverse()
                      .map((monthKey) =>
                        renderCompactView(archivedGrouped[monthKey], monthKey)
                      )}
                  </>
                ) : (
                  <>
                    {Object.keys(archivedGrouped)
                      .sort()
                      .reverse()
                      .map((monthKey) => (
                        <div key={monthKey} className={styles.monthGroup}>
                          <h4 className={styles.monthTitle}>
                            {formatMonthYear(monthKey)}
                          </h4>
                          <div className={styles.tripGrid}>
                            {archivedGrouped[monthKey].map((trip) => (
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
                        </div>
                      ))}
                  </>
                )}
              </div>
            )}

            {upcomingTrips.length === 0 && archivedTrips.length === 0 && (
              <div className={styles.emptyState}>
                <p className={styles.emptyStateText}>
                  Brak wycieczek. Dodaj pierwszą wycieczkę, aby rozpocząć.
                </p>
              </div>
            )}
          </>
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
