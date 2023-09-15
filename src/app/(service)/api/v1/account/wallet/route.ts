import { NextResponse, type NextRequest } from "next/server";
import { GoogleAuth } from "google-auth-library";
import jwt from 'jsonwebtoken';
import { UserAuth } from "@/lib/auth/token";

const issuerId = '3388000000022210333';
const classId = `${issuerId}.mimecoin-test`;
const baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1';

const credentials = {
  "type": "service_account",
  "project_id": "mimecoin",
  "private_key_id": "509aa61b8f382fa0a5a2f732771fd0c77683c137",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDXesaraTV7jnU4\n0AhWsmnPjMUzn41YUG86xv8kR4vF68HIvbhpAfM/2uXFbpDm4e9LsAzI8B9oMYRQ\nejQQ2ml0jAzeRzFxVEknzfN1cqZYM4jS3YSZxdSjsfuc47PUuY2gd++FvxXU/F26\nW0vMVGAPXlMs9sCcJ1aJ/MBkSmjOq3VRrl9owy/v0AgIW+iLLct0yeDdMfJnrOQe\npzRkug/kxrXoupDaYgwDPw8ECuY6uWix21MMzyh7sFQPHqBYCAujTmxJxw9rZdt8\nuxfDigsn7dc0t00SfacJMZFeWjIelf3BZe5oyX0Fg1lcUJ07x2YFFg7NTGTmHXU2\nZmEQn9BrAgMBAAECggEAYkileoTD+MXrMM0uqIC7Y4g1YI0LdvdFLL2cnasmlVGp\n84qZpQfXME6DVFDQtgbi05aK1lI0OR2w2NZMjk1ZIWhJ7E7zvdnwfj/hprXzKrLi\n2y9f7pW+HiYt+osfuM0jzMg3z7zvU9UCWWCQC7SGlivza0RnaTJGNi07geMwt+bF\nkHiV4IBLq6rR19EciW5qiq/nZt9FjSuvqJslCIBDMw5H3djcK3LFIhpH//eRnnOY\n0O0TXBgbTwbFr/kxken3OeGOu9HtRQggrjPY52bKQPcIEZ+z6l3RIl/802LAkWAc\nTtNsD9elQ2iPNhTjSA63JxV8tFPawhT/nXmLwB0AlQKBgQDvuTYTbEQCqae36mNa\n1uP+/co/4RQqRGlPT/Svwmnvhd9mZpH1wq/kA/vSLHG77JKKAiOCkDVOFTyW0mno\noamAfwujtIpfbQrko/ejk8OTS2+HW33QCZElC7PwxX6wcuJd6kd16/4gJ77zMbPO\njrYWgAAFoeeujNhpnFwioT4KhwKBgQDmHCqIU+HwoNVaax2yavfCh5mx3//Jdh1U\n396wrFsmofBINN3LcCd6dPaHYrUXf5674LNsQrIV+pz+mqz4md4xfqoezEocXgmo\n7sbuEDgvKdZAUy2dM2L2BcEEEbzpdhXHgmfyVqCGTYZfhhr7cv/SMzIaF/YNM4af\nZCmRs6KP/QKBgD543t3K7iJfgiTMwV2v+LTAANAK4Q1uzJ7tsE+Jc8AG/EQcYNdS\nCDJ800hfarhVm465pfVljW6u3B5V8WG9l4W0Fh1wdEsQCLGzBVssq+Ab3ZHBxxTL\nGXc1CIyreyuSlOlyn3LcsFpC4WFRR5GB4XQVoWvWWKFFdTR4mg4wRRHLAoGAdiy2\n5yZ1HXfrujDSooNu1DeBhiksmtEPBTyniAIsGa4G0X5c/ZKOo8QXq7XUnMnMwl4G\npy2lecYoBFV5SX7z7mVHhuORl/nvahOelDo+MHKC9qwA+/+c7g5MbwORCjC7xKdD\nLOCyNebwgHRFvSb1HIVwUJhHo8X3eDofYxVnAh0CgYBrQnf6sHlRXGRRVXNgJhIL\n8EadmJu0h3aTyTn3jjDjLQGQ90Fy+z3ReIlJ6wl5TFphZhPbh2kcuzNnUwdMJrf1\n/lZGMSlyemJ75/GKy71gvHgniA9fH3abz8/65yhTUo/jcFU/P0HeMnmZJf8vDezR\nvhvrZOB/ZujDrI3vlJpj5g==\n-----END PRIVATE KEY-----\n",
  "client_email": "mimecoin-card@mimecoin.iam.gserviceaccount.com",
  "client_id": "109082291270923663761",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/mimecoin-card%40mimecoin.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

const httpClient = new GoogleAuth({
  credentials: credentials,
  scopes: 'https://www.googleapis.com/auth/wallet_object.issuer'
});

export async function GET(request: NextRequest) {
  let auth = null;

  try {
    auth = await UserAuth(request);
  } catch (error: any) {
    return NextResponse.json({
      status: 401,
      message: error.message,
      timestamp: new Date().getTime()
    }, { status: 401 })
  }

  const balances = await auth.namespace.getBalance( auth.account );

  let objectId = `${issuerId}.${auth.account.id}`;

  const genericObject = {
      "id": `${objectId}`,
      "classId":  classId,
      "genericType": "GENERIC_TYPE_UNSPECIFIED",
      "logo": {
        "sourceUri": { "uri": "https://mimecoin.vercel.app/static/icon.png" }
      },
      "cardTitle": { "defaultValue": { "language": "pt-BR", "value": "Mimecoin" } },
      "subheader": { "defaultValue": { "language": "pt-BR", "value": "Títular" } },
      "header": { "defaultValue": { "language": "pt-BR", "value": auth.account.customer?.name } },
      "textModulesData": [
        { "id": "namespace", "header": "namespace", "body": auth.namespace.name },
        { "id": "code", "header": "código", "body": auth.namespace.code },
        { "id": "conta", "header": "conta", "body": auth.account.accountNumber },
        { "id": "digito", "header": "digito", "body": auth.account.accountKey },
        { "id": "saldo", "header": "saldo", "body": `₼ ${ balances.balance }` }
      ],
      "barcode": {
          "type": "QR_CODE",
          "value": objectId,
      },
      "hexBackgroundColor": "#262626",
      "heroImage": {
          "sourceUri": {
              "uri": "https://mimecoin.vercel.app/static/hero.png"
          }
      }
  }

  await update( genericObject, objectId );

  const claims = {
    iss: credentials.client_email,
    aud: 'google',
    origins: [],
    typ: 'savetowallet',
    payload: {
      genericObjects: [ genericObject ]
    }
  }

  const token = jwt.sign(claims, credentials.private_key, { algorithm: 'RS256' });

  return NextResponse.json({
    data: {
      saveLink : `https://pay.google.com/gp/v/save/${ token }`
    },
    status: 200,
    timestamp: new Date().getTime()
  }, { status: 200 })
}

async function update( genericObject : any, resourceId : string ) {
  await httpClient.request({
    url: `${baseUrl}/genericObject/${ resourceId }`,
    method: 'PUT',
    data: genericObject
  });
}

// const response = await httpClient.request({
//   url: `${baseUrl}/genericClass/${classId}`,
//   method: 'PUT',
//   data: genericClass
// });

// const response = await httpClient.request({
//   url: `${baseUrl}/genericClass/${classId}`,
//   method: 'GET',
//   // data: genericClass
// });

export async function POST(request: NextRequest) {
  const response = await httpClient.request({
    url: `${baseUrl}/genericObject?classId=${ classId }`,
    method: 'GET',
  });

  return NextResponse.json({
    data: response ,
    status: 200,
    timestamp: new Date().getTime()
  }, { status: 200 })
}

export async function PATCH(request: NextRequest) {
  const response = await httpClient.request({
    url: `${baseUrl}/genericClass/${classId}`,
    method: 'PUT',
    data: genericClass
  });

  return NextResponse.json({
    data: response ,
    status: 200,
    timestamp: new Date().getTime()
  }, { status: 200 })
}

const genericClass : any = {
  'id': `${classId}`,
  "classTemplateInfo": {
    "cardTemplateOverride": {
      "cardRowTemplateInfos": [
        {
          "twoItems": {
            "startItem": {
              "firstValue": {
                "fields": [
                  {
                    "fieldPath": "object.textModulesData['namespace']"
                  }
                ]
              }
            },
            "endItem": {
              "firstValue": {
                "fields": [
                  {
                    "fieldPath": "object.textModulesData['code']"
                  }
                ]
              }
            }
          }
        },
        {
          "threeItems": {
            "startItem": {
              "firstValue": {
                "fields": [
                  {
                    "fieldPath": "object.textModulesData['conta']"
                  }
                ]
              }
            },
            "middleItem": {
              "firstValue": {
                "fields": [
                  {
                    "fieldPath": "object.textModulesData['digito']"
                  }
                ]
              }
            },
            "endItem": {
              "firstValue": {
                "fields": [
                  {
                    "fieldPath": "object.textModulesData['saldo']"
                  }
                ]
              }
            }
          }
        }
      ]
    },
  },
  'imageModulesData': [
    {
      'mainImage': {
        'sourceUri': {
          'uri': 'https://mimecoin.vercel.app/static/hero.png'
        },
        'contentDescription': {
          'defaultValue': {
            'language': 'en-US',
            'value': 'Mimecoin'
          }
        }
      },
      'id': 'event_banner'
    }
  ],
  'textModulesData': [
    {
      'header': 'Mimecoin Token Service',
      'body': 'Mimecoin é uma plataforma que permite você criar seu próprio sistema monetário e use como serviço.',
      'id': 'mimecoin-test'
    }
  ],
}