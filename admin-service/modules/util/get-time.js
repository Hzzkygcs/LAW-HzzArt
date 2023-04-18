function getTime() {
    let date_time = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
    return date_time;
}

module.exports.getTime = getTime;