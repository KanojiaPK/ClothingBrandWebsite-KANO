import CategoryModel from "../models/category.model.js";
export const addCategory = async (req, res) => {
  try {
    const { categoryname, categorytype, description } = req.body; // Corrected keys
    const saveData = await CategoryModel.create({
      categoryname: categoryname, // Corrected key
      categorytype: categorytype, // Corrected key
      description: description,
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

export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    if (categories) {
      return res.status(200).json({
        data: categories,
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
export const getCategory = async (req, res) => {
  try {
    const categoryid = req.params.categoryid;
    const category = await CategoryModel.findOne({ _id: categoryid });
    if (category) {
      return res.status(200).json({
        data: category,
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

export const updateCategory = async (req, res) => {
  try {
    const categoryid = req.params.categoryid;
    const { name, description } = req.body;
    const category = await CategoryModel.updateOne(
      { _id: categoryid },
      {
        $set: {
          name: name,
          description: description,
        },
      }
    );
    if (category.acknowledged) {
      return res.status(200).json({
        message: "Updated!",
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

export const deleteCategory = async (req, res) => {
  try {
    const categoryid = req.params.categoryid;
    const category = await CategoryModel.deleteOne({ _id: categoryid });
    if (category.acknowledged) {
      return res.status(200).json({
        message: "Deleted!",
        success: true,
      });
      a;
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
