const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//R.R: gere as well, why not use async await? also it's better practive to wrap this in an initialize function and call that function on your startup, this way you have more controll over the mongo connection
mongoose.connect(process.env.MONGODB_URI, 
        { useNewUrlParser: true, useUnifiedTopology: true } ,
        (err, client) => {
            if (err) {
                //R.R: not the best idea to print the MONGODB_URI it can contain sensative info like user password of your DB
                return console.log('Unable to connect to MongoDB server', process.env.MONGODB_URI);
            }
        console.log('Connected to MongoDB server');
});

module.exports = {mongoose};
