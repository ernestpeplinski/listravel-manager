export interface Trip {
  id?: string;
  startDate: Date;
  endDate: Date;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  thumbnailUrl?: string;
  cancelled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TripFormData {
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  price: number;
  cancelled: boolean;
}
