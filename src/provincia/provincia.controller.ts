import { Request, Response, NextFunction } from 'express';
import { Provincia } from './provincia.entity.js';
import { ProvinciaRepository } from './provincia.repository.js';

const repository = new ProvinciaRepository();

function sanitizeProvincia(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        codProv: req.body.codProv,
        nombreProv: req.body.nombreProv,
        codPais: req.body.codPais
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (typeof req.body.sanitizedInput[key] === "undefined") {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}

function findAll(req: Request, res: Response) {
    res.json({ data: repository.findAll() });
}

function findOne(req: Request, res: Response) {
    const provinciaFound = repository.findOne({ id: req.params.codProv });
    if (!provinciaFound) {
        return res.status(404).json({ message: "Provincia not found" });
    }
    res.json({ data: provinciaFound });
}

function add(req: Request, res: Response) {
    const input = req.body.sanitizedInput;
    const nuevaProvincia = new Provincia(
        input.codProv,
        input.nombreProv,
        input.codPais
    );
    const provinciaCreada = repository.add(nuevaProvincia);
    return res.status(201).send({ message: "Provincia created", data: provinciaCreada });
}

function update(req: Request, res: Response) {
    req.body.sanitizedInput.codProv = req.params.codProv;
    const provinciaActualizada = repository.update(req.body.sanitizedInput);

    if (!provinciaActualizada) {
        return res.status(404).send({ message: 'Provincia not found' });
    }

    return res.status(200).send({ message: 'Provincia updated successfully', data: provinciaActualizada });
}

function remove(req: Request, res: Response) {
    const provinciaEliminada = repository.delete({ id: req.params.codProv });

    if (!provinciaEliminada) {
        res.status(404).send({ message: 'Provincia not found' });
    } else {
        res.status(200).send({ message: 'Provincia deleted successfully' });
    }
}

export { sanitizeProvincia, findAll, findOne, add, update, remove };