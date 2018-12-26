const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const measurementSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  domains: [{
      domain: String,
      keywords: [{
          keyword: String,
          measurement: {
            google: Number,
            bing: Number,
            yahoo: Number
          }
        }]
    }]
});

module.exports = mongoose.model('measurement', measurementSchema);
