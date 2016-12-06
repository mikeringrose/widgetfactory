var _ = require('lodash'),
  express = require('express'),
  models = require('../models');

var router = express.Router();

router.post('/', function(req, res, next) {
  var widgetIds = req.body.widgets;

  models.sequelize.transaction(function(t) {
    return models.Widget.findAll({
        where: {
          id: widgetIds,
          inventory: {
            $gt: 0
          }
        }
      })
      .then(function(widgets) {
        if (widgetIds.length != widgets.length) {
          throw new Error("Some items are out of stock.");
        } else {
          return _.map(widgets, function(w) {
            w.update({inventory: w.inventory - 1}, {transaction: t});
          });
        }
      })
      .then(function(widgets) {
        return models.Order.create({}, {transaction: t});
      })
      .tap(function(order) {
        return order.setWidgets(widgetIds, {transaction: t});
      })
      .then(function(order) {
        res.status(201).json(order);
      })
      .catch(function(e) {
        res.status(400).json({message: "Not all items are in stock."});
        throw e;
      });
  });
});

router.delete('/:orderId', function(req, res, next) {
  models.Order.destroy({ where: { id: req.params.orderId } })
    .then(function(num) {
      if (num == 1) {
        res.status(200).send();
      } else {
        res.status(404).send();
      }
    });
});

module.exports = router;
