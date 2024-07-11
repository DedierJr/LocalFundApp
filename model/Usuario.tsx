// /LocalFundApp/model/Usuario.tsx
export class Usuario {
    public id: string;
    public username: string;
    public nickname: string;
    public email: string;
    public senha: string;
    public datanascimento: Date;
    public fotoPerfil: string;
    public bio: string;
    public followers: string[];
    public following: string[];
    public chats: string[];

    constructor(obj?: Partial<Usuario>) {
        this.id = obj?.id || '';
        this.username = obj?.username || '';
        this.nickname = obj?.nickname || '';
        this.email = obj?.email || '';
        this.senha = obj?.senha || '';
        this.datanascimento = obj?.datanascimento || new Date();
        this.fotoPerfil = obj?.fotoPerfil || '';
        this.bio = obj?.bio || '';
        this.followers = obj?.followers || [];
        this.following = obj?.following || [];
        this.chats = obj?.chats || [];
    }

    toFirestore() {
        return {
            id: this.id,
            username: this.username,
            nickname: this.nickname,
            email: this.email,
            senha: this.senha,
            datanascimento: this.datanascimento,
            fotoPerfil: this.fotoPerfil,
            bio: this.bio,
            followers: this.followers,
            following: this.following,
            chats: this.chats,
        };
    }
}