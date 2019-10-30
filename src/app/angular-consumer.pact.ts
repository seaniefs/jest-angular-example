import {TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {AngularConsumer} from './angular-consumer.service';
import {Pact, Query} from '@pact-foundation/pact';
import {HTTPMethod} from '@pact-foundation/pact/common/request';

describe('Angular API', () => {

  const path = require('path');
  const provider: Pact = new Pact({
    port: 12349,
    log: path.resolve(process.cwd(), 'coverage', 'logs', 'mockserver-integration.log'),
    dir: path.resolve(process.cwd(), 'coverage', 'pacts'),
    spec: 2,
    cors: true,
    logLevel: 'debug',
    pactfileWriteMode: 'update',
    consumer: 'AngularConsumer',
    provider: 'TestProvider',
  });
  setupTestBed({
    imports: [HttpClientModule],
    providers: [AngularConsumer]
  });

  beforeAll((done) => {
    provider.setup().then(() => {
      done();
    });
  });

  afterAll((done) => {
    provider.verify()
      .then(() => provider.finalize())
      .then(() => {
        done();
      });
  });

  describe('Request for JSON data', () => {

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'data count > 0',
          uponReceiving: 'a request for json data',
          withRequest: {
            method: HTTPMethod.GET,
            path: '/provider.json',
            query: {validDate: '2013-08-16T15:31:20Z'}
          },
          willRespondWith: {
            status: 200,
            body: {
              test: 'NO',
              validDate: '2013-08-16T15:31:20Z',
              count: 100
            }
          }
        })
        .then(
          () => {
            done();
          },
          error => done.fail(error)
        );
    });

    it('should answer 200', done => {
      const client = TestBed.get(AngularConsumer);
      client.performQuery$('2013-08-16T15:31:20Z').subscribe(
        response => {
          expect(response.validDate).toEqual('2013-08-16T15:31:20Z');
          expect(response.count).toEqual(100);
          done();
        },
        error => {
          done.fail(error);
        }
      );
    });
  });

  describe('Missing Date Parameter', () => {

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'data count > 0',
          uponReceiving: 'a request with a missing date parameter',
          withRequest: {
            method: HTTPMethod.GET,
            path: '/provider.json',
            query: {validDate: ''}
          },
          willRespondWith: {
            status: 400,
            body: {
              error: 'validDate is required'
            },
            headers: {
              'Content-Type': 'application/json'
            }
          }
        })
        .then(
          () => {
            done();
          },
          error => done.fail(error)
        );
    });

    it('should answer 400', done => {
      const client = TestBed.get(AngularConsumer);
      client.performQuery$('').subscribe(
        response => {
          done.fail('Expected error');
        },
        error => {
          expect(error).toEqual('Status: 400 Error: validDate is required');
          done();
        }
      );
    });
  });

  describe('Invalid Date Parameter', () => {

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'data count > 0',
          uponReceiving: 'a request with an invalid date parameter',
          withRequest: {
            method: HTTPMethod.GET,
            path: '/provider.json',
            query: {validDate: 'Not a date'}
          },
          willRespondWith: {
            status: 400,
            body: {
              error: '\'Not a date\' is not a date'
            },
            headers: {
              'Content-Type': 'application/json'
            }
          }
        })
        .then(
          () => {
            done();
          },
          error => done.fail(error)
        );
    });

    it('should answer 400', done => {
      const client = TestBed.get(AngularConsumer);
      client.performQuery$('Not a date').subscribe(
        response => {
          done.fail('Expected error');
        },
        error => {
          expect(error).toEqual('Status: 400 Error: \'Not a date\' is not a date');
          done();
        }
      );
    });
  });

  describe('No Data Available', () => {

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'data count == 0',
          uponReceiving: 'a request for json data when none exists',
          withRequest: {
            method: HTTPMethod.GET,
            path: '/provider.json',
            query: {validDate: '2013-08-16T15:31:30Z'}
          },
          willRespondWith: {
            status: 404
          }
        })
        .then(
          () => {
            done();
          },
          error => done.fail(error)
        );
    });

    it('should answer 404', done => {
      const client = TestBed.get(AngularConsumer);
      client.performQuery$('2013-08-16T15:31:30Z').subscribe(
        response => {
          done.fail('Expected error');
        },
        error => {
          expect(error).toEqual('Status: 404 Error: No Data');
          done();
        }
      );
    });
  });

});
