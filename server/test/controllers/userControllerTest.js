import { expect } from 'chai'
import { createUser } from '../../src/controllers/userControllerNew';
import { assert, spy } from 'sinon';
const sandbox = require('sinon').sandbox.create();
const User = require('../../src/models/user.js');
const body = {
    mail: "bla@gmail.com",
    name: "Bla",
    userType: "teacher",
    password: "IAmNotTellingYouThis",
    requiresGuardianConsent: false
};
const signUpFailedMessage = {
    msg: "Sign up failed"
};

describe('userControllerNew', function () {
    describe('createUser', function () {
        const userToBeSaved = {
            email: body.mail,
            name: body.name,
            type: body.userType,
            password: "Something",
            loginType: 'password',
            requiresGuardianConsent: body.requiresGuardianConsent,
            isVerified: false
        };
        var request;
        var response;
        var findOneSpy;

        beforeEach(function () {
            request = { body };
            response = {
                send: spy(),
                json: spy(),
                status: createResponseWithStatusCode(200)
            };

        });

        afterEach(function () {
            sandbox.restore();
        });

        it('shall not create user when it already exists', function () {
            findOneSpy = sandbox.stub(User, 'findOne').yields(null, { name: 'whiskers' });
            response.status = createResponseWithStatusCode(400)

            createUser(request, response);

            assertFindOneWasCalledWithUsername();
            assertSendWasCalledWith({
                msg: "Username not available! Please try again"
            });
        });

        it('shall not create user when retrieving username fails', function () {
            findOneSpy = sandbox.stub(User, 'findOne').yields({ error: "Could not retrieve user" }, null);
            response.status = createResponseWithStatusCode(422)

            createUser(request, response);

            assertFindOneWasCalledWithUsername();
            assertSendWasCalledWith(signUpFailedMessage);
        });

        it('shall fail creating user when user could not be persisted', function () {
            findOneSpy = sandbox.stub(User, 'findOne').yields(null, null);
            var saveSpy = sandbox.stub(User.prototype, 'save').yields({ error: "Could not save user" }, null);
            response.status = createResponseWithStatusCode(422);

            createUser(request, response);

            assertFindOneWasCalledWithUsername();
            assert.calledOnce(saveSpy);
            assertJsonWasCalledWith(signUpFailedMessage);
        });

        it('shall save automatically verified user ', function () {
            findOneSpy = sandbox.stub(User, 'findOne').yields(null, null);
            var saveSpy = sandbox.stub(User.prototype, 'save').yields(null, userToBeSaved);
            response.status = createResponseWithStatusCode(200);
            request.body.userType = "student";
            userToBeSaved.type = "student"

            createUser(request, response);

            assertFindOneWasCalledWithUsername();
            assert.calledOnce(saveSpy);
            assert.calledOnce(response.send);
            const actualResponse = response.send.getCall(0).args[0];
            const userSaved = actualResponse.user;
            expect(actualResponse.msg).to.be.equal("Successfully signed up! Please log in");
            expect(userSaved.name).to.be.equal(userToBeSaved.name);
            expect(userSaved.email).to.be.equal(userToBeSaved.email);
            expect(userSaved.isVerified).to.be.true;
            expect(userSaved.isNew).to.be.true;
            expect(userSaved.blurb).to.be.equal("I <3 CS");
            expect(userSaved.type).to.be.equal("student");
            expect(userSaved.password).to.be.equal("IAmNotTellingYouThis");
        });

        function createResponseWithStatusCode(statusCode) {
            return function (responseStatus) {
                expect(responseStatus).to.be.equal(statusCode);
                return this;
            }
        }

        function assertFindOneWasCalledWithUsername() {
            assert.calledOnce(findOneSpy);
            assert.calledWith(findOneSpy, { name: "Bla" });
        }

        function assertSendWasCalledWith(msg) {
            assert.calledOnce(response.send);
            assert.calledWith(response.send, msg);
        }

        function assertJsonWasCalledWith(msg) {
            assert.calledOnce(response.json);
            assert.calledWith(response.json, msg);
        }

    });

});