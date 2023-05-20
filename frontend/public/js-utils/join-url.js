
function joinUrl(firstUrl, ...args) {
    let currentUrl = firstUrl;
    for (let url of args){
        if (!currentUrl.endsWith('/'))
            currentUrl += '/';
        if (url.startsWith('/'))
            url = url.substring(1);
        currentUrl += url;
    }
    return currentUrl;
}