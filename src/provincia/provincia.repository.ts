import { Repository } from "../shared/repository";
import { Provincia } from "./provincia.entity";

const Provincias = [
    new Provincia(
        "3",
        "Buenos Aires",
        "argentina"
    )
]

export class Provinciarepository implements Repository<Provincia> {

    public findAll(): Provincia[] | undefined { 
        return Provincias;
    }

public findOne(item: {id:string}): Provincia | undefined {
  return Provincias.find((provincia)=> provincia.codProv === item.id);
}


    public add(item: Provincia): Provincia | undefined {
        Provincias.push(item);
        return item;
    }

    public update(item: Provincia): Provincia | undefined {
        const ProvinciaIdx = Provincias.findIndex((Provincia) => Provincia.codProv === item.codProv);
        if (ProvinciaIdx !== -1) {
            Provincias [ProvinciaIdx] = {...Provincias[ProvinciaIdx], ...item};
            return Provincias[ProvinciaIdx];
        }
    }
public delete(item: {id:string}): Provincia | undefined {
  const idx = Provincias.findIndex((provincia) => provincia.codProv === item.id);
  if (idx !== -1) {
    const deleted = Provincias[idx];
    Provincias.splice(idx, 1);
    return deleted;
  }
  return undefined;
}
}