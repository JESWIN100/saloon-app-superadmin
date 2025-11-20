const express=require('express')
const { todayBookingsCount, totalRevenue } = require('../controller/bookings.controller')
const { getTotalUsers } = require('../controller/user.controller')
const { getTotalSaloons } = require('../controller/saloon.controller')

const routes=express.Router()


routes.get('/',async(req,res)=>{
    const count=await todayBookingsCount()
    const total=await totalRevenue()
    const customers=await getTotalUsers()
    const saloons =await getTotalSaloons()
    res.render('index',{count:count,total,customers,saloons})
})


// routes.get('/getcount',todayBookingsCount)

module.exports=routes