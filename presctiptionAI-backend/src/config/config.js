module.exports.jwtSecret = 'aljnjsnv134213t';

module.exports.sessionSecret = 'fhw982392fwfwq';
module.exports.callbackURL = 'http://localhost:3000/users/auth/google/callback';


module.exports.pg = {
    user: 'postgres',
    host: '127.0.01',
    database: 'prescription-db',
    password: 'Hrhk@4321',
    port: 5432,
};


// config/google.js
module.exports.googleConfig = {
    googleClientID: '',
    googleClientSecret: '',
    callbackURL: ''
};
