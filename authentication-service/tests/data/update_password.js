function dummyUpdatePasswordBody(old_password='fake_password', new_password='new_fake_password') {
    return {
        'old_password': old_password,
        'new_password': new_password,
    };
}

module.exports.dummyUpdatePasswordBody = dummyUpdatePasswordBody;