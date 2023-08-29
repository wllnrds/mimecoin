import { multiChain } from "../core"
import { db } from "../database"
import { TransactionStatus } from "../database/db"
import randToken from 'rand-token'

export class PaymentOrder{
    id: string
    digits: string
    namespaceCode: string
    namespaceAccountOrigin?: string
    due?: Date | null
    amount: number
    status: TransactionStatus
    createdAt: Date
    payedAt?: Date | null

    private constructor(
        id: string,
        digits: string,
        namespaceCode: string,
        namespaceAccountOrigin: string,
        due: Date | null,
        amount: number,
        status: TransactionStatus,
        createdAt: Date,
        payedAt: Date | null,
    ){
        this.id = id,
        this.digits = digits
        this.namespaceCode = namespaceCode
        this.namespaceAccountOrigin = namespaceAccountOrigin
        this.due = due
        this.amount = amount
        this.status = status
        this.createdAt = createdAt
        this.payedAt = payedAt
    }

    static DbToObj( data: any ){
        return new PaymentOrder(
            data.id,
            data.digits,
            data.namespaceCode,
            data.namespaceAccountOrigin,
            data.due,
            data.amount,
            data.status,
            data.createdAt,
            data.payedAt
        )
    }

    static async getOrder( namespaceCode : string, digits : string ){
        const order = await db.selectFrom('PaymentOrder').selectAll().where(({ eb, and })=>and([
            eb('PaymentOrder.namespaceCode', '=', namespaceCode),
            eb('PaymentOrder.digits','=', digits)
        ])).executeTakeFirst();

        return PaymentOrder.DbToObj(order);
    }

    static async getOrderById( namespaceCode : string, id : string ){
        const order = await db.selectFrom('PaymentOrder').selectAll().where(({ eb, and })=>and([
            eb('PaymentOrder.namespaceCode', '=', namespaceCode),
            eb('PaymentOrder.id','=', id)
        ])).executeTakeFirst();

        return PaymentOrder.DbToObj(order);
    }

    static async Generate( params :{
        namespaceCode : string,
        namespaceAccountOrigin : string,
        namespaceAccountOriginKey : string,
        due : Date,
        amount : number,
        precision: number,
    }){
        const digits = PaymentOrder._digitGenerator( params );
        const entry = await db.insertInto('PaymentOrder').values({
            namespaceCode: params.namespaceCode,
            namespaceAccountOrigin: params.namespaceAccountOrigin,
            amount: params.amount,
            digits,
            due: params.due,
            status: 'pending'
        }).returningAll().executeTakeFirstOrThrow();

        return entry
    }

    getDigits(){
        const REGEX_DIGIT = new RegExp("([a-z]{3})(0)([0-9]{5})([0-9]{1})([0-9]{5})([0-9]{6})([0-9]{1})([0-9]{5})([0-9]{6})([0-9]{1})([0-9]{4})([0-9]{1,})");
        const REPLACE_DIGIT = "$1 $2 $3 $4 $5.$6 $7 $8.$9 $10 $11 $12"
        return this.digits.replace( REGEX_DIGIT, REPLACE_DIGIT );
    }

    static _digitGenerator( params : {
        namespaceCode : string,
        namespaceAccountOrigin : string,
        namespaceAccountOriginKey : string,
        due : Date,
        amount : number,
        precision: number,
    }){
        const code = randToken.generator({ chars:'0-9' });

        let start = params.namespaceCode
        
        let middle = multiChain([
            [
                "0",                                            // Código monetário
                params.precision.toString().padStart(5,"0")     // Campo livre
            ].join(''),
            [
                fromBaseDate( new Date() ).padStart( 5, "0" ),  // Preenchimento
                params.namespaceAccountOrigin + params.namespaceAccountOriginKey // Conta beneficiada
            ].join(''),
            code.generate(10).toString().padStart( 10, "0" )                                  // ID do documento
        ]);

        let fromBase = fromBaseDate( params.due ).padStart( 4, "0" )
        let value = params.amount.toString().padStart(10,"0")
        
        return [start, middle, fromBase, value].join('');
    }

    async confirm(){
        await db.updateTable('PaymentOrder')
            .set({
                payedAt: new Date(),
                status: 'confirmed'
            }).where( 'id' , '=' , this.id ).executeTakeFirstOrThrow();
    }
}

const BASE_DATE : number = 1680836400000 // 07 de abril de 2023

function fromBaseDate( date : Date ){
    const result = parseInt( ( ( date.getTime() - BASE_DATE ) / ( 1000 * 60 * 60 * 24 ) ).toString(), 10 ).toString()
    return result
}