import {Schema} from 'mongoose';

export default new Schema({
    name: {type: Schema.Types.String, required: true},
    slug: {type: Schema.Types.String, required: true, unique: true},
    location: {
      lon: {type: Schema.Types.Number, required: true},
      lat: {type: Schema.Types.Number, required: true}
    },
    description: {type: Schema.Types.String, required: true},
    google_places_id: {type: Schema.Types.String, required: true},
    founder_quote: Schema.Types.String,
    logo: {
        url: Schema.Types.String
    }
});
