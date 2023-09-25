import { existsSync, promises } from 'fs'

class ProductManager {

    constructor(){
        this.path = 'Products.json'
    }

    async getProducts(queryObj){
        //console.log("query",queryObj);
        const {limit} = queryObj;
        try{
            if(existsSync(this.path)){
                const productsFile = await promises.readFile(this.path,'utf-8');
                const productData = JSON.parse(productsFile);
                return limit ? productData.slice(0,+limit) : productData;
                //return JSON.parse(productsFile)
            }else {
                return []
            }
        } catch (error){
            return error
        }
    }

    async getProductById(idProduct) {
        try{
            const products = await this.getProducts({})
            const product = products.find((p) => p.id === idProduct)
            return product
        }catch(error){
            return error
        }
    }

    async updateProduct(idProduct,product){
        try{
            const products = await this.getProducts({})
            const productnew = products.find((p) => p.id === idProduct)
            const returnedTarget = Object.assign(productnew, product)
            const newArrayProducts = products.filter(p=>p.id!==idProduct)
            newArrayProducts.push(productnew)
            await promises.writeFile(this.path,JSON.stringify(newArrayProducts))

        }catch(error){
            return error
        }
    }

    async deleteProduct(idProduct){
        try{
            const products = await this.getProducts({})
            const newArrayProducts = products.filter(p=>p.id!==idProduct)
            const product = products.find((p) => p.id === idProduct)
        if (!product) {
            console.log('Product not found');
            return
        }
        await promises.writeFile(this.path,JSON.stringify(newArrayProducts))

        }catch(error){
            return error
        }
    }

    async addProduct(product){
        try{
            const products = await this.getProducts({})
            let id
            if (!products.length) {
                id = 1
            } else {
                id = products[products.length - 1].id + 1
            }
            const {title,description,price,thumbnail,code,stock} = product
            if(!title || !description || !price || !thumbnail || !code || !stock){
                console.log('Some data is missing')
                return
            }
    
            const isCodeRepeat = products.some((p) => p.code === code)
            if (isCodeRepeat) {
                console.log('Code already used')
                return
            }
            
            products.push({ id, ...product })
            await promises.writeFile(this.path,JSON.stringify(products))
            console.log('Product added')
        } catch(error){
            return error
        }
    }
}

export const manager = new ProductManager();