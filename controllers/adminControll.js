const express = require("express");
const mongoose = require("mongoose");
const { user, details } = require("../mongo");
const { logout } = require("./userController");
const { ObjectId } = require("mongodb");

module.exports = {
  getAdminPage: async (req, res) => {
    const detail = await user.find({role : "user"});
    console.log('details',detail);
    // const userNameList = details.map(user => user.userName);

    // console.log(`this is : ${userDetails}`);

    res.render("admin", { userName: detail });
  },

  showUsersDetails: async (req, res) => {
    const userId = req.params.id;
    console.log("params", req.params);
    console.log(typeof userId);
    const userDetails = await details.findOne({
      _id: mongoose.Types.ObjectId.createFromHexString(userId),
    });
    console.log(userDetails);

    res.render("adminshowdetails", { userDetails: userDetails });
  },
};
