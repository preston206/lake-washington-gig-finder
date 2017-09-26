// get ONE job by ID
function getOneJob(callbackFn) {

    let id = $('#edit-job-id').val();
    let url = "http://localhost:8080/jobs/getone/" + id;

    $.ajax({
        url: url,
        id: id,
        success: callbackFn
    });
};

// get ALL job posts
function getAllJobs(callbackFn) {
    let url = "http://localhost:8080/jobs/"

    // local storage test
    // let localStorage;
    // try {
    //     localStorage = window.localStorage;
    //     console.log("localStorage allowed.");
    // }
    // catch (error) {
    //     console.log("localStorage denied.");
    // };

    $.ajax({
        url: url,
        success: callbackFn
    });
};

// delete ONE job by ID
function deleteOneJob() {
    let id = $('#edit-job-id').val();
    let url = "http://localhost:8080/jobs/delete/" + id;

    $.ajax({
        url: url,
        id: id,
        method: "DELETE",
        success: function () {
            console.info("job has been deleted.");
        }
    });
};

// EDIT PAGE
// populate the edit page with info from ONE job post
function populateEditPageFields(data) {
    $('#edit-company').val(data.company);
    $('#edit-title').val(data.title);
    $('#edit-salary').val(data.salary);
    $('#edit-region').val(data.region);
    $('#edit-city').val(data.city);
    $('#edit-email').val(data.email);
    $('#edit-technologies').val(data.technologies);
    $('#edit-description').val(data.description);
};

// FIND PAGE
// display ALL job posts on find.html
function displayAllJobs(data) {

    let results = [];

    let jobCheck = $('#job-listings').html();

    if (jobCheck) {
        $('#job-listings').empty();
        $('#job-description').empty();
    };

    data.map(function (job) {

        let date = new Date(job.postDate);
        let month = date.getMonth();
        let day = date.getDate();

        if (month) {
            month++
            switch (month) {
                case 1:
                    month = "January";
                    break;
                case 2:
                    month = "February";
                    break;
                case 3:
                    month = "March";
                    break;
                case 4:
                    month = "April";
                    break;
                case 5:
                    month = "May";
                    break;
                case 6:
                    month = "June";
                    break;
                case 7:
                    month = "July";
                    break;
                case 8:
                    month = "August";
                    break;
                case 9:
                    month = "September";
                    break;
                case 10:
                    month = "October";
                    break;
                case 11:
                    month = "November";
                    break;
                case 12:
                    month = "December";
                    break;
            };
        };

        let jobPostHtml = $(`<div class="job-post-wrap">
        <p class="job-post">
        <span class="job-post-date">${month} ${day}</span><br />
        ${job.city}<br />
        ${job.salary}<br />
        ${job.company}<br />
        ${job.title}<br />
        ${job.technologies}<br />
        <span class="job-post-id">${job.id}</span></p></div>`);

        let jobDescriptionHtml = $(`<p class="job-description">
        <span class="job-description-date">${month} ${day}</span><br />
        ${job.city}<br />
        ${job.salary}<br />
        ${job.company}<br />
        ${job.title}<br />
        ${job.technologies}<br />
        <span class="job-description-id">${job.id}</span></p>`);

        $(jobPostHtml).each(function (event) {
            $(this).on('click', function () {
                // console.log("this is a test!");
                $('#job-description').html(jobDescriptionHtml);
            });
        });

        results.push(jobPostHtml);
    });

    $('#job-listings').html(results);
};


// DOC READY FUNCTIONS
$(function () {
    // find.html - refresh job list
    $('#btn-refresh-jobs').click(() => {
        getAllJobs(displayAllJobs);
    });

    // edit.html - populate fields with job data
    $('#btn-fill-edit-page').click(() => {
        getOneJob(populateEditPageFields);
    });

    // delete job task
    $('#btn-delete-job-post').click(() => {
        deleteOneJob();
    });

    // index.html - login form handler
    $('#form-login').submit(function (event) {
        event.preventDefault();

        const formData = $(event.target);
        const username = formData.find('[name=username]').val().trim();
        const password = formData.find('[name=password]').val().trim();
        const base64encoded = window.btoa(username + ':' + password);
        console.log(username, password);
        console.log(base64encoded);

        $.ajax({
            type: 'POST',
            url: '/auth/login',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Basic ' + base64encoded);
            },
            error: function (error) {
                alert("a login error occurred.");
                // console.log(error);
            },
            success: function (jqXHR) {
                localStorage.setItem('authToken', jqXHR.authToken);
                window.location.href = "find.html";
                // console.log("logged in.");
                // console.log(jqXHR);
                // let authToken = jqXHR.authToken;
                // console.log("authToken: ", authToken);
                // console.log("from local storage: ", localStorage.getItem('authToken'));
            }
        })
    });

    // job post authorization
    $('#btn-goToPost').click(function (event) {
        event.preventDefault();

        let postAuthToken = localStorage.getItem('authToken');
        console.log(postAuthToken);

        $.ajax({
            type: 'GET',
            url: '/auth/post',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + postAuthToken);
            },
            error: function (error) {
                console.log("error getting post.html");
                console.log(error);
            },
            success: function (jqXHR) {
                // localStorage.setItem('authToken', jqXHR.authToken);
                window.location.href = "post.html";
            }
        })
    });

    console.log("document is ready");
});