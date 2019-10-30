import {TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {AngularConsumer} from './angular-consumer.service';
import {Pact, Query} from '@pact-foundation/pact';
import {HTTPMethod} from '@pact-foundation/pact/common/request';

describe('Dummy API', () => {
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

  beforeAll(done => {
    const query: Query = {};
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
