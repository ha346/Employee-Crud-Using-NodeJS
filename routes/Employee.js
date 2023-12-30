var express=require('express')
var router=express.Router()
var pool = require('./pool')
var upload=require('./multer')
var fs = require('fs')
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage=new LocalStorage('./scratch')


router.get('/employee', function (req, res, next) {
    try {
        var admin = JSON.parse(localStorage.getItem('ADMIN'))
        if (admin == null) {
            res.render('LoginPage',{message:''})

        }
        res.render('EmployeeInterface', { status: null })
    }
    catch(e)
    {
        res.render('LoginPage',{message:''})

    }
})

router.get('/fetchallstate', function (req, res, next) {
   
    pool.query('select * from state', function (error, result) {
        
        if (error)
        {
            console.log(error)
            res.status(500).json([])
        }
        else
        {
            console.log(result)
            res.status(200).json(result)
        }
    })
})

router.get('/fetchallcity', function (req, res, next) {
    
    pool.query('select * from city where stateid=?', [req.query.stateid], function (error, result) {
        
        if(error)
        {
            res.status(500).json([])
        }
        else
        {
            res.status(200).json(result)
        }
    })
})

router.post('/submitemployeerecord', upload.single('pic'), function (req, res, next) {

    console.log(req.body)

    var name = req.body.firstname + ' ' + req.body.lastname
    var birthdate=new Date(req.body.birthdate)

    pool.query('insert into employee(employeename, birthdate, gender, address, state, city, emailaddress, mobilenumber,pic) values(?,?,?,?,?,?,?,?,?)', [name,birthdate, req.body.gender, req.body.address, req.body.state, req.body.city, req.body.emailaddress, req.body.mobilenumber, req.file.filename], function (error, result) {
        
        if (error)
        {
            console.log(error)
            res.render('EmployeeInterface',{status:0})
        }
        else
        {
            console.log(result)
            res.render('EmployeeInterface',{status:1})
        }
    })

})


router.post('/insertrecord', function (req, res, next) {
    
    pool.query('insert into state values(?,?)', [req.body.stateid, req.body.statename], function (error, result) {
    
        if(error)
        {
            res.status(500).json({status:false,message:error})
        }
        else {
            res.status(200).json({status:true,message:result})

        }

})
})


router.get('/displayallemployee', function (req, res, next) {
    
    try {
        var admin = JSON.parse(localStorage.getItem('ADMIN'))
        if (admin == null) {
            res.render('LoginPage', { message: '' })
        }
        pool.query('select E.*,(select S.statename from state S where S.stateid=E.state) as statename,(select C.cityname from city C where C.cityid=E.city) as cityname from employee E', function (error, result) {
        
            if (error) {
                console.log(error)
                res.render('DisplayEmployee', { status: false, data: '' })
            }
            else {
                console.log(result)
                res.render('DisplayEmployee', { status: true, data: result })
            }
        })
    }
    catch(e)
    {
        res.render('LoginPage',{message:''})
    }
})



router.get('/displayrecordbyid', function (req, res, next) {
    
    console.log(req.query)
    pool.query('select E.*,(select S.statename from state S where S.stateid=E.state) as statename,(select C.cityname from city C where C.cityid=E.city) as cityname from employee E where employeeid=?',[req.query.eid] ,function (error, result) {
        
        if (error)
        {
            console.log(error)
            res.render('DisplayRecordById',{status:false,data:[]})
        }
        else
        {
            console.log(result)
             res.render('DisplayRecordById',{status:true,data:result[0]})
        }
    })
})


router.post('/editdeleterecord', function (req, res, next) {
    
    if (req.body.action == "Submit")
    {
        pool.query('update employee set employeename=?, birthdate=?, gender=?, address=?, state=?, city=?, emailaddress=?, mobilenumber=? where employeeid=?', [req.body.firstname+" "+req.body.lastname, req.body.birthdate, req.body.gender, req.body.address, req.body.state, req.body.city, req.body.emailaddress, req.body.mobilenumber, req.body.employeeid], function (error, result) {
            
            if(error)
            {
                 res.redirect('/employee/displayallemployee')
            }
            else
            {
                 res.redirect('/employee/displayallemployee')
            }
        })
    }
    else
    {
        pool.query('delete from employee where employeeid=?',[req.body.employeeid], function (error, result) {
            
            if(error)
            {
                 res.redirect('/employee/displayallemployee')
            }
            else
            {
                 res.redirect('/employee/displayallemployee')
            }
        })

    }
})


router.get('/displaypicture', function (req, res, next) {
    console.log(req.query.ename)
    res.render('DisplayPicture',{ eid:req.query.eid,ename:req.query.ename,picture:req.query.picture})

})

router.post('/editpicture',upload.single('pic'), function (req, res, next) {
    
    pool.query('update employee set pic=? where employeeid=?',[req.file.filename,req.body.employeeid], function (error, result) {
        
        if (error)
        {
            res.redirect('/employee/displayallemployee')
        }
        else
        {
            var filePath="E:/SappalSir's_Folder/Node Projects/EmployeeProject/public/images/"+req.body.oldpicture
            fs.unlinkSync(filePath)
            res.redirect('/employee/displayallemployee')
        }
    })
})
 


module.exports = router;