const request = require('supertest');
const {REGISTER_ENDPOINT, USERNAME_VALID_ENDPOINT, VALIDATE_LOGIN_ENDPOINT} = require("../../routes/endpoints");
const {User} = require("../../model/user");
const main = require("../../main");
const {dummyRegistrationBody} = require("../data/registration");
let server;



describe('/auth/login', function () {
    beforeEach(async () => {
        server = await main.server();
        await User.deleteMany({});

        await request(server).post(REGISTER_ENDPOINT).send(dummyRegistrationBody());
    });

    afterEach(() => {
        server.close();
    });

    describe('POST', function () {
        it('should return 200 on login successful', async function () {
            const res = await request(server).post(VALIDATE_LOGIN_ENDPOINT).send(dummyRegistrationBody());
            expect(res.status).toBe(200);
        });
        it('should return 401 unauthorized if password is wrong', async function () {
            const data = dummyRegistrationBody();
            data.password = "wrong_fake_password";
            const res = await request(server).post(VALIDATE_LOGIN_ENDPOINT).send(data);
            expect(res.status).toBe(401);
        });
        it('should return 404 unauthorized if username not found', async function () {
            const data = dummyRegistrationBody();
            data.username = "wrongusername";
            const res = await request(server).post(VALIDATE_LOGIN_ENDPOINT).send(data);
            expect(res.status).toBe(404);
        });
        it('should return the user correctly', async function () {
            const res = await request(server).post(VALIDATE_LOGIN_ENDPOINT).send(dummyRegistrationBody());
            const hasil = JSON.parse(res.text);
            expect(hasil.username).toStrictEqual('abc');
        });
    });
});

