const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        error: true,
        message: "Enter email",
      });
    }

    if (!password) {
      return res.status(400).json({
        error: true,
        message: "Enter Password",
      });
    }

    const isUser = await User.findOne({ email: email });

    if (!isUser) {
      return res.json({
        error: true,
        message: "User Not Found",
      });
    }

    if (isUser.email === email &&  bcrypt.compare(isUser.password,password)) {
      const user = { user: isUser };

      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
      });

      return res.json({
        error: false,
        user,
        accessToken,
        message: "Login Successful",
      });
    } else {
      return res.status(400).json({
        error: true,
        message: "Invalid Credentials..",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Error",
    });
  }
};

exports.signUp = async (req, res) => {
  try{
  
    const { fullName, email, password } = req.body;

    if (!fullName) {
      return res.status(400).json({
        error: true,
        message: "Enter full name",
      });
    }

    if (!email) {
      return res.status(400).json({
        error: true,
        message: "Enter Email",
      });
    }

    if (!password) {
      return res.status(400).json({
        error: true,
        message: "Enter Password",
      });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
      return res.json({
        error: true,
        message: "Email already registered",
      });
    }

    let hashPassword = await bcrypt.hash(password,10);

    const user = new User({
      fullName,
      email,
      password:hashPassword,
    });

    await user.save();

    // const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    //   expiresIn: "36000m",
    // });

    return res.json({
      error: false,
      user,
      // accessToken,
      message: "Registration Successful",
    });

  }catch(error){
    return res.status(500).json({
      error:true,
      message:"Internal Error"
    })
  }
  
};

exports.getUser = async (req, res) => {
  const { user } = req.user;

  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.status(401).json({
      error: true,
      message: "User Not found",
    });
  }

  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: "",
  });
};
