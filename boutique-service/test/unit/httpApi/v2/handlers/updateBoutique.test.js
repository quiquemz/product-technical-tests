import Bluebird from 'bluebird';
import {expect} from 'chai';
import Sinon from 'sinon';
import {updateBoutique as boutiqueHandler} from '../../../../../src/httpApi/v2/handlers';
import generateMockModels from '../../../../utils/mocks/models';
import generateMockBoutiques from '../../../../utils/mocks/boutiques';
import * as googlePlacesModule from '../../../../../src/externalApi/googlePlaces';


describe('Unit Tests > httpApi > v2 > handlers > update boutique', () => {
    const defaultGooglePlacesId = 'xyz';

    before(() => {
        Sinon.stub(googlePlacesModule, 'default').returns(defaultGooglePlacesId)}
    );

    after(() => {
        Sinon.restore()
    });

    it('returns non-existing message given non-existing slug', done => {
        const boutiques = generateMockBoutiques();
        const slug = 'does not exists';

        function assertion(output){
            expect(output).to.equal(`No boutique found with given slug: ${slug}`);
            done();
        }

        const models = generateMockModels();
        models.boutique.findOne.returns(Bluebird.resolve(null));

        const req = {
            params: {slug: slug},
            body: {update: boutiques[0]}
        };
        const res = {
            status: (x) => res, // To be able to run tests, else they keep hanging
            send: assertion
        };
        const next = function(){};

        boutiqueHandler({models}, req, res, next);
    });

    it('returns non-existing message given error', done => {
        const boutiques = generateMockBoutiques();
        const slug = 'does not exists';
        const errorThrown = new Error('test error');

        function assertion(output){
            expect(output).to.equal(`No boutique found with given slug: ${slug}`);
            done();
        }

        const models = generateMockModels();
        models.boutique.findOne.returns(Bluebird.reject(errorThrown));

        const req = {
            params: {slug: slug},
            body: {update: boutiques[0]}
        };
        const res = {
            status: (x) => res, // To be able to run tests, else they keep hanging
            send: assertion
        };
        const next = function(){};

        boutiqueHandler({models}, req, res, next);
    });

    it('returns updated boutique', done => {
        const boutiques = generateMockBoutiques();
        const slug = 'does not exists';
        const update = boutiques[1];

        function assertion(output){
            expect(output.google_places_id).to.equal(defaultGooglePlacesId);
            done();
        }

        const models = generateMockModels();

        models.boutique.findOne.returns(Bluebird.resolve(boutiques[0]));
        models.boutique.findOneAndUpdate.returns(Bluebird.resolve(boutiques[1]));

        const req = {
            params: {slug},
            body: {update}
        };
        const res = {
            status: (x) => res, // To be able to run tests, else they keep hanging
            send: assertion
        };
        const next = function(){};

        boutiqueHandler({models}, req, res, next);
    });

    it('returns error', done => {
        const boutiques = generateMockBoutiques();
        const slug = 'does not exists';
        const errorThrown = new Error('test error');

        function assertion(errorReceived){
            expect(errorReceived).to.equal(errorThrown);
            done();
        }

        const models = generateMockModels();

        models.boutique.findOne.returns(Bluebird.resolve(boutiques[0]));
        models.boutique.findOneAndUpdate.returns(Bluebird.reject(errorThrown));

        const req = {
            params: {slug},
            body: {update: boutiques[0]}
        };
        const res = {
            status: (x) => res, // To be able to run tests, else they keep hanging
            send: assertion
        };
        const next = function(){};

        boutiqueHandler({models}, req, res, next);
    });

});
