const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/datas")
  .then(() => {
    console.log("conected");
  })
  .catch((err) => {
    console.error(err);
  });

const signupSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPassword: { type: String, required: true },
  detail: { type: mongoose.Types.ObjectId },
  role : {type : String , default : "user"}
});

const detailschema = new mongoose.Schema({
  age: { type: Number, trim: true },
  city: { type: String, trim: true },
  street: { type: String, trim: true },
  pin: { type: Number, trim: true },
  houseNumber: { type: Number, trim: true },
});

const user = mongoose.model("user_details", signupSchema);
const details = mongoose.model("details", detailschema);

module.exports = { user, details };
