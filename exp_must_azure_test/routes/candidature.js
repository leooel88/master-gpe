const router = require('express-promise-router')();

const Candidature = require('../controller/Candidature.js');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype == "application/pdf"){
            cb(null, './CV')
        }else{
            return cb(new Error('Only .pdf allowed'));
        }
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
const upload = multer({ storage: storage })

router.get('/create/:fichePosteId', Candidature.getReadPage);

// router.get('/create/test:fichePosteId', Candidature.createTestCandidature);

router.post('/create', upload.single('candidature_CV'), Candidature.create);

module.exports = router;