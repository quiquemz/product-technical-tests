import axios from 'axios';
import url from 'url';

export default function googlePlaceId(name, {lat, lon}) {
    const reqUrl = url.format({
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

    console.log('Test');
    return axios
        .get(reqUrl, {timeout: 5000})
        .then(res => {
            const {data: {candidates}} = res;
            console.log(candidates[0].place_id);
            return candidates[0].place_id;
        })
        .catch(err => console.log(err));
}
