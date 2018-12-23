const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

function insertToDB(measurementInput){
  mongoose.connect(URI, { useNewUrlParser: true });

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
  const measurement = mongoose.model('measurement', measurementSchema);


  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    // console.log("connected");
    const tmp = new measurement(getMeasurement());
    // tmp.save();
    tmp.save().then(() => {
      console.log("json to DB completed!");
      db.close();
    });
  })

  function getMeasurement(){
    let measurementObject = {
      "domains":[]
    };

    let i = 0;
    for (let domain in measurementInput){
      measurementObject.domains.push({
        "domain":domain,
        "keywords":[]
      });
      for (let keyword in measurementInput[domain]){
        measurementObject.domains[i].keywords.push({
          "keyword":keyword,
          "measurement":measurementInput[domain][keyword]
        });
      }
      i++;
    }

    return measurementObject;
  }
}

module.exports = {
  insertToDB: insertToDB
};
