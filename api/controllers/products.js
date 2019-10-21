const Product = require('../models/products');
const mongoose = require('mongoose');

exports.products_get_all = (req,res,next)=>{
  Product.find()
  .select('name price _id productImage') //only grab these fields
  .exec()
  .then(docs=>{
    //config the repsonse to be more informative
    const response = {
      count:docs.length,
      prodcuts:docs.map(doc=>{
        return {
          name:doc.name,
          price:doc.price,
          _id:doc._id,
          productImage:doc.productImage,
          request:{
            type:'GET',
            url:'http://localhost:3000/products/' + doc._id
          }
        }
      })
    }

    res.status(200).json(response);
  })
  .catch(err =>{
    console.log(err);
    res.status(500).json({
      error:err
    });
  });
};

exports.products_create_product = (req,res,next) => {
  console.log(req.file);

  //build out a product obj based on the model defined in the Product schema
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage:req.file.path
  });

  //save the product to the db
  product.save().then(result => {
    //send back some results to validate creation of the product
    res.status(201).json({
      message:'Created product successfully',
      createdProduct:{
        name:result.name,
        price:result.price,
        _id:result._id
      },
      request:{
        type:'GET',
        url:'http://localhost:3000/products/' + result._id
      }
    });
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      error:err
    })
  });
}

exports.products_get_product = (req,res,next)=>{
  const id = req.params.productId;

  //grab the product based on the id, and send back the doc
  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then((doc)=>{
      //config a response with extra info
      const response = {
        product:doc,
        request:{
          type:'GET',
          url:'http://localhost:3000/products',
          description:'Get all products'
        }
      }

      if(doc){
        res.status(200).json(response);
      } else{
        res.status(404).json({
          message:'No valid entry found for provided id'
        })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error:err});
    });
}

exports.products_update_product = (req,res,next)=>{
  const id = req.params.productId;
  const updateOps = {};

  //get everything that should be changed off the body - pass data as an arrray in JSON
  for(const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }

  //update the product using id from params and data from the body using $set
  Product.update({ _id:id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message:'Product updated',
        request:{
          type:'GET',
          url:'http://localhost:3000/products/' + id
        }
      });
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({
        error:err
      });
    });
};

exports.products_delete_product = (req,res,next)=>{
  const id = req.params.productId;
  Product.deleteOne({ _id:id })
    .exec()
    .then(result=>{
      res.status(200).json({
        message:'Product deleted',
        request:{
          type:'POST',
          url:'http://localhost:3000/products',
          body:{'name':'String','price':'Number'},
          description:'URL and body data for POSTing a new product'
        }
      });
    })
    .catch(err =>{
      console.log(err);
      res.status(500).json({
        error:err
      })
    });
};
