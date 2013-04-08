// Generated by CoffeeScript 1.6.1
var DataCollection, DataModel, DataView, FormModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DataModel = (function(_super) {

  __extends(DataModel, _super);

  function DataModel() {
    return DataModel.__super__.constructor.apply(this, arguments);
  }

  DataModel.prototype.defaults = {
    data: []
  };

  return DataModel;

})(Backbone.Model);

FormModel = (function(_super) {

  __extends(FormModel, _super);

  function FormModel() {
    return FormModel.__super__.constructor.apply(this, arguments);
  }

  FormModel.prototype.initialize = function() {
    this.form_id = $('#form_id').html();
    this.user = $('#user').html();
    return this.url = "/api/v1/repos/" + this.form_id + "/?format=json&user=" + this.user;
  };

  return FormModel;

})(Backbone.Model);

DataCollection = (function(_super) {

  __extends(DataCollection, _super);

  function DataCollection() {
    return DataCollection.__super__.constructor.apply(this, arguments);
  }

  DataCollection.prototype.model = DataModel;

  DataCollection.prototype.initialize = function() {
    this.form_id = $('#form_id').html();
    return this.url = "/api/v1/data/" + this.form_id + "/?format=json";
  };

  DataCollection.prototype.comparator = function(data) {
    return data.get('timestamp');
  };

  return DataCollection;

})(Backbone.Collection);

DataView = (function(_super) {

  __extends(DataView, _super);

  function DataView() {
    return DataView.__super__.constructor.apply(this, arguments);
  }

  DataView.prototype.el = $('#viz');

  DataView.prototype.events = {
    "click #yaxis_options input": "change_y_axis",
    "click #chart_options a.btn": "switch_viz",
    "change #sharing_toggle": "toggle_public"
  };

  DataView.prototype.data = new DataCollection();

  DataView.prototype.form = new FormModel();

  DataView.prototype.raw_headers = ['uuid'];

  DataView.prototype.map_headers = null;

  DataView.prototype.map_enabled = false;

  DataView.prototype.map = null;

  DataView.prototype.yaxis = null;

  DataView.prototype.chart_fields = [];

  DataView.prototype.width = 750;

  DataView.prototype.height = 250;

  DataView.prototype.initialize = function() {
    this.listenTo(this.form, 'sync', this.render);
    this.form.fetch();
    this.data = document.initial_data;
    return this;
  };

  DataView.prototype.toggle_public = function(event) {
    var _this = this;
    $.post("/repo/share/" + this.form.form_id + "/", {}, function(response) {
      if (response.success) {
        $(event.currentTarget).attr('checked', response["public"]);
        if (response["public"]) {
          return $('#privacy').html('<img src=\'/static/img/public_repo.png\'>&nbsp;PUBLIC');
        } else {
          return $('#privacy').html('<img src=\'/static/img/private_repo.png\'>&nbsp;PRIVATE');
        }
      }
    });
    return this;
  };

  DataView.prototype.switch_viz = function(event) {
    var viz_type;
    viz_type = $(event.currentTarget).data('type');
    if (viz_type === 'map' && !this.map_enabled) {
      return;
    } else if (viz_type === 'line' && this.chart_fields.length === 0) {
      return;
    }
    $('.active').removeClass('active');
    $(event.currentTarget).addClass('active');
    return $('.viz-active').fadeOut('fast', function() {
      var _this = this;
      $(this).removeClass('viz-active');
      return $('#' + viz_type + '_viz').fadeIn('fast', function() {
        if (viz_type === 'map') {
          return document.vizApp.map.invalidateSize(false);
        }
      }).addClass('viz-active');
    });
  };

  DataView.prototype.change_y_axis = function(event) {
    $('#yaxis_options input').attr('checked', false);
    $(event.target).attr('checked', true);
    this.yaxis = event.target.value;
    return this.renderCharts();
  };

  DataView.prototype.render = function() {
    var field, _i, _len, _ref, _ref1, _ref2, _ref3;
    if (!this.form.attributes.children || !this.data) {
      return;
    }
    _ref = this.form.attributes.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      field = _ref[_i];
      if ((_ref1 = field.type) !== 'note') {
        this.raw_headers.push(field.name);
      }
      if ((_ref2 = field.type) === 'decimal' || _ref2 === 'int' || _ref2 === 'integer') {
        this.chart_fields.push(field.name);
        if (!this.yaxis) {
          this.yaxis = field.name;
        }
      }
      if ((_ref3 = field.type) === 'geopoint') {
        $('#map_btn').removeClass('disabled');
        this.map_enabled = true;
        this.map_headers = field.name;
      }
    }
    this.renderRaw();
    if (this.data.models.length > 0) {
      if (this.map_enabled) {
        this.renderMap();
      } else {
        $('#map').hide();
      }
      if (this.chart_fields.length) {
        this.renderCharts();
      } else {
        $('#line_btn').addClass('disabled');
      }
    } else {
      $('#line_btn').addClass('disabled');
      $('#map_btn').addClass('disabled');
    }
    return this;
  };

  DataView.prototype.renderRaw = function() {
    var datum, headers, html, key, value, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    $('#raw').html('');
    html = '<table id="raw_table" class="table table-striped table-bordered">';
    html += '<thead><tr>';
    headers = '';
    _ref = this.raw_headers;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      html += "<th>" + key + "</th>";
    }
    html += '</tr></thead>';
    html += '<tbody>';
    _ref1 = this.data.models;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      datum = _ref1[_j];
      html += '<tr>';
      _ref2 = this.raw_headers;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        key = _ref2[_k];
        value = datum.get('data')[key];
        if (value) {
          html += "<td>" + value + "</td>";
        } else {
          html += "<td>N/A</td>";
        }
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    $('#raw').html(html);
    $('#raw_table').dataTable({
      'sDom': "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
      'sPaginationType': 'bootstrap'
    });
    $.extend($.fn.dataTableExt.oStdClasses, {
      "sWrapper": "dataTables_wrapper form-inline"
    });
    return this;
  };

  DataView.prototype.renderCharts = function() {
    var end, line, max, min, model, option, parseDate, start, value, x, xAxis, y, yAxis, yaxis_tmpl, _i, _j, _len, _len1, _ref, _ref1,
      _this = this;
    d3.select('svg').remove();
    $('#yaxis_options').html('');
    yaxis_tmpl = _.template($('#yaxis_tmpl').html());
    _ref = this.chart_fields;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      option = _ref[_i];
      $('#yaxis_options').append(yaxis_tmpl({
        label: option,
        value: option,
        checked: this.yaxis === option ? 'checked' : ''
      }));
    }
    parseDate = d3.time.format('%Y-%m-%dT%H:%M:%S').parse;
    start = parseDate(this.data.models[0].get('timestamp'));
    end = parseDate(this.data.models[this.data.length - 1].get('timestamp'));
    min = null;
    max = null;
    _ref1 = this.data.models;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      model = _ref1[_j];
      value = parseFloat(model.get('data')[this.yaxis]);
      if (!min || value < min) {
        min = value;
      }
      if (!max || value > max) {
        max = value;
      }
    }
    x = d3.time.scale().domain([start, end]).range([0, 800]);
    y = d3.scale.linear().domain([min, max]).range([200, 0]);
    xAxis = d3.svg.axis().scale(x).orient('bottom');
    yAxis = d3.svg.axis().scale(y).orient('left');
    line = d3.svg.line().x(function(d) {
      return x(parseDate(d.get('timestamp')));
    }).y(function(d) {
      return y(parseFloat(d.get('data')[_this.yaxis]));
    });
    this.svg = d3.select('#line').append('svg').attr('width', this.width).attr('height', this.height).append('g').attr('transform', 'translate( 32, 16 )');
    this.svg.append('g').attr('class', 'x axis').attr('transform', 'translate( 0, 200 )').call(xAxis);
    this.svg.append("g").attr("class", "y axis").call(yAxis);
    this.svg.append('path').datum(this.data.models).attr('class', 'line').attr('d', line);
    return this;
  };

  DataView.prototype.renderMap = function() {
    var center, controls, datum, geopoint, heatmapData, html, key, layers, marker, myIcon, value, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    this.heatmap = L.TileLayer.heatMap({
      radius: 20,
      opacity: 0.8,
      gradient: {
        0.45: "rgb(0,0,255)",
        0.55: "rgb(0,255,255)",
        0.65: "rgb(0,255,0)",
        0.95: "yellow",
        1.0: "rgb(255,0,0)"
      }
    });
    center = [0, 0];
    _ref = this.data.models;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      datum = _ref[_i];
      geopoint = datum.get('data')[this.map_headers].split(' ');
      center[0] += parseFloat(geopoint[0]);
      center[1] += parseFloat(geopoint[1]);
    }
    center[0] = center[0] / this.data.models.length;
    center[1] = center[1] / this.data.models.length;
    this.map = L.map('map').setView(center, 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(this.map);
    myIcon = L.icon({
      iconUrl: '/static/img/leaflet/marker-icon.png',
      iconRetinaUrl: '/static/img/leaflet/marker-icon@2x.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: '/static/img/leaflet/marker-shadow.png',
      shadowSize: [41, 41],
      shadowAnchor: [15, 41]
    });
    heatmapData = [];
    this.markers = [];
    _ref1 = this.data.models;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      datum = _ref1[_j];
      geopoint = datum.get('data')[this.map_headers].split(' ');
      marker = L.marker([geopoint[0], geopoint[1]], {
        icon: myIcon
      });
      html = '';
      _ref2 = datum.get('data');
      for (key in _ref2) {
        value = _ref2[key];
        html += "<div><strong>" + key + ":</strong> " + value + "</div>";
      }
      marker.bindPopup(html);
      this.markers.push(marker);
      heatmapData.push({
        lat: geopoint[0],
        lon: geopoint[1],
        value: 1
      });
    }
    this.marker_layer = L.layerGroup(this.markers);
    this.heatmap.addData(heatmapData);
    this.map.addLayer(this.heatmap);
    this.map.addLayer(this.marker_layer);
    layers = {
      'Markers': this.marker_layer,
      'Heatmap': this.heatmap
    };
    controls = L.control.layers(null, layers, {
      collapsed: false
    });
    return controls.addTo(this.map);
  };

  return DataView;

})(Backbone.View);
