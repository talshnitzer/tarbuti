

//standart error output function
const error = (err) => {
    let errmsg = {}
    switch (err) {
        case '1':
            errmsg = {error: 'user not found'}
            break;
        case '2':
            errmsg = {error: 'password not correct'}
            break;
        case '3':
            errmsg = {error: 'user blocked'}
            break;
        case '4':
            errmsg = {error: 'token not ok'}
            break;
        case '5':
            errmsg = {error: 'user not found or not authorized'}
            break;
        case '6':
            errmsg = {error: 'no user found'}
            break;
        default:
            errmsg = {error: err}
            break;
    }
    return errmsg
}

module.exports = {error};
