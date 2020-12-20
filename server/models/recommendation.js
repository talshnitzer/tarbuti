const mongoose = require('mongoose');

var RecommendationSchema = new mongoose.Schema({
    _creatorId: {
        type: String,
        require: true
    },
    serviceName: {
        type: String,
        require: true,
        trim: true,
        minlength: 1
    },
    providerName: {
        type: String,
        require: true,
        trim: true
    },
    providerPhone: {
        type: String,
        require: true,
        trim: true
    },
    providerEmail: {
        type: String,
        require: true,
        trim: true
    },
    description:{
        require: true,
        type: String
    },
    tags1: {
        type: [String],
        trim: true
    },
    tags2: {
        type: [String],
        trim: true
    },
    tags3: {
        type: [String],
        trim: true
    },
    tags4: {
        type: [String],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    eventDate: {
        type: String
    },
    servicePrice: {
        type: String,
        trim: true
    },
    priceRemarks: {
        type: String,
        trim: true
    }
});


const Recommendation = mongoose.model('Recommendation', RecommendationSchema);
module.exports = {Recommendation,RecommendationSchema};