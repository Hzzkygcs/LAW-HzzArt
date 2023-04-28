const BACKEND_HOST = "http://localhost:80";
const FRONTEND_HOST = "http://localhost:80";


module.exports.urls = {
    authentication: {
        css: `/authentication/css.css`,
        login_page: `/authentication/login.html`,
        register_page: `/authentication/register.html`,

        login_post: `${BACKEND_HOST}/auth/login`,
        register_post: `${BACKEND_HOST}/auth/register`,
    }
};

