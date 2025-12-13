const express=require('express')
const router=express.Router()
const adminController=require('../controller/admincontroller')
const adminAuth=require('../middleware/adminAuth')


router.get('/login',adminAuth.isLogin, adminController.loadLogin)
router.post('/login',adminController.login)
router.get('/dashboard',adminAuth.checkSession ,adminController.loadDashboard)
router.get('/logout',adminAuth.checkSession,adminController.logout)
router.post('/editUser',adminAuth.checkSession,adminController.editUser)
router.post('/deleteUser',adminAuth.checkSession,adminController.deleteUser)
router.post('/addUser',adminAuth.checkSession,adminController.addUser)
module.exports=router