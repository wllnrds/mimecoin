import firebaseApp from "../config";
import { child, getDatabase, push, ref, update } from 'firebase/database';

export async function addData({ userId, namespaceId } : { userId : string, namespaceId : string }){
    const db = getDatabase(firebaseApp);

    const postData = {
        timestamp: new Date().getTime(),
        transactionId: "Teste"
    }

    const newKey = push( child( ref(db), `space/${ namespaceId }`) ).key;
    const updates : any = {};

    updates[`space/${ namespaceId }/transactions/${ newKey }`] = postData;
    updates[`user/${ userId }/transactions/${ newKey }`] = postData;

    return update( ref(db), updates )
}