const connection = require("../config/connection");
const axios = require("axios");

const addSaloons =async (req, res) => {
  const { name, address, phone,pincode,city, state_id, district_id,email,gender_served } = req.body;
  console.log(req.body);
  
  const country_id=1
  const image = req.file ? req.file.filename : null;
  try {
   await connection.query(
      `INSERT INTO salons (name, address, phone, pincode, city, country_id, email, state_id, district_id, image,gender_served, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, NOW())`,
      [name, address, phone, pincode, city, country_id, email, state_id, district_id, image,gender_served],
      async (err, result) => {
        if (err) {
          console.error(err);
          return res.json({ success: false, error: err.message });
        }

       
        res.json({ success: true });
      }
    );
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
}














const getAllSaloons = (req, res) => {
  const sql = `
    SELECT 
      s.salon_id,
      s.user_id,
      s.name,
      s.address,
      s.email,
      s.gender_served,
      s.country_id,
      s.state_id,
      st.name AS state_name,
      s.district_id,
      d.name AS district_name,
      s.city,
      s.pincode,
      s.phone,
      s.image,
      s.created_at,
      s.status
    FROM salons s
    LEFT JOIN states st ON s.state_id = st.state_id
    LEFT JOIN districts d ON s.district_id = d.district_id
    ORDER BY s.created_at DESC
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching saloons:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};
     

const getSaloonById = async (req, res) => {
  const { id } = req.params;
console.log(id);

  const query = `SELECT * FROM salons WHERE salon_id = ?`;
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching saloon:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Saloon not found" });
    }

    // Return the first item (since ID is unique)
    res.json({ success: true, saloon: results[0] });
  });
};



const getStateanddistrict = async (req, res) => {
  try {
    const statesSql = `SELECT * FROM states ORDER BY name ASC`;
    connection.query(statesSql, (err, states) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ states: [], districts: [] });
      }

      const districtsSql = `SELECT * FROM districts ORDER BY name ASC`;
      connection.query(districtsSql, (err, districts) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ states: [], districts: [] });
        }

        // Send both states and districts together
        res.json({ states, districts });
        
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ states: [], districts: [] });
  }
};


const updateSaloon = async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, pincode, city, email, state_id, district_id,gender_served } = req.body;
  const image = req.file ? req.file.filename : null;
console.log(req.body);

  try {
    let query, params;
    if (image) {
      query = `
        UPDATE salons
        SET name=?, address=?, phone=?, pincode=?, city=?, email=?, state_id=?, district_id=?, image=?, gender_served=?
        WHERE salon_id=?
      `;
      params = [name, address, phone, pincode, city, email, state_id, district_id, image,gender_served, id];
    } else {
      query = `
        UPDATE salons
        SET name=?, address=?, phone=?, pincode=?, city=?, email=?, state_id=?, district_id=?, gender_served=?
        WHERE salon_id=?
      `;
      params = [name, address, phone, pincode, city, email, state_id, district_id,gender_served, id];
    }

    await connection.query(query, params);
    res.json({ success: true, message: "Saloon updated successfully" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error updating saloon" });
  }
};


const deleteSaloon = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM salons WHERE salon_id = ?`;

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: 'Error deleting saloon' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Saloon not found' });
    }
    res.json({ success: true, message: 'Saloon deleted successfully' });
  });
};


const getDistrictsByState = async (req, res) => {
  const { stateId } = req.params;
  try {
    const query = `SELECT * FROM districts WHERE state_id = ?`;
    const [rows] = await connection.query(query, [stateId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
};

// Get all states
const getStates = async (req, res) => {
  const query = `SELECT * FROM states ORDER BY name`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching states:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ success: false, message: "No states found" });
    }

    res.json({ success: true, states: results });
    console.log("Fetched states:", results);
  });
};



const getTotalSaloons = async () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT COUNT(*) AS total_salons FROM salons", (err, results) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      resolve(results[0].total_salons);
    });
  });
};




module.exports = { getAllSaloons ,getStateanddistrict,addSaloons,getSaloonById,getDistrictsByState,getStates,
  updateSaloon,
  deleteSaloon,getTotalSaloons
};
