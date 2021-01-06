//code review branch
require("./config/config.js");

const { mongoose } = require("./db/mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const _ = require("lodash");

const { authenticate } = require("./middleware/authenticate");
const { User } = require("./models/user");
const { Tag } = require("./models/tag");
const { Recommendation } = require("./models/recommendation");
const { error, createValidationCode, sendEmail } = require("./service");

const app = express();
const corsOptions = {
  origin: "*",
  exposedHeaders: ["Content-Range", "x-auth", "Content-Type"],
};
const port = process.env.PORT;
app.use(cors(corsOptions));
app.use(bodyParser.json()); //convert the request body from json to an object

//SIGN-UP FLOW:
//user post sign up request - server register the user doc as "pending"
app.post("/user/create", async (req, res) => {
  try {
    const body = _.pick(req.body, [
      "email",
      "firstName",
      "lastName",
      "phoneNum",
      "community",
    ]);
    let user = new User(body);
    (user._id = new mongoose.Types.ObjectId()), (user.status = "pending");
    user.userType = "user";
    await user.save();
    let userId = {};
    userId = user._id;
    res.send({ userId });
  } catch (e) {
    console.log("app.post(/user/create e", e);
    res.status(200).send(error(e.message));
  }
});

//Admin post user approval, server generates password for the user
//and send it by email (sms in the future) - this validates the user email (or phone num in future)
//user doc updates from "pending" to "approved"
app.post("/user/approve/:id", authenticate(["admin"]), async (req, res) => {
  try {
    const id = req.params.id;
    console.log("/user/approve/:id--- id", id);
    let user = await User.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    console.log("/user/approve/:id--- user", user);
    //await func to send email with code
    const validationCode = createValidationCode();
    user.password = validationCode;
    await user.save();
    console.log(
      "/user/approve/:id--- user.email, user.name",
      user.email,
      user.name
    );
    await sendEmail(user.email, validationCode, user.firstName);
    res.send({ status: "OK", validationCode });
  } catch (e) {
    res.status(200).send({ error: e.message });
    console.log("e", e);
  }
});

//Login - after the user is approved  - login with email (phone num) and password
//server validates the user credetials and status
app.post("/user/login", async (req, res) => {
  try {
    const body = _.pick(req.body, ["email", "password"]);
    const user = await User.findByCredentials(body.email, body.password);
    console.log("/user/login user", user);

    const token = await user.generateAuthToken();
    console.log("/user/login token", token);

    let userDetails = {
      _id: user._id,
      userType: user.userType,
      userName: user.userName,
    };
    res.header("x-auth", token).send({ userDetails });
  } catch (e) {
    res.status(200).send(error(e));
  }
});

//GET all users
app.get("/user/all", authenticate(["admin"]), async (req, res) => {
  try {
    const allUsers = await User.find(
      {},
      "firstName lastName email phoneNum community status"
    ).exec();
    res.send(allUsers);
  } catch (e) {
    res.status(200).send(e.message);
  }
});

//--------------------------------------------------------------------------------------//

//Create a recommendation
app.post(
  "/recommendation/create",
  authenticate(["user", "admin"]),
  async (req, res) => {
    try {
      const body = req.body;
      const recommendation = new Recommendation(body);
      recommendation._creatorId = req.user._id;
      await recommendation.save();
      const recommendationPop = await recommendation.populate({
        path: "_creatorId",
        select: "firstName lastName community",
      }).execPopulate();
      console.log(
        "/recommendation/create recommendation recommendationPop",
        recommendation,
        recommendationPop
      );
      res.send(recommendationPop);
    } catch (e) {
      console.log(
        "post /recommendation/create error. recommendation not saved. e: ",
        e
      );
      res.status(200).send(error(e.message));
    }
  }
);

//Update  a recommendation
app.post(
  "/recommendation/update/:id",
  authenticate(["user", "admin"]),
  async (req, res) => {
    try {
      const id = req.params.id;
      const body = _.pick(req.body, [
        "serviceName",
        "providerName",
        "providerPhone",
        "providerEmail",
        "description",
        "tags1",
        "tags2",
        "tags3",
        "tags4",
        "eventDate",
        "servicePrice",
        "priceRemarks",
      ]);
      let recommendation = await Recommendation.findOneAndUpdate(
        { _id: id, _creatorId: req.user._id },
        body,
        {
          new: true,
        }
      );
      console.log(
        "***/recommendation/update/:id recommendation: ",
        recommendation
      );

      if (!recommendation) {
        throw new Error("1");
      }
      res.send(recommendation);
    } catch (e) {
      console.log("***/recommendation/update/:id error e:", e);
      res.status(200).send(error(e.message));
    }
  }
);

//Delete recommendation
app.post(
  "/recommendation/delete/:id",
  authenticate(["user", "admin"]),
  async (req, res) => {
    try {
      const id = req.params.id;
      let recommendation = await Recommendation.findOne({
        _id: id,
        _creatorId: req.user._id,
      });
      if (!recommendation) {
        throw new Error("1");
      }

      await recommendation.remove();
      console.log("***/recommendation/delete/:id removed");

      let ok = "ok";
      res.send({ ok });
    } catch (e) {
      res.status(200).send(error(e.message));
    }
  }
);

//GET all recommendations
app.get("/recommendation/all", async (req, res) => {
  try {
    const allRecommendations = await Recommendation.find().populate({
      path: "_creatorId",
      select: "firstName lastName community",
    });
    res.send(allRecommendations);
  } catch (e) {
    res.status(200).send(e.message);
  }
});

//GET a specific recommendation
app.get(
  "/recommendation/:id",
  authenticate(["user", "admin"]),
  async (req, res) => {
    try {
      const id = req.params.id;
      const recommendation = await Recommendation.findOne({
        _id: id,
        _creatorId: req.user._id,
      });
      res.send(recommendation);
    } catch (e) {
      res.status(200).send(e.message);
    }
  }
);

//Create a tag
app.post("/tag/create", authenticate(["admin"]), async (req, res) => {
  try {
    const body = req.body;
    const tag = new Tag(body);
    await tag.save();
    res.send(tag);
  } catch (e) {
    console.log("post /tag/create error. tag not saved. e: ", e);
    res.status(200).send(error(e.message));
  }
});

//Update  a tag
app.post("/tag/update/:id", authenticate(["admin"]), async (req, res) => {
  try {
    const id = req.params.id;
    const body = _.pick(req.body, ["tagName", "tagContent"]);
    let tag = await Tag.findByIdAndUpdate(id, body, { new: true });
    console.log("***/tag/update/:id tag: ");

    if (!tag) {
      throw new Error("1");
    }
    res.send({ tag });
  } catch (e) {
    console.log("***/tag/update/:id error e:", e);
    res.status(200).send(error(e.message));
  }
});

//Delete tag
app.post("/tag/delete/:id", authenticate(["admin"]), async (req, res) => {
  try {
    const id = req.params.id;
    let tag = await Tag.findOne({ _id: id });
    if (!tag) {
      throw new Error("1");
    }

    await tag.remove();
    console.log("***/tag/delete/:id removed");

    let ok = "ok";
    res.send({ ok });
  } catch (e) {
    res.status(200).send(error(e.message));
  }
});

//GET all tags
app.get("/tag/all", async (req, res) => {
  try {
    const allTags = await Tag.find({});
    res.send(allTags);
  } catch (e) {
    res.status(200).send(e.message);
  }
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = { app };
