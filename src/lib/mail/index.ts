export class Mailer{
    static Send( templateTag : string, content : any ){
        const timestamp = `E-mail ${ templateTag } - ${ new Date().getTime() }`;
        console.groupCollapsed(timestamp)
        console.info("E-mail enviado:")
        console.info(content)
        console.groupEnd()
    }
}