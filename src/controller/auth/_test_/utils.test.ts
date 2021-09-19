import User from "../../../model/userModel";
import { generateHashedValue, IBasicUser } from "../../../utils/helpers/auth";
import server from "../../../server";
import chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);

export const initiateRequest = () => {
  return chai.request(server);
};

export const basicUser = {
  email: "testmail123@yaarnbox.com",
  password: "testpassword"
};

export const getUserResponse = (
  id: string,
  createdAt: Date,
  updatedAt: Date
): IBasicUser => {
  return {
    _id: id,
    firstName: "Test",
    lastName: "Account",
    email: "testmail123@yaarnbox.com",
    profileImageUrl: "https://ui-avatars.com/api?name=Test-Account",
    createdAt,
    updatedAt
  };
};

export const createTestUser = async (): Promise<void> => {
  const newAdmin = new User({
    email: "testmail123@yaarnbox.com",
    firstName: "Test",
    lastName: "Account",
    profileImageUrl: "https://ui-avatars.com/api?name=Test-Account",
    password: generateHashedValue("testpassword")
  });

  await newAdmin.save();
};

export const deleteTestUser = async (): Promise<void> => {
  await User.deleteMany({ email: "testmail123@yaarnbox.com" });
};

type Value = string | number | Date | boolean;

export const updateTestUser = async (
  field: string | string[],
  value: Value | Value[]
): Promise<void> => {
  if (typeof field === "string") {
    await User.updateOne(
      { email: "testmail123@yaarnbox.com" },
      { [field]: value }
    );
  } else {
    const fieldsToUpdate: Record<string, Value> = {};

    for (let i = 0; i < field.length; i++) {
      //create new property in fieldsToUpdate that
      //uses field at current index as the key and
      //uses value at current index as the value
      fieldsToUpdate[field[i]] = (value as Value[])[i];
    }

    await User.updateOne({ email: "testmail123@yaarnbox.com" }, fieldsToUpdate);
  }
};
