const randomstring = require("randomstring");
const nodemailer = require("nodemailer");

const createValidationCode = () => randomstring.generate({
    length: 4,
    charset: 'numeric'
  });

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD // generated ethereal password
    }
  });


// R.R: the html here is almost too long. if it would have been a bit bigger I would say for sure to take it out to an html template file. your call in this case... 
const  sendEmail = async (email, validationCode, userName ) => {
  try{
    let mailOptions = {
      from: '"תרבותי - משגב" <' + process.env.EMAIL_USER + '>', 
      to: email, 
      subject: 'בקשתך להצטרף לאפליקציית תרבותי אושרה', 
      text: 'אישור אימייל', 
      html: 
      `שלום ${userName} <br><br> תודה על הצטרפותך לאפליקציית תרבותי.<br><br>`+
      `הססמא שלך היא<b>${validationCode}</b><br><br>`  +
      `נא להכניס אותה בשדה ״סיסמא״ במסך ההתחברות<br><br>` +
      `תודה<br><br>תרבותי - משגב`
  };

  await transporter.sendMail(mailOptions);
  } catch (e) { // R.R: why do you need the catch if you just throw the error?
    throw new Error(e.message);
  }
    
}

// R.R: this is a bit old fanation in my opinion. when you throw the error '1' it's not informative to who ever is looking at the code. 
// and you don't have any reall functinally here so I don't really understant the point of this function
//standart error output function
const error = (err) => {
    let errmsg = {}
    switch (err) {
        case '1':
            errmsg = {error: 'document not found'}
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

module.exports = {error, createValidationCode, sendEmail};
