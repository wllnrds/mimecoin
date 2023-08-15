export class Mailer{
    static Send( templateTag : string, content : any ){
        const timestamp = `E-mail ${ templateTag } - ${ new Date().getTime() }`;
        console.groupCollapsed(timestamp)
        console.log("E-mail enviado:")
        console.log(content)
        console.groupEnd()
    }
}