const connection = require("../config/connection");

// Add Service
const addService = (req, res) => {
  const { name,gender } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name) {
    return res.status(400).json({ success: false, message: "Service name required" });
  }

  const sql = "INSERT INTO service_names (name,gender, image) VALUES (?, ?, ?)";
  connection.query(sql, [name,gender, image], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err });
    res.status(200).json({ success: true, message: "Service added successfully" });
  });
};

// Get All Services
const getServices = (req, res) => {
  const sql = "SELECT * FROM service_names ORDER BY id DESC";
  connection.query(sql, (err, data) => {
    if (err) return res.status(500).json({ success: false, message: err });
    res.status(200).json({ success: true, services: data });
  });
};

// Update Service
const updateService = (req, res) => {
  const { id, name } = req.body; // use id not service_id
  const image = req.file ? req.file.filename : null;

  if (!id) {
    return res.status(400).json({ success: false, message: "Service ID is required" });
  }

  const sql = "UPDATE service_names SET name=?, image=COALESCE(?, image) WHERE id=?";
  connection.query(sql, [name, image, id], (err) => {
    if (err) return res.status(500).json({ success: false, message: err });
    res.status(200).json({ success: true, message: "Service updated successfully" });
  });
};

// Delete Service
const deleteService = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM service_names WHERE id = ?";
  connection.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ success: false, message: err });
    res.status(200).json({ success: true, message: "Service deleted successfully" });
  });
};

module.exports = {
  addService,
  getServices,
  updateService,
  deleteService
};
