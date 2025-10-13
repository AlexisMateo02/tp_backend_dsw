import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/dataBase/orm.js'
import { KayakType } from './kayakType.entity.js'

const em = orm.em

function sanitizeKayakTypeInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    id: req.body.id,
    model: req.body.model,
    brand: req.body.brand,
    material: req.body.material,
    paddlersQuantity: req.body.paddlersQuantity,
    maxWeightCapacity: req.body.maxWeightCapacity,
    constructionType: req.body.constructionType,
    length: req.body.length,
    beam: req.body.beam
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (typeof req.body.sanitizedInput[key] === "undefined") {
      delete req.body.sanitizedInput[key];
    }
  })
  next();
}

async function findAll(req: Request, res: Response) {
  try{
    const kayakTypes = await em.find(KayakType, {}, {
      populate: ['product']  // ← Poblar el producto asociado
    })
    
    res.status(200).json({ 
      message: 'Found all kayak types', 
      data: kayakTypes 
    })
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const kayakType = await em.findOneOrFail(KayakType, { id }, {
      populate: ['product']
    })
    
    res.status(200).json({ 
      message: 'Found kayak type', 
      data: kayakType
    })
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    // 🟡 CAMBIO: Verificar si ya existe un producto con este kayakType
    const kayakType = em.create(KayakType, req.body.sanitizedInput)
    await em.flush()
    
    res.status(201).json({ 
      message: 'Kayak type created', 
      data: kayakType 
    })
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const kayakType = em.getReference(KayakType, id)
    em.assign(kayakType, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'Kayak type updated' })
  }
  catch (error: any){
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const kayakType = await em.findOne(KayakType, { id }, {
      populate: ['product']
    })
    
    if (!kayakType) {
      return res.status(404).json({ message: 'Kayak type not found' })
    }
    
    // 🟡 CAMBIO: Prevenir borrado si tiene un producto asociado
    if (kayakType.product) {
      return res.status(400).json({ 
        message: 'Cannot delete kayak type with associated product',
        productId: kayakType.product.id
      })
    }
    
    await em.removeAndFlush(kayakType)
    res.status(200).json({ message: 'Kayak type deleted' })
  }
  catch (error: any){
    res.status(500).json({ message: error.message })
  }
}

// 🟡 NUEVA FUNCIÓN: Obtener el producto asociado a un kayakType
async function getProduct(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const kayakType = await em.findOneOrFail(KayakType, { id }, {
      populate: ['product']
    })
    
    if (!kayakType.product) {
      return res.status(404).json({ 
        message: 'No product associated with this kayak type' 
      })
    }
    
    res.status(200).json({ 
      message: 'Product found for kayak type',
      data: kayakType.product 
    })
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const controllerKayakType = {
  sanitizeKayakTypeInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  getProduct  // 🟡 NUEVA FUNCIÓN
}