import { IUser } from "../../model/userModel";
export function instanceOfUser(user: IUser | void): user is IUser {
  return true;
}

export function instanceOfStringArray(
  value: string[] | null | undefined
): value is string[] {
  return true;
}
