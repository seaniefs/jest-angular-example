import {TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {DummyClient} from './dummy-client.service';
import {Pact} from '@pact-foundation/pact';


describe('Dummy API', () => {
  const provider : Pact = new Pact({
    port: global.port,
    log: path.resolve(process.cwd(), 'coverage', 'logs', 'mockserver-integration.log'),
    dir: path.resolve(process.cwd(), 'coverage', 'pacts'),
    spec: 2,
    cors: true,
    logLevel: "debug",
    pactfileWriteMode: 'update',
    consumer: 'plandialog-frontend',
    provider: 'MyProvider',
  }); ;

  setupTestBed({
    imports: [HttpClientModule],
    providers: [DummyClient]
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
    provider
      .addInteraction({
        state: '',
        uponReceiving: 'get dummies',
        withRequest: {
          method: 'GET',
          path: '/dummies'
        },
        willRespondWith: {
          status: 200,
          body: {
            value: 'hello'
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
    const client = TestBed.get(DummyClient);
    client.getDummy$().subscribe(
      response => {
        expect(response).toEqual({value: 'hello'});
        done();
      },
      error => {
        done.fail(error);
      }
    );
  });
});
