import Bluebird from 'bluebird';
import {expect} from 'chai';
import {boutique as boutiqueHandler} from '../../../../../src/httpApi/v2/handlers';
import generateMockModels from '../../../../utils/mocks/models';
import generateMockBoutiques from '../../../../utils/mocks/boutiques';


describe('Unit Tests > httpApi > v2 > handlers > boutique', () => {
    const boutiques = generateMockBoutiques();

    it('passes any error onto the next callback', done => {
        const errorThrown = new Error('test error');

        function assertion(errorReceived){
            expect(errorReceived).to.equal(errorThrown);
            done();
        }

        const models = generateMockModels();
        models.boutique.findOne.returns(Bluebird.reject(errorThrown));
        const req = {
            params: {
                slug: boutiques[0].slug
            }
        };
        const res = {};
        const next = assertion;

        boutiqueHandler({models}, req, res, next);
    });

    it('returns a boutique for given existing slug', done => {

        function assertion(output){
            expect(output).to.equal(boutiques[0]);
            done();
        }

        const models = generateMockModels();
        models.boutique.findOne.returns(Bluebird.resolve(boutiques[0]));
        const req = {
            params: {
                slug: boutiques[0].slug
            }
        };
        const res = {
            status: (x) => res, // To be able to run tests, else they keep hanging
            send: assertion
        };
        const next = function(){};

        boutiqueHandler({models}, req, res, next);
    });

    it('returns non-existing message given non-existing slug', done => {
        const slug = 'does-not-exist';

        function assertion(output){
            expect(output).to.equal(`No boutique found with given slug: ${slug}`);
            done();
        }

        const models = generateMockModels();
        models.boutique.findOne.returns(Bluebird.resolve(undefined));
        const req = {
            params: {
                slug: slug
            }
        };
        const res = {
            status: (x) => res, // To be able to run tests, else they keep hanging
            send: assertion
        };
        const next = function(){};

        boutiqueHandler({models}, req, res, next);
    });

});
