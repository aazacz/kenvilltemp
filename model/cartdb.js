const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
      }]
    
    });



const cart= new mongoose.model("cart",cartSchema)

module.exports=cart
