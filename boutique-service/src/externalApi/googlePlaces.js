import {get as axiosGet} from 'axios';
import {format as urlFormat} from 'url';

export default function(name, {lat, lon}) {
    const NOT_FOUND_RES = '-1';
    const reqUrl = urlFormat({
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        pathname: '/maps/api/place/findplacefromtext/json',
        query: {
            inputtype: 'textquery',
            fields: 'place_id',
            input: name,
            locationbias: `point:${lat},${lon}`,
            key: process.env.GOOGLE_API_KEY
        }
    });

    return axiosGet(reqUrl, {timeout: 5000})
        .then(res => {
            const {data: {candidates}} = res;

            if (candidates.length === 1) {
                return candidates[0].place_id;
            } else {
                return NOT_FOUND_RES;
            }
        })
        .catch(err => NOT_FOUND_RES);
}
