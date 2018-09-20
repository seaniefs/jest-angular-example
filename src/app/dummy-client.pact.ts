import {TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {DummyClient} from './dummy-client.service';
import {Pact} from '@pact-foundation/pact';

declare var provider: Pact;

describe('Dummy API', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        DummyClient
      ]
    });
  });

  beforeAll((done) => {
    provider.addInteraction({
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
    }).then(() => {
      done()
    }, error => done.fail(error));
  });

  it('should answer 200', (done) => {
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
})
;
