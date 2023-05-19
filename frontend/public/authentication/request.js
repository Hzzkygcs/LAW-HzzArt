async function post(url, data, {isJson=true, contentType=null}={}){
    return request("POST", url, data, {isJson: isJson,contentType: contentType})
}
async function get(url, data, {contentType=null}={}){
    return request("GET", url, data, {isJson: false,contentType: contentType})
}



async function request(method, url, data, {isJson=true, contentType=null}){
    return new Promise((res, rej) => {
        $.ajax({
            type: method,
            url: url,
            data: isJson ? JSON.stringify(data) : data,
            headers: {
              "x-jwt-token": localStorage.getItem("x-jwt-token"),
            },
            contentType: contentType ?? (isJson ? 'application/json' : 'multipart/form-data'),
        }).done((data) => {
            data.validationFail = null;
            res(data);
        }).fail(function (e) {
            if (e.status >= 400 && e.responseJSON != null && 'reason' in e.responseJSON){
                const ret = {};
                ret.validationFail = e.responseJSON.reason;
                ret.statusCode = e.statusCode;
                res(ret);
                return;
            }
            rej(e);
        });
    });
}