
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
        detailReportedCollectionPage: () => `${urls.admin.admin()}/detail-report-collection.html`,
        adminDownloadPage: () => `${urls.admin.admin()}/admin-download-page.html`,
    },

    adminHomepage: () => "/admin/reported-collections.html",
    homepage: () => urls.collections.myCollectionsPage(),

    collections: {
        // do not delete. it's actually used inside the template
        components: {
            components: () => `${noLeadingSlash(urls.collections.collections())}/components`,
            saveVideoModal: () => `${urls.collections.components.components()}/-save-video-modal.ejs`,
            commentsModal: () => `${urls.collections.components.components()}/-comments-modal.ejs`,
            reportModal: () => `${urls.collections.components.components()}/-report-modal.ejs`,
            commentsBox:() => `${urls.collections.components.components()}/-comments-box.ejs`,
        },
        editCollectionsComponents: {
            editCollectionsComponents:
                () => `${noLeadingSlash(urls.collections.collections())}/edit-collections-components`,
            creatingImageCard:
                () => `${urls.collections.editCollectionsComponents.editCollectionsComponents()}/-creating-the-image-card.ejs`,
            imageCard:
                () => `${urls.collections.editCollectionsComponents.editCollectionsComponents()}/-image-card.ejs`,
            createNewImgBtnCard:
                () => `${urls.collections.editCollectionsComponents.editCollectionsComponents()}/-add-image-card.ejs`,
        },

        collections: () => `/collections`,

        css: () => `${urls.collections.collections()}/css.css`,
        dependencies: () => `${noLeadingSlash(urls.collections.collections())}/-dependencies.ejs`,


        myCollectionsPage: () => `${urls.collections.collections()}/my-collections.html`,
        // AI Art collection service
        artCollectionService: () => `/art-collection-service`,
        myCollectionsCreateCollections: () => `${urls.collections.artCollectionService()}/collections`,
        myCollectionsGetCollections: () => `${urls.collections.artCollectionService()}/collections`,
        myCollectionsGetImage: () => `${urls.collections.artCollectionService()}/collections/image/`,
        myCollectionsDeleteImage: () => `${urls.collections.artCollectionService()}/collections/delete-image/`,
        myCollectionsAddImage: () => `${urls.collections.artCollectionService()}/collections/`,
        myCollectionsSetName: () => `${urls.collections.artCollectionService()}/collections/`,

        generateImages: () => `${urls.collections.artCollectionService()}/collections/generate`,
        getGeneratedImages: () => `${urls.collections.artCollectionService()}/collections/generated-images/`,

        likeCommentService: () => `/like-comment-service`,

        editCollectionsPage: () => `${urls.collections.collections()}/edit-collections.html`,

        searchCollectionsPage: () => `${urls.collections.collections()}/search-result.html`,
        popularCollectionsPage: () => `${urls.collections.collections()}/popular-collections.html`,
        addImagePage: () => `${urls.collections.collections()}/generator.html`,
        addImageToCollectionPage: () => `${urls.collections.collections()}/generated-image.html`,
        userDownloadPage: () => `${urls.collections.collections()}/user-download-page.html`,

        collectionDetailsJs: () => `${urls.collections.collections()}/collection-details.js`,
        collectionDetailsPage: () => `${urls.collections.collections()}/collection-details.html`,
    },
    video: {
        component: {},
        videoProgress:   () => '/video/video-progress.html',
        getAllVideoProgressOfAnUser:   () => '/export-collection-orchestrations/export-collections/check/user',
        getEntireVideoProgress:   () => '/export-collection-orchestrations/export-collections/check',
        multipleDownloadProgressJs: () => '/multiple-download-progress/multiple-download-progress.js',
    },

    collection_interactions_orchestration: {
        getMyCollections: () => `${collectionInteractionsOrchestration()}/my-collections`,
        getPopularCollections: () => `${collectionInteractionsOrchestration()}/popular-collections`,
        reportedCollectionsGetCollections: () => `${collectionInteractionsOrchestration()}/reported-collections`,
        getSpecificCollection: (collectionId) => `${collectionInteractionsOrchestration()}/reported-collections/${collectionId}`,
        searchCollections: () => `${collectionInteractionsOrchestration()}/search-collections`,
        rejectReportCollection: () => `${collectionInteractionsOrchestration()}/reported-collections/reject-report`,
        sendBanCollection: () => `${collectionInteractionsOrchestration()}/reported-collections/ban-collection`,
        sendBanAccountOwner: () => `${collectionInteractionsOrchestration()}/reported-collections/ban-account`,
    },
};

module.exports.urls = urls;



function loginOrchestration() {
    return "/login-orchestration";
}


function authenticationService() {
    return "/authentication-service";
}

function collectionInteractionsOrchestration() {
    return "/collection-interactions-orchestration";
}


/**
 * @param {string} string
 */
function noLeadingSlash(string) {
    if (!string.startsWith("/"))
        return;
    return string.substring(1);
}