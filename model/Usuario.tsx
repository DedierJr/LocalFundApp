// /home/aluno/Documentos/DedierJr/LocalFundApp/model/Usuario.tsx
import bcrypt from 'bcryptjs'; // Importe a biblioteca de hash bcryptjs

export class Usuario {
    public id: string;
    public username: string;
    public nickname: string;
    public email: string;
    public senhaHash: string; // Agora é o hash da senha
    public datanascimento: Date;
    public fotoPerfil: string;
    public bio: string;
    public friends: string[];
    public friendRequests: { senderId: string, status: string }[];

    constructor(obj?: Partial<Usuario>) {
        this.id = obj?.id || '';
        this.username = obj?.username || '';
        this.nickname = obj?.nickname || '';
        this.email = obj?.email || '';
        this.senhaHash = obj?.senhaHash ? bcrypt.hashSync(obj.senhaHash, 10) : ''; // Hash da senha
        this.datanascimento = obj?.datanascimento || new Date();
        this.fotoPerfil = obj?.fotoPerfil || '';
        this.bio = obj?.bio || '';
        this.friends = obj?.friends || [];
        this.friendRequests = obj?.friendRequests || [];
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
