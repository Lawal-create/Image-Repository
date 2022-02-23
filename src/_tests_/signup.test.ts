import { expect, should } from "chai";
import { IBasicUser } from "../utils/helpers/auth";
import {
  basicUser,
  deleteTestUser,
  getUserResponse,
  initiateRequest
} from "./utils.test";

should();

describe("POST /signup", () => {
  afterEach(deleteTestUser);

  it("should not signup a user with missing required fields", (done) => {
    initiateRequest()
      .post("/api/v1/auth/signup")
      .send(basicUser)
      .end((err: Error, res: ChaiHttp.Response) => {
        res.should.have.status(422);
        res.body.should.be.a("object");
        res.body.should.have.property("error");

        expect(res.body.status).to.equal("error");
        done();
      });
  });

  it("should signup a user if payload is valid", (done) => {
    const user = {
      ...basicUser,
      firstName: "Test",
      lastName: "Account",
      passwordConfirm: "testpassword"
    };

    initiateRequest()
      .post("/api/v1/auth/signup")
      .send(user)
      .end((err: Error, res: ChaiHttp.Response) => {
        res.should.have.status(200);
        res.body.should.be.a("object");

        expect(res.body.data).to.have.property("email");

        const user: IBasicUser = res.body.data;
        expect(user).to.deep.equal(
          getUserResponse(user._id, user.createdAt, user.updatedAt)
        );
        done();
      });
  });
});
