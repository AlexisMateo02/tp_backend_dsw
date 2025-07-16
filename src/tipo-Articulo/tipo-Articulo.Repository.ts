import { Repository } from "../shared/repository";
import { TipoArticulo } from "./tipo-Articulo.entity";

const TiposArticulos = [
    new TipoArticulo(
        "1",
        "chaleco salvavidas",
        "uso acuático"
    )
]

export class TipoArticulorepository implements Repository<TipoArticulo> {

    public findAll(): TipoArticulo[] | undefined { 
        return TiposArticulos;
    }

    public findOne(item: {id:string}): TipoArticulo | undefined {
      return TiposArticulos.find((TipoArticulo)=> TipoArticulo.id === item.id);
    } 

    public add(item: TipoArticulo): TipoArticulo | undefined {
        TiposArticulos.push(item);
        return item;
    }

    public update(item: TipoArticulo): TipoArticulo | undefined {
        const TipoArticuloIdx = TiposArticulos.findIndex((TipoArticulo) => TipoArticulo.id === item.id);
        if (TipoArticuloIdx !== -1) {
            TiposArticulos [TipoArticuloIdx] = {...TiposArticulos[TipoArticuloIdx], ...item};
            return TiposArticulos[TipoArticuloIdx];
        }
    }

    public delete(item: {id:string}): TipoArticulo | undefined {
        const TipoArticuloIdx = TiposArticulos.findIndex((TipoArticulo) => TipoArticulo.id === item.id);
        if (TipoArticuloIdx !== -1) {
            const deletedTipoArticulos = TiposArticulos[TipoArticuloIdx]; 
            TiposArticulos.splice(TipoArticuloIdx, 1);
            return deletedTipoArticulos;
        }
        return undefined;
    } 

    
}