const express=require('express')
const { check_login } = require('../controller/auth.controller');
const { default: axios } = require('axios');

const routes=express.Router()


routes.get('/',async(req,res)=>{
    const response = await axios.get('http://localhost:4040/errors');
    res.render('user-errors',{ errors: response.data })
})


module.exports=routes