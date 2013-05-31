// Generated by CoffeeScript 1.6.1
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'vendor/underscore', 'vendor/backbone-min', 'leaflet', 'leaflet_heatmap', 'leaflet_cluster'], function($, _, Backbone, L) {
  var MapView;
  MapView = (function(_super) {

    __extends(MapView, _super);

    function MapView() {
      return MapView.__super__.constructor.apply(this, arguments);
    }

    MapView.prototype.name = "MapView";

    MapView.prototype.el = $('#map_viz');

    MapView.prototype.btn = $('#map_btn');

    MapView.prototype.map_headers = void 0;

    MapView.prototype.initialize = function(options) {
      this.parent = options.parent;
      this.data = options.data;
      this.form = options.form;
      this._detect_headers(this.form.attributes.children);
      if (this.map_headers != null) {
        this.btn.removeClass('disabled');
        return this.render();
      }
    };

    MapView.prototype._detect_headers = function(root) {
      var field, _i, _len, _ref, _ref1;
      for (_i = 0, _len = root.length; _i < _len; _i++) {
        field = root[_i];
        if ((_ref = field.type) === 'group') {
          this._detect_headers(field.children);
        }
        if ((_ref1 = field.type) === 'geopoint') {
          this.map_headers = field;
          return;
        }
      }
    };

    MapView.prototype.render = function() {
      var center, constrainedMarker, controls, datum, geopoint, heatmapData, html, key, layers, marker, myIcon, valid_count, value, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      this.heatmap = L.TileLayer.heatMap({
        radius: 80,
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
      valid_count = 0;
      _ref = this.data.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        datum = _ref[_i];
        geopoint = datum.get('data')[this.map_headers.name];
        if (geopoint == null) {
          continue;
        }
        geopoint = geopoint.split(' ');
        if (isNaN(geopoint[0]) || isNaN(geopoint[1])) {
          continue;
        }
        center[0] += parseFloat(geopoint[0]);
        center[1] += parseFloat(geopoint[1]);
        valid_count += 1;
      }
      if (valid_count === 0) {
        this.map_enabled = false;
        $('#map_btn').addClass('disabled');
        $('#map').hide();
        return this;
      }
      center[0] = center[0] / valid_count;
      center[1] = center[1] / valid_count;
      this.map = L.map('map').setView(center, 10);
      this.test_map = L.map('hidden_map').setView(center, 10);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(this.map);
      myIcon = L.icon({
        iconUrl: '//keep-static.s3.amazonaws.com/img/leaflet/marker-icon.png',
        iconRetinaUrl: '//keep-static.s3.amazonaws.com/img/leaflet/marker-icon@2x.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: '//keep-static.s3.amazonaws.com/img/leaflet/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [15, 41]
      });
      heatmapData = [];
      this.markers = [];
      this.constrained_markers = [];
      this.marker_layer = new L.MarkerClusterGroup();
      _ref1 = this.data.models;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        datum = _ref1[_j];
        geopoint = datum.get('data')[this.map_headers.name];
        if (geopoint == null) {
          continue;
        }
        geopoint = geopoint.split(' ');
        if (isNaN(geopoint[0]) || isNaN(geopoint[1])) {
          continue;
        }
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
        this.marker_layer.addLayer(marker);
        constrainedMarker = L.marker([geopoint[0], geopoint[1]], {
          icon: myIcon
        });
        heatmapData.push({
          lat: geopoint[0],
          lon: geopoint[1],
          value: 1
        });
      }
      this.constrained_layer = L.layerGroup(this.constrained_markers);
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
      controls.addTo(this.map);
      return this;
    };

    return MapView;

  })(Backbone.View);
  return MapView;
});
