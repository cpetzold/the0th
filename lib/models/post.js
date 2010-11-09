mongoose.model('Post', {
  properties: [
    'authorid', 
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
    }
  },
  
  indexes: ['title'],

  methods: {
    save: function(fn){
      this.created = this.created || new Date();
      this.updated = new Date();
      
      this.__super__(fn);
    }
  }
});