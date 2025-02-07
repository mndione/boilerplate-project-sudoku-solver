const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    
    //#1
    test('post valid puzzle string', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.deepEqual(res.body, {solution: '135762984946381257728459613694517832812936745357824196473298561581673429269145378'});
        done();
      });
    });

    //#2
    test('post missing puzzle string', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/solve')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, { error: 'Required field missing' });
            done();
          });
      });

      //#3
      test('post invalid char puzzle string', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/solve')
          .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6xx'})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, {error: 'Invalid characters in puzzle'});
            done();
          });
      });

      //#4
      test('post puzzle incorrect length', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/solve')
          .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6'})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, {error: 'Expected puzzle to be 81 characters long'});
            done();
          });
      });

      //#5
      test('post puzzle not solvable', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/solve')
          .send({puzzle: '..9..5.1.85.4....2932......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, {error: 'Puzzle cannot be solved'});
            done();
          });
      });

      //#6
      test('check all fields sent', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/check')
          .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: 7
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, {valid: true});
            done();
          });
      });

      //#7
      test('check one conflict', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/check')
          .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: 6
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.conflict.length, 1);
            done();
          });
      });

      //#8
      test('check multiple conflict', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/check')
          .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: 1
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.conflict.length, 2);
            done();
          });
      });

      //#9
      test('check all placement conflict', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/check')
          .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: 5
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.conflict.length, 3);
            done();
          });
      });

      //#10
      test('check missing required fields', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/check')
          .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1'
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, {error: 'Required field(s) missing'});
            done();
          });
      });

      //#11
      test('check invalid characters', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/check')
          .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6xx',
                coordinate: 'A1',
                value: 5
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, {error: 'Invalid characters in puzzle'});
            done();
          });
      });

      //#12
      test('check invalid puzzle length', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/check')
          .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6',
                coordinate: 'A1',
                value: 5
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, {error: 'Expected puzzle to be 81 characters long'});
            done();
          });
      });

      //#13
      test('check invalid coordinate placement', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/check')
          .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A0',
                value: 5
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, {error: 'Invalid coordinate'});
            done();
          });
      });

      //#14
      test('check invalid value placement', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/check')
          .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: '0'
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.deepEqual(res.body, {error: 'Invalid value'});
            done();
          });
      });

});

