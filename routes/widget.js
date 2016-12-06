var _ = require('lodash'),
  express = require('express'),
  models = require('../models');

var router = express.Router();

router.get('/', function(req, res, next) {
  models.Widget.findAll({
      where: { widgetTypeId: 1 },
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
      return _.map(widgets, function(w) {
        var retval = {};

        retval.id = w.id;
        retval.name = w.widget_type.category;
        retval.inventory = w.inventory;

        _.map(w.attribute_values, function(a) {
            return retval[a.name] = a.value;
        });

        return retval;
      });
    })
    .then(function(widgets) {
      res.json(widgets);
    });
});

router.patch('/:widgetId', function(req, res, next) {
  var updates = _.map(req.body, ['inventory']);

  if (updates.inventory > 0) {
    models.Widget.findById(req.params.widgetId)
      .then(function(widget) {
        widget.update(updates)
      })
      .then(function(widget) {
        res.status(200).send();
      });
  } else {
    res.status(400).send('Inventory needs to be a positive integer.');
  }
});

module.exports = router;
