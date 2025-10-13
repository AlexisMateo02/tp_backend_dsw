import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/dataBase/orm.js'
import { PickUpPoint } from './pickUpPoint.entity.js'
import { Localty } from '../localty/localty.entity.js'

const em = orm.em

function sanitizePickUpPointInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    id: req.body.id,
    adressStreet: req.body.adressStreet,
    adressnumber: req.body.adressnumber,
    adressFloor: req.body.adressFloor,
    adressApartment: req.body.adressApartment,
    tower: req.body.tower,
    localty: req.body.localty
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
    const pickUpPoints = await em.find(PickUpPoint, {}, {
      populate: ['localty', 'publishments']
    })
    res.status(200).json({ message: 'Found all pick up points', data: pickUpPoints })
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const pickUpPoint = await em.findOneOrFail(PickUpPoint, { id }, {
      populate: ['localty', 'publishments']
    })
    res.status(200).json({ message: 'Found pick up point', data: pickUpPoint})
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const pickUpPoint = em.create(PickUpPoint, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'Pick up point created', data: pickUpPoint })
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const pickUpPoint = em.getReference(PickUpPoint, id)
    em.assign(pickUpPoint, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'Pick up point updated' })
  }
  catch (error: any){
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const pickUpPoint = em.getReference(PickUpPoint, id)
    await em.removeAndFlush(pickUpPoint)
    res.status(200).json({ message: 'Pick up point deleted' })
  }
  catch (error: any){
    res.status(500).json({ message: error.message })
  }
}

export const controllerPickUpPoint = {
  sanitizePickUpPointInput,
  findAll,
  findOne,
  add,
  update,
  remove,
}