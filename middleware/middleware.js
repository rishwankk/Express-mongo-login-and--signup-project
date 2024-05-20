module.exports={ 
  isAdmin:(req,res,next)=>{
    if(req.session.userRole=="admin"){
      next()
     
    }else {
      res.redirect("/login")
     
    }
  },
  
  isAuthenticated: (req, res, next) => {
    if (req.session.isLoggedIn) {
      if(req.session.userRole=="admin"){
        return res.redirect("/admin")
      }
      next();
      
    }else{
      res.redirect("/login")
    }
   
  },
  welcome:(req,res,next)=>{
    if(!req.session.isLoggedIn){
      return res.redirect("/login")
    }
    next()
  
}



  }
