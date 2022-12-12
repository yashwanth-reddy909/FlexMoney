const express= require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const YogaUsers=require('../Models/YogaUsers');
const Subscriptions=require('../Models/Subscriptions');
var app=express();
const YogaUsersRouter= express.Router();
YogaUsersRouter.use(bodyParser.json());

YogaUsersRouter.route('/')
.get((req,res,next)=>{
    YogaUsers.find({})
    .then((allusers)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(allusers);
    },err=>next(err))
    .catch((err)=>{
        next(err);
    });
})
.post((req,res,next)=>{
    var date = new Date();
    date.setMonth(date.getMonth()+1);
    YogaUsers.create({
        FullName: req.body.FullName,
        EmailId: req.body.EmailId,
        Age: req.body.Age,
        AmountPaid: req.body.Shift ? 500 : 0
    })
    .then((user)=>{
        var time = new Date();
        var next_month = new Date();
        next_month.setMonth(next_month.getMonth() + 1);
        if(req.body.Shift != null){
            Subscriptions.create({
                User: user._id,
                Money: 500,
                Shift: req.body.Shift,
                PaymentTime: time.toString(),
                ExpirationDate: next_month.toString()    
            })
            .then((subscri)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(user);
            },err=>next(err))
            .catch(err=>next(err));
        }
        else{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(user);
        }
    },err=>{
        res.statusCode=403;
        res.setHeader('Content-Type','application/json');
        res.json({message:err.message});        
    })
    .catch((err)=>next(err));
})
.delete((req,res,next)=>{
    YogaUsers.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','applicationb/json');
        res.json(resp);
    },err=>next(err))
    .catch((err)=>next(err));
});

YogaUsersRouter.route('/:UserEmailId')
// .get((req,res,next)=>{
//     YogaUsers.findOne({EmailId: req.params.UserEmailId})
//     .then(user=>{
//         Subscriptions.findOne({User: user._id})
//         .then((subscri)=>{
//             res.statusCode=200;
//             res.setHeader('Content-Type','application/json');
//             res.json({'User': user,'Subscription': subscri});
//         })
//         .catch(err=>next(err));
//     })
//     .catch(err=>next(err));
// })
.delete((req,res,next)=>{
    YogaUsers.findOneAndRemove({EmailId: req.params.UserEmailId})
    .then(resp=>{
        Subscriptions.findOneAndRemove({User: resp._id})
        .then((subscri)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json({'User': user,'Subscription': subscri});
            
        })
        .catch(err=>next(err));
    },err=>next(err))
    .catch(err=>next(err));
});


YogaUsersRouter.route('/:UserEmailId/recharge')
.get((req,res,next)=>{
    YogaUsers.findOne({EmailId: req.params.UserEmailId})
    .then((user)=>{
        if(user == null){
            throw new Error("EmailId not found");
            return null;
        }
        Subscriptions.findOne({User: user._id})
        .then(sub=>{
            if(sub == null){
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json({'Exprire': true,
                        'User': user});
                return null;
            }
            const expiration = new Date(sub.ExpirationDate);
            var expire = false;
            if(new Date() > expiration){
                expire = true;
            }
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json({'Expire': expire,
                        'User': user,
                        'Subscription': sub});
        })
        .catch(err=>next(err));
    },err=>next(err))
    .catch((err)=>{
        next(err);
    });
})
.post((req,res,next)=>{
    YogaUsers.findOne({EmailId: req.params.UserEmailId})
    .then((user)=>{
        if(user == null){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json({'User': user,'Exprire': true});
            return null;
        }
        Subscriptions.findOne({User: user._id})
        .then(sub=>{
            if(sub == null){
                // new payment
                var time = new Date();
                var next_month = new Date();
                next_month.setMonth(next_month.getMonth() + 1);
                Subscriptions.create({
                    User: user._id,
                    Money: 500,
                    Shift: req.body.Shift,
                    PaymentTime: time.toString(),
                    ExpirationDate: next_month.toString()    
                })
                .then(sub1 => {
                    user.AmountPaid += 500;
                    user.save()
                    .then(user2=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json({'User': user,'Subscription': sub1,'Expire': false});
                    })
                    .catch(err=>next(err));
                },err=>next(err))
                .catch(err=>next(err));
            }
            else{
                // exsiting payment
                const expiration = new Date(sub.ExpirationDate);
                let date = new Date();
                var expire = false;
                if(date > expiration){
                    expire = true;
                    sub.Shift = req.body.Shift;
                    sub.PaymentTime = date.toString();
                    date.setMonth(date.getMonth() + 1);
                    sub.ExpirationDate = date.toString();
                    user.AmountPaid += 500;
                }
                user.save()
                .then(user2=>{
                    sub.save()
                    .then(sub2 => {
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json({'Expire': expire,
                        'User': user,
                        'Subscription': sub});
                    },err=>next(err))
                    .catch(err=>next(err));
                })
                .catch(err=>next(err));
            }
        })
        .catch(err=>next(err));
    },err=>next(err))
    .catch((err)=>{
        next(err);
    });
});





module.exports=YogaUsersRouter;