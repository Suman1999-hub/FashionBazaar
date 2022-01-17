const nodemailer = require('nodemailer');
const ejs = require('ejs');

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'verify.fashionbazar@gmail.com',
    pass: 'Fashion123Bazar',
  },
});

module.exports.sendConfirmationEmail = (
  name,
  email,
  userId,
  confirmationToken
) => {
  ejs.renderFile(
    __dirname + '/emailTemplate.ejs',
    { name, userId, confirmationToken },
    function (err, data) {
      console.log('err at nodemailer');
      if (err) {
      } else {
        console.log('err at nodemailer 2');
        var mainOptions = {
          from: 'freecourseyard@gmail.com',
          to: email,
          subject: 'Please confirm your account',
          html: data,
        };
        transport.sendMail(mainOptions).catch((err) => {
          console.log(err);
        });
      }
    }
  );
};
