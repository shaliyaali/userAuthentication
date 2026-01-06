
const User = require('../model/usermodel')

const checkSession = async (req, res, next) => {
  try {
    // 1. Check session exists
    if (!req.session.user) {
      return res.redirect('/user/login');
    }

    // 2. Check user still exists in DB
    const user = await User.findById(req.session.user);
    console.log(user)
    if (!user) {
      // User deleted by admin
      req.session.destroy(err => {
        if (err) console.error(err);
        return res.redirect('/user/login');
      });
    } else {
      // 3. User valid → allow access
      req.user = user; // optional, useful later
      next();
    }

  } catch (error) {
    console.error(error);
    res.redirect('/user/login');
  }
};


const isLogin = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/user/home')
  }
  next()

}

module.exports = { checkSession, isLogin }