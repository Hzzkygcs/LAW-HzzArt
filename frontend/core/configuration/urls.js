
const urls = {
    global_dependencies: () => "-global-dependencies.ejs",
    footer_navbar: {
        js: {
            // leading slash because it's not used by ejs include()
            logout: () => `/${urls.footer_navbar.footer_navbar()}/logout.js`,
        },

        footer_navbar: () => "footer-navbar",
        footer: () => `${urls.footer_navbar.footer_navbar()}/-footer.ejs`,
        navbar: () => `${urls.footer_navbar.footer_navbar()}/-navbar.ejs`,

        // do not delete. it's actually used inside the template
        components: {
            components: () => `${urls.footer_navbar.footer_navbar()}/components`,
            navbar_left: () => `${urls.footer_navbar.components.components()}/-navbar-left.ejs`,
            navbar_show_mobile_modal_btn: () => `${urls.footer_navbar.components.components()}/-navbar-show-mobile-modal-btn.ejs`,
            search_bar: () => `${urls.footer_navbar.components.components()}/-search-bar.ejs`,
            navbar_right: () => `${urls.footer_navbar.components.components()}/-navbar-right.ejs`,
        }
    },

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
    admin: {
        css: () => `/admin/css.css`,
        reported_collections_page: () => `/admin/reported-collections.html`,
        detail_reported_collection_page: () => `/admin/detail-report-collection.html`,
    },

    homepage: () => module.exports.urls.myCollections.myCollectionsPage(),
    myCollections: {
        myCollectionsPage: () => '/collections/my-collections.html',
    }
};

module.exports.urls = urls;



function loginOrchestration() {
    return "/login-orchestration";
}


function authenticationService() {
    return "/authentication-service";
}
