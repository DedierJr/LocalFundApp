// /home/aluno/Documentos/DedierJr/LocalFundApp/model/Usuario.tsx
import bcrypt from 'bcryptjs';

interface Friend {
    friendId: string;
    chatId: string;
}

interface FriendRequest {
    senderId: string;
    status: 'pending' | 'accepted' | 'rejected';
}

export class Usuario {
    public id: string;
    public username: string;
    public nickname: string;
    public email: string;
    public senhaHash: string;
    public datanascimento: string;
    public fotoPerfil?: string;
    public bio?: string;
    public friends: Friend[];
    public friendRequests: FriendRequest[];

    constructor(obj?: Partial<Usuario>) {
        if (obj) {
            this.id = obj.id || '';
            this.username = obj.username || '';
            this.nickname = obj.nickname || '';
            this.email = obj.email || '';
            this.senhaHash = obj.senhaHash || '';
            this.datanascimento = obj.datanascimento || '';
            this.fotoPerfil = obj.fotoPerfil || undefined;
            this.bio = obj.bio || undefined;
            this.friends = obj.friends || [];
            this.friendRequests = obj.friendRequests || [];
        } else {
            this.id = '';
            this.username = '';
            this.nickname = '';
            this.email = '';
            this.senhaHash = '';
            this.datanascimento = '';
            this.friends = [];
            this.friendRequests = [];
        }
    }

    async setSenha(senha: string) {
        this.senhaHash = await bcrypt.hash(senha, 10);
    }

    async verificarSenha(senha: string) {
        return await bcrypt.compare(senha, this.senhaHash);
    }

    toFirestore() {
        return {
            id: this.id,
            username: this.username,
            nickname: this.nickname,
            email: this.email,
            senhaHash: this.senhaHash,
            datanascimento: this.datanascimento,
            fotoPerfil: this.fotoPerfil,
            bio: this.bio,
            friends: this.friends,
            friendRequests: this.friendRequests
        };
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            nickname: this.nickname,
            email: this.email,
            datanascimento: this.datanascimento,
            fotoPerfil: this.fotoPerfil,
            bio: this.bio,
            friends: this.friends,
            friendRequests: this.friendRequests
        };
    }
}
