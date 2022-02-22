import User, { IUser } from "../model/userModel";
import Image, { IImage } from "../model/imageModel";
import AuthService from "../services/AuthService";
import Repository from "../repository/repository";
import ImageService from "../services/ImageService";

const userRepository: Repository<IUser> = new Repository<IUser>(User);
const imageRepository: Repository<IImage> = new Repository<IImage>(Image);
const authService = new AuthService(userRepository);
const imageService = new ImageService(imageRepository, userRepository);

export { authService, imageService };
