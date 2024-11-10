import productModel from "../models/product.model.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import util from "util";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "./uploads";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const fullname = `${name}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, fullname);
  },
});

const upload = multer({ storage: storage });

const uploadFiles = util.promisify(
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ])
);

const deleteFile = (filepath) => {
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
};  

export const addProduct = async (req, res) => {
  try {
    await uploadFiles(req, res);

    const { title, description, availablein, price, quantity, category } =
      req.body;
    let thumbnail = null;
    let images = [];

    if (req.files) {
      if (req.files["thumbnail"] && req.files["thumbnail"][0]) {
        thumbnail = req.files["thumbnail"][0].filename;
      }
      if (req.files["images"]) {
        images = req.files["images"].map((file) => file.filename);
      }
    }

    const newProduct = new productModel({
      title,
      description,
      availablein,
      price,
      quantity,
      category,
      thumbnail,
      images,
    });

    const saveData = await newProduct.save();

    return res.status(201).json({
      data: saveData,
      message: "New record added",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productid = req.params.productid;
    await uploadFiles(req, res);

    const { title, description, availablein, price, quantity, category } =
      req.body;

    let thumbnail = req.body.thumbnail;
    let images = req.body.images ? req.body.images.split(",") : [];

    if (req.files) {
      if (req.files["thumbnail"] && req.files["thumbnail"][0]) {
        const oldProduct = await productModel.findById(productid);
        deleteFile(`./uploads/${oldProduct.thumbnail}`);
        thumbnail = req.files["thumbnail"][0].filename;
      }
      if (req.files["images"]) {
        const oldProduct = await productModel.findById(productid);
        oldProduct.images.forEach((image) => deleteFile(`./uploads/${image}`));
        images = req.files["images"].map((file) => file.filename);
      }
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      productid,
      {
        title,
        description,
        availablein,
        price,
        quantity,
        category,
        thumbnail,
        images,
      },
      { new: true }
    );

    if (updatedProduct) {
      return res.status(200).json({
        message: "Product updated successfully",
        success: true,
        data: updatedProduct,
      });
    }

    return res.status(400).json({
      message: "Failed to update product",
      success: false,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productid = req.params.productid;
    const product = await productModel.findById(productid);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    if (product.thumbnail) {
      deleteFile(`./uploads/${product.thumbnail}`);
    }
    if (product.images && product.images.length > 0) {
      product.images.forEach((image) => deleteFile(`./uploads/${image}`));
    }

    await productModel.findByIdAndDelete(productid);

    return res.status(200).json({
      message: "Product deleted successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", sort } = req.query;
    const skipno = limit * (page - 1);
    const rgx = (pattern) => new RegExp(`.*${pattern}.*`, "i");
    const searchRgx = rgx(search);

    let filter = search
      ? {
          $or: [
            { title: { $regex: searchRgx } },
            { description: { $regex: searchRgx } },
          ],
        }
      : {};

    let sortValue = ["_id", 1];
    if (sort === "new") sortValue = ["_id", -1];
    if (sort === "lth") sortValue = ["price", 1];
    if (sort === "htl") sortValue = ["price", -1];

    const products = await productModel
      .find(filter)
      .populate("category")
      .limit(parseInt(limit))
      .skip(skipno)
      .sort([sortValue]);

    if (products) {
      return res.status(200).json({
        count: products.length,
        data: products,
        message: "Fetched!",
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

export const getProductsAggr = async (req, res) => {
  try {
    const products = await productModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      { $unwind: "$categoryData" },
    ]);

    if (products) {
      return res.status(200).json({
        count: products.length,
        data: products,
        message: "Fetched!",
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

export const getProduct = async (req, res) => {
  try {
    const productid = req.params.productid;
    const product = await productModel.findById(productid).populate("category");

    if (product) {
      return res.status(200).json({
        data: product,
        message: "Fetched!",
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
