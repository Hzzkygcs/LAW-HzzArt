function loginOrchestration() {
    return "http://localhost:8085";
}

function authenticationService() {
    return "http://localhost:8081";
}




module.exports.urls = {
    utils: {
        getFormData: () => "/js-utils/getFormData.js"
    },

    authentication: {
        js: () => `/authentication/js.js`,
        css: () => `/authentication/css.css`,
        login_page: () => `/authentication/login.html`,
        register_page: () => `/authentication/register.html`,

        login_post: () => `${loginOrchestration()}/login/new-login`,
        register_post: () => `${authenticationService()}/auth/register`,
    }
};

