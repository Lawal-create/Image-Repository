import { expect } from "chai";
import { getBasicUserDetails } from "../../../utils/helpers/auth";
import {
  basicUser,
  createTestUser,
  deleteTestUser,
  getUserResponse,
  initiateRequest
} from "./utils.test";

describe("POST /login", () => {
  beforeEach(async () => await createTestUser());
  afterEach(async () => await deleteTestUser());

  it("should not login a user with missing required fields", (done) => {
    initiateRequest()
      .post("/api/v1/auth/login")
      .send({ email: "testmail123@yaarnbox.com" })
      .end((err: Error, res: ChaiHttp.Response) => {
        res.should.have.status(422);
        res.body.should.be.a("object");
        res.body.should.have.property("error");

        expect(res.body.error).to.equal("Password is required");
        done();
      });
  });
  it("should not login a user with incorrect password", (done) => {
    initiateRequest()
      .post("/api/v1/auth/login")
      .send({ ...basicUser, password: "password" })
      .end((err: Error, res: ChaiHttp.Response) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");

        expect(res.body.error).to.equal("Password is not correct");
        done();
      });
  });
  it("should login a user with correct login details", (done) => {
    initiateRequest()
      .post("/api/v1/auth/login")
      .send(basicUser)
      .end((err: Error, res: ChaiHttp.Response) => {
        res.should.have.status(200);
        res.body.should.be.a("object");

        expect(res.body.data).to.have.property("jwt");
        expect(res.body.data).to.have.property("user");

        const user = getBasicUserDetails(res.body.data.user);
        expect(user).to.deep.equal(
          getUserResponse(user._id, user.createdAt, user.updatedAt)
        );
        done();
      });
  });
});
