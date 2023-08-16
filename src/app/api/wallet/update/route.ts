import { NextRequest } from "next/server";

export async function GET( request: NextRequest ) {
    
    const { searchParams } = new URL(request.url)

    console.log( searchParams );

    // const namespace : {
    //     name : string,
    //     code : string
    // } = {
    //    name : "Teste",
    //    code : "wln" 
    // };

    // const account : {
    //     accountNumber : string,
    //     accountKey : string,
    //     balance : string
    // } = {
    //     accountNumber : "10001",
    //     accountKey : "3",
    //     balance : "0.00"
    // }

    // const customer : {
    //     name: string
    // } = {
    //     name: "Willian Almeida Rodrigues"
    // }

    // const CARD = {
    //     "id": "ISSUER_ID.OBJECT_ID",
    //     "classId": "ISSUER_ID.GENERIC_CLASS_ID",
    //     "logo": {
    //         "sourceUri": {
    //             "uri": "https://mimecoin.vercel.app/static/icon.png"
    //         },
    //         "contentDescription": {
    //             "defaultValue": {
    //                 "language": "pt-BR",
    //                 "value": "Mimecoin"
    //             }
    //         }
    //     },
    //     "cardTitle": {
    //         "defaultValue": {
    //             "language": "pt-BR",
    //             "value": "Mimecoin"
    //         }
    //     },
    //     "subheader": {
    //         "defaultValue": {
    //             "language": "pt-BR",
    //             "value": "Títular"
    //         }
    //     },
    //     "header": {
    //         "defaultValue": {
    //             "language": "pt-BR",
    //             "value": customer.name
    //         }
    //     },
    //     "textModulesData": [
    //         {
    //             "id": "namespace",
    //             "header": "namespace",
    //             "body": namespace.name
    //         },
    //         {
    //             "id": "conta",
    //             "header": "conta",
    //             "body": account.accountNumber
    //         },
    //         {
    //             "id": "digito",
    //             "header": "digito",
    //             "body": account.accountKey
    //         }
    //     ],
    //     "barcode": {
    //         "type": "TEXT_ONLY",
    //         "value": "₼ " + account.balance,
    //         "alternateText": "Saldo atual"
    //     },
    //     "hexBackgroundColor": "#262626",
    //     "heroImage": {
    //         "sourceUri": {
    //             "uri": "https://storage.googleapis.com/wallet-lab-tools-codelab-artifacts-public/google-io-hero-demo-only.png"
    //         },
    //         "contentDescription": {
    //             "defaultValue": {
    //                 "language": "pt-BR",
    //                 "value": "https://mimecoin.vercel.app/static/hero.png"
    //             }
    //         }
    //     }
    // }
}

const Class = {
    "id": "ISSUER_ID.CLASS_ID",
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
            "twoItems": {
              "startItem": {
                "firstValue": {
                  "fields": [
                    {
                      "fieldPath": "object.textModulesData['conta']"
                    }
                  ]
                }
              },
              "endItem": {
                "firstValue": {
                  "fields": [
                    {
                      "fieldPath": "object.textModulesData['3']"
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    }
  }