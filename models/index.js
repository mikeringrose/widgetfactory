var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/widget_factory');

var WidgetType = exports.WidgetType = sequelize.define('widget_type', {
  category: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

var Widget = exports.Widget = sequelize.define('widget', {
  inventory: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});

var Attribute = exports.Attribute = sequelize.define('attribute', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

var AttributeValue = exports.AttributeValue = sequelize.define('attribute_value', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  value: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

var WidgetAttributeValue = exports.WidgetAttributeValue = sequelize.define('widget_attribute_value', {
  widgetId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  attributeValueId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

var WidgetTypeAttributeValue = exports.WidgetTypeAttributeValue = sequelize.define('widget_type_attribute_value', {
  widgetTypeId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  attributeValueId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

var Order = exports.Order = sequelize.define('order', {});

var OrderWidget = exports.OrderWidget = sequelize.define('order_widget', {
  orderId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  widgetId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
});

//- relationships
WidgetType.belongsToMany(AttributeValue, {
  through: {
    model: WidgetTypeAttributeValue
  },
  foreignKey: 'widgetTypeId'
});

Widget.belongsToMany(AttributeValue, {
  through: {
    model: WidgetAttributeValue
  },
  foreignKey: 'widgetId'
});

AttributeValue.belongsToMany(Widget, {
  through: {
    model: WidgetAttributeValue
  },
  foreignKey: 'attributeValueId'
});

Widget.belongsTo(WidgetType);

Order.belongsToMany(Widget, {
  through: {
    model: OrderWidget
  },
  foreignKey: 'orderId'
});

//- seed data
sequelize.afterBulkSync(function() {
  WidgetType.bulkCreate([
    {
      category: 'Prime',
      description: 'Demands your undivided attention'
    },
    {
      category: 'Elite',
      description: 'The most premier widget ever'
    },
    {
      category: 'Extreme Edition',
      description: 'It\'s radical'
    }
  ]);
  Attribute.bulkCreate([
    {
      id: 0,
      name: 'Size'
    },
    {
      id: 1,
      name: 'Color'
    },
    {
      id: 2,
      name: 'Smell'
    }
  ]);
  AttributeValue.bulkCreate([
    {
      id: 0,
      name: 'Size',
      value: 'Invisibly Small',
      attributeId: 0
    },
    {
      id: 1,
      name: 'Size',
      value: 'Galactically Huge',
      attributeId: 0
    },
    {
      id: 100,
      name: 'Color',
      value: 'Red',
      attributeId: 1
    },
    {
      id: 101,
      name: 'Color',
      value: 'Green',
      attributeId: 1
    },
    {
      id: 200,
      name: 'Smell',
      value: 'Trashy',
      attributeId: 2
    },
    {
      id: 201,
      name: 'Smell',
      value: 'Ringrosey',
      attributeId: 2
    }
  ]);
  WidgetTypeAttributeValue.bulkCreate([
    {
      widgetTypeId: 1,
      attributeValueId: 0
    },
    {
      widgetTypeId: 1,
      attributeValueId: 1
    },
    {
      widgetTypeId: 1,
      attributeValueId: 100
    },
    {
      widgetTypeId: 1,
      attributeValueId: 101
    },
    {
      widgetTypeId: 1,
      attributeValueId: 200
    },
    {
      widgetTypeId: 1,
      attributeValueId: 201
    },
    {
      widgetTypeId: 2,
      attributeValueId: 0
    },
    {
      widgetTypeId: 2,
      attributeValueId: 1
    },
    {
      widgetTypeId: 2,
      attributeValueId: 100
    },
    {
      widgetTypeId: 2,
      attributeValueId: 101
    },
    {
      widgetTypeId: 3,
      attributeValueId: 0
    },
    {
      widgetTypeId: 3,
      attributeValueId: 1
    },
    {
      widgetTypeId: 3,
      attributeValueId: 100
    }
  ]);
  Widget.bulkCreate([
    {
      inventory: 2,
      widgetTypeId: 1
    },
    {
      inventory: 8,
      widgetTypeId: 2
    },
    {
      inventory: 20,
      widgetTypeId: 1
    },
    {
      inventory: 18,
      widgetTypeId: 1
    },
    {
      inventory: 5,
      widgetTypeId: 1
    },
    {
      inventory: 1,
      widgetTypeId: 2
    },
    {
      inventory: 7,
      widgetTypeId: 2
    }
  ]);
  WidgetAttributeValue.bulkCreate([
    {
      widgetId: 1,
      attributeValueId: 0
    },
    {
      widgetId: 1,
      attributeValueId: 100
    },
    {
      widgetId: 1,
      attributeValueId: 200
    },
    {
      widgetId: 3,
      attributeValueId: 0
    },
    {
      widgetId: 3,
      attributeValueId: 101
    },
    {
      widgetId: 4,
      attributeValueId: 1
    },
    {
      widgetId: 4,
      attributeValueId: 101
    },
    {
      widgetId: 2,
      attributeValueId: 101
    },
    {
      widgetId: 2,
      attributeValueId: 0
    },
    {
      widgetId: 5,
      attributeValueId: 0
    },
    {
      widgetId: 5,
      attributeValueId: 100
    },
    {
      widgetId: 5,
      attributeValueId: 201
    },
    {
      widgetId: 6,
      attributeValueId: 100
    },
    {
      widgetId: 6,
      attributeValueId: 0
    },
    {
      widgetId: 7,
      attributeValueId: 100
    },
    {
      widgetId: 7,
      attributeValueId: 1
    }
  ]);
});

exports.sequelize = sequelize;

sequelize.sync({force: true});
