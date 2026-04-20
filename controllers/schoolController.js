const db = require('../db');
const calculateDistance = require('../utils/distance');

// ➤ ADD SCHOOL
const addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Validation
  if (!name || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required: name, address, latitude, longitude'
    });
  }

  if (typeof name !== 'string' || typeof address !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Name and address must be strings'
    });
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({
      success: false,
      message: 'Latitude and longitude must be valid numbers'
    });
  }

  if (lat < -90 || lat > 90) {
    return res.status(400).json({
      success: false,
      message: 'Latitude must be between -90 and 90'
    });
  }

  if (lon < -180 || lon > 180) {
    return res.status(400).json({
      success: false,
      message: 'Longitude must be between -180 and 180'
    });
  }

  const sql = `
    INSERT INTO schools (name, address, latitude, longitude)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name.trim(), address.trim(), lat, lon], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error while adding school',
        error: err.message
      });
    }

    return res.status(201).json({
      success: true,
      message: 'School added successfully',
      schoolId: result.insertId
    });
  });
};

// ➤ LIST SCHOOLS (SORTED BY DISTANCE)
const listSchools = (req, res) => {
  const { latitude, longitude } = req.query;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      success: false,
      message: 'User latitude and longitude are required'
    });
  }

  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);

  if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({
      success: false,
      message: 'Latitude and longitude must be valid numbers'
    });
  }

  const sql = 'SELECT * FROM schools';

  db.query(sql, (err, schools) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error while fetching schools',
        error: err.message
      });
    }

    const sortedSchools = schools
      .map((school) => ({
        ...school,
        distance_km: calculateDistance(
          userLat,
          userLon,
          school.latitude,
          school.longitude
        )
      }))
      .sort((a, b) => a.distance_km - b.distance_km);

    return res.status(200).json({
      success: true,
      count: sortedSchools.length,
      data: sortedSchools
    });
  });
};

module.exports = {
  addSchool,
  listSchools
};