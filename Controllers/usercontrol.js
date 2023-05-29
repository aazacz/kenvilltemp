const bcrypt = require('bcrypt')

const Otp = require('../model/otpdb')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer')
const categorydb = require("../model/categorydb")
const productdb = require('../model/productsdb')
const cartdb = require('../model/cartdb')
const customerdetail = require('../model/userdetailsdb')
const addressdb = require('../model/addressdb')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

//password Hashing
const passwordHash = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 5)
        return passwordHash;
    } catch (error) {
        console.log(error.message)
    }
}



//index page
exports.index = (req, res) => {
   
let session
    if (session) {
        
        res.render('index', { session: session })
    }
    else {
        const session = null
        res.render('index', { session: session })
    }

}



//login page
exports.login = (req, res) => {
    const session = null
    const title = req.flash("title");
    res.render('login', { title: title[0] || "", session: session })
}
//POST login page
exports.login_post = async (req, res) => {
    try {

        console.log(req.body.email)  //email printing

        const userlog = await customerdetail.findOne({ email: req.body.email }).populate("cartId")

        // console.log(userlog)
        console.log(req.body.password);  //password printing
        if (userlog) {
            console.log(userlog);

            const passwordmatch = await bcrypt.compare(req.body.password, userlog.password)

            if (passwordmatch) {

               req.session.userid = userlog._id
                console.log("session");
                console.log(req.session.userid);
                res.redirect('/')
            }
            else {
                req.flash("title", "password incorrect");
                console.log("password incorrect");
                res.redirect('/login')
            }
        }
        else {
            req.flash("title", "Username incorrect");
            console.log("username incorrect");
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message);
    }


}







//UserLogout
exports.logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
    }
}




//about page
exports.about = (req, res) => {
    res.render('about')
}

//contact page
exports.contact = (req, res) => {
    res.render('contact')
}
//dashboard page
exports.dashboard = async(req, res) => {

    const session=req.session.userid
    console.log("session id in the dashboard page is");
    console.log(session);
    const cart= await cartdb.find({}).populate('product');
    const user=await customerdetail.find({_id:req.session.userid}).populate('address')
    
    // console.log("the user is: "+ user)
    // console.log("the user is: "+ user[0].name)
    // console.log(cart)
    console.log("         ")
    console.log(user[0].address[0].name)
    console.log(user[0].address[1].name)


      if (req.session.userid) {
        const session = req.session.userid
        res.render('dashboard', { session: session,cart:cart,user:user })
    }
    else {
        const session = null
        res.render('dashboard', { session: session })
    }

}

//function to convert a string to Title Case
function toTitleCase(str) {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
      return match.toUpperCase();
    });
  }
  



//post - dashboard userdetails update
exports.userupdate=async (req,res)=>{

        let firstname=toTitleCase(req.body.firstname)
		let lastname=toTitleCase(req.body.lastname)
		let name=toTitleCase(req.body.name)
		let email=toTitleCase(req.body.email)

		let addressname=toTitleCase(req.body.addressname)
		let houseNo=toTitleCase(req.body.houseNo)
		let street=toTitleCase(req.body.street)
		let state=toTitleCase(req.body.state)
		let pincode=req.body.pincode
		let alternatePhone=req.body.alternatePhone
		let phone=req.body.phone
		let userid=req.session.userid
        console.log(userid)
        console.log(addressname)
        console.log(houseNo)
        console.log(street)
        console.log(state)
        console.log(pincode)
        console.log(alternatePhone)
        console.log(phone)
        console.log(userid)

        //checking if the address already exists
const addressExists = await addressdb.findOne({
    name:addressname,
    houseno:houseNo,
    street:street,
    state:state,
    pincode:pincode,
    phone:phone,
    alternatenumber:alternatePhone,
    customerid:userid})

console.log(addressExists);


if(addressExists){//checking if the same address exists
return;

}
else{
     const updateaddress = new addressdb({
            name:addressname,
            houseno:houseNo,
            street:street,
            state:state,
            pincode:pincode,
            phone:phone,
            alternatenumber:alternatePhone,
            customerid:userid
        })

    const updateAddress= await updateaddress.save()
    const addrerssId=new ObjectId(updateAddress._id);
    console.log(addrerssId);
    const addtoUserDb=await customerdetail.findByIdAndUpdate(userid,{$addToSet:{address:addrerssId}},{new:true})
    res.send({messsage:"user details updated"})
}
}



//post - add address 
exports.addnewadress=async (req,res)=>{

		let addressname=toTitleCase(req.body.addressname)
		let houseNo=toTitleCase(req.body.houseNo)
		let street=toTitleCase(req.body.street)
		let state=toTitleCase(req.body.state)
		let pincode=req.body.pincode
		let alternatePhone=req.body.alternatePhone
		let phone=req.body.phone
		let userid=req.session.userid
        console.log(userid)
        console.log(addressname)
        console.log(houseNo)
        console.log(street)
        console.log(state)
        console.log(pincode)
        console.log(alternatePhone)
        console.log(phone)
       
        //checking if the address already exists
const addressExists = await addressdb.findOne({
    name:addressname,
    houseno:houseNo,
    street:street,
    state:state,
    pincode:pincode,
    phone:phone,
    alternatenumber:alternatePhone,
    customerid:userid})

console.log(addressExists);


if(addressExists){//checking if the same address exists
    console.log("Address already exists");
return;

}
else{
     const updateaddress = new addressdb({
            name:addressname,
            houseno:houseNo,
            street:street,
            state:state,
            pincode:pincode,
            phone:phone,
            alternatenumber:alternatePhone,
            customerid:userid
        })

    const updateAddress= await updateaddress.save()
    const addrerssId=new ObjectId(updateAddress._id);
    console.log(addrerssId);
    const addtoUserDb=await customerdetail.findByIdAndUpdate(userid,{$addToSet:{address:addrerssId}},{new:true})
    res.send({messsage:"address added"})
}
}






//product open page
exports.product = async (req, res) => {
    const session = req.session.userid
    console.log(session);
    // console.log(req.query.productid)
    const product = await productdb.findOne({ _id: req.query.productid })

    res.render('product', { product: product, session: session })

}

//category page
exports.category = async (req, res) => {
    try {
        const session = req.session.userid
        console.log("checking session exists before loading category page");
        console.log(session);

        const product = await productdb.find({})

        // console.log(product);
        const title = req.flash("title");

        res.render("category", {title: title[0] || "", product: product, session: session })
    } catch (error) {
        console.log(error.message)
    }

}

//checkout page
exports.checkout = (req, res) => {
    res.render('checkout')
}





//signup page rendering
exports.signup = (req, res) => {
    const session = null
    const title = req.flash("title");
    res.render('signup', { title: title[0] || "", session: session })
}


//POST signup page rendering
exports.signup_post = async (req, res) => {
    try {
        const { email, password, repassword } = req.body;
        const finduser = await customerdetail.findOne({ email: email })

        let newCustomer

        if (finduser) { //IF case -- checking if user already registered
            console.log("User Already Registered")
            req.flash("title", "User Already Registered");
            res.redirect("/signup")
        }
        else {                  //Else case if User is NEW

            if (password === repassword) {//check if paswwords match 
                const passwordH = await passwordHash(req.body.password);

                newCustomer = new customerdetail({
                    name: req.body.username,
                    email: req.body.email,
                    password: passwordH,
                    block: "active",
                    isAdmin: 0
                   
                });

                try {
                    console.log(newCustomer);
                    await newCustomer.validate(); // Validate the newCustomer document
                    const insertdata = await newCustomer.save();

                    if (insertdata) {
                        req.flash("title", "Successfully registered");
                        res.redirect('/signup')
                    } else {
                        req.flash("title", "Registration Error");
                        res.redirect('/signup')
                    }
                } catch (error) {
                    console.log(error.message);
                }


            } else {
                req.flash("title", "Password didn't match");
                res.redirect('/signup')
            }

        }


    } catch (error) {
        console.log("error in catch");
        console.log(error.message);
    }
};


//otp login
exports.otplogin = async (req, res) => {
    try {
        const session = null
        const title = req.flash("title");
        res.render("otplogin", { title: title[0] || "", session: session })
    } catch (error) {
        console.log(error.message);
    }
}

//POST otp login
exports.otplogin_verify = async (req, res) => {
    try {
        const userData = await customerdetail.findOne({ email: req.body.email });

        if (userData) {
            if (userData.block == "active") {
                const OTP = otpGenerator.generate(4, {
                    digits: true,
                    alphabets: false,
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                });
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "abhilashabinz@gmail.com",
                        pass: "otjhcsnvnhknygrh",
                    },
                });
                var mailOptions = {
                    from: "abhilashabinz@gmail.com",
                    to: userData.email,
                    subject: "OTP VERIFICATION",
                    text: "PLEASE ENTER THE OTP FOR LOGIN " + OTP,
                };
                transporter.sendMail(mailOptions, function (error, info) { });
                console.log(OTP);

                const otp = new Otp({ email: req.body.email, otp: OTP });
                const salt = await bcrypt.genSalt(10);
                otp.otp = await bcrypt.hash(otp.otp, salt);
                const result = await otp.save();
                const session = null
                res.render("otpverify", { data: result, session: session });
            } else {
                req.flash("title", "User is Blocked");
                res.redirect("/otplogin");
            }
        } else {
            req.flash("title", "User is not found");
            res.redirect("/otplogin");
        }
    } catch (error) {
        console.log(error.message);
    }
}

// POST otp verify
exports.otpverify = async (req, res) => {
    try {
        console.log(req.body.email)
        console.log(req.body.otp)
        const userdata = await Otp.findOne({ email: req.body.email })
        console.log(userdata)
        if (userdata) {
            const otpmatch = await bcrypt.compare(req.body.otp, userdata.otp)
            console.log(otpmatch);
            if (otpmatch) {
                req.session.userid = req.body.email
                res.redirect('/dashboard')
            } else {
                req.flash("title", "OTP is not matched");
                console.log("otp wrong");
                res.redirect('/otplogin')
            }


        } else {
            req.flash("title", "OTP expired");

            console.log("otp expired");
            res.redirect('/otplogin')
        }



    } catch (error) {
        console.log(error.message);
    }
}














