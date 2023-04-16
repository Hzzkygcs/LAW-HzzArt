const request = require('supertest');
const {REGISTER_ENDPOINT, USERNAME_VALID_ENDPOINT} = require("../../routes/endpoints");
const {User} = require("../../model/user");
const main = require("../../main");
const {dummyRegistrationBody} = require("../data/registration");
const {dummyUpdatePasswordBody} = require("../data/update_password");
let server;



describe('/auth/register', function () {
    beforeEach(async () => {
        server = await main.server();
        await User.deleteMany({});

        await request(server).post(REGISTER_ENDPOINT).send(dummyRegistrationBody());
    });

    afterEach(() => {
        server.close();
    });

    describe('GET', function () {
        it('should return 200 on correct data', async function () {
            const res = await request(server).get(`${USERNAME_VALID_ENDPOINT}/a`).send();
            expect(res.status).toBe(200);
        });
        it('should create the user correctly', async function () {
            let res = await request(server).get(`${USERNAME_VALID_ENDPOINT}/a`).send();
            res = JSON.parse(res.text);
            expect(res.username).toBe('a');
        });
        it('should give the same lastPasswordUpdateDate', async function () {
            const endpoint = `${USERNAME_VALID_ENDPOINT}/a`;
            let res1 = await request(server).get(endpoint).send();
            let res2 = await request(server).get(endpoint).send();
            let res3 = await request(server).get(endpoint).send();
            const lastPasswordUpdateDate = JSON.parse(res1.text).lastPasswordUpdateDate;
            for (let res of [res1, res2, res3]){
                res = JSON.parse(res.text);
                expect(res.username).toBe('a');
                expect(res.lastPasswordUpdateDate).toBe(lastPasswordUpdateDate);
            }
        });
    });

    describe('PATCH', function () {
        it('should return 200 on correct data', async function () {
            const res = await request(server).patch(`${USERNAME_VALID_ENDPOINT}/a`).send(dummyUpdatePasswordBody());
            expect(res.status).toBe(200);
        });
        it('should return 401 unauthorized if old_password is wrong', async function () {
            const res = await request(server).patch(`${USERNAME_VALID_ENDPOINT}/a`).send(dummyUpdatePasswordBody(
                'wrong_old_fake_password'
            ));
            expect(res.status).toBe(401);
        });
        it('should change last password update date if success', async function () {
            let beforeUpdatePassword = await request(server).get(`${USERNAME_VALID_ENDPOINT}/a`).send();
            const updateResp = await request(server).patch(`${USERNAME_VALID_ENDPOINT}/a`).send(dummyUpdatePasswordBody());
            console.assert(updateResp.status === 200);

            let afterUpdatePassword = await request(server).get(`${USERNAME_VALID_ENDPOINT}/a`).send();
            beforeUpdatePassword = JSON.parse(beforeUpdatePassword.text);
            afterUpdatePassword = JSON.parse(afterUpdatePassword.text);
            expect(beforeUpdatePassword.lastPasswordUpdateDate)
                .not.toBe(afterUpdatePassword.lastPasswordUpdateDate);
        });
    });
});

