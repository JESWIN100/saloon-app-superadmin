const express=require('express')
const { Bookings, totalRevenue, getLatestBookings } = require('../controller/bookings.controller')

const routes=express.Router()


routes.get('/',(req,res)=>{
    res.render('booking')
})


routes.get('/bookings',Bookings)

routes.get('/revenue',totalRevenue)


routes.get("/latest-bookings", getLatestBookings);

module.exports=routes