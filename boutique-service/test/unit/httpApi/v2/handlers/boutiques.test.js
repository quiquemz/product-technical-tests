import Bluebird from 'bluebird';
import {expect} from 'chai';
import {boutiques as boutiquesHandler} from '../../../../../src/httpApi/v2/handlers';
import generateMockModels from '../../../../utils/mocks/models';


describe('Unit Tests > httpApi > v2 > handlers > boutiques', () => {
    it('passes any error onto the next callback', done => {
        const errorThrown = new Error('test error');

        function assertion(errorReceived){
            expect(errorReceived).to.equal(errorThrown);
            done();
        }

        const models = generateMockModels();
        models.boutique.find.returns(Bluebird.reject(errorThrown));
        const req = {};
        const res = {};
        const next = assertion;

        boutiquesHandler({models}, req, res, next);

    });

    it('returns all of the entries in the boutique collection', done => {
        const boutiques = [{}, {}];

        function assertion(output){
            expect(output.length).to.equal(boutiques.length);

            boutiques.forEach((expectedBoutique, index) => {
                expect(output[index]).to.equal(expectedBoutique);
            });

            done();
        }

        const models = generateMockModels();
        models.boutique.find.returns(Bluebird.resolve(boutiques));
        const req = {};
        const res = {
            send: assertion
        };
        const next = function(){};

        boutiquesHandler({models}, req, res, next);
    });
});
