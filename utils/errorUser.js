const axios = require('axios');

app.get('/admin/errors', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:4040/errors');
    res.render('errors', { errors: response.data });
  } catch (err) {
    res.send('Failed to fetch errors');
  }
});
