const router = require('express').Router();
const path = require('path');

var UsersRouter=require('./users');
router.use('/backendapi/users',UsersRouter);


module.exports=router;