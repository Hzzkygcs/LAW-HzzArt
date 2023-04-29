$(document).ready(function() {
    const form = $("form#submit-form");
    const errorMsg = $(".error-msg");
    errorMsg.fadeOut(0);

    form.on("submit", async function(event) {
        event.preventDefault();
        errorMsg.fadeOut();

        const data = getFormData($(this));
        const res = await post(this.action, data);
        if (res.validationFail){
            errorMsg.text(res.validationFail.message);
            errorMsg.fadeIn();
            return false;
        }

        return false;
    });

});


function validatePasswordConfirmation(data) {
    if (data.password == data['confirm-password'])
        return data;
}