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
      `אנא הכנס אותה בשדה ״סיסמא״ במסך ההתחברות<br><br>` +
      `תודה<br><br>תרבותי - משגב`
  };

  await transporter.sendMail(mailOptions);
  } catch (e) {
    throw new Error(e.message);
  }
    
}

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
