import {Request, Response, NextFunction} from 'express';
import {TipoArticulo} from './tipo-Articulo.entity';
import { TipoArticulorepository } from './tipo-Articulo.repository'; 

const repository = new TipoArticulorepository();


function sanitizeTipoArticulo(req: Request, res: Response, next: NextFunction) {
 req.body.sanitizedInput = {
    id: req.body.id,
    nombre: req.body.nombre,
    usoPrincipal: req.body.usoPrincipal
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
    const TipoArticulo = repository.findOne({id: req.params.id});
    if(!TipoArticulo) {
        return res.status(404).json({message: "TipoArticulo not found"});
    }
    res.json({data: TipoArticulo});
}

function add( req: Request, res: Response){
    const inpunt = req.body.sanitizedInput;
    const TipoArticuloInput = new TipoArticulo(
        inpunt.id, 
        inpunt.nombre, 
        inpunt.usoPrincipal
    );

const tipoArticulo = repository.add(TipoArticuloInput);
return res.status(201).send({message: "TipoArticulo created", data: TipoArticulo});

}

function update (req: Request, res: Response){ 
  req.body.sanitizedInput.id = req.params.id
  const TipoArticulo = repository.update(req.body.sanitizedInput)

  if (!TipoArticulo) {
    return res.status(404).send({ message: 'TipoArticulo not found' })}

  return res.status(200).send({ message: 'TipoArticulo updated successfully', data: TipoArticulo })
}


function remove(req: Request, res: Response) {
  const id = req.params.id
  const TipoArticulo = repository.delete({ id })

  if (!TipoArticulo) {
    res.status(404).send({ message: 'TipoArticulo not found' })
  } else {
    res.status(200).send({ message: 'TipoArticulo deleted successfully' })
  }
}


export {sanitizeTipoArticulo, findAll, findOne, add, update, remove};
