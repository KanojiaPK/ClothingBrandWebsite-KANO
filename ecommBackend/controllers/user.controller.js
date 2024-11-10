import UserModel from "../models/user.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("./uploads")) {
      cb(null, "./uploads");
    } else {
      fs.mkdirSync("./uploads");
      cb(null, "./uploads");
    }
  },
  filename: function (req, file, cb) {
    const orgName = file.originalname;
    const ext = path.parse(orgName).ext;
    const name = path.parse(orgName).name;
    const fullname =
      name + "-" + Date.now() + "" + Math.round(Math.random() * 1e9) + ext;

    cb(null, fullname);
  },
});

const upload = multer({ storage: storage });

export const addUser = async (req, res) => {
  try {
    const dataWithFile = upload.single("avatar");

    dataWithFile(req, res, async function (err) {
      if (err)
        return res.status(400).json({ message: err.message, success: false });
      console.log(req.body);
      console.log(req.file);

      let img = null;
      if (req.file) {
        img = req.file.filename;
      }
      const { name, email, password, contact } = req.body;
      const saveData = await UserModel.create({
        name: name,
        email: email,
        password: password,
        contact: contact,
        image: img,
      });

      if (saveData) {
        return res.status(201).json({
          data: saveData,
          message: "New record added",
          success: true,
        });
      }

      return res.status(400).json({
        message: "Bad request",
        success: false,
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const userData = await UserModel.find();
    if (userData) {
      return res.status(200).json({
        data: userData,
        message: "Fetched!",
        success: true,
        filepath: "http://localhost:8001/uploads/",
      });
    }
    return res.status(400).json({
      message: "Bad request",
      success: false,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};
export const getUser = async (req, res) => {
  try {
    const userid = req.params.userid;
    const userData = await UserModel.findOne({ _id: userid });
    if (userData) {
      return res.status(200).json({
        data: userData,
        message: "Fetched!",
        success: true,
        filepath: "http://localhost:8001/uploads/",
      });
    }
    return res.status(400).json({
      message: "Bad request",
      success: false,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const dataWithFile = upload.single("avatar");

    dataWithFile(req, res, async function (err) {
      if (err)
        return res.status(400).json({ message: err.message, success: false });
      const userid = req.params.userid;

      const existingUser = await UserModel.findOne({ _id: userid });
      let img = existingUser.image;
      if (req.file) {
        img = req.file.filename;
        if (fs.existsSync("./uploads/" + existingUser.image)) {
          fs.unlinkSync("./uploads/" + existingUser.image);
        }
      }
      const { name, email, password, contact } = req.body;

      // Hash the password if it's provided
      let hashedPassword = password;
      if (password) {
        hashedPassword = bcrypt.hashSync(password, 10);
      }

      const user = await UserModel.updateOne(
        { _id: userid },
        {
          $set: {
            name: name,
            email: email,
            password: hashedPassword, // Use the hashed password
            contact: contact,
            image: img,
          },
        }
      );
      if (user.acknowledged) {
        return res.status(200).json({
          message: "Updated!",
          success: true,
        });
      }
      return res.status(400).json({
        message: "Bad request",
        success: false,
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userid = req.params.userid;
    const existingUser = await UserModel.findOne({ _id: userid });
    const user = await UserModel.deleteOne({ _id: userid });
    if (user.acknowledged) {
      if (fs.existsSync("./uploads/" + existingUser.image)) {
        fs.unlinkSync("./uploads/" + existingUser.image);
      }
      return res.status(200).json({
        message: "Deleted!",
        success: true,
      });
    }
    return res.status(400).json({
      message: "Bad request",
      success: false,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

/* ===========================
        Auth
=============================*/

export const signUp = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;

    const existUser = await UserModel.findOne({ email: email });
    if (existUser) {
      return res.status(200).json({
        message: "User already exist",
        success: false,
      });
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    console.log(hashPassword);
    const saveData = await UserModel.create({
      name: name,
      email: email,
      password: hashPassword,
      contact: contact,
    });

    if (saveData) {
      return res.status(201).json({
        data: saveData,
        message: "New record added",
        success: true,
      });
    }

    return res.status(400).json({
      message: "Bad request",
      success: false,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({
        message: "User doesn't exist!",
        success: false,
      });
    }

    const comparePassword = bcrypt.compareSync(password, existingUser.password);
    if (!comparePassword) {
      return res.status(400).json({
        message: "Invalid credential",
        success: false,
      });
    }

    // If passwords match, generate JWT token
    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
      },
      "your_secret_key_here", // Replace with your secret key
      { expiresIn: "1h" }
    );

    // Exclude password from response data
    const responseData = { ...existingUser.toObject() };
    delete responseData.password;

    // Send token and user data in response
    return res.status(200).json({
      data: responseData,
      token: token,
      message: "Successfully logged in",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};
