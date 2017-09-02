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
    update: function (itemObject) {
        console.log(`updating job id ${itemObject.id}...`);
        const { id } = itemObject;
        if (!(id in this.items)) {
            throw StorageException(`Can't update item, because ${id} doesn't exist.`);
        };
        this.items[itemObject.id] = itemObject;
        return itemObject;
    },
    delete: function (id) {
        console.log(`Deleting job id ${id}...`);
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