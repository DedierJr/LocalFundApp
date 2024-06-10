// /home/aluno/Documentos/DedierJr/LocalFundApp/model/Chat.tsx

export class Chat {
    public id: string;
    public participants: string[]; // Lista de IDs dos participantes
    public createdAt: string; // Data de criação do chat

    constructor(obj?: Partial<Chat>) {
        if (obj) {
            this.id = obj.id || '';
            this.participants = obj.participants || [];
            this.createdAt = obj.createdAt || new Date().toISOString();
        } else {
            this.id = '';
            this.participants = [];
            this.createdAt = new Date().toISOString();
        }
    }

    toFirestore() {
        return {
            id: this.id,
            participants: this.participants,
            createdAt: this.createdAt
        };
    }

    toJSON() {
        return {
            id: this.id,
            participants: this.participants,
            createdAt: this.createdAt
        };
    }
}
