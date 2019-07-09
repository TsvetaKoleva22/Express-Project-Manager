const User = require('../models/User');
const Team = require('../models/Team');
const Project = require('../models/Project');

module.exports = {
    projectCreateGet: (req, res) => {
        res.render('project/createProject');
    },
    projectCreatePost: (req, res) => {
        let name = req.body.name;
        let description = req.body.description;
        
        let myProject = new Project({
            name, 
            description
        });

        myProject.save().then(function(resultProject){
            res.redirect('/');
        }).catch(function(err){
            console.log(err);
        })
    },

    projectManageGet: (req, res) => {
        Team.find({}).then(function(resultTeams){
            Project.find({ team: null }).then(function(resultProjects){
                res.render('project/manageProjects', {
                    teamsArr: resultTeams,
                    projectsArr: resultProjects
                });
            })
        }).catch(function(err){
            console.log(err);
        })    
    },
    projectManagePost: (req, res) => {
        let teamSelected = req.body.teamSelected;
        let projectSelected = req.body.projectSelected;
        
        Project.findById(projectSelected).then(function(resultProject){
            resultProject.team = teamSelected;
            resultProject.save();
        }).catch(function(err){
            console.log(err);
        })

        Team.findById(teamSelected).then(function(resultTeam){
            resultTeam.projects.push(projectSelected);
            resultTeam.save();
        }).catch(function(err){
            console.log(err);
        })

        res.redirect('/');
    },

    projectAllGet: (req, res) => {
        Project.find({})
        .populate('team')
        .then(function(resultProjects){
            res.render('project/all', {projectsArr: resultProjects})
        }).catch(function(err){
            console.log(err);
        })
    },

    projectSearchPost: (req, res) => {
        let searchedProject = req.body.searchedProject.toLowerCase();

        Project.find({})
        .populate('team')
        .then(function(resultProjects){
            let foundProjects = resultProjects.filter(p => p.name.toLowerCase().includes(searchedProject));
            res.render('project/all', {projectsArr: foundProjects})
        }).catch(function(err){
            console.log(err);
        })
    },
};