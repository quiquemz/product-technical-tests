import Sinon from 'sinon';
import Bluebird from 'bluebird';
import {expect} from 'chai';
import getGooglePlacesId from '../../../src/externalApi/googlePlaces';
import generateMockModels from '../../utils/mocks/models';
import axios from 'axios';

describe('Unit Tests > externalApi > googlePlaces > getGooglePlacesId', () => {
    const mockName = 'test';
    const mockLocation = {lat: 1, lon: 2};

    let axiosGet;
    before(() => {
        axiosGet = Sinon.stub(axios, 'get');
    });

    after(() => {
        Sinon.restore();
    })

    it('returns error response', done => {
        axiosGet.returns(Bluebird.reject(new Error('')));

        getGooglePlacesId(mockName, mockLocation).then(result => {
            expect(result).to.equal('-1');
            done();
        });
    });

    it('returns not found response', done => {
        const resp = {data: {candidates: []}}

        axiosGet.returns(Bluebird.resolve(resp));

        getGooglePlacesId(mockName, mockLocation).then(result => {
            expect(result).to.equal('-1');
            done();
        });
    });

    it('returns first candidate', done => {
        const resp = {data: {candidates: [{place_id: 'xyz'}]}}

        axiosGet.returns(Bluebird.resolve(resp));

        getGooglePlacesId(mockName, mockLocation).then(result => {
            expect(result).to.equal('xyz');
            done();
        });
    });
});
