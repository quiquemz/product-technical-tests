export default function boutiques({models}, req, res, next) {
    const Boutique = models.boutique;
    Boutique.find({})
        .then(boutiques => {
            res.status(200).send(boutiques);
        })
        .catch(next);
}
