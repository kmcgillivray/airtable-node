const router = require('express').Router();
const Crud = require('./modules/airtable-crud');

// Change 'Meals' to your table name
const table = new Crud('Meals');

router.get('/', table.find(), (req, res) => res.jsonp(req.result));
router.get('/new', (req, res) => res.render('new'));
router.post('/new', table.create(), (req, res) => res.jsonp(req.result));
router.get('/:id', table.findOne(), (req, res) => res.jsonp(req.result));
router.put('/:id', table.update(), (req, res) => res.jsonp(req.result));

module.exports = router;
