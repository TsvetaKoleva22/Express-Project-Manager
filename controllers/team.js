const User = require('../models/User');
const Team = require('../models/Team');
const Project = require('../models/Project');

module.exports = {
    teamCreateGet: (req, res) => {
        res.render('team/createTeam');
    },
    teamCreatePost: (req, res) => {
        let name = req.body.name;

        let myTeam = new Team({
            name,
            projects: [],
            members: []
        });

        myTeam.save().then(function (resultTeam) {
            res.redirect('/');
        }).catch(function (err) {
            console.log(err);
        })
    },

    teamManageGet: (req, res) => {
        Team.find({}).then(function (resultTeams) {
            User.find({}).then(function (resultUsers) {
                res.render('team/manageTeams', {
                    teamsArr: resultTeams,
                    usersArr: resultUsers
                });
            })
        }).catch(function (err) {
            console.log(err);
        })
    },
    teamManagePost: (req, res) => {
        let userSelected = req.body.userSelected;
        let teamSelected = req.body.teamSelected;

        Team.findById(teamSelected).then(function (resultTeam) {
            User.findById(userSelected).then(function (resultUser) {

                if(resultTeam.members.length > 0){
                    for (let member of resultTeam.members) {
                        if (member.toString() === resultUser._id.toString()) {
                            console.log('User is already in this team!');
                            res.redirect('/team/manage');
                            return;
                        } 
                    }
                } 
                
                resultTeam.members.push(userSelected);
                resultTeam.save();
                resultUser.teams.push(teamSelected);
                resultUser.save();
                res.redirect('/');
            })
        }).catch(function (err) {
            console.log(err);
        })
    },


    teamAllGet: (req, res) => {
        Team.find({})
        .populate('projects')
        .populate('members')
        .then(function(resultTeams){
            res.render('team/allTeams', {teamsArr: resultTeams})
        }).catch(function(err){
            console.log(err);
        })
    },

    teamLeavePost: (req, res) => {
        let teamId = req.params.teamId;
        let userId = req.user._id;
        Team.findById(teamId)
        .then(function(resultTeam){
            resultTeam.members = resultTeam.members.filter(m => m.toString() !== userId.toString());
            resultTeam.save();
        }).catch(function(err){
            console.log(err);
        })

        User.findById(userId)
        .then(function(resultUser){
            resultUser.teams = resultUser.teams.filter(t => t.toString() !== teamId.toString());
            resultUser.save();
        }).catch(function(err){
            console.log(err);
        })

        res.redirect('/');
    },

    teamSearchPost: (req, res) => {
        let searchedTeam = req.body.searchedTeam.toLowerCase();

        Team.find({})
        .populate('projects')
        .populate('members')
        .then(function(resultTeams){
            let foundTeams = resultTeams.filter(t => t.name.toLowerCase().includes(searchedTeam));
            res.render('team/allTeams', {teamsArr: foundTeams})
        }).catch(function(err){
            console.log(err);
        })
    },

};