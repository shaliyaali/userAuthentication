const userSchema = require('../model/usermodel')
const bcrypt = require('bcrypt')

const loadLogin = async (req, res) => {
  res.render('admin/login', { message: null })
}

const loadDashboard = async (req, res) => {
  try {

    const admin = req.session.admin


    if (!admin) return res.redirect('admin/login')

    const users = await userSchema.find({ role: 'user' })

    res.render('admin/dashboard', { users })

  } catch (error) {
    res.send(error)

  }

}

const login = async (req, res) => {


  try {
    const { email, password } = req.body

    const admin = await userSchema.findOne({ email })

    if (admin.role != 'admin') return res.render('admin/login', { message: 'Invalid user!!!' })
    if (!admin) return res.render('admin/login', { message: 'Invalid credentials' })

    const ismatch = await bcrypt.compare(password, admin.password)
    if (!ismatch) return res.render('admin/login', { message: 'Incorrect Password!!!' })

    req.session.admin = true



    res.redirect('/admin/dashboard')



  }
  catch (error) {
    res.send(error)
  }

}

const logout=async(req,res)=>{
  req.session.admin=null
  res.render('admin/login',{message:null})
}

const editUser=async(req,res)=>{
  try{
    const {email,password,_id}=req.body

    const hashedPassword= await bcrypt.hash(password,10)
    const user=await userSchema.findOneAndUpdate({_id:_id},{$set:{email,password:hashedPassword}})
    res.redirect('/admin/dashboard')
    
  }catch(error){
    console.log(error)
  }
  
}

const deleteUser=async(req,res)=>{
  const {_id}=req.body
  const user=await userSchema.findOneAndDelete({_id:_id})
  res.redirect('/admin/dashboard')
}

const addUser=async (req,res)=>{
  try{
    const {email,password}=req.body
    const hashedPassword=await bcrypt.hash(password,10)
    const users=await userSchema.find({role:'user'})

    const sameEmail=await userSchema.findOne({email})
    if(sameEmail) return res.render('admin/dashboard',{message:'User Already Exist',users})
    //const user=await userSchema.insertOne({email,password:hashedPassword,role:'user'})
    
    const newUser= new userSchema({
      email,
      password:hashedPassword,
      role:'user'
    })
    await newUser.save()
    res.redirect('/admin/dashboard')

  }catch(error){
    console.log(error)
  }
 

}


module.exports = { loadLogin, login, loadDashboard,logout ,editUser,deleteUser,addUser}