var env = process.env.NODE_ENV ||'development';

//when json file is required it is automatically parses it into a javascript object.
if (env === 'development' || env === 'test') {
    var config = require('./config.json');
    var envConfig = config[env];
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}