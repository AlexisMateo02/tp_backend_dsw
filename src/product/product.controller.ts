import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/dataBase/orm.js'
import { Product } from './product.entity.js'

const em = orm.em

function sanitizeProductInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity,
    articleType: req.body.articleType,
    kayakType: req.body.kayakType
    // ❌ NO incluir publishments - se maneja desde Publishment
  };
  //more checks here

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (typeof req.body.sanitizedInput[key] === "undefined") {
      delete req.body.sanitizedInput[key];
    }
  })
  next();
}

async function findAll(req: Request, res: Response) {
  try{
    const products = await em.find(Product, {}, {
      populate: ['articleType', 'kayakType'] // ← Solo tipos, no publishments
    })
    res.status(200).json({ message: 'Found all products', data: products })
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const product = await em.findOneOrFail(Product, { id }, {
      populate: ['articleType', 'kayakType'] // ← Solo tipos, no publishments
    })
    res.status(200).json({ message: 'Found product', data: product})
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    // Validación: No puede tener ambos tipos
    const { articleType, kayakType } = req.body.sanitizedInput;
    if (articleType && kayakType) {
      return res.status(400).json({ 
        message: 'Product cannot have both articleType and kayakType' 
      })
    }
    
    const product = em.create(Product, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'Product created', data: product })
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const product = em.getReference(Product, id)
    em.assign(product, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'Product updated' })
  }
  catch (error: any){
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const product = em.getReference(Product, id)
    await em.removeAndFlush(product)
    res.status(200).json({ message: 'Product deleted' })
  }
  catch (error: any){
    res.status(500).json({ message: error.message })
  }
}

export const controllerProduct = {
  sanitizeProductInput,
  findAll,
  findOne,
  add,
  update,
  remove,
}