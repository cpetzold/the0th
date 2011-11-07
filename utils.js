module.exports = {

  binary: function(decimal) {
    var r = 0
      , n = 1;

    while (n * 2 <= decimal) {
      n *= 2;
    }
    
    while (n > 0.5) {
      if (decimal >= n) {
        r += '1';
        decimal -= n;
      } else if(decimal < n) {
        r += '0';
      }
      n /= 2;
    } 

    return r;
  }

};
