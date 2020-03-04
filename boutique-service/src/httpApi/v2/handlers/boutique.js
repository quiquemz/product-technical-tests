export default function boutique({models}, req, res, next) {
    const Boutique = models.boutique;
    const {slug} = req.params;

    Boutique.findOne({slug})
            .then(boutique => {
                if (!boutique) {
                    return res.status(404).send(`No boutique found with given slug: ${slug}`);
                } else {
                    return res.status(200).send(boutique)
                }
            })
            .catch(next);
}
