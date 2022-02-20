import User, { IUser } from "../model/userModel";
import AuthService from "../services/AuthService";
import Repository from "../repository/repository";

const userRepository: Repository<IUser> = new Repository<IUser>(User);
const authService = new AuthService(userRepository);

export { authService };
