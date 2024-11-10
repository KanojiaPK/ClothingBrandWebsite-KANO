import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
export const addToCart = async (req, res) => {
  try {
    const { userID, productID, quantity } = req.body;

    const exitingItem = await cartModel.findOne({
      userID: userID,
      productID: productID,
    });
    if (exitingItem) {
      let qty = quantity
        ? exitingItem.quantity + quantity
        : exitingItem.quantity + 1;

      if (qty > 5) {
        return res.status(200).json({
          message: "Quantity exceeded",
        });
      }
      const updateQty = await cartModel.updateOne(
        { _id: exitingItem._id },
        {
          $set: {
            quantity: qty,
          },
        }
      );

      if (updateQty.modifiedCount > 0) {
        return res.status(201).json({
          message: "Updated",
          success: true,
        });
      }
    }

    const proData = await productModel.findOne({ _id: productID });

    const saveData = await cartModel.create({
      userID: userID,
      productID: productID,
      title: proData.title,
      image: proData.thumbnail,
      price: proData.price,
      quantity: quantity ? quantity : 1,
    });
    if (saveData) {
      return res.status(200).json({
        data: saveData,
        message: "Success",
        success: true,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const type = req.query.type;
    const cartItemID = req.params.item_id;
    const cartItem = await cartModel.findOne({ _id: cartItemID });
    let qty = cartItem.quantity;

    if (type === "increment") {
      qty = qty + 1;
    }

    if (type === "decrement") {
      qty = qty - 1;
    }

    if (qty > 5) {
      return res.status(200).json({
        message: "Quantity exceeded",
      });
    }

    if (qty == 0) {
      const deleteItem = await cartModel.deleteOne({ _id: cartItemID });
      //   console.log(deleteItem)
      if (deleteItem.deletedCount > 0) {
        return res.status(200).json({
          message: "Item removed",
        });
      }
    }
    const updateCartQty = await cartModel.updateOne(
      { _id: cartItemID },
      {
        $set: {
          quantity: qty,
        },
      }
    );

    if (updateCartQty.modifiedCount > 0) {
      return res.status(200).json({
        message: "Updated",
        success: true,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const cartItemID = req.params.item_id;
    const deleteItem = await cartModel.deleteOne({ _id: cartItemID });
    if (deleteItem.deletedCount > 0) {
      return res.status(200).json({
        message: "Item removed",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const userID = req.params.user_id;
    const cartItems = await cartModel.find({ userID: userID });
    if (cartItems) {
      return res.status(201).json({
        data: cartItems,
        message: "Success",
        success: true,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};
