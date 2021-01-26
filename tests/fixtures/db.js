const mongoose  = require('mongoose')
const jwt = require('jsonwebtoken')
const {User} = require('../../server/models/user')
const {Recommendation} = require('../../server/models/recommendation')

const userOneId = new mongoose.Types.ObjectId()
const adminId = new mongoose.Types.ObjectId()
const recommendationOneId = new mongoose.Types.ObjectId()
const recommendationTwoId = new mongoose.Types.ObjectId()
const adminRecommendationId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    email: "shimon.shnitzer@gmail.com",
    firstName: "shimon",
    lastName: "shnitzer",
    phoneNum: "0545633955",
    community: "tuval",
    password: 'password',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const adminUser = {
    _id: adminId,
    email: "tal.shnitzer@gmail.com",
    firstName: "tal",
    lastName: "shnitzer",
    phoneNum: "0545633955",
    community: "tuval",
    userType: 'admin',
    password: 'password',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: adminId }, process.env.JWT_SECRET)
    }]
}

const recommendationOne = {
    _id: recommendationOneId,
    serviceName: "המלצה אחד",
    providerName: "ספק אחד",
    providerPhone: "111111111",
    providerEmail: "111@111.com",
    description: "מספק אחד ",
    tags1: ["אחד"],
    tags2: ["אחד, אחד"],
    tags3: ["אחד, אחד, אחד"],
    tags4: ["אחד, אחד, אחד, אחד"],
    eventDate: "01/1111",
    servicePrice: "111",
    priceRemarks: "הערה אחד",
    _creatorId: userOneId
}

const recommendationTwo = {
    _id: recommendationTwoId,
    serviceName: "המלצה שנים",
    providerName: "ספק שנים",
    providerPhone: "22222222",
    providerEmail: "222@222.com",
    description: "מספק שנים ",
    tags1: ["שנים"],
    tags2: ["שנים, שנים"],
    tags3: ["שנים, שנים, שנים"],
    tags4: ["שנים, שנים, שנים, שנים"],
    eventDate: "02/2222",
    servicePrice: "222",
    priceRemarks: "הערה שנים",
    _creatorId: userOneId
}

const adminRecommendation = {
    _id: adminRecommendationId,
    serviceName: "המלצה שלוש",
    providerName: "ספק שלוש",
    providerPhone: "33333333",
    providerEmail: "333@333.com",
    description: "מספק שלוש ",
    tags1: ["שלוש"],
    tags2: ["שלוש, שלוש"],
    tags3: ["שלוש, שלוש, שלוש"],
    tags4: ["שלוש, שלוש, שלוש, שלוש"],
    eventDate: "03/3333",
    servicePrice: "333",
    priceRemarks: "הערה שלוש",
    _creatorId: adminId
}

const setupDatabase = async () => {
    await User.deleteMany();
    await Recommendation.deleteMany();
    await new User(userOne).save();
    await new User(adminUser).save();
    await new Recommendation(recommendationOne).save()
    await new Recommendation(recommendationTwo).save()
    await new Recommendation(adminRecommendation).save()
}

module.exports = {
    userOne,
    userOneId,
    adminId,
    adminUser,
    setupDatabase, 
    recommendationOneId,
    adminRecommendationId
}