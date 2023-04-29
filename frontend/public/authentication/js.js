function errorMsg() {
    return $(".error-msg");
}

$(document).ready(function() {
    const form = $("form#submit-form");
    errorMsg().fadeOut(0);

    form.on("submit", async function(event) {
        event.preventDefault();
        errorMsg().fadeOut();

        const data = getFormData($(this));
        if (isRegistrationForm(this) && !validatePasswordConfirmation(data))
            return false;

        const res = await post(this.action, data);
        if (res.validationFail){
            errorMsg().text(res.validationFail.message);
            errorMsg().fadeIn();
            return false;
        }

        const redirect = $(this).attr('data-redirect-to');
        window.location = redirect;
        return false;
    });
});

function isRegistrationForm(form) {
    return $(form).hasClass("register");
}


function validatePasswordConfirmation(data) {
    if (data.password === data['confirm-password']) {
        delete data['confirm-password'];
        return true;
    }
    errorMsg().text("Password does not match");
    errorMsg().fadeIn();

    return false;
}