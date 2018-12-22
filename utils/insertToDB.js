const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const measurementInput  = require('../test/measurements/2018-12-20');

mongoose.connect(URI, { useNewUrlParser: true });

const measurementSchema = new Schema({
  timestamp: String,
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
  console.log("connected");



  const tmp = new measurement(getMeasurement());
  // tmp.save().then(() => console.log('meow'));
  tmp.save();

})

measurement.find({}, function (err, result) {
  if (err) return console.log(err);
  // console.log(JSON.stringify(result));
  db.close()
});

function getMeasurement(){
  let measurementObject = {"timestamp":"2018-12-20","domains":[]};
  let i = 0;
  for (let domain in measurementInput.google){
    let keywordsArr = [];
    measurementObject.domains.push({"domain":domain,"keywords":[]});
    for (let i in measurementInput.google[domain]){
      for (let keyword in measurementInput.google[domain][i]){
        keywordsArr.push({"keyword":keyword,"measurement":{"google":0,"bing":0,"yahoo":0}});
      }
    }
    measurementObject.domains[i].keywords = keywordsArr;
    i++;
  }
  for (let searchengine in measurementInput){
    let k = 0;
    for (let domain in measurementInput[searchengine]){
      let w = 0;
      for (let j in measurementInput[searchengine][domain]){
        for (let keyword in measurementInput[searchengine][domain][j]){
          measurementObject.domains[k].keywords[w].measurement[searchengine] = measurementInput[searchengine][domain][j][keyword];
          w++;
        }
      }
      k++;
    }
  }

  console.log(JSON.stringify(measurementObject));
  return measurementObject;
}

// OK
// let measurementObject = {"domains":[]};
// let i = 0;
// for (let domain in measurementInput.google){
//   let keywordsArr = [];
//   measurementObject.domains.push({"domain":domain,"keywords":[]});
//   for (let i in measurementInput.google[domain]){
//     for (let keyword in measurementInput.google[domain][i]){
//       keywordsArr.push({
//         "keyword":keyword,
//         "measurement":{
//           "google":0,
//           "bing":0,
//           "yahoo":0
//         }
//       });
//     }
//   }
//   measurementObject.domains[i].keywords = keywordsArr;
//   i++;
// }
// // console.log(JSON.stringify(measurementObject));
//
// for (let searchengine in measurementInput){
//   let k = 0;
//   for (let domain in measurementInput[searchengine]){
//     // console.log(k + ". domain: " + domain);
//     let w = 0;
//     for (let j in measurementInput[searchengine][domain]){
//       for (let keyword in measurementInput[searchengine][domain][j]){
//         // console.log(w + ". " + keyword + ": " + measurementInput[searchengine][domain][j][keyword]);
//         // console.log(measurementObject.domains[k].keywords[w].measurement[searchengine]);
//         measurementObject.domains[k].keywords[w].measurement[searchengine] = measurementInput[searchengine][domain][j][keyword];
//         w++;
//       }
//     }
//     k++;
//   }
// }

// console.log(JSON.stringify(measurementObject));
