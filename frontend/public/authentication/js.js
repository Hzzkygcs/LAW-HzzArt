$(document).ready(function() {
    const form = $("form#submit-form");

    form.on("submit", async function(event) {
        event.preventDefault();

        const data = getFormData($(this));
        const res = await post(this.action, data);
        if (res.error){

            return false;
        }

        return false;
    });

    function hideForm() {

    }
});