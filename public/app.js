// get ONE job post by ID
function getOneJob(callbackFn) {

    let id = $('#edit-job-id').val();
    let url = "http://localhost:8080/jobs/getone/" + id;

    $.ajax({
        url: url,
        success: callbackFn
    });
};

// get ALL job posts
function getAllJobs(callbackFn) {

    // console.log("starting function...");

    //     $.ajax({
    //         method: 'GET',
    //         url: 'http://localhost:8080/jobs/',
    //         error: function (error) {
    //             console.error("an error occurred.");
    //         },
    //         success: function () {
    //             console.log("your data is ready.");
    //         }
    //     });

    //     console.log("have you got your data yet?");


    let url = "http://localhost:8080/jobs/"

    $.ajax({
        url: url,
        success: callbackFn
    });
};

// delete ONE job post by ID
function deleteOneJob() {
    let id = $('#edit-job-id').val();
    let url = "http://localhost:8080/jobs/delete/" + id;

    // $.ajax({
    //     url: url,
    //     id: id,
    //     method: "DELETE",
    //     success: function () {
    //         console.info("job has been deleted.");
    //     }
    // });

    $.ajax({
        url: url,
        method: "DELETE",
        success: function () {
            console.info("job has been deleted.");
        }
    });
};

// INDEX PAGE
// login handler
function login() {
    const formData = $(event.target);
    const username = formData.find('[name=username]').val().trim();
    const password = formData.find('[name=password]').val().trim();
    const base64encoded = window.btoa(username + ':' + password);
    // console.log(username, password);
    // console.log(base64encoded);

    let localStorage;
    let noLocalStorage;
    try {
        localStorage = window.localStorage;
    } catch (error) {
        let noLocalStorage = true;
    };

    $.ajax({
        method: 'POST',
        url: '/auth/login',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + base64encoded);
        },
        error: function (error) {
            alert("a login error occurred.");
            // console.log(error);
        },
        success: function (jqXHR) {
            // console.log(jqXHR);
            if (noLocalStorage) {
                console.info("unable to access local storage");
            }
            else {
                localStorage.setItem('authToken', jqXHR.authToken);
                localStorage.setItem('userId', jqXHR.id);
            };
            window.location.href = "find.html";
            // console.log("logged in.");
            // console.log("authToken: ", authToken);
            // console.log("from local storage: ", localStorage.getItem('authToken'));
        }
    });
    alert("have you logged in yet?");
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

// POST PAGE
// send job data to jobs POST endpoint
function postJob() {
    let url = "http://localhost:8080/jobs/post/";

    let technologies = $('#post-technologies').val();

    if (typeof technologies === "string") {
        technologies = technologies.split(",");
    };

    technologies.map(function (technology, index) {
        technologies[index] = technology.trim();
    });

    let userIdFromLocalStorage = localStorage.userId;

    let data = {
        company: $('#post-company').val(),
        title: $('#post-title').val(),
        salary: $('#post-salary').val(),
        region: $('#post-region').val(),
        city: $('#post-city').val(),
        email: $('#post-email').val(),
        technologies: technologies,
        description: $('#post-description').val(),
        postedBy: userIdFromLocalStorage || ''
    };

    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        success: function () {
            console.info("from AJAX call: job has been posted.");
        }
    });
};

// EDIT PAGE
// populate the edit page with data from ONE job post
function populateEditPageFields(data) {
    $('#edit-company').val(data.company);
    $('#edit-title').val(data.title);
    $('#edit-salary').val(data.salary);
    $('#edit-region').val(data.region);
    $('#edit-city').val(data.city);
    $('#edit-email').val(data.email);
    console.log(data.technologies);
    $('#edit-technologies').val(data.technologies);
    $('#edit-description').val(data.description);
};

// send updated job data to jobs PUT endpoint
function updateJob() {
    let id = $('#edit-job-id').val();
    let url = "http://localhost:8080/jobs/update/" + id;

    let technologies = $('#edit-technologies').val();

    if (typeof technologies === "string") {
        technologies = technologies.split(",");
    };

    technologies.map(function (technology, index) {
        technologies[index] = technology.trim();
    });

    let data = {
        id: id,
        company: $('#edit-company').val(),
        title: $('#edit-title').val(),
        salary: $('#edit-salary').val(),
        region: $('#edit-region').val(),
        city: $('#edit-city').val(),
        email: $('#edit-email').val(),
        technologies: technologies,
        description: $('#edit-description').val()
    };

    $.ajax({
        method: "PUT",
        url: url,
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        success: function () {
            console.info("from AJAX call: job has been updated.");
        }
    });
};


// DOC READY FUNCTIONS
$(function () {
    // index.html - login form handler
    $('#form-login').submit(function (event) {
        event.preventDefault();
        login();
    });

    // find.html - get all jobs / refresh job list
    $('#btn-refresh-jobs').click(() => {
        getAllJobs(displayAllJobs);
    });

    // post.html - submit job post
    $('#form-job-post').submit(function (event) {
        event.preventDefault();
        postJob();
    });

    // edit.html - populate fields with job data
    $('#btn-fill-edit-page').click(() => {
        getOneJob(populateEditPageFields);
    });

    // edit.html - disable\enable delete button
    $('#checkbox-edit-delete').on('change', function () {
        if ($('#checkbox-edit-delete').prop("checked")) {
            $('#btn-delete-job-post').attr("disabled", false);
        }
        else {
            $('#btn-delete-job-post').attr("disabled", true);
        }
    });

    // edit.html - send updated job data
    $('#form-job-edit').submit(function (event) {
        event.preventDefault();
        updateJob();
    });

    // edit.html - enable fields upon imported job data; and disable job id input
    $('#btn-fill-edit-page').click(function () {
        $('#edit-job-id').attr("disabled", true);
        $('.disabled-input').attr("disabled", false);
    });

    // delete one job post
    $('#btn-delete-job-post').click(() => {
        deleteOneJob();
    });

    // job post authorization
    $('#btn-goToPost').click(function (event) {
        event.preventDefault();

        let postAuthToken = localStorage.getItem('authToken');
        console.log(postAuthToken);

        $.ajax({
            method: 'GET',
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
        });
    });

    console.log("document is ready");
});