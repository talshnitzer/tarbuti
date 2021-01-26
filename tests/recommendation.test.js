const request = require("supertest");
const { app } = require("../server/server");
const { Recommendation } = require("../server/models/recommendation");
const {
  userOne,
  setupDatabase,
  recommendationOneId,
  adminRecommendationId,
} = require("./fixtures/db");

//start with clean database
beforeEach(setupDatabase);

test("should create a recommendation for user", async () => {
  const response = await request(app)
    .post("/recommendation/create")
    .set("x-auth", `${userOne.tokens[0].token}`)
    .send({
      serviceName: "טסט המלצה",
      providerName: "ספק טסט",
      providerPhone: "999999999",
      providerEmail: "999@999.com",
      description: "מספר טסט",
      tags1: ["טסט"],
      eventDate: "09/9999",
      servicePrice: "999",
      priceRemarks: "הערה 9",
    })
    .expect(200);
  const recommendation = await Recommendation.findById(response.body._id);
  expect(recommendation).not.toBeNull();
  expect(recommendation._creatorId).toEqual(userOne._id);
});

test("should get all recommendations", async () => {
  const response = await request(app).get("/recommendation/all").expect(200);
  expect(response.body.length).toEqual(3);
});

test("should get all recommendations", async () => {
  const response = await request(app).get("/recommendation/all").expect(200);
  expect(response.body.length).toEqual(3);
});

test("should update user recommendation", async () => {
  const response = await request(app)
    .post(`/recommendation/update/${recommendationOneId}`)
    .set("x-auth", `${userOne.tokens[0].token}`)
    .send({ tags1: "עריכה" })
    .expect(200);
  const recommendation = await Recommendation.findById(response.body._id);
  expect(recommendation.tags1[0]).toEqual("עריכה");
  expect(response.body._creatorId.firstName).toEqual(userOne.firstName);
});

test("should not update admin recommendation", async () => {
  const response = await request(app)
    .post(`/recommendation/update/${adminRecommendationId}`)
    .set("x-auth", `${userOne.tokens[0].token}`)
    .send({ tags1: "עריכה" })
    .expect(400);
});
