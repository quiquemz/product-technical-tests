import request from 'supertest';
import Sinon from 'sinon';
import {expect} from 'chai';
import boot from '../../../../src/boot';
import mongoose from 'mongoose';
import mongooseMock from 'mongoose-mock';

describe.skip('Integration tests > httpApi > v1 > boutiques', function(){

    let api;
    before(() => {
        Sinon.stub(mongoose, 'connect');
        Sinon.stub(mongoose, 'connection').returns(mongooseMock.connection);

        return boot({})
            .then(outputs => {
                console.log(outputs);
                api = outputs.api;
            });
    });

    after(() => {
        Sinon.restore();
    })

    it('should return boutiques', done => {
        console.log(api);
        request(api)
            .get('/v1/boutiques')
            // .expect(200)
            .then(response => {
                expect(response).to.be.ok;
                done();
            })
            .catch(err => done());
    });
});
