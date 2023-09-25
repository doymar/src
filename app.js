import express from 'express'
import { manager } from './ProductManager.js'
const app = express()

app.get('/products',async(req,res)=>{
    try{
        const products = await manager.getProducts(req.query);
        res.status(200).json({message:'Product found',products});
    }catch(error){
        res.status(500).json({message: error.message});
    }
})

app.get('/products/:id',async(req,res)=>{
    console.log(req.params);
    const {id} = req.params
    try{
        const product = await manager.getProductById(+id);
        if(!product){
            return res.status(404).json({message: "The product does not exist"});
        }
        res.status(200).json({message:'Product found',product});
    }catch(error) {
        res.status(500).json({message: error.message});
    }
})

app.listen(8080,()=>{
    console.log('Escuchando el puerto 8080');
})