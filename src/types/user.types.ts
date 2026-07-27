export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface UpdateProfileRequest {
  loginId: string;
  password: string;
  passwordConfirm: string;
}

export interface UpdateProfileData {
  userId: number;
  email: string;
  loginId: string;
  name: string;
  profileImageUrl: string;
}
