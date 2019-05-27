import 'jest-preset-angular';
import './jestGlobalMocks';
import './setupTestBed';
import 'pactProvider';

declare var beforeAll: any;
declare var afterAll: any;

beforeAll((done) => {
  provider.setup().then(() => done());
});

afterAll((done) => {
  provider.verify()
    .then(() => provider.finalize())
    .then(() => done());
});
