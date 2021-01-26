const request = require("supertest");

const { app } = require("../server/server");
const { User } = require("../server/models/user");
const { userOne, userOneId, setupDatabase, adminUser } = require('./fixtures/db')

//start with clean database
beforeEach(setupDatabase);

afterEach(() => {
  console.log("afterEach");
});

test("should signup new user", async () => {
  const response = await request(app)
    .post("/user/create")
    .send({
      email: "yosef.mango@gmail.com",
      firstName: "yosef",
      lastName: "mango",
      phoneNum: "0545633955",
      community: "tuval",
    })
    .expect(200);
  //Assert that the database was changed correctly
  const user = await User.findById(response.body.userId);
  expect(user).not.toBeNull();
});

test("should not signup existing user", async () => {
  await request(app)
    .post("/user/create")
    .send({
      email: userOne.email,
      firstName: "tal",
      lastName: "shnitzer",
      phoneNum: "0545633955",
      community: "tuval",
    })
    .expect(400);
});

test("should login existing user", async () => {
  const response = await request(app)
    .post("/user/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  //Assert that the token in response saved corretly in database
  const user = await User.findOne({ email: userOne.email });
  expect(response.headers["x-auth"]).toBe(user.tokens[1].token);
});

test("should not login bad password", async () => {
  await request(app)
    .post("/user/login")
    .send({
      email: userOne.email,
      password: "badPassword",
    })
    .expect(400);
});

test("should approve user", async () => {
  await request(app)
    .post(`/user/approve/${userOneId}`)
    .set("x-auth", `${adminUser.tokens[0].token}`)
    .expect(200);
});

test("should not succeed to approve user - not admin", async () => {
  await request(app)
    .post(`/user/approve/${userOneId}`)
    .set("x-auth", `${userOne.tokens[0].token}`)
    .expect(400);
});
