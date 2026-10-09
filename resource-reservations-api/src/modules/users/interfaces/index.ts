// Interfaz sin el passwordHash
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  role: {
    id: string;
    name: string;
  };
}
