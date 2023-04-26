const BACKEND_HOST = "http://localhost:80";
const FRONTEND_HOST = "http://localhost:80";


module.exports.urls = {
    authentication: {
        css: `${FRONTEND_HOST}/authentication/css.css`,
        login: `${BACKEND_HOST}/auth/login`,
        register: `${BACKEND_HOST}/auth/register`,
    }
};

