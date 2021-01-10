const {mongoose} = require('../db/mongoose.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({//store the schema of the user. we can add method to 'schema' but not to 'model'
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    userType: {
        type: String,
        required: true,
        trim: true,
        enum: ['user','admin']
    },
    password: {
        type: String,
        trim: true,
        default: ""
    },
    tokens: [{
        access: { //define the type of the token
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    phoneNum: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true
    },
    community: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        trim: true,
        enum: ['approved','pending']
    }

});

//R.R having the methods here make thos file too long 

//INSTANCE methods

//generate token in each login access
UserSchema.methods.generateAuthToken = function () {
    var user = this; //'this' stores the individual doc
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString(); //arguments: 1. object - data we want to sigh 2. secret value

    user.tokens = user.tokens.concat([{ access, token}]);

    return user.save().then(() => {
        console.log('####UserSchema.methods.generateAuthToken return');
        return token;
    });
};

//MODEL methods
//find the user by username and password in login access
UserSchema.statics.findByCredentials = function (userName, password) {
    var User = this;

    return User.findOne({email: userName}).then((user) => {
        if(!user) {
            console.log('findByCredentials user not found 1');
            
            return Promise.reject('1');
        }

        return new Promise((resolve, reject) => {
            //use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password, (err, res) => { //res = false in this case
                if (res) {
                    resolve(user);
                } else {
                    console.log('findByCredentials user auth not passed');
                    
                    reject('2');
                }
            });
        });
    });
};

//encoding the user password before creating the new user doc
UserSchema.pre(['save'], function (next) {
    let user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) =>{
            bcrypt.hash(user.password, salt, (err, hash) =>{
                 user.password = hash;
                 return next();
            });
        });
    }  else {
        return next();
    }
});


UserSchema.post('save', function(error, doc, next) {
    if(error.name === 'MongoError' && error.code === 11000) {
        console.log('UserSchema.posts save--- error', error);
        next(new Error('This user email already exist'));
    }
    else next(error)
})

//authenticate the user by verifing the user token and role(user/admin)
UserSchema.statics.findByToken = function (token, userTypes)  {
    const User = this; 
    let decoded;
    console.log('UserSchema.statics.findByToken userTypes', userTypes);
    
    try{  
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        console.log('UserSchema.statics.findByToken catch e', e);
        
        return Promise.reject('4');     
    }

    return User.findOne({
        '_id': decoded._id,
        'userType': {$in: userTypes},
        'tokens.token': token,  
        'tokens.access': 'auth'
    }); 

};


var User = mongoose.model('User', UserSchema);

module.exports = {User};
