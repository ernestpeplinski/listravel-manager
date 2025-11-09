import React, { useState } from "react";
import type { Trip, TripFormData } from "../types/trip";
import { uploadToCloudinary } from "../utils/cloudinary";
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
        <h2>{trip ? "Edytuj wycieczkę" : "Dodaj nową wycieczkę"}</h2>

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
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
                disabled={uploading}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price">Cena (PLN) *</label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
              min="0"
              step="0.01"
              required
              disabled={uploading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Opis *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              required
              disabled={uploading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Zdjęcie główne *</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
            />
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Podgląd głównego zdjęcia" />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="thumbnail">Miniaturka *</label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={handleThumbnailChange}
              disabled={uploading}
            />
            {thumbnailPreview && (
              <div className={styles.imagePreview}>
                <img src={thumbnailPreview} alt="Podgląd miniaturki" />
              </div>
            )}
          </div>

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
              disabled={uploading}
            >
              {uploading
                ? "Zapisywanie..."
                : trip
                ? "Zapisz zmiany"
                : "Dodaj wycieczkę"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
