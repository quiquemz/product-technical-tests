export default function boutique({models}, req, res, next) {
    const Boutique = models.boutique;
    const {slug} = req.params;

    Boutique.findOne({slug})
        .then(boutique => {
            res.send(boutique || `No boutique found with given slug: ${slug}`);
        })
        .catch(next);
}
