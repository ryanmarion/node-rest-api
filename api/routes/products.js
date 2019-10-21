const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const uploadFileSizeLimit = 1024*1024*5; //5MB limit for image uplaoding associated with products

const ProductsController = require('../controllers/products');


//build out a storage strategy using multer to handle uploaded files/images
const storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./uploads');
  },
  filename:function(req,file,cb){
    cb(null, Date.now() + '_' + file.originalname);
  }
});

//filter out filtypes on image upload - make sure we're only getting png and jpeg
const fileFilter = (req,file,cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
      cb(null,true);
  } else {
    cb(new Error('Incorrect filetype - jpg and png are only types accepted'),false);
  }
};

//set up an upload object thru multer to hanlde uploading files
const upload = multer({
  storage:storage,
  limits:{
    fileSize:uploadFileSizeLimit
  },
  fileFilter: fileFilter
});

//grab a list of all the products
router.get('/', ProductsController.products_get_all);

//add a new product :)
router.post('/', checkAuth, upload.single('productImage'), ProductsController.product_create_product);

//grab info off a product based on an id
router.get('/:productId', ProductsController.products_get_product);

//handle updating a product
router.patch('/:productId', checkAuth, ProductsController.products_update_product);

//handle deleting a product
router.delete('/:productId', checkAuth, ProductsController.products_delete_product);


module.exports = router;
