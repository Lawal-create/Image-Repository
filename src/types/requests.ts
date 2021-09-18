export interface LoginUserRequestData {
  email: string;
  password: string;
}

export interface SignupUserRequestData extends LoginUserRequestData {
  profileImageUrl?: string;
  firstName: string;
  lastName: string;
}
