const express=require("express")
const router=express.Router()

const middleware=require("../middleware/middleware")
const admin=require("../controllers/adminControll")

router.get("/",middleware.isAdmin,admin.getAdminPage)
router.get("/details/:id",admin.showUsersDetails)


module.exports=router