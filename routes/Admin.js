var express=require('express')
var router = express.Router()
var pool = require('./pool')
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage=new LocalStorage('./scratch')

router.get('/loginpage', function (req, res, next) {
    
    res.render('LoginPage',{message:''})
})

router.post('/chkadminlogin', function (req, res, next) {
    
   
    pool.query('select * from admins where (emailid=? or mobile=?) and password=?', [req.body.emailid, req.body.emailid, req.body.password], function (error, result) {
        
        if(error)
        {
             
            res.render('LoginPage',{message:'Server Error'})
        }
        else
        {
            if (result.length == 1)
            {
                localStorage.setItem('ADMIN',JSON.stringify(result[0]))   // JSON.stringify(result[0])-----> It converts the json result into string so that less chances to loss the data
                res.render('Dashboard',{data:result[0]})
            }
            else
            {
                
                res.render('LoginPage',{message:'Invalid UserId/Mobile Number/Password...'})

            }
        }
    })
})


router.get('/logout', function (req, res, next) {
    
    localStorage.clear()
    res.render('LoginPage',{message:''})
})

module.exports = router;