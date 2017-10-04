const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: ""
  },
  savedJobs: {
    type: Array,
    default: []
  }
});

// Future TODO: add a "save job" feature
// it would require a PUT API to push the job ID (this.job.id) to the
// savedJobs array. Then a GET, which would find the user and then return
// the array of saved jobs, and then the job IDs might need to be sent to
// another GET endpoint which would iterate over the array and
// return the data to display on the page.


UserSchema.methods.apiRepr = function () {
  return {
    id: this._id,
    username: this.username || '',
    role: this.role || '',
    savedJobs: this.savedJobs || []
  };
}

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
}

UserSchema.statics.hashPassword = function (password) {
  console.log("password has been hashed.");
  return bcrypt.hash(password, 10);
}

const User = mongoose.model('User', UserSchema);

module.exports = { User };
