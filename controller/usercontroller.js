const userSchema=require('../model/usermodel')
const bcrypt=require('bcrypt')
const saltround=10


const registerUser=async(req ,res)=>{
  try{
    const {email,password}=req.body
    const role='user'
    const user=await userSchema.findOne({email})

    if(user) return res.render('user/signup',{message:'User Already Exist'})

    const hashedpassword=await bcrypt.hash(password,saltround)

    const newUser=new userSchema({
      email,
      password:hashedpassword,
      role
    })

    await newUser.save()
   // res.render('user/login',{message:'Registered Sucessfully'})
   res.redirect('/user/login')
  }
  catch(error){
    res.render('user/signup',{message:'Something went wrong!!!'})
  }
  
}

const login=async(req,res)=>{
  try{
    const {email,password,role}=req.body
    

    const user=await userSchema.findOne({email})
     if(!user) return res.render('user/login',{message:'User does not exist!!!'})

    if(user.role !='user') return res.render('user/login',{message:'Invalid user!!!'})
    
 
  const ismatch=await bcrypt.compare(password,user.password)
  if(!ismatch) return res.render('user/login',{message:'Incorrect Password!!!'})
  
  req.session.user=true
  res.render('user/home',{user:email})

  }
  catch(error){
    res.render('user/login',{message:'Something went wrong!!!'})
  }
  
}

const logout=(req,res)=>{
  req.session.user=null
  res.render('user/login',{message:null})
}



const loadLogin=(req,res)=>{
  res.render('user/login',{message:null})
}

const loadRegister=(req,res)=>{
  res.render('user/signup',{message:null})
}

const loadHome=async (req,res)=>{

  const {email,password,role}=req.body
  //const user=await userSchema.findOne({email})
  res.redirect('/user/home')
 // res.render('user/home',{user:"email"})
}
module.exports={
  registerUser,
  loadLogin,
  loadRegister,
  login,
  loadHome,
  logout

}