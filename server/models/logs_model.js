  const mongoose = require("mongoose");
  const mongodb = require('../dbs_connected/mongodb')
  const Joi = require("joi");
  let message = Joi.object().keys({senderId:Joi.string(),recipentId:Joi.string(), payload:Joi.string()})

  const logSchema = new mongoose.Schema({
    chatId:String,
    messages: {type:Array, default:[]}
  });
  
  const logModel = mongodb.model("log",logSchema);
  exports.logModel = logModel;


 const validLog = (_logObj) => {
    let schema = Joi.object({
      chatId:Joi.string(),
      messages:Joi.Array().item(message),
    })
    return schema.validate(_logObj);
  }
  exports.validLog=validLog;
 