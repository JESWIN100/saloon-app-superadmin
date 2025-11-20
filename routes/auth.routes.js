const express=require('express')
const { check_login } = require('../controller/auth.controller')

const routes=express.Router()


routes.get('/',(req,res)=>{
    res.render('login')
})



routes.post('/login',check_login)

module.exports=routes