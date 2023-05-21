

async function alwaysRefreshDownloadList(urlToGetDownloadList, rowContainerElement, showUsername) {
    // noinspection InfiniteLoopJS
    while (true){
        await refreshDownloadListOneTime(urlToGetDownloadList, rowContainerElement, showUsername);
        await sleep(200);
    }
}

async function refreshDownloadListOneTime(urlToGetDownloadList, rowContainerElement, showUsername) {
    const listOfDownloads = await get(urlToGetDownloadList, {});
    if (listOfDownloads.validationFail){
        alert(listOfDownloads.validationFail.message);
        throw Error("");
    }

    console.log(urlToGetDownloadList);
    console.log(listOfDownloads);

    $(rowContainerElement).empty();
    for (const downloadInfo of listOfDownloads) {
        let {percentageTotal, tokenName, username, collection_name} = downloadInfo;
        if (!showUsername)
            username = null;

        const el = spawnNewDownloadRow(username, collection_name, tokenName, percentageTotal);
        $(rowContainerElement).append(el);
    }
}


function spawnNewDownloadRow(username, collectionName, token, progress) {
    const el = $($("#row-template-of-multi-download-page").html())
    if (username == null){
        el.find(".username-td").remove();
    } else {
        el.find(".username-text").text(username);
    }

    el.find(".collection-name").text(collectionName);
    el.find(".token-td").text(token);
    el.find("a.token-td").attr('href', getDownloadPage(token));

    const progressInt = parseInt(progress);
    const progressBar = el.find(".progress-bar");
    progressBar.text(`${progressInt}%`);
    progressBar.css('width', `${progressInt}%`);
    // el.on('click', function () {
    //     window.location.href = getDownloadPage(token);
    // });
    return el;
}