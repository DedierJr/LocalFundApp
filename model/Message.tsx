// /home/aluno/Documentos/DedierJr/LocalFundApp/model/Message.tsx
export class Message {
    public id: string;
    public chatId: string;
    public senderId: string;
    public content: string;
    public timestamp: Date;

    constructor(obj?: Partial<Message>) {
        if (obj) {
            this.id = obj.id || '';
            this.chatId = obj.chatId || '';
            this.senderId = obj.senderId || '';
            this.content = obj.content || '';
            this.timestamp = obj.timestamp || new Date();
        } else {
            this.id = '';
            this.chatId = '';
            this.senderId = '';
            this.content = '';
            this.timestamp = new Date();
        }
    }

    toFirestore() {
        return {
            chatId: this.chatId,
            senderId: this.senderId,
            content: this.content,
            timestamp: this.timestamp
        };
    }

    toJSON() {
        return {
            id: this.id,
            chatId: this.chatId,
            senderId: this.senderId,
            content: this.content,
            timestamp: this.timestamp
        };
    }
}