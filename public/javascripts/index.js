function WidgetTypeListViewModel() {
  var self = this;
  self.order = ko.observableArray([]);
  self.widgetTypes = ko.observableArray([]);
  self.currentWidgetType = ko.observable();
  self.filters = ko.observable({});

  $.getJSON("/widgettypes", function(data) {
    var mappedWidgets = $.map(data, function(item) { return new WidgetType(item) });
    self.widgetTypes(mappedWidgets);
  });

  self.addToOrder = function() {
    self.order.push(this.selectedWidget());
    $('#widgetTypeModal').modal('hide');
  };

  self.viewOrder = function() {
    $('#orderModal').modal('show');
  };

  self.removeFromOrder = function(widget) {
    this.order.remove(function(item) {
      return item.id == widget.id;
    });
  };

  self.placeOrder = function() {
    var data = {
      widgets: (_.map(self.order(), 'id'))
    }

    $.ajax({
      type: 'POST',
      url: '/orders',
      data: JSON.stringify(data),
      success: function() {
        self.order([]);
        $('#orderModal').modal('hide');
      },
      error: function(e) {
        alert(e.responseJSON.message);
      },
      contentType: 'application/json'
    });
  };

  self.displayWidgetType = function(selected) {
    self.currentWidgetType(selected);
    $('#widgetTypeModal').modal('show');
    self.currentWidgetType().attributesUpdated();
  };

  self.updateFilters = function() {
    var filters = {};

    $('.filters form select').each(function() {
      if ($(this).val().length > 0) {
        filters[$(this).attr('name')] = $(this).val();
      }
    });

    self.filters(filters);
  };

  self.filters.subscribe(function(newfilter) {
    $.getJSON("/widgettypes", {filter: JSON.stringify(self.filters())}, function(data) {
      var mappedWidgets = $.map(data, function(item) { return new WidgetType(item) });
      self.widgetTypes(mappedWidgets);
    });
  });
}

function WidgetType(data) {
  var self = this;
  self.id = data.id;
  self.category = data.category;
  self.description = data.description;
  self.attributes = ko.observableArray();
  self.inventory = ko.observableArray();
  self.selectedWidget = ko.observable();

  $.getJSON('/widgettypes/' + this.id + '/attributes', function(attributes) {
    self.attributes(attributes);
  });

  $.getJSON('/widgettypes/' + this.id + '/inventory', function(inventory) {
    var mappedInventory = $.map(inventory, function(item) { return new Widget(item) });
    self.inventory(mappedInventory);
  });

  self.attributesUpdated = function() {
    var attrs = {};
    $('#widgetTypeModal form select').each(function() {
      attrs[$(this).attr('name')] = $(this).val();
    });

    var widgets = self.filter(attrs);
    if (widgets.length == 1 && widgets[0].inventory > 0) {
      self.selectedWidget(widgets[0]);
      $('#addToOrderButton').removeClass('disabled');
    } else {
      self.selectedWidget(null);
      $('#addToOrderButton').addClass('disabled');
    }
  };
}

WidgetType.prototype = {
  filter: function(attrs) {
    return _.filter(this.inventory(), attrs);
  }
};

function Widget(data) {
  var self = this;
  _.assignIn(self, data);

  self.attributeString = ko.computed(function() {
    return _.chain(self).omit(['id', 'category', 'inventory']).values().value().join(', ');
  });
}
