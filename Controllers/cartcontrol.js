const categorydb = require("../model/categorydb")
const productdb = require('../model/productsdb')
const cartdb = require('../model/cartdb')
const customerdetail = require('../model/userdetailsdb')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


//cart page loading
exports.cart =async (req, res) => {
  const session=req.session.userid
  console.log("session id in the cart page");
  console.log(session);
  const cart= await cartdb.find({}).populate('product');
  const cart1= await cartdb.find({})
  
  console.log(cart)
  console.log("         ")
  console.log(cart1)
  
  
  console.log(cart[0].product.length)
  console.log(cart[0].product[1])
  
  
  res.render('cart',{session:session,cart:cart})
  }



//adding to the CART
exports.addtocart = async (req, res) => {
  const id = req.body._id;
  console.log("id of product item");
  console.log(id);
  console.log("productid printed");

  try {
    let User = await cartdb.findOne({ userId: req.session.userid }); //checking if there is any user or not

    console.log("user found");

    if(User) {  //If User have already a cart

      const isProductExist = await cartdb.exists({ userId: req.session.userid, product: new ObjectId(id) });

     if (!isProductExist) { //Executes the IF Condition if the product is not already existed in the cart

     
      if (User.product.length == 0) {
        const addtocart = await cartdb.create({ userId: req.session.userid, product: [ObjectId(id)] });
        console.log(addtocart);
        console.log("if condition");
        res.redirect('/category');
      }
      else {
        console.log();
        const addtocart = await cartdb.findOneAndUpdate({userId: req.session.userid}, { $addToSet: { product: new mongoose.Types.ObjectId(id) } }, { new: true,upsert: true });
        console.log(addtocart);
        console.log("else condition");
        res.redirect('/category');
      }
    }
    else{
      res.send({ messsage: "category already added" })
      return;
    }
    } 
    else {  //If User is purchasing for the first time
      const addtocart = new cartdb({userId: req.session.userid,product: [id]});

      const newcart = await addtocart.save();
      res.send({message: "category added"})
      console.log("new user so added to cart");
      console.log(newcart._id);

      console.log("adding the newly created cartid to the users mongodb");

      const addtouser = await customerdetail.findByIdAndUpdate(req.session.userid,{ cartId: newcart._id },{ new: true });

      console.log(addtouser);
      return;
    }
  } catch (error) {
    console.log(error.message);
  }
};


//increaseQuantity of cart
exports.increaseQuantity = async (req,res)=>{
  try {
    const id = req.body.id;
    const quantity = req.body.purchased;
    console.log(id);
    console.log(quantity);
    const product = await productdb.findByIdAndUpdate(id,{$set:{purchased:quantity}});
    const quantitydec = await productdb.findByIdAndUpdate(id,{$inc:{quantity:-quantity}});
    res.send({message:"incremented"})

}catch(error){
console.log(error.message);
}
}

//decreaseQuantity of cart
exports.decreaseQuantity = async (req,res)=>{
  try {
    const id = req.body.id;
    const quantity = req.body.purchased;
    console.log(id);
    console.log(quantity);
    const product = await productdb.findByIdAndUpdate(id,{$set:{purchased:quantity}});
    const quantityinc = await productdb.findByIdAndUpdate(id,{$inc:{quantity:quantity}});
    res.send({message:"decremented"})

}catch(error){
console.log(error.message);
}
}



///cartdel
exports.cartdel=async (req,res)=>{

  try {
    const id=new ObjectId(req.body.id);
    const quantity = req.body.purchased
    const cartid = req.body.cartid

    console.log(id)
    const find=await cartdb.find({product:id})

    console.log("the product inthe cart is")
    console.log(find)
    const productdel = await cartdb.findByIdAndUpdate(cartid,{$pull:{product:id}},{new:true});
    const quantityinc = await productdb.findByIdAndUpdate(id,{$inc:{quantity:quantity}});
    res.send({message:"deleted"})
  } catch (error) {
    console.log(error.message)    
  }
}