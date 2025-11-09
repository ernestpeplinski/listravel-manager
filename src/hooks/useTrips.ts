import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Trip } from "../types/trip";

export const useTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all trips
  const fetchTrips = async () => {
    try {
      setLoading(true);
      const tripsQuery = query(
        collection(db, "trips"),
        orderBy("startDate", "desc")
      );
      const querySnapshot = await getDocs(tripsQuery);

      const tripsData: Trip[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate.toDate(),
          endDate: data.endDate.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Trip;
      });

      setTrips(tripsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError("Nie udało się pobrać wycieczek");
    } finally {
      setLoading(false);
    }
  };

  // Add new trip
  const addTrip = async (trip: Omit<Trip, "id">): Promise<string | null> => {
    try {
      const tripData = {
        ...trip,
        startDate: Timestamp.fromDate(trip.startDate),
        endDate: Timestamp.fromDate(trip.endDate),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, "trips"), tripData);
      await fetchTrips(); // Refresh list
      return docRef.id;
    } catch (err) {
      console.error("Error adding trip:", err);
      setError("Nie udało się dodać wycieczki");
      return null;
    }
  };

  // Update existing trip
  const updateTrip = async (
    tripId: string,
    updates: Partial<Omit<Trip, "id">>
  ): Promise<boolean> => {
    try {
      const tripRef = doc(db, "trips", tripId);
      const updateData: Record<string, unknown> = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      if (updates.startDate) {
        updateData.startDate = Timestamp.fromDate(updates.startDate);
      }
      if (updates.endDate) {
        updateData.endDate = Timestamp.fromDate(updates.endDate);
      }

      await updateDoc(tripRef, updateData);
      await fetchTrips(); // Refresh list
      return true;
    } catch (err) {
      console.error("Error updating trip:", err);
      setError("Nie udało się zaktualizować wycieczki");
      return false;
    }
  };

  // Delete trip
  const deleteTrip = async (tripId: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, "trips", tripId));
      await fetchTrips(); // Refresh list
      return true;
    } catch (err) {
      console.error("Error deleting trip:", err);
      setError("Nie udało się usunąć wycieczki");
      return false;
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return {
    trips,
    loading,
    error,
    addTrip,
    updateTrip,
    deleteTrip,
    refreshTrips: fetchTrips,
  };
};
