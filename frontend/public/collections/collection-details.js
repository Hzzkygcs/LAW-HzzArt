$(document).ready(async function () {
    const getImages = await get("/art-collection-service/collections/" + collectionId, {});
    console.log(getImages);
    const images = getImages.images;


    const images_list = images.map(imageId => {
        return `${myCollectionsGetImageUrl}${imageId}`;
    });

    let currentIndex = 0;
    const imageElement = document.getElementById('image');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            imageElement.src = images_list[currentIndex];
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < images_list.length - 1) {
            currentIndex++;
            imageElement.src = images_list[currentIndex];
        }
    });

    if (images_list.length > 0) {
        imageElement.src = images_list[currentIndex];
    }
});



$(document).ready(async function() {
    const fetchInfoUrl = "/like-comment-service/like-comment/get-post/" + collectionId;
    const postLikeOrUnlikeUrl = "/like-comment-service/like-comment/like/" + collectionId;
    await updateLikeCommentInformation(await get(fetchInfoUrl, {}));
    let likeButton = document.getElementById("like-button");
    likeButton.addEventListener("click", async function() {
        await updateLikeCommentInformation(await post(postLikeOrUnlikeUrl, {}));
    });
});

async function updateLikeCommentInformation(response) {
    const totalLikes = response;
    document.getElementById("total-likes").textContent = totalLikes.post_likes;
    document.getElementById("total-comment").textContent = totalLikes.post_comments;

    let likeButton = document.getElementById("like-button");
    if (totalLikes.liked) {
        likeButton.classList.add("liked");
    } else {
        likeButton.classList.remove("liked");
    }
}


$(document).ready(async function () {
    const fetchCommentUrl = "/like-comment-service/like-comment/get-comment/" + collectionId;
    const postCommentUrl = "/like-comment-service/like-comment/comment/" + collectionId;
    const initFetch = await get(fetchCommentUrl, {});
    updateCommentBox(initFetch);

    // Add a click event listener to the "Comment" button
    let commentButton = document.getElementById("input-comment-button")

    commentButton.addEventListener("click", async function() {
        const commentTextInput = $("#input-comment-text");
        var commentText = commentTextInput.val();

        var data = {
            comment: commentText
        };
        const response_comment = await post(postCommentUrl, data);
        updateCommentBox(response_comment);
        commentTextInput.val("");
    });
});
function updateCommentBox(response){
    let getComment = response;
    getComment = getComment.response;
    const commentBoxClass = $("#commentBox");
    commentBoxClass.empty();

    for (const comment of getComment) {
        const {collection_id, comment_id, comment_text, username} = comment;
        commentBoxClass.append(createCommentInstanceBox(collection_id, comment_id, username, comment_text));
    }
    scrollToBottom(commentBoxClass);
}
function scrollToBottom(element) {
    $(element).animate({ scrollTop: $(element).prop("scrollHeight")}, 1000);
}

function createCommentInstanceBox(collection_id, comment_id, username, comment_text) {

    const commentContainer = $("<div>", {
        class: "border border-black rounded-lg p-4",
    });

    const flexContainer = $("<div>", {
        class: "flex items-center space-x-2",
    });

    const avatarContainer = $("<div>", {
        class: "bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center",
    });

    const avatarText = $("<span>", {
        class: "comment-username",
        text: username.charAt(0),
    });

    const commentContentContainer = $("<div>");

    const commentUser = $("<h2>", {
        class: "comment-username",
        text: username,
    });

    const commentText = $("<h3>", {
        class: "comment-text",
        text: comment_text,
    });

    avatarContainer.append(avatarText);
    commentContentContainer.append(commentUser, commentText);
    flexContainer.append(avatarContainer, commentContentContainer);

    commentContainer.append(flexContainer);
    return commentContainer
}