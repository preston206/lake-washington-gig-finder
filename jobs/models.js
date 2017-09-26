const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// ----- Job Model -----
const JobSchema = mongoose.Schema({
    company: {
        type: String
    },
    title: {
        type: String
    },
    salary: {
        type: String
    },
    region: {
        type: String
    },
    city: {
        type: String
    },
    email: {
        type: String
    },
    technologies: {
        type: Array
    },
    description: {
        type: String
    }
},
    {
        timestamps: {
            type: Date,
            createdAt: 'postDate'
        }
    });

JobSchema.methods.apiRepr = function () {
    return {
        id: this._id,
        postDate: this.postDate || '',
        company: this.company || '',
        title: this.title || '',
        salary: this.salary || '',
        region: this.region || '',
        city: this.city || '',
        email: this.email || '',
        technologies: this.technologies || '',
        description: this.description || ''
    }
}

const Job = mongoose.model('Job', JobSchema);

module.exports = { Job }