const sendMail = require('./SendMail');

(async () => {
  try {
    const res = await sendMail('gotijay59@example.com', 'Test mail', '<p>hello</p>');
    console.log('Mail sent:', res.accepted || 'ok');
  } catch (err) {
    console.error('Mail error:', err);
  }
})();