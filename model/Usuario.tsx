// /home/aluno/Documentos/DedierJr/LocalFundApp/model/Usuario.tsx
import bcrypt from 'bcryptjs'; 

export class Usuario {
    public id: string;
    public username: string;
    public nickname: string;
    public email: string;
    public senhaHash: string; 
    public datanascimento: Date;
    public fotoPerfil: string;
    public bio: string;
    public followers: string[]; 
    public following: string[]; 
    public chats: string[]; // Array to store chat IDs

    constructor(obj?: Partial<Usuario>) {
        this.id = obj?.id || '';
        this.username = obj?.username || '';
        this.nickname = obj?.nickname || '';
        this.email = obj?.email || '';
        this.senhaHash = obj?.senhaHash ? bcrypt.hashSync(obj.senhaHash, 10) : ''; 
        this.datanascimento = obj?.datanascimento || new Date();
        this.fotoPerfil = obj?.fotoPerfil || '';
        this.bio = obj?.bio || '';
        this.followers = obj?.followers || [];
        this.following = obj?.following || [];
        this.chats = obj?.chats || []; 
    }

    // Método para verificar se a senha fornecida corresponde à senha armazenada
    verificaSenha(senha: string): boolean {
        return bcrypt.compareSync(senha, this.senhaHash);
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
            friendRequests: this.friendRequests,
        };
    }
}
