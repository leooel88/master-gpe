const fs = require('fs');


exports.getListFile = (req, res) => {

	console.log('list files')

  // Function to get current filenames
  // in directory
  fs.readdir(__dirname + '/../../../public/servedFiles/adminFile', (err, files) => {
    if (err)
      console.log(err);
    else {
      console.log("adminFile");
      files.forEach(file => {
        console.log(file);
      })
    }
  })
    
  // Function to get current filenames
  // in directory with "withFileTypes"
  // set to "true" 
    
  fs.readdir(__dirname + '/../../../public/servedFiles/adminFile', 
    { withFileTypes: true },
    (err, files) => {
    console.log("adminFile");
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        console.log(file);
      })
    }
    res.render('listfile',{files:files} );
  }) 
 
}
/*
exports.deleteFile = (req, res,next) => {

	prouct
    // include node fs module

 
// delete file named 'sample.txt'
fs.unlink('./adminFile/'+req.params.filename, function (err) {
    if (err) throw err;
    // if no error, file has been deleted successfully
    console.log('File deleted!');
})
}*/
exports.deleteFile = (req, res, next) => {
    fs.unlink(__dirname + '/../../../public/servedFiles/adminFile/'+req.body.filename, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('File deleted!');
        res.redirect('/listFile');
})
}