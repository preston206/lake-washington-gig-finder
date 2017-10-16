let state = {
    authToken: null,
    userId: null,
    noSessionStorage: false
};

// get ONE job post by ID
function getOneJob(id, callbackFn) {
    let url = "/jobs/getone/" + id;

    $.ajax({
        url: url,
        success: callbackFn
    });
};

// get jobs by user ID
function getJobsByUserId(callbackFn) {

    let id = sessionStorage.userId || state.userId;
    let url = "/jobs/getmyjobs/" + id;

    $.ajax({
        url: url,
        success: callbackFn
    });
};

// get jobs by region
function getJobsByRegion(region, callbackFn) {

    let url = "/jobs/region/" + region;

    $.ajax({
        url: url,
        success: callbackFn
    });
};

// get ALL job posts
function getAllJobs(callbackFn) {

    let url = "/jobs/"

    $.ajax({
        url: url,
        success: callbackFn
    });
};

// INDEX PAGE
// login handler
function login(callbackFn) {
    const formData = $(event.target);
    const username = formData.find('[name=username]').val().trim();
    const password = formData.find('[name=password]').val().trim();
    const base64encoded = window.btoa(username + ':' + password);

    // let sessionStorage;
    let sessionStorage;
    try {
        // sessionStorage = window.sessionStorage;
        sessionStorage = window.sessionStorage
    } catch (error) {
        state.noSessionStorage = true;
    };

    $.ajax({
        method: 'POST',
        url: '/auth/login',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'basic ' + base64encoded);
        },
        error: function (error) {
            alert("A login error occurred.");
            // console.log(error);
        },
        success: callbackFn
    });
};

// save user id and auth token to session storage and app state
function logUserInfo(data) {

    // res.locals.user = req.user;

    // console.log(data);
    // alert(data);

    if (state.noSessionStorage) {
        console.info("Unable to access local session storage.");
    }
    else {
        // sessionStorage.setItem('authToken', data.authToken);
        // sessionStorage.setItem('userId', data.id);
        sessionStorage.setItem('authToken', data.authToken);
        sessionStorage.setItem('userId', data.id);
    };

    state.authToken = data.authToken;
    state.userId = data.id;

    window.location.href = "/find";
};

// FIND PAGE
// display ALL job posts on find.html
function displayAllJobs(data) {

    let results = [];

    let jobCheck = $('#all-job-listings').html();

    if (jobCheck) {
        $('#all-job-listings').empty();
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

        let jobPostHtml = $(`<div class="job-post-wrap mt-1">
            <p class="job-post p-1">
            <span class="font-weight-bold">Posted</span> <span>${month} ${day}</span><br />
            <span class="font-weight-bold">by</span> <span>${job.company}</span><br />
            <span class="font-weight-bold">for</span> <span>${job.title}</span><br />
            <span class="font-weight-bold">region</span> <span>${job.region}</span><br />
            <span class="font-weight-bold">in</span> <span>${job.city}</span><br />
            <span class="font-weight-bold">at</span> <span>${job.salary}</span><br />
            <span class="font-weight-bold">using</span> <span>${job.technologies}</span>
            </p></div>`);

        // <span class="job-post-id">${job.id}</span>

        let jobDescriptionHtml = $(`<p class="job-description">

            <h1 class="display-4">${job.company}</h1>
            <br />

            <span class="font-weight-bold">Posted on:</span><br />
            <span class="lead">${month} ${day}</span>
            <br />
            <br />

            <span class="font-weight-bold">
            Title:</span><br />
            <span class="lead">${job.title}</span>
            <br />
            <br />

            <span class="font-weight-bold">
            Located in:</span><br />
            <span class="lead">${job.city}</span>
            <br />
            <br />

            <span class="font-weight-bold">
            Salary range:</span><br />
            <span class="lead">${job.salary}</span>
            <br />
            <br />

            <span class="font-weight-bold">
            This job uses the following technologies:</span><br />
            <span class="lead">${job.technologies}</span>
            <br />
            <br />

            <span class="font-weight-bold">
            Contact:</span><br />
            <span class="lead">${job.email}</span>
            <br />
            <br />

            <span class="font-weight-bold">
            Job description and other details:</span>
            <br />
            <textarea class="job-description-textarea bg-light lead" readonly>${job.description}</textarea>
            <br />
            
            <hr class="my-3" />

            <small class="job-post-id">Job ID: ${job.id}</small>

            </p>`);

        $(jobPostHtml).each(function (event) {
            $(this).on('click', function () {
                // console.log("this is a test!");
                $('#job-description').html(jobDescriptionHtml);
            });
        });

        results.push(jobPostHtml);
    });

    // The save button is for a future feature. It would
    // send the job ID to a PUT endpoint. See Users model for details.
    // Then the user could display the jobs they've saved on
    // the find page

    // <button type="button" class="btn btn-warning btn-sm" id="save-job">
    // Save
    // </button>
    // <br />

    $('#all-job-listings').html(results);
};

// POST PAGE
// send job data to jobs POST endpoint
function postJob() {
    let url = "/jobs/post/";

    let technologies = $('#post-technologies').val();

    if (typeof technologies === "string") {
        technologies = technologies.split(",");
    };

    technologies.map(function (technology, index) {
        technologies[index] = technology.trim();
    });

    let data = {
        company: $('#post-company').val(),
        title: $('#post-title').val(),
        salary: $('#post-salary').val(),
        region: $('#post-region').val(),
        city: $('#post-city').val(),
        email: $('#post-email').val(),
        technologies: technologies,
        description: $('#post-description').val(),
        postedBy: sessionStorage.userId || state.userId
    };

    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        success: function () {
            // console.info("job has been posted.");
            window.location.reload(true);
        }
    });
};

// EDIT PAGE
// display jobs by user ID
function displayJobsToEdit(data) {

    let results = [];

    if (data.length === 0) {
        $('#edit-job-list').html("<p class='text-center text-primary font-weight-bold pt-5'>You haven't posted any jobs yet.</p>");
    }
    else {

        // TODO: move date process into new function (dont reuse code!)

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
            <p class="job-post p-1">
            <span class="font-weight-bold">Posted</span> <span>${month} ${day}</span><br />
            <span class="font-weight-bold">for</span> <span>${job.title}</span><br />
            <span class="font-weight-bold">in</span> <span>${job.city}</span><br />
            <span class="font-weight-bold">Job ID: </span> <span>${job.id}</span><br />
            </p></div>`);

            $(jobPostHtml).each(function (event) {
                $(this).on('click', function () {
                    getOneJob(job.id, populateEditPageFields);
                    $('.disabled-input').attr('disabled', false);
                    $('#checkbox-delete').prop('checked', false);
                    $('#btn-delete-job-post').attr("disabled", true);
                    $('#btn-update-job-post').attr('disabled', true);
                });
            });

            results.push(jobPostHtml);
        });

        $('#edit-job-list').html(results);
    };
};

// populate the edit page with data from ONE job post
function populateEditPageFields(data) {
    $('#edit-job-id').val(data.id);
    $('#edit-company').val(data.company);
    $('#edit-title').val(data.title);
    $('#edit-salary').val(data.salary);
    $('#edit-region').val(data.region);
    $('#edit-city').val(data.city);
    $('#edit-email').val(data.email);
    $('#edit-technologies').val(data.technologies);
    $('#edit-description-textarea').val(data.description);
};

// send updated job data to jobs PUT endpoint
function updateJob() {
    let id = $('#edit-job-id').val();
    let url = "/jobs/update/" + id;

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
        description: $('#edit-description-textarea').val()
    };

    $.ajax({
        method: "PUT",
        url: url,
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        success: function () {
            // console.info("job has been updated.");
            window.location.reload(true);
        }
    });
};

// delete ONE job post by ID
function deleteOneJob() {
    let id = $('#edit-job-id').val();

    let confirmMsg = confirm("Your job post will be deleted. Confirm?");

    if (confirmMsg === true) {

        let url = "/jobs/delete/" + id;

        $.ajax({
            url: url,
            method: "DELETE",
            success: function () {
                console.info("Job has been deleted.");
                window.location.reload(true);
            }
        });

        // window.location.reload(true);
    }
    else {
        return;
    }
};


/////////////////////////
// DOC READY FUNCTIONS
$(function () {
    // login.html - login form handler
    $('#form-login').submit(function (event) {
        event.preventDefault();
        login(logUserInfo);
    });

    // find.html - get all jobs / refresh job list
    $('#btn-refresh-jobs').click(() => {
        getAllJobs(displayAllJobs);
    });

    // find.html - get job filtered by region
    $('#btn-filter-nw, #btn-filter-ne, #btn-filter-se, #btn-filter-sw').click(function () {
        let buttonValue = $(this).attr('value');
        getJobsByRegion(buttonValue, displayAllJobs);
    });

    // post.html - submit job post
    $('#form-job-post').submit(function (event) {
        event.preventDefault();
        postJob();
    });

    // edit.html - disable\enable delete job post button
    $('#checkbox-delete').on('change', function () {
        if ($('#checkbox-delete').prop("checked")) {
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

    // edit.html - listen for form change to enable submit button
    $('#formDiv form').on('keyup change', 'input, select, textarea', function () {
        $('#btn-update-job-post').attr('disabled', false);
    });

    // edit.html - delete one job post
    $('#btn-delete-job-post').click(() => {
        deleteOneJob();
    });

    // job post authorization
    $('#btn-goToPost').click(function (event) {
        event.preventDefault();

        let postAuthToken = sessionStorage.getItem('authToken');
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
                // sessionStorage.setItem('authToken', jqXHR.authToken);
                window.location.href = "/post";
            }
        });
    });

    console.log("document is ready");
});