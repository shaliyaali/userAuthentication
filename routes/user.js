const express=require('express')
const router=express.Router()
const userController=require('../controller/usercontroller')
const auth=require('../middleware/auth')


router.get('/login',auth.isLogin,userController.loadLogin)
router.post('/login',userController.login)
router.get('/signup',auth.isLogin,userController.loadRegister)
router.post('/signup',userController.registerUser)
router.get('/home',auth.checkSession,userController.loadHome)
router.post('/logout',auth.checkSession,userController.logout)
router.get('/logout',userController.getLogout)

module.exports=router