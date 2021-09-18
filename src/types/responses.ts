import { IJWToken, IBasicUser } from "../utils/helpers/auth";

export interface AuthResponseData {
  user: IBasicUser;
  jwt: IJWToken;
}
