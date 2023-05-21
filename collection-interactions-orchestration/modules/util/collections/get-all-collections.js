const {getArtCollectionsUrl,getArtCollectionsLikeCommentUrl} = require('../../../URLs/get-art-collections-url');
const {makeRequest} = require("../../external-call/make-request");

async function getAllCollections(token) {
  const url = getArtCollectionsUrl('/collections-all');
  let response = await makeRequest("get",
    url,
    {},
    {"x-jwt-token": token}
  );
  return response.data;
}

async function getAllCollectionsWithLikeComments() {
  const url = getArtCollectionsLikeCommentUrl('/like-comment/sort-collection/');
  let response = await makeRequest("get", url, {}, {});
    return response.data;
}

async function getCurrentUserCollections(token) {
  const url = getArtCollectionsUrl('/collections');
  let response = await makeRequest("get",
    url,
    {},
    {"x-jwt-token": token}
  );
  return response.data;
}

async function getCurrentUserCollectionsWithLikeComments(collectionIds,token) {
  const url = getArtCollectionsLikeCommentUrl('/like-comment/get-posts/');
  let response = await makeRequest("post", url,
      {collection_ids: collectionIds},
          {"x-jwt-token": token}
  );
    return response.data;
}

module.exports = {getAllCollections,getAllCollectionsWithLikeComments,getCurrentUserCollections,getCurrentUserCollectionsWithLikeComments};