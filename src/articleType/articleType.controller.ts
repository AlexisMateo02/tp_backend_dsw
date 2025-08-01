import {Request, Response, NextFunction} from 'express';
import {ArticleType} from './articleType.entity.js';
import { ArticleTyperepository } from './articleType.repository.js'; 

const repository = new ArticleTyperepository();


function sanitizeArticleType(req: Request, res: Response, next: NextFunction) {
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


function findAll (req:Request,res:Response){
    res.json({data: repository.findAll()});
}

function findOne(req: Request, res: Response) {
    const ArticleType = repository.findOne({id: req.params.id});
    if(!ArticleType) {
        return res.status(404).json({message: "TipoArticulo not found"});
    }
    res.json({data: ArticleType});
}

function add( req: Request, res: Response){
    const inpunt = req.body.sanitizedInput;
    const ArticleTypeInput = new ArticleType(
        inpunt.id, 
        inpunt.name, 
        inpunt.mainUse
    );

const articleType = repository.add(ArticleTypeInput);
return res.status(201).send({message: "TipoArticulo created", data: ArticleType});

}

function update (req: Request, res: Response){ 
  req.body.sanitizedInput.id = req.params.id
  const ArticleType = repository.update(req.body.sanitizedInput)

  if (!ArticleType) {
    return res.status(404).send({ message: 'TipoArticulo not found' })}

  return res.status(200).send({ message: 'TipoArticulo updated successfully', data: ArticleType })
}


function remove(req: Request, res: Response) {
  const id = req.params.id
  const ArticleType = repository.delete({ id })

  if (!ArticleType) {
    res.status(404).send({ message: 'TipoArticulo not found' })
  } else {
    res.status(200).send({ message: 'TipoArticulo deleted successfully' })
  }
}


export {sanitizeTipoArticulo, findAll, findOne, add, update, remove};
