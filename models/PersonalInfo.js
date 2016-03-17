var mongoose = require('mongoose');

var PersonalInfoSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  dob: String,
  gender: String
});


mongoose.model('PersonalInfo', PersonalInfoSchema);