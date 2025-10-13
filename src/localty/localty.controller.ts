import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/dataBase/orm.js'
import { Localty } from './localty.entity.js'

const em = orm.em

function sanitizeLocaltyInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    zipcode: req.body.zipcode,
    name: req.body.name,
    province: req.body.province
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
    const localties = await em.find(Localty, {}, {
      populate: ['province', 'users', 'pickUpPoints']
    })
    res.status(200).json({ message: 'Found all localties', data: localties })
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try{
    const zipcode = req.params.zipcode
    const localty = await em.findOneOrFail(Localty, { zipcode }, {
      populate: ['province', 'users', 'pickUpPoints']
    })
    res.status(200).json({ message: 'Found localty', data: localty})
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const localty = em.create(Localty, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'Localty created', data: localty })
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try{
    const zipcode = req.params.zipcode
    // 🟡 CAMBIO: Usar findOneOrFail en lugar de getReference
    const localty = await em.findOneOrFail(Localty, { zipcode })
    em.assign(localty, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'Localty updated' })
  }
  catch (error: any){
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try{
    const zipcode = req.params.zipcode
    // 🟡 CAMBIO: Usar findOneOrFail en lugar de getReference  
    const localty = await em.findOneOrFail(Localty, { zipcode })
    await em.removeAndFlush(localty)
    res.status(200).json({ message: 'Localty deleted' })
  }
  catch (error: any){
    res.status(500).json({ message: error.message })
  }
}

export const controllerLocalty = {
  sanitizeLocaltyInput,
  findAll,
  findOne,
  add,
  update,
  remove,
}