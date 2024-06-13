// /home/aluno/Documentos/DedierJr/LocalFundApp/services/friendRequestService.ts
import { firestore } from '../firebase';
import { Usuario } from '../model/Usuario';

export const sendFriendRequest = async (senderId: string, receiverId: string) => {
    const receiverRef = firestore.collection('Usuario').doc(receiverId);
    const receiverDoc = await receiverRef.get();
    if (!receiverDoc.exists) {
        throw new Error('Usuário destinatário não encontrado');
    }

    const receiver = receiverDoc.data() as Usuario;
    if (receiver.friendRequests.some(req => req.senderId === senderId && req.status === 'pending')) {
        throw new Error('Solicitação de amizade já enviada');
    }

    receiver.friendRequests.push({ senderId, status: 'pending' });
    await receiverRef.set(receiver.toFirestore());
    console.log('Solicitação de amizade enviada');
};

export const respondToFriendRequest = async (receiverId: string, senderId: string, accept: boolean) => {
    const receiverRef = firestore.collection('Usuario').doc(receiverId);
    const receiverDoc = await receiverRef.get();
    if (!receiverDoc.exists) {
        throw new Error('Usuário destinatário não encontrado');
    }

    const receiver = receiverDoc.data() as Usuario;
    const requestIndex = receiver.friendRequests.findIndex(req => req.senderId === senderId && req.status === 'pending');
    if (requestIndex === -1) {
        throw new Error('Solicitação de amizade não encontrada ou já respondida');
    }

    receiver.friendRequests[requestIndex].status = accept ? 'accepted' : 'rejected';
    if (accept) {
        const senderRef = firestore.collection('Usuario').doc(senderId);
        const senderDoc = await senderRef.get();
        if (!senderDoc.exists) {
            throw new Error('Usuário remetente não encontrado');
        }

        const sender = senderDoc.data() as Usuario;
        receiver.friends.push({ friendId: senderId, chatId: '' });
        sender.friends.push({ friendId: receiverId, chatId: '' });
        await senderRef.set(sender.toFirestore());
    }

    await receiverRef.set(receiver.toFirestore());
    console.log(`Solicitação de amizade ${accept ? 'aceita' : 'rejeitada'}`);
};
