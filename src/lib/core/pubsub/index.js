import { PubSub } from "@google-cloud/pubsub";

const G_KEY = process.env.GOOGLE_SERVICE_KEY || null;
const credential = G_KEY ? JSON.parse( Buffer.from(G_KEY, "base64").toString() ) : null ;
const ps = credential ? new PubSub({ projectId: credential.project_id, credentials:{ client_email: credential.client_email, private_key: credential.private_key, } }) : null;

export class WebHook{
    static async createTopic( topicId ){
        if(!ps){
            console.warn("Pub/Sub service cannot work. G_KEY not setted.");
            return;
        }
        try {
            return await ps.createTopic( topicId );
        } catch (error) {
            console.error("Fail to create topic", error);
        }
    }

    static async subscribe({ namespaceCode, topicId = "default-pubsub", hook  }){
        if(!ps){
            console.warn("Pub/Sub service cannot work. G_KEY not setted.");
            return;
        }
        try {
            let topic = ps.topic( topicId )
            const [subscription] = topic.createSubscription( hook.name , {
                pushEndpoint: hook.url,
                pushConfig: {
                    noWrapper: {
                        writeMetadata: false
                    }
                },
                filter: `attributes.namespaceCode = "${ namespaceCode }"`
            })
            return subscription
        } catch (error) {
            console.error("Fail to subscribe", error);
        }
    }
    
    static async publish({ namespaceCode, payload, topicId = "default-pubsub" }){
        if(!ps){
            console.warn("Pub/Sub service cannot work. G_KEY not setted.");
            return;
        }
        try {
            let topic = ps.topic( topicId )

            if( !(await topic.exists()) ){
                throw new Error("Topic doens exist")
            }

            return await topic.publishMessage({
                json: payload,
                attributes: { namespaceCode }
            });
        } catch (error) {
            console.error("Fail to publish", error);
        }
    }
}