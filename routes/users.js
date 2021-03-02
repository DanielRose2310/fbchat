const express = require("express");
const {
  userModel,
  validUser,
  validLogin,
  genToken,
} = require("../models/users_model");
const router = express.Router();
const bcrypt = require("bcrypt");
const authToken = require("../middleware/auth");
router.get("/", async (req, res) => {
  userModel
    .find({})
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get("/userprofile/:id", async (req, res) => {
  userModel
    .findOne({
      _id: req.params.id,
    },{pass:0})
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});
router.get("/contactinfo/:id", async (req, res) => {
  userModel
    .findOne({
      _id: req.params.id,
    },{pass:0, contacts:0})
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get("/all", async (req, res) => {
  userModel
    .find({},{userName:1,image:1, contacts:1})
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});
router.get("/userfromtoken", authToken, async (req, res) => {
  userModel
    .find({
      _id: req._id,
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.post("/login", async (req, res) => {
  let valid = validLogin(req.body);
  if (!valid.error) {
    try {
      let userData = await userModel.findOne({
        email: req.body.email,
      });
      if (userData) {
        let validPass = await bcrypt.compare(req.body.pass, userData.pass);
        if (!validPass) {
          res.status(400).json({
            message: "INVALID PASSWORD",
          });
        } else {
          let newToken = genToken(userData.email, userData._id);
          res.json({
            token: newToken,
            _id: userData._id,
            userName: userData.userName,
            email: userData.email,
            admin: userData.admin,
            date_time: userData.date_time,
            contacts:userData.contacts,
            image: userData.image,
          });
        }
      } else {
        res.status(400).json("No user found");
      }
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  } else {
    res.status(400).json(valid.error.details);
  }
});

router.post("/new", async (req, res) => {
  let valid = validUser(req.body);
  if (!valid.error) {
    let salt = await bcrypt.genSalt(10);
    req.body.pass = await bcrypt.hash(req.body.pass, salt);
    try {
      await userModel.insertMany([req.body]).then((data) => {
        let user={
          _id:data[0]._id,
          userName:data[0].userName,
          email:data[0].email,
          admin:data[0].admin,
          image:data[0].image,
          contacts:data[0].contacts,
          date_time:data[0].date_time
        }
        res.json(user);
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        success: false,
        error: "User already in the system",
      });
    }
  } else {
    res.status(400).json(valid.error.details);
  }
});

router.patch('/addcontact', async(req,res)=>{
  let userdata = await userModel.findOne({
    _id: req.body.userId,
  }); 
    try {
       await userModel.updateOne(
        {
          _id: req.body.userId,
        },
        {
          $push: {
            contacts: req.body.contactId,
          },
        }
      );
      userdata = await userModel.findOne({
        _id: req.body.userId,
      });
      res.json({
        contacts: userdata.contacts,
    });
    } catch (err) {
      res.status(400).json({
        err,
      });
    }
})
 

router.patch('/removecontact', async(req,res)=>{
  let userdata = await userModel.findOne({
    _id: req.body.userId,
  }); 
    try {
       await userModel.updateOne(
        {
          _id: req.body.userId,
        },
        {
          $pull: {
            contacts: req.body.contactId,
          },
        }
      );
      userdata = await userModel.findOne({
        _id: req.body.userId,
      });
      res.json({
        contacts: userdata.contacts,
    });
    } catch (err) {
      res.status(400).json({
        err,
      });
    }
})
 

router.post("/reset", async (req, res) => {
  userModel
    .deleteMany({})
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.put("/editone", authToken, async (req, res) => {
  let userDB = validUser(req.body);
  let user = await userModel.findOne({
    _id: req._id,
  });
  if (!userDB.error) {
    //let validPass = await bcrypt.compare(req.body.pass, user.pass)
    //if (validPass) {
    try {
      let data = await userModel.updateOne(
        {
          _id: req._id,
        },
        {
          $set: {
            userName: req.body.userName,
            image: req.body.image,
          },
        }
      );
      user = await userModel.findOne({
        _id: req._id,
      });
      res.json({
        user: user.user,
        _id: user._id,
        email: user.email,
        admin: user.admin,
        date_time: user.date_time,
        image: user.image,
        contacts: user.contacts,
        data,
      });
    } catch (err) {
      res.status(400).json({
        err,
      });
    }
  } else {
    res.status(400).json(userDB.error.details);
  }
});

module.exports = router;
