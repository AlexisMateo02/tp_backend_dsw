import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/dataBase/orm.js'
import { ArticleType } from './articleType.entity.js'

const em = orm.em

function sanitizeArticleTypeInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    id: req.body.id,
    name: req.body.name,
    mainUse: req.body.mainUse
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
    const articleTypes = await em.find(ArticleType, {})
    res.status(200).json({ message: 'Found all article types', data: articleTypes })
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const articleType = await em.findOneOrFail(ArticleType, { id })
    res.status(200).json({ message: 'Found article type', data: articleType})
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const articleType = em.create(ArticleType, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'Article type created', data: articleType })
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const articleType = em.getReference(ArticleType, id)
    em.assign(articleType, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'Article type updated' })
  }
  catch (error: any){
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const articleType = em.getReference(ArticleType, id)
    await em.removeAndFlush(articleType)
    res.status(200).json({ message: 'Article type deleted' })
  }
  catch (error: any){
    res.status(500).json({ message: error.message })
  }
}

export const controllerArticleType = {
	sanitizeArticleTypeInput,
	findAll,
	findOne,
	add,
	update,
	remove,
}
