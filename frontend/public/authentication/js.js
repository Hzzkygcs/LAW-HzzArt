$(document).ready(function() {
    const form = $("form#submit-form");

    form.on("submit", function(event) {
        event.preventDefault();
        alert("yow");
        return false;
    });
});