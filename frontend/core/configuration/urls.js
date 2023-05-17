
const urls = {
    global_dependencies: () => "-global-dependencies.ejs",
    footer_navbar: {
        js: {
            // leading slash because it's not used by ejs include()
            logout: () => `/${urls.footer_navbar.footer_navbar()}/logout.js`,
        },
        css: {
            navbarCss: () => `/${urls.footer_navbar.footer_navbar()}/navbar-css.css`,
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
            search_bar_mobile: () => `${urls.footer_navbar.components.components()}/-search-bar-mobile.ejs`,
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
        admin : () => `/admin`,
        css: () => `${urls.admin.admin()}/css.css`,
        dependencies: () => `${noLeadingSlash(urls.admin.admin())}/-dependencies.ejs`,
        reported_collections_page: () => `/admin/reported-collections.html`,
        detail_reported_collection_page: () => `/admin/detail-report-collection.html`,
    },

    adminHomepage: () => "/admin/reported-collections.html",
    homepage: () => module.exports.urls.collections.myCollectionsPage(),

    collections: {
        // do not delete. it's actually used inside the template
        components: {
            components: () => `${noLeadingSlash(urls.collections.collections())}/components`,
            saveVideoModal: () => `${urls.collections.components.components()}/-save-video-modal.ejs`,
            commentsModal: () => `${urls.collections.components.components()}/-comments-modal.ejs`,
            reportModal: () => `${urls.collections.components.components()}/-report-modal.ejs`,
        },

        collections: () => `/collections`,

        css: () => `${urls.collections.collections()}/css.css`,
        dependencies: () => `${noLeadingSlash(urls.collections.collections())}/-dependencies.ejs`,

        myCollectionsPage: () => `${urls.collections.collections()}/my-collections.html`,
        searchCollectionsPage: () => `${urls.collections.collections()}/search-result.html`,
        popularCollectionsPage: () => `${urls.collections.collections()}/popular-collections.html`,
        editCollectionsPage: () => `${urls.collections.collections()}/edit-collections.html`,
        addImagePage: () => `${urls.collections.collections()}/generator.html`,
        collectionDetailsPage: () => `${urls.collections.collections()}/collection-details.html`,
    },
    video: {
      videoProgress:   () => '/video/video-progress.html',
    },
};

module.exports.urls = urls;



function loginOrchestration() {
    return "/login-orchestration";
}


function authenticationService() {
    return "/authentication-service";
}


/**
 * @param {string} string
 */
function noLeadingSlash(string) {
    if (!string.startsWith("/"))
        return;
    return string.substring(1);
}