const userSchema = require('../model/usermodel')
const bcrypt = require('bcrypt')

const loadLogin = async (req, res) => {
   const message = req.session.message
    delete req.session.message 
  res.render('admin/login', { message })
}

const loadDashboard = async (req, res) => {
  try {

    const admin = req.session.admin


    if (!admin) return res.redirect('/admin/login')

    const users = await userSchema.find({ role: 'user' })

    const message = req.session.message
    delete req.session.message 
    res.render('admin/dashboard', { users,message })

  } catch (error) {
    res.send(error)

  }

}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const admin = await userSchema.findOne({ email })

    if (!admin) {
      req.session.message = 'Invalid credentials'
      return res.redirect('/admin/login')
    }

    if (admin.role !== 'admin') {
      req.session.message = 'Invalid user'
      return res.redirect('/admin/login')
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      req.session.message = 'Incorrect password'
      return res.redirect('/admin/login')
    }

    
    req.session.admin = admin._id

    req.session.message = 'Login successful'
    res.redirect('/admin/dashboard')

  } catch (error) {
    console.error(error)
    req.session.message = 'Something went wrong'
    res.redirect('/admin/login')
  }
}


const logout = async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/admin/dashboard')
    }
    res.clearCookie('connect.sid')
    res.redirect('/admin/login')
  })
}


const editUser=async(req,res)=>{
  try{
    const {email,password,_id}=req.body

    const hashedPassword= await bcrypt.hash(password,10)
    const user=await userSchema.findOneAndUpdate({_id:_id},{$set:{email,password:hashedPassword}})

    req.session.message='Edited sucessfully'
    res.redirect('/admin/dashboard')
    
  }catch(error){
    console.log(error)
  }
  
}

const deleteUser=async(req,res)=>{
  const {_id}=req.body
  const user=await userSchema.findOneAndDelete({_id:_id})
  req.session.message='Deleted'
  res.redirect('/admin/dashboard')
}

const addUser=async (req,res)=>{
  try{
    const {email,password}=req.body
    const hashedPassword=await bcrypt.hash(password,10)
    const users=await userSchema.find({role:'user'})

    const sameEmail=await userSchema.findOne({email})
    if(sameEmail){
      req.session.message='User already exist'
      return res.redirect('/admin/dashboard')
    } 
    
    
    const newUser= new userSchema({
      email,
      password:hashedPassword,
      role:'user'
    })
    await newUser.save()
     req.session.message='User added'
    res.redirect('/admin/dashboard')

  }catch(error){
    console.log(error)
  }
 

}
const getLogout=(req,res)=>{
  
  res.redirect('/admin/dashboard')
}

module.exports = { loadLogin, login, loadDashboard,logout ,editUser,deleteUser,addUser,getLogout}