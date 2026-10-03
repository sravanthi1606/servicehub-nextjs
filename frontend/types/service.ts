export type ServiceStatus = "ACTIVE" | "INACTIVE";

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  /** Duration in minutes */
  duration: number;
  image?: string;
  providerId: string;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
}

/** Service card data with the provider details already joined in. */
export interface ServiceListItem extends Service {
  providerName: string;
  rating: number;
}
