const express = require('express');
const { getServices, addService, updateService, deleteService } = require('../controller/service_name.controller');
const upload = require('../config/multer');
const routes = express.Router();

routes.get('/', (req, res) => {
  res.render('services');
});

routes.post('/add', upload.single('image'), addService);

routes.get('/list', getServices);

routes.post('/update', upload.single('image'), updateService);

routes.get('/delete/:id', deleteService);

module.exports = routes;
