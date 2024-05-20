const express = require("express");
const fs = require("fs");
const { user, details } = require("../mongo");
const mongoose = require("mongoose");
const userController = {
  getSignupPage: (req, res) => {
    const error = req.session.errors;
    req.session.errors = "";
    console.log(typeof error);
    console.log(`Reached server with some error: ${error}`);
    res.render("signup", { title: "signup", error });
  },

  postSignup: async (req, res) => {
    const { userName, userEmail, userPassword, ConfirmPass } = req.body;

    console.log(req.body);

    // Validate password
    const isValidPassword = (password) => {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/;
      return passwordRegex.test(password);
    };

    req.session.errors = {};

    if (userName.length < 3) {
      console.log("name error ");
      req.session.errors.nameError = "Name must be at least 3 characters long";
    }

    if (!userPassword) {
      console.log("pass error ");
      req.session.errors.passError = "Password must be provided";
      console.log("pass ok");
    } else if (!isValidPassword(userPassword)) {
      console.log("pass error ");
      req.session.errors.passRegex =
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long.";
    }

    if (userPassword !== ConfirmPass) {
      req.session.errors.cpassError = "Passwords do not match";
      console.log("cpass error");
    }

    console.log(Object.keys(req.session.errors).length);

    if (Object.keys(req.session.errors).length > 0) {
      return res.redirect("/signup");
      console.log("errorok");
    }

    try {
      const existUser = await user.findOne({ userEmail: userEmail });
      console.log("user ", existUser);
      if (existUser) {
        console.log("exist user");
        req.session.errors.existError =
          "User with the same name or email already exists";
        // res.send("all ready exist ")
        return res.redirect("/signup");
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("An error occurred. Please try again later.");
    }

    console.log(req.body);
    const userdatas = new user(req.body);
    await userdatas.save();
    console.log(userdatas);
    if (userdatas) {
      // req.session.user={
      //     userId:userdatas._id,
      //       userName:userdatas.userName
      // }
      req.session.userName = userdatas.userName;
      req.session.userId = userdatas._id;
      req.session.userRole = userdatas.role;
    }

    // req.session.isLoggedIn = true
    // res.send(userName + " " + "is signed successfully ");
    res.redirect("/");
  },

  getLoginPage: (req, res) => {
    const errormsg = req.session.errormsg;
    req.session.errormsg = "";
    res.render("login", { title: "login", errormsg });
  },

  postLogin: async (req, res) => {
    const { loginEmail, loginPassword } = req.body;

    try {
      const loggedUser = await user.findOne({
        userEmail: loginEmail,
      });

      if (!loggedUser) {
        req.session.errormsg = "invalid Username";
        return res.redirect("/login");
      }
      if (loggedUser.userPassword !== loginPassword) {
        req.session.errormsg = "invalid Password";
        return res.redirect("/login");
      }

      console.log(loggedUser);
      if (loggedUser) {
        // req.session.user={
        //   userId:loggedUser._id,
        //   userName:loggedUser.userName
        //
        req.session.userName = loggedUser.userName;
        req.session.userId = loggedUser._id;
        req.session.userRole = loggedUser.role;

        // console.log(req.session.userId);

        req.session.isLoggedIn = true;

        if (loggedUser.role == "admin") {
          return res.redirect("/admin");
        } else {
          res.redirect("/userHome");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      req.session.errormsg = "An error occurred. Please try again later.";
      res.redirect("/login");
    }
  },
  getHomepage: async (req, res) => {
    const userName = req.session.userName;

    req.session.userName = "";
    res.render("home", { userName });
  },
  getuserHome: async (req, res) => {
    try {
      const userName = req.session.userName;
      const userId = req.session.userId;

      res.render("userHome", { userName });
    } catch (err) {
      console.log(err);
      res.json("something went wrong");
    }
  },

  showDetails: async (req, res) => {
    console.log(req.session.userId);
    // const userList =await  user.findOne({_id : req.session.userId})

    // console.log(userList);
    // if(userList.detail){
    //   return res.redirect('/usersDetails')
    // }
    // res.render("usersDetailsForm");
    try {
      const userList = await user.findOne({ _id: req.session.userId });

      const userId = req.session.userId;
      if (userList?.detail) {
        const details = await user.aggregate([  { $match: { _id: mongoose.Types.ObjectId.createFromHexString(userId), },},{ $lookup: {from: "details",localField: "detail",foreignField: "_id", as: "userDetails",  }, },  {  $project: {userDetails: { $arrayElemAt: ["$userDetails", 0] },  },}, { $replaceRoot: { newRoot: "$userDetails" },  }, {  $project: { _id: 0,},}, ]);

        console.log("this is fetched data", details);
        // Render the page with existing user details
        return res.render("usersDetails", { userDetails: details[0] });
      }

      // Render the form for entering new detai
      res.render("usersDetailsForm");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("An error occurred. Please try again later.");
    }
  },
  postshowDetails: async (req, res) => {
    const { age, city, street, pin, houseNumber } = req.body;

    const personalDatass = new details(req.body);
    await personalDatass.save();
    // console.log(personalDatass);
    await user.updateOne(
      { _id: req.session.userId },
      { detail: personalDatass._id }
    );

    res.render("userdataredirectform");
  },

  getUserDetails: async (req, res) => {},


  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res
          .status(500)
          .send("An error occurred. Please try again later.");
      }
      res.redirect("/login");
    });
  },



updateUserDetails:async (req,res)=>{
console.log("id is"+ req.session.userId);
const users= await user.findOne({_id:req.session.userId})
const {city,street,pin,houseNumber,age}=req.body

const detailsReference=users.detail


const updatedDetail= await details.updateOne({_id:detailsReference},{$set:{city:city,age:age,pin:pin,houseNumber:houseNumber}})


res.redirect("/userHome")
}
};

module.exports = userController;
