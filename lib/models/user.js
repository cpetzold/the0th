mongoose.model('User', {
 
  properties: [
    'name', 
    'alias', 
    'email',
    'salt',
    'password',
    'updated'
  ],
  
  cast: {
    'updated': Date
  },
  
  indexes: ['alias'],

  setters: {
    name: function(v){
      return v.capitalize();
    },
    password: function(v){
      return v.md5();
    }
  },

  methods: {
    save: function(fn) {
      this.updated = new Date();
      this.__super__(fn);
    }
  },
  
  static: {
    authenticate: function(e, p, fn) {
      this.find({'email': e}).first(function(user){
        if (user && user.password == p.md5()) {
          fn(user);
        } else {
          fn(false);
        }
      });
    }
  }
});