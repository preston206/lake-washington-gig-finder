const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// ----- Job Model -----
const JobSchema = mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    technologies: {
        type: Array,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    postedBy: {
        type: String,
        required: true
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
        description: this.description || '',
        postedBy: this.postedBy || ''
    }
}

const Job = mongoose.model('Job', JobSchema);

module.exports = { Job }