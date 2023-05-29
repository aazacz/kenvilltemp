const isLogin = async (req, res, next) => {
    try {
        if (req.session.userid) {
            next();
        } else {
            res.redirect('/login');
        }
       
    }
    catch (error) {
        console.log(error.message);
    }
}



const isLogout = async (req, res, next) => {
    try {
        if ( req.session.userid) {
            const session=req.session.userid
            // console.log(session);
            if (session) {
            
             console.log("checking if session exists");
             console.log(session);
             res.render('index', { session: session })
            }
        } else {
            next()
        }
        
    }
    catch (error) {
        console.log(error.message);
    }
}

module.exports = { isLogin, isLogout }