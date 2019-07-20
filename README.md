# Express-Project-Manager
### Final Express Exam Project

The project uses Express as a back-end framework, MongoDB as a database with Mongoose and Handlebars as a view engine. It is an application for managing projects and the teams in them.

**Guest** (not logged in) users are able to login, register and view the Home page.

**Logged in users** can logout, view all teams, view all projects, view their profile and leave a team.

**The Admin** (seeded at the start of the application) can logout, distribute teams, distribute projects, create teams, create projects and  view their profile.

The app offers the following *views*:

* Guest pages - **Index page**, **Login page**, **Register page**.
* User pages - **Projects page** (shows all projects with their teams and description), **Teams page** (shows all teams with their members and projects), **Profile page** (with picture, My teams and My projects).
* Admin pages - **Create team page**, **Create project page**, **Admin Projects page** for distributing projects to the teams(the dropdown for the projects contains only projects that do not yet have a team), **Admin Teams page** for distributing users to the existing teams(each user can be in many teams).

Each page has access security restrictions (for example a guest cannot access Projects page, etc.)

As a bonus feature, the app supports two searching options - an user can search in teams or in projects for a certain string.

  
