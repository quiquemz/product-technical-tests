import supertest from 'supertest';
import Sinon from 'sinon';
import {expect} from 'chai';
import boot from '../../../../src/boot';

describe.skip('Integration tests > httpApi > v1 > boutiques', function(){

    let api;
    before(() => {
        bluebird = new Bluebird((resolve, reject) => {
            const db = mongoose.connection;
            db.on('error', reject);
            db.once('open', resolve);
        });



        return boot({})
            .then(outputs => {
                api = outputs.api;
            });
    });

    it('should return boutiques', () => {
        return supertest(api)
            .get('/v1/boutiques')
            .expect(200)
            .then(response => {
                expect(response).to.be.ok;
            });
    });
});
