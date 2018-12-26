const mongoose    = require('mongoose');
const uriDB       = process.env.URI_MONGODB;
const Measurement = require('../config/measurementModel');

function insertToDB(measurementInput){
  mongoose.connect(uriDB, { useNewUrlParser: true });

  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    const tmp = new Measurement(getMeasurement());
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
