const express=require('express')
const { getAllSaloons, getStateanddistrict, addSaloons, getSaloonById, getStates, getDistrictsByState, updateSaloon, deleteSaloon } = require('../controller/saloon.controller');
const upload = require('../config/multer');

const routes=express.Router()


routes.get('/',async(req,res)=>{
   
   
     return res.render("saloon",);
})

routes.post('/add',upload.single("image"),addSaloons)

routes.get('/getAllSaloons',getAllSaloons)
routes.get('/getstates',getStateanddistrict)
routes.get('/getbyid/:id',getSaloonById)
routes.get('/getstate', getStates);
routes.put('/update/:id',upload.single("image"),updateSaloon);
routes.delete('/delete/:id', deleteSaloon);
routes.get('/getDistricts/:stateId', getDistrictsByState);
module.exports=routes