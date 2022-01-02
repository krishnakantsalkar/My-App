export interface IuserLogin {
  userLogin: {
    email: string;
    password: string;
  };
  token?: boolean;
  id?: string;
  profileId: string;
  keepSignedIn?: boolean;
}
