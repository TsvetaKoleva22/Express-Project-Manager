const restrictedPages = require('./auth');
const homeController = require('../controllers/home');
const userController = require('../controllers/user');
const teamController = require('../controllers/team');
const projectController = require('../controllers/project');


module.exports = app => {
    app.get('/', homeController.index);

    app.get('/user/register', restrictedPages.isAnonymous, userController.registerGet);
    app.post('/user/register', restrictedPages.isAnonymous, userController.registerPost);
    app.get('/user/login', restrictedPages.isAnonymous, userController.loginGet);
    app.post('/user/login', restrictedPages.isAnonymous, userController.loginPost);
    app.post('/user/logout', restrictedPages.isAuthed, userController.logout);

    app.get('/team/create', restrictedPages.hasRole('Admin'), teamController.teamCreateGet);
    app.post('/team/create', restrictedPages.hasRole('Admin'), teamController.teamCreatePost);

    app.get('/project/create', restrictedPages.hasRole('Admin'), projectController.projectCreateGet);
    app.post('/project/create', restrictedPages.hasRole('Admin'), projectController.projectCreatePost);

    app.get('/project/manage', restrictedPages.hasRole('Admin'), projectController.projectManageGet);
    app.post('/project/manage', restrictedPages.hasRole('Admin'), projectController.projectManagePost);

    app.get('/team/manage', restrictedPages.hasRole('Admin'), teamController.teamManageGet);
    app.post('/team/manage', restrictedPages.hasRole('Admin'), teamController.teamManagePost);

    app.get('/project/all', restrictedPages.isAuthed, projectController.projectAllGet);

    app.get('/team/all', restrictedPages.isAuthed, teamController.teamAllGet);

    app.get('/user/profile', restrictedPages.isAuthed, userController.myProfileGet);

    app.post('/team/leave/:teamId', restrictedPages.isAuthed, teamController.teamLeavePost);


    app.post('/team/search', restrictedPages.isAuthed, teamController.teamSearchPost);
    app.post('/project/search', restrictedPages.isAuthed, projectController.projectSearchPost);



    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};