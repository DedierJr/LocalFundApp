import bcrypt from 'bcryptjs';

export class Usuario {
    public id: string;
    public nome: string;
    public email: string;
    public senhaHash: string; // Usaremos senhaHash em vez de senha
    public datanascimento: string;

    constructor(obj?: Partial<Usuario>) {
        if (obj) {
            this.id = obj.id || '';
            this.nome = obj.nome || '';
            this.email = obj.email || '';
            this.senhaHash = obj.senhaHash || '';
            this.datanascimento = obj.datanascimento || '';
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
            nome: this.nome,
            email: this.email,
            senhaHash: this.senhaHash, // Agora armazenamos o hash da senha
            datanascimento: this.datanascimento
        };
    }

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email,
            datanascimento: this.datanascimento
        };
    }
}
