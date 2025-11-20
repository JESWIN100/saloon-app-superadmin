const connection = require("../config/connection");

// Get all bookings (with optional date filter)
const Bookings = async (req, res) => {
  try {
    const { date } = req.query;
    const params = [];

    let sql = `
      SELECT 
        bm.booking_id,
        bm.booking_date,
        bm.status AS booking_status,
        bm.payment_status,
        bm.total_amount,
        bm.customer_id,
        bm.salon_id,
        u.name AS customer_name,
        u.email,
        u.mobile,
        u.role AS customer_role,
        bd.detail_id,
        bd.service_id,
        bd.slot_id,
        bd.start_time,
        bd.end_time,
        bd.amount AS service_amount,
        bd.status AS service_status,
        s.slot_date,
        sa.name AS salon_name,
        sa.address AS salon_address,
        se.name AS service_name,
        se.price AS service_price
      FROM booking_master bm
      LEFT JOIN users u ON bm.customer_id = u.user_id
      LEFT JOIN booking_details bd ON bm.booking_id = bd.booking_id
      LEFT JOIN slots s ON bd.slot_id = s.slot_id
      LEFT JOIN salons sa ON bm.salon_id = sa.salon_id
      LEFT JOIN services se ON bd.service_id = se.service_id
    `;

    if (date) {
      sql += ` WHERE DATE(bm.booking_date) = ? `;
      params.push(date);
    }

    sql += ` ORDER BY bm.booking_date ASC, bd.start_time ASC `;

    connection.query(sql, params, (err, results) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).json({ error: "Database query failed" });
      }

      // Group services under each booking
      const grouped = {};
      results.forEach(row => {
        if (!grouped[row.booking_id]) {
          grouped[row.booking_id] = {
            booking_id: row.booking_id,
            booking_date: row.booking_date,
            status: row.booking_status,
            payment_status: row.payment_status,
            total_amount: row.total_amount,
            name: row.customer_name, // from users table
            customer: row.customer_id ? {
              id: row.customer_id,
              email: row.email,
              mobile: row.mobile,
              role: row.customer_role
            } : null,
            salon: row.salon_id ? {
              salon_id: row.salon_id,
              name: row.salon_name,
              address: row.salon_address
            } : null,
            services: []
          };
        }

        if (row.detail_id) {
          grouped[row.booking_id].services.push({
            detail_id: row.detail_id,
            service_id: row.service_id,
            name: row.service_name,
            price: row.service_price,
            slot_id: row.slot_id,
            slot_date: row.slot_date,
            start_time: row.start_time,
            end_time: row.end_time,
            amount: row.service_amount,
            status: row.service_status
          });
        }
      });

      res.json(Object.values(grouped));
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send("Server error");
  }
};

// Get today’s bookings count
const todayBookingsCount = async () => {
  try {
    const sql = `SELECT COUNT(*) AS today_bookings_count FROM booking_master WHERE DATE(booking_date) = CURDATE()`;
    return new Promise((resolve, reject) => {
      connection.query(sql, (err, results) => {
        if (err) return reject(err);
        resolve(results[0].today_bookings_count);
      });
    });
  } catch (error) {
    console.error(error);
    return 0;
  }
};

// Get total revenue
const totalRevenue = async () => {
  try {
    const sql = `SELECT SUM(total_amount) AS total_revenue 
      FROM booking_master
      WHERE status != 'cancelled'`;
    return new Promise((resolve, reject) => {
      connection.query(sql, (err, results) => {
        if (err) return reject(err);
        resolve(results[0].total_revenue || 0);
      });
    });
  } catch (error) {
    console.error(error);
    return 0;
  }
};

// Get latest 6 bookings
const getLatestBookings = async (req, res) => {
  try {
    const sql = `
      SELECT 
        bm.booking_id,
        bm.booking_date,
        bm.status AS booking_status,
        bm.payment_status,
        bm.total_amount,
        bm.customer_id,
        bm.salon_id,
        u.name AS customer_name,
        u.email,
        u.mobile,
        u.role AS customer_role,
        bd.detail_id,
        bd.service_id,
        bd.slot_id,
        bd.start_time,
        bd.end_time,
        bd.amount AS service_amount,
        bd.status AS service_status,
        s.slot_date,
        sa.name AS salon_name,
        sa.address AS salon_address,
        se.name AS service_name,
        se.price AS service_price
      FROM booking_master bm
      LEFT JOIN users u ON bm.customer_id = u.user_id
      LEFT JOIN booking_details bd ON bm.booking_id = bd.booking_id
      LEFT JOIN slots s ON bd.slot_id = s.slot_id
      LEFT JOIN salons sa ON bm.salon_id = sa.salon_id
      LEFT JOIN services se ON bd.service_id = se.service_id
      ORDER BY bm.booking_date DESC, bd.start_time DESC
      LIMIT 6
    `;

    connection.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: "Database query failed" });

      const grouped = {};
      results.forEach(row => {
        if (!grouped[row.booking_id]) {
          grouped[row.booking_id] = {
            booking_id: row.booking_id,
            booking_date: row.booking_date,
            status: row.booking_status,
            payment_status: row.payment_status,
            total_amount: row.total_amount,
            name: row.customer_name,
            customer: row.customer_id ? {
              id: row.customer_id,
              email: row.email,
              mobile: row.mobile,
              role: row.customer_role
            } : null,
            salon: row.salon_id ? {
              salon_id: row.salon_id,
              name: row.salon_name,
              address: row.salon_address
            } : null,
            services: []
          };
        }

        if (row.detail_id) {
          grouped[row.booking_id].services.push({
            detail_id: row.detail_id,
            service_id: row.service_id,
            name: row.service_name,
            price: row.service_price,
            slot_id: row.slot_id,
            slot_date: row.slot_date,
            start_time: row.start_time,
            end_time: row.end_time,
            amount: row.service_amount,
            status: row.service_status
          });
        }
      });

      res.json(Object.values(grouped));
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send("Server error");
  }
};

module.exports = { Bookings, todayBookingsCount, totalRevenue, getLatestBookings };
