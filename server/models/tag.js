const mongoose = require('mongoose');

//here the admin can define the tags that users will set to recommendations, and the content of each tag
//i.e tagName: "holidays", tagContent: ["christmas","new year","independence day"....]
//in this example users can set to each new recommendation the relevant holiday

const TagSchema = new mongoose.Schema({
    tagName: {
        type: String,
        trim: true,
        maxlength:10,
        unique: true
    },
    tagContent: {
        type: [String],
        trim: true,
        maxlength: 10
    }
});

const Tag = mongoose.model('Tag', TagSchema);
module.exports = {Tag,TagSchema};
