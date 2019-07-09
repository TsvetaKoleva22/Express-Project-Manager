const encryption = require('../util/encryption');
const User = require('../models/User');
const Team = require('../models/Team');
const Project = require('../models/Project');


module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },
    registerPost: async (req, res) => {
        let reqUser = req.body;

        if(!reqUser.password || !reqUser.username || !reqUser.firstName || !reqUser.lastName){
            reqUser.error = 'Please fill all fields';
            res.render('user/register', reqUser);
            return;
        }
        if(reqUser.imageUrl === ""){
            reqUser.imageUrl = undefined; //za da sloji default-nata kartinka  
        }

        let salt = encryption.generateSalt();
        let hashedPass = encryption.generateHashedPassword(salt, reqUser.password);

        try{
            const user = await User.create({
                username: reqUser.username,
                hashedPass,
                salt,
                firstName: reqUser.firstName,
                lastName: reqUser.lastName,
                imageUrl: reqUser.imageUrl,
                roles: [ 'User' ] 
            });
            req.logIn(user, function(err){
                if(err){
                    reqUser.error = err;
                    res.render('user/register', reqUser);
                    return;
                } else {
                    res.redirect('/');
                }
            });
        } catch(err){
            reqUser.error = err;
            res.render('user/register', reqUser)
        }       
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    },
    loginGet: (req, res) => {
        res.render('user/login');
    },
    loginPost: async (req, res) => {
        let reqUser = req.body;
        try {
            const user = await User.findOne({username : reqUser.username});
            if(!user){
                reqUser.error = 'Invalid username';
                res.render('user/login', reqUser);
                return;
            }
            if(!user.authenticate(reqUser.password)){
                reqUser.error = 'Invalid password';
                res.render('user/login', reqUser);
                return;
            }
            req.logIn(user, function(err){
                if(err){
                    reqUser.error = err;
                    res.render('user/login', reqUser);
                    return;
                } else {
                    res.redirect('/');
                }
            })
        } catch(err){
            reqUser.error = err;
            res.render('user/login', reqUser)
        }  
    },
    
    myProfileGet: (req, res) => {
        let userId = req.user._id;
        Team.find({})
        .populate('members')
        .populate('projects')
        .then(function(resultTeams){
            let projectsArr = [];
            let teamsArr = [];
            for(let team of resultTeams){
                for(let member of team.members){
                    if(member._id.toString() === userId.toString()){
                        teamsArr.push(team);
                        for(let project of team.projects){
                            projectsArr.push(project);
                        }
                    }
                }

                
            }
            res.render('user/myProfile', {teamsArr, projectsArr, imageUrl : req.user.imageUrl});
        }).catch(function (err){
            console.log(err);
        })
    },
};