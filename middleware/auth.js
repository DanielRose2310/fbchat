const jwt = require("jsonwebtoken");

const authToken = (req, res, next) => { 
  let token = req.header("x-auth-token");
  if (!token) { return res.status(401).json({ message: "access denied" }) }
  try {
    
    let checkToken = jwt.verify(token, "mytoken");
     req._id = checkToken._id;
    next();
  }
  catch (err) {
    return res.status(401).json(err)
  }
}

module.exports = authToken;