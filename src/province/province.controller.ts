import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/dataBase/orm.js'
import { Province } from './province.entity.js'

const em = orm.em

function sanitizeProvinceInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    id: req.body.id,
    name: req.body.name,
    country: req.body.country
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
    const provinces = await em.find(Province, {}, {
      populate: ['localties']  // ← ÚNICO CAMBIO: poblar localidades
    })
    res.status(200).json({ message: 'Found all provinces', data: provinces })
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const province = await em.findOneOrFail(Province, { id }, {
      populate: ['localties']  // ← ÚNICO CAMBIO: poblar localidades
    })
    res.status(200).json({ message: 'Found province', data: province})
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const province = em.create(Province, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'Province created', data: province })
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const province = em.getReference(Province, id)
    em.assign(province, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'Province updated' })
  }
  catch (error: any){
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const province = em.getReference(Province, id)
    await em.removeAndFlush(province)
    res.status(200).json({ message: 'Province deleted' })
  }
  catch (error: any){
    res.status(500).json({ message: error.message })
  }
}

export const controllerProvince = {
  sanitizeProvinceInput,
  findAll,
  findOne,
  add,
  update,
  remove,
}