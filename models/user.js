var mongoose = require('mongoose').Mongoose;

mongoose.model('User', {
 
  properties: [
    'name', 
    'alias', 
    'email', 
    'password',
    { 'posts': 
      [[  'title', 
          'body', 
          'posted', 
          'modified' 
      ]] 
    } 
  ],
  
  cast: {
    'posts.posted': Date,
    'posts.modified': Date
  },
  
  indexes: ['alias'],

  setters: {
    name: function(v){
      return this.v.capitalize();
    },
  },

  getters: {
    
  },

  methods: {
    save: function(fn){
      this.updated_at = new Date();
      this.__super__(fn);
    }
  },

  static: {

  }
});