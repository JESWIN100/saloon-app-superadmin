



const express=require('express')
const { getAllUsers } = require('../controller/user.controller')


const routes=express.Router()


routes.get('/',(req,res)=>{
    res.render('user')
})


routes.get('/get',getAllUsers)

module.exports=routes