export interface CreateUser {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  country?: string;
}
