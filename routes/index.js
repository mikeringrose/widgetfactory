var _ = require('lodash'),
  express = require('express'),
  router = express.Router(),
  models = require('../models');

router.get('/', function(req, res, next) {
  models.AttributeValue.findAll()
    .then(function(attributeValues) {
      var attributes = _.chain(attributeValues).groupBy('name').map(function(v, k) {
        return { name: k, values: (_.map(v, 'value')) };
      }).value();
      res.render('index', { title: 'My Widget Store', attributes: attributes, groupedAttributes: (_.groupBy(attributes, 'name')) });
    });
});

router.get('/vieworders', function(req, res, next) {
  models.Order.findAll()
    .then(function(orders) {
      res.render('orders', { title: 'My Widget Store', orders: orders } );
    });
});

router.get('/viewwidgets', function(req, res, next) {
  models.Widget.findAll({
      include: [
        {
          model: models.AttributeValue
        },
        {
          model: models.WidgetType
        }
      ]
    })
    .then(function(widgets) {
      res.render('widgets', { title: 'My Widget Store', widgets: widgets } );
    });
});

module.exports = router;
