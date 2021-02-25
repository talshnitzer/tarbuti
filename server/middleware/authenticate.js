const {User} = require('./../models/user');
const {error} = require('./../service');

const authenticate = (userTypes) => {
    
    return (req,res,next) => {
        const token = req.header('x-auth');
        
        User.findByToken(token, userTypes).then((user) => {
            if (!user){
                console.log('authenticate - user not found');
                return Promise.reject('5');  
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
            
            res.status(400).send(error(e));
        });
    };
}

module.exports = {authenticate};