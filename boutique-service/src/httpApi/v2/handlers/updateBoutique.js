import getGooglePlacesId from '../../../externalApi/googlePlaces';

export default async function updateBoutique({models}, req, res, next) {
    const Boutique = models.boutique;
    const {slug} = req.params;
    const {update = {}} = req.body;

    const boutique = await Boutique.findOne({slug})
                                .then(_boutique => _boutique)
                                .catch(err => 'Not found');

    if (!boutique || boutique === 'Not found') {
        return res.status(404).send(`No boutique found with given slug: ${slug}`);
    }

    if (!boutique.google_places_id || boutique.google_places_id === '-1') {
        update.google_places_id = await getGooglePlacesId(boutique.name, boutique.location);
    }

    Boutique.findOneAndUpdate({slug}, update, {new: true})
            .then(_boutique => res.status(200).send(_boutique))
            .catch(err => res.status(500).send(err));
}
