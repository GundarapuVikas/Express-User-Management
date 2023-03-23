const { expect } = require('chai');
const { listOfUsers } = require('../dist/controllers/controller');
let chai = require('chai');
const chaiHttp = require('chai-http');
let server = require('../dist/server');
// assertion style
chai.should();

chai.use(chaiHttp);
chai.use(require("chai-sorted"));

describe('Tasks Api', () => {
  /* Testing main */  
  describe('Get /', () => {
    it("it should show the menu of api calls.", (done) => {
      // console.log('listOfUsers :>> ', listOfUsers);
      chai.request(server)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.a.property("message");
          expect(res.body).to.have.a.property("Add User");
          expect(res.body).to.have.a.property("Get list of Users");
          expect(res.body).to.have.a.property("Search for a user by id");
          expect(res.body).to.have.a.property("Update user details");
          expect(res.body).to.have.a.property("Delete a specific user");
          expect(res.body).to.have.a.property("List of Deleted Users");
          expect(res.body).to.have.a.property("AutoSuggest users based on substring");
          expect(listOfUsers).to.have.lengthOf(0);
          done();
        })
    })
  })

  /* Testing add user */
  describe('POST /addUser', () => {
    it('it should add a user having valid data in the list and user doesnt exit in the list', (done) => {
      listOfUsers.push({
        "id": "dc659146-97a7-40df-b630-40b29414e570",
        "login": "abcd@gmail.com",
        "password": "abcd1234",
        "age": 20,
        "isDeleted": false
      });
      listOfUsers.push({
        "id": "10ae7022-1c37-40a1-b21b-510e4110983f",
        "login": "ravi@gmail.com",
        "password": "ravi123",
        "age": 12,
        "isDeleted": true
      });
      let l = listOfUsers.length;
      let user = {
        login: "gopi@gmail.com",
        password: "gopi77",
        age: 18
      }
      chai.request(server)
        .post('/addUser')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(listOfUsers).to.have.lengthOf(l + 1);
          done();
        })
    });
    it('it should add a user having valid data in the list and user already exit in the list', (done) => {
      // console.log(listOfUsers)
      let l = listOfUsers.length;
      let user = {
        login: "abcd@gmail.com",
        password: "abcd1234",
        age: 20
      }
      chai.request(server)
        .post('/addUser')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(listOfUsers).to.have.lengthOf(l);
          done();
        })
    });
    it('it shouldnt add the user with invalid data', (done) => {
      let l = listOfUsers.length;
      let user = {
        login: "abcd",
        password: "abcd1234",
        age: 200
      }
      chai.request(server)
        .post('/addUser')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(listOfUsers).to.have.lengthOf(l);
          done();
        })
    });
  })

  /* Testing get users */
  describe('Get /users', () => {
    it("it should display the list of users.", (done) => {
      // console.log('listOfUsers :>> ', listOfUsers);
      chai.request(server)
        .get('/users')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(2);
          done();
        })
    });
    it("it should a message if there are no users.", (done) => {
      // console.log(listOfUsers)
      while (listOfUsers.length > 0) {
        listOfUsers.pop();
      }
      chai.request(server)
        .get('/users')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(listOfUsers).to.have.lengthOf(0);
          expect(res.body).to.eql({ "message": "No users present" })
          done();
        })
    })
  });

  /* Testing fetch user */
  describe('Get /fetch_user/:id', () => {
    it("it should display the user details fetched by id.", (done) => {
      listOfUsers.push({
        "id": "dc659146-97a7-40df-b630-40b29414e570",
        "login": "abcd@gmail.com",
        "password": "abcd1234",
        "age": 20,
        "isDeleted": false
      });
      listOfUsers.push({
        "id": "10ae7022-1c37-40a1-b21b-510e4110983f",
        "login": "ravi@gmail.com",
        "password": "ravi123",
        "age": 12,
        "isDeleted": true
      });
      let l = listOfUsers.length;
      chai.request(server)
        .get('/fetch_user/10ae7022-1c37-40a1-b21b-510e4110983f')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(1);
          expect(res.body[0].id).to.eql('10ae7022-1c37-40a1-b21b-510e4110983f');
          done();
        })
    });
    it("it should send a message when user by id is not found.", (done) => {
      chai.request(server)
        .get('/fetch_user/11aa22bb-1111-aaaa-b2b2-510e4110983f')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).not.to.be.an('array');
          expect(res.body).to.have.property('message').eql("No user exits with the id: 11aa22bb-1111-aaaa-b2b2-510e4110983f");
          done();
        })
    })
  });

  /* Testing update user */
  describe('PUT /update_user/:id', () => {
    it('it should update the user details fetched by id', (done) => {
      // console.log('listOfUsers :>> ', listOfUsers);
      const updatedDetails = { login: "vikas@epam.com", password: "Vikas8055", age: 21 };
      chai.request(server)
        .put('/update_user/dc659146-97a7-40df-b630-40b29414e570')
        .send(updatedDetails)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('id', "dc659146-97a7-40df-b630-40b29414e570");
          expect(res.body).to.have.property('login', updatedDetails.login);
          expect(res.body).to.have.property('password', updatedDetails.password);
          expect(res.body).to.have.property('age', updatedDetails.age);
          done();
        })
    })
    it('it should display a message if user with id is not found', (done) => {
      const updatedDetails = { login: "vikas@epam.com", password: "Vikas8055", age: 21 };
      chai.request(server)
        .put('/update_user/11aa22bb-1111-aaaa-b2b2-510e4110983f')
        .send(updatedDetails)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').eql("User doesn't exist");
          done();
        })
    })
  });

  /* Testing delete user */
  describe('DELETE /delete_user/:id', () => {
    it('it should soft delete the userwith an id making idDeleted value true', (done) => {
      // console.log('listOfUsers :>> ', listOfUsers);
      let l = listOfUsers.length;
      chai.request(server)
        .delete('/delete_user/dc659146-97a7-40df-b630-40b29414e570')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').eql("User deleted successfully");
          expect(res.body).to.have.property('data');
          expect(listOfUsers).to.have.lengthOf(l);
          expect(res.body.data).to.have.property('id').eql("dc659146-97a7-40df-b630-40b29414e570");
          expect(res.body.data).to.have.property('isDeleted').eql(true);
          done();
        })
    })
    it('it should display message if no user found to delete by id', (done) => {
      // console.log('listOfUsers :>> ', listOfUsers);
      let l = listOfUsers.length;
      chai.request(server)
        .delete('/delete_user/dc651111-9711-40d11-b63110-40b29414e111111570')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').eql("User doesn't exist to delete");
          done();
        })
    })
  });

  /* Testing list of deleted users */

  describe('Get /deletedUsers', () => {
    it("it should display the list of users deleted and checks for isdeleted value true", (done) => {
      // console.log('listOfUsers :>> ', listOfUsers);
      let deleteLength = 0
      listOfUsers.forEach(user => {
        user.isDeleted ? deleteLength++ : deleteLength;
      });
      chai.request(server)
        .get('/deletedUsers')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(deleteLength);
          (res.body).forEach(user => {
            expect(user.isDeleted).to.be.eql(true);
          });
          done();
        })
    });
    it("it should a message if there are no users.", (done) => {
      // console.log(listOfUsers)
      listOfUsers.forEach(user => {
        if (user.isDeleted) { user.isDeleted = false; }
      });
      chai.request(server)
        .get('/deletedUsers')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').eql("No deleted users");
          done();
        })
    })
  });

  /* Testing suggest users */
  describe('Get /AutoSuggestUsers/:substring/:limit', () => {
    it("it should a message if there are no users suggested", (done) => {
      let userIdx = listOfUsers.findIndex(user => user.login.match('epam'))
      console.log(userIdx)
      delete listOfUsers[userIdx];
      chai.request(server)
        .get('/AutoSuggestUsers/epam/3')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').eql("No users are found for the given sub string");
          done();
        })
    })
    it("it should display the suggested users that match with string and with limit.", (done) => {
      listOfUsers.push(
        {
          "id": "ba495e08-d770-4a47-a555-79560053b3ef",
          "login": "aman@epam.com",
          "password": "Epam1",
          "age": 25,
          "isDeleted": false
        },
        {
          "id": "10a9dacd-0a5e-431b-affa-28345b1919d3",
          "login": "balu@epam.com",
          "password": "Epam2",
          "age": 25,
          "isDeleted": false
        },
        {
          "id": "14a61e2d-9bd3-4d47-9e31-a849bca0c4ec",
          "login": "dev@epam.com",
          "password": "Epam3",
          "age": 25,
          "isDeleted": false
        },
        {
          "id": "11c7c42a-0f07-41ef-a816-c8a0b6021254",
          "login": "farooq@epam.com",
          "password": "Epam4",
          "age": 25,
          "isDeleted": false
        },
        {
          "id": "66c9fce5-087e-4dc1-b4c4-8fe7431ec59d",
          "login": "gopal@epam.com",
          "password": "Epam5",
          "age": 25,
          "isDeleted": false
        }
      )
      console.log("hi rey", listOfUsers)
      chai.request(server)
        .get('/AutoSuggestUsers/epam/3')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(3);
          res.body.forEach(user => {
            expect(user.login).to.have.string('epam')
          });
          expect(res.body).to.be.sortedBy("login");
          done();
        })
    });
  });

})



























