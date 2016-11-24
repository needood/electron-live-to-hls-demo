const Datastore = require('nedb')
const db = new Datastore({ filename: `${__dirname}/../store`,autoload: true });
module.exports = db
