// Generated by CoffeeScript 1.6.1

define(['vendor/underscore'], function(_) {
  var build_form;
  build_form = function(child, lang) {
    var label, schema_dict, _ref, _ref1,
      _this = this;
    label = '';
    if (typeof child.label === 'object') {
      label = child.label[lang];
      if (this.languages.length === 0) {
        _.each(child.label, function(child, key) {
          return _this.languages.push(key);
        });
      }
    } else {
      label = child.label;
    }
    schema_dict = {
      help: child.hint,
      title: label,
      is_field: true,
      bind: child.bind
    };
    if ((_ref = child.type) === 'string' || _ref === 'text') {
      if (child.bind.readonly) {
        schema_dict['template'] = _.template('<div id="<%= editorId %>_field" data-key="<%= editorId %>" class="control-group">\
                                                        <strong></strong><%= title %>\
                                                   </div>');
        schema_dict['is_field'] = false;
      }
      schema_dict['type'] = 'Text';
    } else if ((_ref1 = child.type) === 'decimal' || _ref1 === 'int' || _ref1 === 'integer') {
      schema_dict['type'] = 'Number';
    } else if (child.type === 'date') {
      schema_dict['type'] = 'Date';
    } else if (child.type === 'geopoint') {
      schema_dict['template'] = _.template('<div id="<%= editorId %>_field" data-key="<%= editorId %>" class="control-group"><strong></strong><%= title %></div>');
      schema_dict['is_field'] = false;
    } else if (child.type === 'today') {
      schema_dict['type'] = 'Date';
      schema_dict['title'] = 'Today';
    } else if (child.type === 'time') {
      schema_dict['type'] = 'DateTime';
    } else if (child.type === 'trigger') {
      schema_dict['type'] = 'Checkbox';
    } else if (child.type === 'note') {
      schema_dict['type'] = 'Text';
      schema_dict['template'] = _.template('<div id="<%= editorId %>_field" data-key="<%= editorId %>" class="control-group">\
                                                        <strong></strong><%= title %>\
                                                   </div>');
      schema_dict['is_field'] = false;
    } else if (child.type === 'datetime') {
      schema_dict['type'] = 'DateTime';
    } else if (child.type === 'photo') {
      schema_dict['type'] = 'Text';
      schema_dict['template'] = _.template("<div id='<%= editorId %>_field' data-key='<%= editorId %>' class='control-group'>                                                        <label for='<%= editorId %>'><%= title %></label>                                                        <input type='file' accept='image/png'></input>                                                   </div>");
    } else if (child.type === 'select all that apply') {
      schema_dict['type'] = 'Checkboxes';
      schema_dict['options'] = [];
      _.each(child.choices, function(option) {
        var choice_label;
        choice_label = option.label;
        if (typeof option.label === 'object') {
          choice_label = option.label[lang];
        }
        return schema_dict['options'].push({
          val: option.name,
          label: choice_label
        });
      });
    } else if (child.type === 'group') {
      _.each(child.children, function(_child) {
        return _this.recursiveAdd(_child);
      });
      return this;
    } else if (child.type === 'select one') {
      schema_dict['type'] = 'Select';
      schema_dict['options'] = [];
      _.each(child.choices, function(option) {
        var choice_label;
        choice_label = option.label;
        if (typeof option.label === 'object') {
          choice_label = option.label[lang];
        }
        return schema_dict['options'].push({
          val: option.name,
          label: choice_label
        });
      });
    } else {
      schema_dict['type'] = 'Text';
      schema_dict['template'] = _.template('<div id="<%= editorId %>_field" data-key="<%= editorId %>" class="control-group">\
                                                        <label for="<%= editorId %>"><strong>Unsupported:</strong><%= title %></label>\
                                                   </div>');
    }
    this.item_dict[child.name] = schema_dict;
    this._fieldsets.push(child.name);
    return this._data[child.name] = child["default"];
  };
  return build_form;
});
