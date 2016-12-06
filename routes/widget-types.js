var _ = require('lodash'),
  express = require('express'),
  models = require('../models');

var router = express.Router();

router.get('/', function(req, res, next) {
  var whereClause = {};

  if (!_.isEmpty(req.query.filter)) {
    var filter = JSON.parse(req.query.filter);

    if (!_.isEmpty(filter)) {
      whereClause = generateWhereClause(filter);
    }
  }

  models.WidgetType.findAll(whereClause)
    .then(function(orders) {
      res.json(orders);
    });
});

router.get('/:widgetTypeId/attributes', function(req, res, next) {
  models.WidgetType.findOne({
      where: { id: req.params.widgetTypeId },
      include: [
        {
          model: models.AttributeValue
        }
      ]
    })
    .then(function(widgetType) {
      var groups = _.chain(widgetType.attribute_values)
        .groupBy('name')
        .map(function(v, k) {
          return {
            name: k,
            values: (_.map(v, 'value'))
          }
        }).value();
      res.json(groups);
    });
});

router.get('/:widgetTypeId/inventory', function(req, res, next) {
  models.Widget.findAll({
      where: { widgetTypeId: req.params.widgetTypeId },
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
        retval.category = w.widget_type.category;
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

function generateWhereClause(filter) {
  var whereClause = {},
    keys = _.keys(filter);
    conditions = _.map(keys, function(k) {
      return { name: k, value: filter[k] };
    });

    return {
      include: [
        {
          model: models.AttributeValue,
          where: { $or: conditions }
        }
      ]
    };
}

module.exports = router;
