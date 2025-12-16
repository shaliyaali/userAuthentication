const userSchema = require('../model/usermodel')
const bcrypt = require('bcrypt')
const saltround = 10


const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const role = 'user'
    const user = await userSchema.findOne({ email })

    if (user) {
      req.session.message = 'User Already Exist'
      return res.redirect('/user/signup')
    }

    const hashedpassword = await bcrypt.hash(password, saltround)

    const newUser = new userSchema({
      email,
      password: hashedpassword,
      role
    })

    await newUser.save()
    req.session.message = 'Registered Sucessfully'
    res.redirect('/user/login')
  }
  catch (error) {
    req.session.message = 'Something went wrong'
    res.redirect('/user/login')
  }
}



const login = async (req, res) => {
  try {
    const { email, password, role } = req.body


    const user = await userSchema.findOne({ email })
    if (!user) {
      req.session.message = 'User does not exist!!!'
      return res.redirect('/user/login')
    }

    if (user.role != 'user') {
      req.session.message = 'Invalid user!!!'
      return res.redirect('/user/login')
    }

    const ismatch = await bcrypt.compare(password, user.password)
    if (!ismatch) {
      req.session.message = 'Incorrect Password!!!'
      return res.redirect('/user/login')
    }

    req.session.user = user._id
    res.redirect('/user/home')

  }
  catch (error) {
    req.session.message = 'Something went wrong'
    res.redirect('/user/login')
  }

}



const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/user/home')
    }
    res.clearCookie('connect.sid')
    res.redirect('/user/login')
  })
}

const getLogout = (req, res) => {
  const message = req.session.message
  delete req.session.message
  res.render('user/home')
}


const loadLogin = (req, res) => {
  const message = req.session.message
  delete req.session.message
  res.render('user/login', { message })
}

const loadRegister = (req, res) => {
  const message = req.session.message
  delete req.session.message
  res.render('user/signup', { message })
}

const loadHome = (req, res) => {

  delete req.session.message
  res.render('user/home')
}
module.exports = {
  registerUser,
  loadLogin,
  loadRegister,
  login,
  loadHome,
  logout,
  getLogout

}