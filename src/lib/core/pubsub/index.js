import { PubSub } from "@google-cloud/pubsub";

const credential = JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_KEY, "base64").toString()
);

const ps = new PubSub({
    projectId: credential.project_id,
    credentials:{
        client_email: credential.client_email,
        private_key: credential.private_key,
    }
})

export class WebHook{
    static async createTopic( topicId ){
        try {
            return await ps.createTopic( topicId );
        } catch (error) {
            console.error("Fail to create topic", error);
        }
    }

    static async subscribe({ namespaceCode, topicId = "default-pubsub", hook  }){
        try {
            let topic = ps.topic( topicId )

            console.log("Topico", topic);

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