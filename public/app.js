// creating mock job search data
const mockJobSearchData = {
    "jobs": [
        {
            "id": "001",
            "postDate": "8/22/17",
            "company": "Tech World",
            "title": "Front-End Engineer",
            "technologies": "HTML, CSS, jQuery"
        },
        {
            "id": "002",
            "postDate": "8/23/17",
            "company": "Cyber-JS",
            "title": "Node Engineer",
            "technologies": "Node, Express, Mongoose"
        },
        {
            "id": "003",
            "postDate": "8/24/17",
            "company": "Code Lab",
            "title": "UX Designer",
            "technologies": "HTML, CSS, Bootstrap"
        },
        {
            "id": "004",
            "postDate": "8/25/17",
            "company": "Web Leet",
            "title": "MongoDB Admin",
            "technologies": "JavaScript, Express, Mongoose, MongoDB"
        }
    ]
};

// "id": "004",
// "postDate": "8/25/17",
// "company": "Web Leet",
// "title": "MongoDB Admin",
// "description": "Lorem eiusmod aliquip proident Ipsum incididunt enim irure" +
// "incididunt aute laboris reprehenderit laborum qui. Laborum pariatur velit enim ut ut" +
// "in aliquip. Quis anim tempor dolore fugiat velit mollit magna labore."

function getJobs(callbackFn) {
    setTimeout(function () { callbackFn(mockJobSearchData) }, 200);
};

// this function stays the same when we connect to a real API later
function displayJobs(data) {

    data.jobs.map(function (job) {

        let html = $(`<p><b>${job.id}</b><br />
        ${job.postDate}<br />
        ${job.company}<br />
        ${job.title}<br />
        ${job.technologies}</p>`);

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