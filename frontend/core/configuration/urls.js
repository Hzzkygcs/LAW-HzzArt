
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
    },

    homepage: () => module.exports.urls.myCollections.myCollectionsPage(),
    myCollections: {
        myCollectionsPage: () => '/collections/my-collections.html',
    }
};



function loginOrchestration() {
    return "/login-orchestration";
}


function authenticationService() {
    return "/authentication-service";
}
