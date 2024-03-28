import { firestore } from '../firebase.js';

export class Marcador {
    public id: string;
    public lat: number;
    public long: number;
    public titulo: string;
    public descricao: string;
    
    constructor(obj?: Partial<Marcador>) {
        if (obj) {
            this.id = obj.id || '';
            this.lat = obj.lat || 0;
            this.long = obj.long || 0;
            this.titulo = obj.titulo || '';
            this.descricao = obj.descricao || '';
        } else {
            this.id = '';
            this.lat = 0;
            this.long = 0;
            this.titulo = '';
            this.descricao = '';
        }
    }

    toFirestore() {
        return {
            id: this.id,
            lat: this.lat,
            long: this.long,
            titulo: this.titulo,
            descricao: this.descricao
        };
    }

    async salvar() {
        const batch = firestore.batch();
        const marcadorRefComId = firestore.collection('Marcador').doc();
        this.id = marcadorRefComId.id;
        batch.set(marcadorRefComId, this.toFirestore());
        await batch.commit();
    }

    toString() {
        return `{
            "id": "${this.id}",
            "lat": "${this.lat}",
            "long": "${this.long}",
            "titulo": "${this.titulo}",
            "descricao": "${this.descricao}"
        }`;
    }
}
