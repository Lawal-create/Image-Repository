import { JwtPayload } from "jsonwebtoken";
export interface TimeStamps {
  createdAt: Date;
  updatedAt: Date;
}
export interface JWTData extends JwtPayload {
  id: string;
}

export const permission = ["public", "private"];
