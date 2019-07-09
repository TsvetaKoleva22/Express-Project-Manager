const User = require('../models/User');
const Team = require('../models/Team');
const Project = require('../models/Project');

module.exports = {
    index: (req, res) => {
        res.render('home/index');
    }
};