define(['react', './local-storage', './mixins', './listcontents', './content-table', './breadcrumbs'],
    function (React, localStorage, mixins, Contents, ContentTable, BreadCrumbs, AnalysisTools) {

  'use strict';

  var viewKey = 'org.intermine.list-tool.list.view';

  var ListView = React.createClass({

    displayName: 'ListView',

    getInitialState: function () {
      return {
        path: this.props.list.type,
        view: (localStorage[viewKey] || 'grid'), 
        selected: {},
        classkeys: {}
      }
    },

    mixins: [mixins.SetStateProperty, mixins.ComputableState],

    computeState: function (props) {
      if (!this.state.path) {
        this.setStateProperty('path', props.list.type);
      }
      props.service.fetchClassKeys().then(this.setStateProperty.bind(this, 'classkeys'));
    },

    render: function () {
      var controls, contents, contentArgs;

      controls = BreadCrumbs({
        path: this.state.path,
        service: this.props.service,
        proceedTo: this._proceedTo,
        revertTo: this._revertTo,
        view: this.state.view,
        onChangeView: this._changeView
      });

      contentArgs = {
        service: this.props.service,
        list: this.props.list,
        classkeys: this.state.classkeys,
        path: this.state.path,
        selected: this.state.selected,
        onItemSelected: this._onItemSelected,
        filterTerm: this.props.filterTerm
      };

      if (this.state.view === 'grid') {
        contents = Contents(contentArgs);
      } else if (this.state.view === 'table') {
        contents = ContentTable(contentArgs);
      } else {
        contents = d.p({className: 'error'}, 'Unknown view: ' + this.state.view);
      }

      return React.DOM.div({}, controls, contents);
    },

    _onItemSelected: function (id, isSelected) {
      var state = this.state;
      state.selected[id] = isSelected;
      this.setState(state);
    },

    _changeView: function (view) {
      localStorage[viewKey] = view;
      this.setStateProperty('view', view);
    },

    _revertTo: function revertTo (path) {
      this.setStateProperty('path', path);
    },

    _proceedTo: function proceedTo (ref) {
      var state = this.state;
      this.setStateProperty('path', state.path + '.' + ref.name);
    }
  });


  return ListView;
});
