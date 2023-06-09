const request = require('supertest');
const {REGISTER_ENDPOINT, USERNAME_VALID_ENDPOINT} = require("../../routes/endpoints");
const {User} = require("../../model/user");
const main = require("../../main");
const {dummyRegistrationBody} = require("../data/registration");
let server;



describe('/auth/register', function () {
    beforeEach(async () => {
        server = await main.server();
        await User.deleteMany({});
    });

    afterEach(() => {
        server.close();
    });

    describe('POST', function () {
        it('should return 200 on correct data', async function () {
            const res = await request(server).post(REGISTER_ENDPOINT).send(dummyRegistrationBody());
            expect(res.status).toBe(200);
        });
        it('should create the user correctly', async function () {
            await request(server).post(REGISTER_ENDPOINT).send(dummyRegistrationBody());
            let res = await request(server).get(`${USERNAME_VALID_ENDPOINT}/abc`).send();
            res = JSON.parse(res.text);
            expect(res.username).toBe('abc');
        });
    });
});

