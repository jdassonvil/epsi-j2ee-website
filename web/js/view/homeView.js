var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var template = require("../../template/home.hbs");

var HomeView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },

  render: function(){
    $('.root').html(template(template));
  }
});

module.exports = HomeView;
