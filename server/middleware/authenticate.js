const {User} = require('./../models/user');
const {error} = require('./../service');

const authenticate = (userTypes) => {
    console.log('authenticate userTypes', userTypes);
    
    return (req,res,next) => {
        const token = req.header('x-auth');
        console.log('authenticate token', token);
        
        User.findByToken(token, userTypes).then((user) => { //R.R why are you not using async await and you are using Promises?  
            if (!user){
                console.log('authenticate - user not found');
                return Promise.reject('5');  //R.R: same comments here. don't reject with '5'
            }
            if (user.blocked) {
                console.log('authenticate - user blocked');
                return Promise.reject('3');
            }
    
            req.user = user;
            req.token = token;
            next();
        }).catch((e) => {
            console.log('authenticate catch e', e);
            
            res.status(200).send(error(e)); //R.R: same comments here. don't return 200 with an error
        });
    };
}

module.exports = {authenticate};
