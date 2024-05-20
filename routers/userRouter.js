

const express=require("express")
const router=express.Router()
const userController=require("../controllers/userController")
const middleware=require("../middleware/middleware")
const  admin=require("../controllers/adminControll")



  
  

//signupRoute
router.get("/signup",userController.getSignupPage)
.post("/signup",userController.postSignup)

//loginRoute
router.get("/login" ,userController.getLoginPage)
.post("/login",userController.postLogin)


router.get("/",userController.getHomepage)



router.get("/userHome",middleware.isAuthenticated,userController.getuserHome)
router.get("/showDetails",middleware.isAuthenticated,userController.showDetails)
.post("/showDetails",userController.postshowDetails)
router.get("/userDetails",middleware.isAuthenticated,middleware.isAdmin,userController.getUserDetails)




router.get("/logout",userController.logout)
router.post("/updatedetails",userController.updateUserDetails)
module.exports=router