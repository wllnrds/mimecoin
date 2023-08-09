export function checkDigit( chain : string ){
    try{
        let __ : Array< number > = chain.split('').map( i => Number.parseInt(i) );
        let _s : number = 0;
        let factor : number = 2;
        for(let i = __.length - 1 ; i >= 0 ; i -- ){
          _s += __[i] * factor;
          if( ++factor > 11 ) factor = 2
        }
        _s = ( ( _s * 10 ) % 11 ) % 10
        return _s.toString();
    }catch( error : any ){
        throw new Error("Fail to create check digit");
    }
}

export function addCheckDigit( chain : string ){
    return `${chain}${checkDigit( chain )}`;
}

export function multiChain( chain : Array<string> ){
    const result = chain.map( item => addCheckDigit(item) )
    return addCheckDigit( result.join('') );
}

export function validateDigit( value:string ){
    const _ = value.slice(-1)
    const chain = value.slice(0,-1);
    const digit = checkDigit( chain );
    if( _ === digit ){
        return chain;
    }else{
        return false;
    }
}