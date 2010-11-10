var mongoose = require('mongoose').Mongoose;

this.User = mongoose.model('User', {
 
  properties: [
    'username',
    'password', 
    'name', 
    'email',
    'type',
    'updated'
  ],
  
  cast: {
    'updated': Date
  },
  
  indexes: ['username'],

  setters: {
    name: function(v){
      return v.capitalize(true);
    },
    password: function(v){
      return v.md5;
    }
  },

  methods: {
    save: function(fn) {
      this.updated = new Date();
      this.__super__(fn);
    }
  },
  
  static: {
    authenticate: function(u, p, fn) {
      this.find({'username': u}).first(function(user){
        if (user) {
          if (user.password == p.md5) {
            fn(user);
          } else {
            fn({ 'error': 'password is incorrect' });
          }
        } else {
          fn({ 'error': "'"+u+"' doesn't exist"});
        }
      });
    }
  }
});

this.Post = mongoose.model('Post', {
  properties: [
    'authorid',
    'type',
    'title', 
    'body',
    { 'tags' : [] },
    'created',
    'updated',
  ],
  
  cast: {
    'created': Date,
    'updated': Date
  },
  
  setters: {
    author: function(author) {
      this.authorid = author.id;
    },
    type: function(v) {
      return v || 'blog';
    }
  },
  
  indexes: ['title'],

  methods: {
    save: function(fn){
      if (!this.created) this.created = new Date();
      this.updated = new Date();
      
      this.__super__(fn);
    }
  }
});

this.Source = mongoose.model('Source', {
  properties: [
    
  ]


});