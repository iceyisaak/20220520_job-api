const notFound = (req, res) => res.status(404).send('Route does NOT exist.');
module.exports = notFound;