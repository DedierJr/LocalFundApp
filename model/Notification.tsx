// /home/aluno/Documentos/DedierJr/LocalFundApp/model/Notification.tsx
export class Notification {
    public id?: string;
    public userId: string;
    public message: string;
    public type: 'followed' | 'chat_message';
    public read: boolean;
    public timestamp: Date;
    public chatId?: string;

    constructor(obj?: Partial<Notification>) {
        this.userId = obj?.userId || '';
        this.message = obj?.message || '';
        this.type = obj?.type || 'followed';
        this.read = obj?.read || false;
        this.timestamp = obj?.timestamp || new Date();
        this.chatId = obj?.type === 'chat_message' ? obj?.chatId || '' : undefined;
    }

    toFirestore() {
        const data: any = {
            userId: this.userId,
            message: this.message,
            type: this.type,
            read: this.read,
            timestamp: this.timestamp,
        };

        if (this.type === 'chat_message' && this.chatId) {
            data.chatId = this.chatId;
        }

        return data;
    }
}
