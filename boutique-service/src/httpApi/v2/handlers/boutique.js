export default function boutique({models}, req, res, next) {
    const Boutique = models.boutique;
    const {slug} = req.params;
    Boutique.find({slug})
        .then(boutique => {
            res.send(boutique);
        })
        .catch(message => {
            res.send(message);
            next();
        });
}
