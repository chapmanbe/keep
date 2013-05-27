// Generated by CoffeeScript 1.6.1
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'vendor/underscore', 'vendor/backbone-min'], function($, _, Backbone) {
  var RawView;
  RawView = (function(_super) {

    __extends(RawView, _super);

    function RawView() {
      return RawView.__super__.constructor.apply(this, arguments);
    }

    RawView.prototype.name = 'RawView';

    RawView.prototype.el = $('#raw');

    RawView.prototype.initialize = function(options) {
      this.parent = options.parent;
      this.raw_headers = options.raw_headers;
      this.data = options.data;
      return this.render();
    };

    RawView.prototype.render = function() {
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

    return RawView;

  })(Backbone.View);
  return RawView;
});