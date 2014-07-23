var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index.ejs', {
        title: 'blah',
        // blah: JSON.stringify(req.app.get('blah')) || '',
    });
});

module.exports = router;
