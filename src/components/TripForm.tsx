import React, { useState } from "react";
import type { Trip, TripFormData } from "../types/trip";
import { uploadToCloudinary } from "../utils/cloudinary";
import { TripCard } from "./TripCard";
import styles from "../styles/TripForm.module.scss";

interface TripFormProps {
  trip?: Trip;
  onSubmit: (trip: Omit<Trip, "id">) => Promise<string | null | boolean>;
  onCancel: () => void;
}

export const TripForm: React.FC<TripFormProps> = ({
  trip,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<TripFormData>({
    startDate: trip?.startDate
      ? new Date(trip.startDate).toISOString().split("T")[0]
      : "",
    endDate: trip?.endDate
      ? new Date(trip.endDate).toISOString().split("T")[0]
      : "",
    title: trip?.title || "",
    description: trip?.description || "",
    price: trip?.price || 0,
    cancelled: trip?.cancelled || false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    trip?.imageUrl || ""
  );
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    trip?.thumbnailUrl || ""
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleFileChange = (
    file: File,
    setFile: (file: File) => void,
    setPreview: (preview: string) => void
  ) => {
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validateDates = (startDate: string, endDate: string) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end < start) {
        setDateError(
          "Data zakończenia nie może być wcześniejsza niż data rozpoczęcia"
        );
        return false;
      }
    }
    setDateError("");
    return true;
  };

  const handleStartDateChange = (value: string) => {
    setFormData({ ...formData, startDate: value });
    validateDates(value, formData.endDate);
  };

  const handleEndDateChange = (value: string) => {
    setFormData({ ...formData, endDate: value });
    validateDates(formData.startDate, value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file, setImageFile, setImagePreview);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file, setThumbnailFile, setThumbnailPreview);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUploading(true);

    try {
      // Validate dates
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate < startDate) {
        setUploading(false);
        return;
      }

      let imageUrl = trip?.imageUrl || "";
      let thumbnailUrl = trip?.thumbnailUrl || "";

      // Upload images if new files selected
      const uploadPromises: Promise<void>[] = [];

      if (imageFile) {
        uploadPromises.push(
          uploadToCloudinary(imageFile, "listravel/trips").then((result) => {
            imageUrl = result.secure_url;
          })
        );
      }

      if (thumbnailFile) {
        uploadPromises.push(
          uploadToCloudinary(thumbnailFile, "listravel/thumbnails").then(
            (result) => {
              thumbnailUrl = result.secure_url;
            }
          )
        );
      }

      await Promise.all(uploadPromises);

      // Validate required images
      if (!imageUrl || !thumbnailUrl) {
        throw new Error(
          !imageUrl
            ? "Zdjęcie główne jest wymagane"
            : "Miniaturka jest wymagana"
        );
      }

      const tripData: Omit<Trip, "id"> = {
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        title: formData.title,
        description: formData.description,
        price: formData.price,
        imageUrl,
        thumbnailUrl,
        cancelled: formData.cancelled,
      };

      const result = await onSubmit(tripData);
      if (result !== false) {
        // Reset form if successful
        setFormData({
          startDate: "",
          endDate: "",
          title: "",
          description: "",
          price: 0,
          cancelled: false,
        });
        setImageFile(null);
        setThumbnailFile(null);
        setImagePreview("");
        setThumbnailPreview("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{trip ? "Edytuj wycieczkę" : "Dodaj nową wycieczkę"}</h2>
          <button
            type="button"
            className={styles.previewToggle}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Pokaż formularz" : "Pokaż podgląd"}
          </button>
        </div>

        {!showPreview ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.formGroup}>
              <label htmlFor="title">Tytuł *</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                disabled={uploading}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="startDate">Data rozpoczęcia *</label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  required
                  disabled={uploading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="endDate">Data zakończenia *</label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  required
                  disabled={uploading}
                />
              </div>
            </div>
            {dateError && <div className={styles.error}>{dateError}</div>}
            {formData.startDate && formData.endDate && !dateError && (
              <div className={styles.durationInfo}>
                Łączny czas trwania:{" "}
                {(() => {
                  const start = new Date(formData.startDate);
                  const end = new Date(formData.endDate);
                  const days =
                    Math.ceil(
                      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
                    ) + 1;
                  return `${days} ${
                    days === 1 ? "dzień" : days < 5 ? "dni" : "dni"
                  }`;
                })()}
              </div>
            )}
            <div className={styles.formGroup}>
              <label htmlFor="price">Cena (PLN) *</label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                min="0"
                step="0.01"
                required
                disabled={uploading}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Opis</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                disabled={uploading}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="image">
                Zdjęcie główne *{" "}
                <span className={styles.labelHint}>
                  (Szczegóły/Plan wycieczki)
                </span>
              </label>
              {!imagePreview ? (
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                />
              ) : (
                <div className={styles.imagePreview}>
                  <img src={imagePreview} alt="Podgląd głównego zdjęcia" />
                  <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                      // Reset file input
                      const fileInput = document.getElementById(
                        "image"
                      ) as HTMLInputElement;
                      if (fileInput) fileInput.value = "";
                    }}
                    disabled={uploading}
                    aria-label="Usuń zdjęcie główne"
                  >
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
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                  <label htmlFor="image" className={styles.changeImageButton}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
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
                    Zmień zdjęcie
                  </label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploading}
                    style={{ display: "none" }}
                  />
                </div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="thumbnail">Miniaturka *</label>
              {!thumbnailPreview ? (
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  disabled={uploading}
                />
              ) : (
                <div className={styles.imagePreview}>
                  <img src={thumbnailPreview} alt="Podgląd miniaturki" />
                  <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={() => {
                      setThumbnailFile(null);
                      setThumbnailPreview("");
                      // Reset file input
                      const fileInput = document.getElementById(
                        "thumbnail"
                      ) as HTMLInputElement;
                      if (fileInput) fileInput.value = "";
                    }}
                    disabled={uploading}
                    aria-label="Usuń miniaturkę"
                  >
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
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                  <label
                    htmlFor="thumbnail"
                    className={styles.changeImageButton}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
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
                    Zmień miniaturkę
                  </label>
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    disabled={uploading}
                    style={{ display: "none" }}
                  />
                </div>
              )}
            </div>{" "}
            <div className={styles.formGroup}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={formData.cancelled}
                  onChange={(e) =>
                    setFormData({ ...formData, cancelled: e.target.checked })
                  }
                  disabled={uploading}
                />
                <span>Wycieczka odwołana</span>
              </label>
            </div>
            <div className={styles.actions}>
              <button
                type="button"
                onClick={onCancel}
                className={styles.cancelButton}
                disabled={uploading}
              >
                Anuluj
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={uploading || !!dateError}
              >
                {uploading
                  ? "Zapisywanie..."
                  : trip
                  ? "Zapisz zmiany"
                  : "Dodaj wycieczkę"}
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.preview}>
            <TripCard
              trip={{
                title: formData.title || "Tytuł wycieczki",
                description: formData.description,
                startDate: formData.startDate
                  ? new Date(formData.startDate)
                  : new Date(),
                endDate: formData.endDate
                  ? new Date(formData.endDate)
                  : new Date(),
                price: formData.price || 0,
                imageUrl: imagePreview,
                thumbnailUrl: thumbnailPreview,
                cancelled: formData.cancelled,
              }}
              onDetails={() => setShowImageModal(true)}
              previewMode={true}
            />
            <div className={styles.actions}>
              <button
                type="button"
                onClick={onCancel}
                className={styles.cancelButton}
              >
                Anuluj
              </button>
              <button
                type="button"
                className={styles.submitButton}
                onClick={async (e) => {
                  e.preventDefault();
                  await handleSubmit(e as React.FormEvent<HTMLButtonElement>);
                }}
                disabled={uploading || !!dateError}
              >
                {uploading
                  ? "Zapisywanie..."
                  : trip
                  ? "Zapisz zmiany"
                  : "Dodaj wycieczkę"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal with full-size image */}
      {showImageModal && imagePreview && (
        <div
          className={styles.imageModal}
          onClick={() => setShowImageModal(false)}
        >
          <img
            src={imagePreview}
            alt={formData.title || "Szczegóły"}
            className={styles.imageModalContent}
          />
        </div>
      )}
    </div>
  );
};
