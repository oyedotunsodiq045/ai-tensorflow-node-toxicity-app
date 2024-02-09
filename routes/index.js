const express = require('express');
const router = express.Router();
const toxicity = require('@tensorflow-models/toxicity');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* handling the text */
router.post('/text', function (req, res, next) {
  // The minimum prediction confidence.
  const threshold = 0.9;

  // Load the model. Users optionally pass in a threshold and an array of
  // labels to include.
  toxicity.load(threshold).then(model => {
    const sentences = req.body.text;

    model.classify(sentences).then(predictions => {
      // `predictions` is an array of objects, one for each prediction head,
      // that contains the raw probabilities for each input along with the
      // final prediction in `match` (either `false` or `true`).
      // If neither prediction exceeds the threshold, `match` is `null`.

      console.log(predictions);
      
      // filter the predictions to get only matched predictions
      const predictionArray = predictions.filter(function (el) {
        if (el.results[0].match === true) {
          return el.label
        }
      });
      
      //return a message about the predictions
      let message;
      predictionArray.length > 0 ? message = "We have fould this text offensive" : message = "Good"
      res.status(201).json({ 'message' : message, 'result' : predictionArray });

    });
  });
});

module.exports = router;
