const mongoose = require('mongoose');
const encryption = require('../util/encryption');

const userSchema = new mongoose.Schema({
    username: { type: mongoose.Schema.Types.String, required: true, unique: true },
    hashedPass: { type: mongoose.Schema.Types.String, required: true },
    salt: { type: mongoose.Schema.Types.String, required: true },
    firstName: { type: mongoose.Schema.Types.String, required: true },
    lastName: { type: mongoose.Schema.Types.String, required: true },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    imageUrl: { type: mongoose.Schema.Types.String, default: 'https://www.blogsaays.com/wp-content/uploads/2014/02/no-user-profile-picture-whatsapp.jpg'},
    roles: [{ type: mongoose.Schema.Types.String }]
});


userSchema.method({
    authenticate: function (password) {
        return encryption.generateHashedPassword(this.salt, password) === this.hashedPass;
    }
});

const User = mongoose.model('User', userSchema);

User.seedAdmin = async function (){
    try {
        let users = await User.find({});
        if(users.length > 0 ){
            return;
        }

        let salt = encryption.generateSalt();
        let hashedPass = encryption.generateHashedPassword(salt, 'admin123');

        return User.create({ 
            username: 'admin',
            hashedPass,
            salt, 
            firstName: 'Tsveta',
            lastName: 'Koleva',
            teams: [],
            imageUrl: 'https://www.wbkidsgo.com/Portals/4/Images/Content/Characters/Scooby/scooby-SD_headShot.png',
            roles: ['Admin']
        })
    } catch (err){
        console.log(err);
    }
}

module.exports = User;
