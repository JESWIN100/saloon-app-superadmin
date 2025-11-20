const express=require('express')
const homerouter=require('./home.routes')
const authrouter=require('./auth.routes')
const saloon=require('./saloon.Route')
const booking=require('./booking.route')
const user=require('./user.route')
const error=require('./error.route')
const services=require('./services.route')
const router=express.Router()




router.use('/home',homerouter)
router.use('/',authrouter)
router.use('/saloon',saloon)
router.use('/booking',booking)
router.use('/saloon',saloon)
router.use('/user',user)
router.use('/error',error)
router.use('/services',services)


module.exports=router