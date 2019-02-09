const mongoose  = require('mongoose');
const Url       = require('../config/urlDocumentModel');
require('dotenv').config();

function insertUrlsToDB(urlDocumentInput){
  mongoose.connect(process.env.URI_MONGODB, { useNewUrlParser: true });

  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    // const tmp = new Url(getUrlStructuredData());
    // tmp.save().then(() => {
    //   console.log("json to DB completed!");
    //   db.close();
    // });
    for(singleDocument of urlDocumentInput){
      // console.log(JSON.stringify(singleDocument) + '\n\n');
      const tmp = new Url(singleDocument);
      tmp.save().then(() => {
        console.log("json to DB completed!");
        db.close();
      });
    }
    // db.close();
  })

  function getUrlStructuredData(){
    let urlObject = {
      "microdata": {},
      "rdfa": {},
      "jsonld": {}
    };

    return urlDocumentInput;
  }
}

module.exports = {
  insertUrlsToDB: insertUrlsToDB
};
