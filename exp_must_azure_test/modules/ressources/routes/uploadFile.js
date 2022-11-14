const router = require('express-promise-router')();

const uploadFile = require('../controllers/uploadFile.js');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype == "application/pdf" || file.mimetype == "image/jpeg"){
            cb(null, './public/servedFiles/adminFile')
        }else{
            return cb(new Error('Only .pdf or .jpeg allowed'));
        }
    },
    filename: function (req, file, cb) {
      cb(null, req.body.titre +'.'+ file.mimetype.split('/').reverse()[0])
    }
  })
const upload = multer({ storage: storage })

router.post('/create', upload.single('document'), uploadFile.create);
router.get('/', function (req, res, next) {
	res.render('uploadFileRh');
});
module.exports = router;