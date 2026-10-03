// The spec does not define the provider document yet; these fields are provisional.
export interface Provider {
  id: string;
  userId: string;
  name: string;
  specialization: string;
  rating: number;
  completedJobs: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TopProvider extends Pick<Provider, "id" | "name" | "specialization" | "rating" | "completedJobs"> {
  earnings: number;
}
