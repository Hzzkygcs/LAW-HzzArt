$(document).ready(function() {
    const form = $("form#submit-form");

    form.on("submit", async function(event) {
        event.preventDefault();
        const data = getFormData($(this));
        const res = await $.ajax({
            type: "POST",
            url: this.action,
            data: JSON.stringify(data),
            contentType: 'application/json',
        }).promise();
        console.log(res);

        return false;
    });
});