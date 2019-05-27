import 'jest-preset-angular';
import './jestGlobalMocks';
import './setupTestBed';
import {Pact} from '@pact-foundation/pact';
import 'pactProvider';

declare var beforeAll: any;
declare var afterAll: any;
declare var provider: Pact;

beforeAll((done) => {
  provider.setup().then(() => done());
});

afterAll((done) => {
  provider.verify()
    .then(() => provider.finalize())
    .then(() => done());
});
