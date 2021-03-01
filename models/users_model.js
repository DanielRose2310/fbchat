const mongoose = require("mongoose");
const mongodb = require('../dbs_connected/mongodb')  
const Joi = require("joi");
  const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
  userName: String,
    email: {type:String, unique:true},
    pass: String,
    admin: { type: Boolean, default: false },
    image:{ type: Number, default: 0},
    contacts: {type:Array, default:[]},
    date_time: {
      type: Date, default: Date.now
    }

  }, { retainKeyOrder: true });
  
  const userModel = mongodb.model("user",userSchema);
  exports.userModel = userModel;


const genToken = (_email,_id) => {
    const token = jwt.sign({email:_email,_id:_id}, "mytoken");
    return token;
  }
  
  exports.genToken = genToken;
  

const validUser = (_userObj) => {
    let schema = Joi.object({
      id:Joi.any(),
      userName:Joi.string().min(2).max(50),
      email: Joi.string().email(),
      pass:Joi.string().min(1).max(50),
      image:Joi.number(),
      admin: Joi.boolean().default(0),
      contacts: Joi.array()
    })
    return schema.validate(_userObj);
  }
  exports.validUser=validUser;


const validLogin = (_userObj) => {
    let schema = Joi.object({
      //user:Joi.string().min(0).max(50),
      email: Joi.string().min(2).max(50).email().required(),
      pass:Joi.string().min(1).max(50).required(),  
    })
    return schema.validate(_userObj);
  }

  
  exports.validLogin = validLogin;

  