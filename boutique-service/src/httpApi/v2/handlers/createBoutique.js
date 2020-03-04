import getGooglePaceId from '../../../api/googlePlacesId';
import "regenerator-runtime/runtime";

export default async function createBoutique({models}, req, res, next) {
    const Boutique = models.boutique;
    const boutique = req.body;

    // Adding google place id
    boutique.google_places_id = await getGooglePaceId(boutique.name, boutique.location);

    Boutique.create(boutique)
            .then(_boutique => res.stats(201).send(_boutique))
            .catch(err => res.status(500).send(err));
}
