const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/orders');
const Product = require('../models/products');
const router = express.Router();

router.get('/',(req,res,next)=>{
  Order.find()
    .select('_id quantity product')
    .populate('product','name price')
    .exec()
    .then(docs =>{
      //config the repsonse to be more informative
      const response = {
        count:docs.length,
        orders:docs.map(doc=>{
          return {
            quantity:doc.quantity,
            product:doc.product,
            _id:doc._id,
            request:{
              type:'GET',
              url:'http://localhost:3000/orders/' + doc._id
            }
          }
        })
      }

      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error:err
      })
    });
});

router.post('/',(req,res,next)=>{
  Product.findById(req.body.productId)
    .then(product =>{
      //validate if the productId exists in the db
      if(!product){
        return res.status(404).json({
          message:'Product not found'
        })
      }

      //build out a product obj based on the model defined in the Product schema
      const order = new Order({
        _id:new mongoose.Types.ObjectId(),
        quantity:req.body.quantity,
        product:req.body.productId
      });

      return order.save()
    })
    .then(result =>{
      res.status(201).json({
        message:'Order stored',
        createdProduct:{
          _id:result._id,
          quantity:result.quantity,
          product:result.product
        },
        request:{
          type:'GET',
          url:'http://localhost:3000/orders/' + result._id
        }
      });
    })
    .catch(err =>{
      console.log(err);
      res.status(500).json({
        error:err
      })
    });
});

router.get('/:orderId',(req,res,next)=>{
  const id = req.params.orderId;
  Order.findById({ _id:id })
    .select('_id quantity product')
    .populate('product','name price')
    .exec()
    .then(order => {
      //validate that the order exists
      if(!order){
        return res.status(404).json({
          message:'Order not found'
        })
      }

      //response
      res.status(200).json({
        order:order,
        request:{
          type:'GET',
          url:'http://localhost:3000/orders',
          description:'GET method for grabbing all orders'
        }
      })
    })
    .catch(err =>{
      res.status(500).json({
        error:err
      })
    })
});

router.delete('/:orderId',(req,res,next)=>{
  const id = req.params.orderId;
  Order.deleteOne({ _id:id })
    .exec()
    .then(result=>{
      res.status(200).json({
        message:'Order deleted',
        request:{
          type:'POST',
          url:'http://localhost:3000/orders',
          body:{'quantity':'Number','productId':'ID'},
          description:'URL and body data for POSTing a new order'
        }
      });
    })
    .catch(err=>{
      res.status(500).json({
        error:err
      })
    })
});

module.exports = router;
