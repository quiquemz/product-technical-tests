import Bluebird from 'bluebird';
import {expect} from 'chai';
import Sinon from 'sinon';
import {createBoutique as boutiqueHandler} from '../../../../../src/httpApi/v2/handlers';
import generateMockModels from '../../../../utils/mocks/models';
import generateMockBoutiques from '../../../../utils/mocks/boutiques';
import * as googlePlacesModule from '../../../../../src/externalApi/googlePlaces';


describe('Unit Tests > httpApi > v2 > handlers > create boutique', () => {
    const defaultGooglePlacesId = 'xyz';
    const boutiques = generateMockBoutiques();

    before(() => {
        Sinon.stub(googlePlacesModule, 'default').returns(defaultGooglePlacesId)}
    );

    after(() => {
        Sinon.restore()
    });

    it('returns error', done => {
        const errorThrown = new Error('test error');

        function assertion(errorReceived){
            expect(errorReceived).to.equal(errorThrown);
            done();
        }

        const models = generateMockModels();
        models.boutique.create.returns(Bluebird.reject(errorThrown));
        const req = {
            body: boutiques[0]
        };
        const res = {
            status: (x) => res, // To be able to run tests, else they keep hanging
            send: assertion
        };
        const next = function(){};

        boutiqueHandler({models}, req, res, next);
    });

    it('returns created boutique', done => {
        function assertion(output){
            expect(output.google_places_id).to.equal(defaultGooglePlacesId);
            done();
        }

        const models = generateMockModels();
        models.boutique.create.returns(Bluebird.resolve(boutiques[0]));

        const req = {
            body: boutiques[0]
        };
        const res = {
            status: (x) => res, // To be able to run tests, else they keep hanging
            send: assertion
        };
        const next = function(){};

        boutiqueHandler({models}, req, res, next);
    });


});
