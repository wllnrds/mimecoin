import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  let test : {
    integration:boolean,
    resource:boolean
  } = {
    integration: false,
    resource: false
  };
  
  if (request.nextUrl.pathname.startsWith('/api/core')) {
    test.integration = true;
  }

  if (request.nextUrl.pathname.startsWith('/api/account')) {
    if(!request.nextUrl.pathname.startsWith('/api/account/login')){
      test.integration = true;
      test.resource = true;
    }
  }

  if( test.integration == true && !request.headers.has('X-Integration-Token') ){
    return NotAllowed("Needs an api key.", 401);
  }

  if( test.resource == true && !request.headers.has('X-Resource-Token') ){
    return NotAllowed("Not logged.", 401);
  }

  if (request.nextUrl.pathname.startsWith('/api')) {
    const res = NextResponse.next()
    res.headers.append('Access-Control-Allow-Origin', '*')
  }
}

function NotAllowed ( message:string , status : number ){
  return NextResponse.json({ message },{ status })
}