const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const notifier = require('node-notifier');      // thong bao

const ProductModel = require('./router/ProductModel')

const app = express()
const uri = 'mongodb://127.0.0.1:27017/Lab5'

// sử dụng middleware body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs')   // khai báo template EJS
app.set('views', './views')      // khai báo views chứa các giao diện


//edit
app.post('/product/edit/:id', (req, res) =>{
    mongoose.connect(uri)
    .then(()=>{

        const id = req.params.id
        const name = req.body.name
        const price = req.body.price
        const quantity = req.body.quantity

        ProductModel.updateMany({_id: id}, {name: name, price: price, quantity: quantity})
        .then((result ) =>{ res.redirect('/')})
        .catch((error) => {
          console.log(error);
        });

    })
    .catch((err) => { res.send('faile connect: ' + err) })
    mongoose.disconnect
})


//delete
app.get('/product/delete/:id', (req, res) =>{

    ProductModel.deleteOne({_id: req.params.id})
    .then((data) =>{ 
        res.redirect(`/`)
    })

})

//creat
app.post('/product/add', (req, res) => {

    mongoose.connect(uri)
        .then(() => {

            const product = new ProductModel(req.body)

            product.save().then(res.redirect(`/?data="add success product ${req.body.name}"`)).catch()

        //     ProductModel.create({
        //         name: req.body.name,
        //         price: req.body.price,
        //         quantity: req.body.quantity
        //     })
        //         .then(() => { res.redirect(`/?data="add success product ${req.body.name}"`) })
        //         .catch((err) => {
                   
        //             res.redirect('/')
        //         })

        })
        .catch((err) => { res.send('faile connect: ' + err) })
    mongoose.disconnect

})

// read
app.get('/', (req, res) => {

    mongoose.connect(uri)
        .then(() => {
            console.log('connect succes')

            ProductModel.find()
                .then((data) => {
                    res.render('list-product', products = data)
                }).catch(((err) => {
                    res.send('Read documents faile')
                }))

        })
        .catch((err) => { res.send('faile connect: ' + err) })
    mongoose.disconnect
})

// show form
app.get('/form/add', (req, res) => {

    // data thong bao
    const data = req.query.data
    if(data != ''){
        notifier.notify(data);
    }

        res.render('form-product', productEdit = null)
})

app.get('/form/add/:id', (req, res) => {

    mongoose.connect(uri)
        .then(() => {
            console.log('connect succes')

            ProductModel.find({_id : req.params.id})
                .then((data) => {
                    res.render('form-product', productEdit = data[0])
                    // res.send(data)
                }).catch(((err) => {
                    res.send('Read documents faile')
                }))
        })
        .catch((err) => { res.send('faile connect: ' + err) })
    mongoose.disconnect
  
})

app.listen(3000)