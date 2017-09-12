const uuid = require('uuid');

function StorageException(message) {
    this.message = message;
    this.name = "StorageException";
};

// job model
const jobs = {
    create: function (company, title, technologies) {
        console.log("creating mock data...");
        const item = {
            id: uuid.v4(),
            company: company,
            title: title,
            technologies: technologies
        };
        this.items[item.id] = item;
        return item;
    },
    get: function () {
        console.log("retrieving jobs...");
        return Object.keys(this.items).map(key => this.items[key]);
    },
    update: function (updatedJob) {
        console.log(`updating job ID ${updatedJob.id}...`);
        const { id } = updatedJob;
        if (!(id in this.items)) {
            throw StorageException(
                `Can't update item, because ${id} doesn't exist.`);
        };
        this.items[updatedJob.id] = updatedJob;
        // console.log(updatedJob);
        return updatedJob;
    },
    delete: function (id) {
        console.log(`Deleting job ID ${id}...`);
        delete this.items[id];
    }
};

function createJobList() {
    const storage = Object.create(jobs);
    storage.items = {};
    return storage;
};

module.exports = {
    jobs: createJobList()
}