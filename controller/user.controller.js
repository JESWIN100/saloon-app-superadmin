const connection = require("../config/connection");

const getAllUsers = async (req, res) => {
  try {
     connection.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
    
    
    res.status(200).json({ success: true, results });
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getTotalUsers = async () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT COUNT(*) AS total_users FROM users", (err, results) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      resolve(results[0].total_users);
    });
  });
};




module.exports = { getAllUsers,getTotalUsers };