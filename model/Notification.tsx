// /home/aluno/Documentos/DedierJr/LocalFundApp/model/Notification.tsx
export class Notification {
    public id?: string;
    public userId: string;
    public message: string;
    public type: 'friend_request' | 'chat_message';
    public read: boolean;
    public timestamp: Date;

    constructor(obj?: Partial<Notification>) {
        this.userId = obj?.userId || '';
        this.message = obj?.message || '';
        this.type = obj?.type || 'friend_request';
        this.read = obj?.read || false;
        this.timestamp = obj?.timestamp || new Date();
    }

    toFirestore() {
        return {
            userId: this.userId,
            message: this.message,
            type: this.type,
            read: this.read,
            timestamp: this.timestamp,
        };
    }
}
