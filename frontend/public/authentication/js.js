function errorMsg() {
    return $(".error-msg");
}

function form() {
    return $("form#submit-form");
}

$(document).ready(function() {
    errorMsg().fadeOut(0);

    form().on("submit", async function(event) {
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
        storeLoginSession(res);
        window.location = $(this).attr('data-redirect-to');
        return false;
    });
});

function isRegistrationForm() {
    return form().hasClass("register");
}

function storeLoginSession(res) {
    if (isRegistrationForm())
        return;
    const jwtToken = res['x-jwt-token'];
    localStorage.setItem("x-jwt-token", jwtToken);
    Cookies.set('x-jwt-token', jwtToken, { expires: 7 });
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