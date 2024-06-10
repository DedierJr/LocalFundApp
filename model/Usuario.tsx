// /home/aluno/Documentos/DedierJr/LocalFundApp/model/Usuario.tsx
import bcrypt from 'bcryptjs';

export class Usuario {
    public id: string;
    public username: string; // Nome de usuário único
    public nickname: string; // Apelido não único
    public email: string;
    public senhaHash: string; // Usaremos senhaHash em vez de senha
    public datanascimento: string;
    public fotoPerfil?: string; // URL da foto de perfil
    public bio?: string; // Bio do usuário
    public friends: string[]; // Lista de IDs de amigos

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
        } else {
            this.id = '';
            this.username = '';
            this.nickname = '';
            this.email = '';
            this.senhaHash = '';
            this.datanascimento = '';
            this.friends = [];
        }
    }

    async setSenha(senha: string) {
        this.senhaHash = await bcrypt.hash(senha, 10); // Hash da senha
    }

    async verificarSenha(senha: string) {
        return await bcrypt.compare(senha, this.senhaHash); // Verificação da senha
    }

    toFirestore() {
        return {
            id: this.id,
            username: this.username,
            nickname: this.nickname,
            email: this.email,
            senhaHash: this.senhaHash, // Agora armazenamos o hash da senha
            datanascimento: this.datanascimento,
            fotoPerfil: this.fotoPerfil,
            bio: this.bio,
            friends: this.friends
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
            friends: this.friends
        };
    }
}
