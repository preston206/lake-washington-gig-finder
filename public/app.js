// creating mock job search data
const mockJobSearchData = {
    "jobs": [
        {
            "id": "001",
            "postDate": "8/22/17",
            "company": "Tech World",
            "title": "Front-End Engineer",
            "description": "Ipsum incididunt enim irure Lorem eiusmod aliquip proident" +
            "incididunt aute laboris reprehenderit laborum qui. Laborum pariatur velit enim ut ut" +
            "in aliquip. Quis anim tempor dolore fugiat velit mollit magna labore."
        },
        {
            "id": "002",
            "postDate": "8/23/17",
            "company": "Cybercoders",
            "title": "Node Engineer",
            "description": "Incididunt enim irure Lorem eiusmod aliquip proident" +
            "incididunt aute laboris reprehenderit Ipsum laborum qui. Laborum pariatur velit enim ut ut" +
            "in aliquip. Quis anim tempor dolore fugiat velit mollit magna labore."
        },
        {
            "id": "003",
            "postDate": "8/24/17",
            "company": "Code Lab",
            "title": "UX Designer",
            "description": "Enim irure Lorem eiusmod aliquip proident Ipsum incididunt" +
            "incididunt aute laboris reprehenderit laborum qui. Laborum pariatur velit enim ut ut" +
            "in aliquip. Quis anim tempor dolore fugiat velit mollit magna labore."
        },
        {
            "id": "004",
            "postDate": "8/25/17",
            "company": "Web Leet",
            "title": "MongoDB Admin",
            "description": "Lorem eiusmod aliquip proident Ipsum incididunt enim irure" +
            "incididunt aute laboris reprehenderit laborum qui. Laborum pariatur velit enim ut ut" +
            "in aliquip. Quis anim tempor dolore fugiat velit mollit magna labore."
        }
    ]
};

function getJobs(callbackFn) {
    setTimeout(function () { callbackFn(mockJobSearchData) }, 200);
};

// this function stays the same when we connect to a real API later
function displayJobs(data) {

    data.jobs.map(function (job) {

        let html = $(`<p>${job.id}</p>
        <p>${job.postDate}</p>
        <p>${job.company}</p>
        <p>${job.title}</p>
        <p>${job.description}</p>`);

        $('#job-listings').append(html);

    });

};

// this function stays the same when we connect to a real API later
function getAndDisplayJobListings() {
    getJobs(displayJobs);
};

$(function () {
    getAndDisplayJobListings();
    console.log("document is ready");
});