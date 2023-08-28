'use client';

import { useState } from "react";
import { addData } from '@/lib/firebase/controller'

export function PiPInfos({ user, namespace }: { user: any, namespace : any }){
    const [ pipWindow, setPip ] = useState( );

    const pip = `<div class="p-3 flex flex-col gap-3">
    <h1 class="text-lg font-bold">${ namespace.name }</h1>
    <p>Transações em tempo real</p>
    <div id="wrap-itens" class="flex flex-col gap-2"></div>
    </div>`
    
    async function OpenPip( namespaceId : string ){
        const wind = window as any;
        const _pipWindow : Window  = await wind.documentPictureInPicture.requestWindow({
            width: 400,
            height: 400
        });

        const tailwind = document.createElement('script');
        tailwind.src = 'https://cdn.tailwindcss.com';
        
        _pipWindow.document.head.appendChild(tailwind);

        const script = document.createElement('script');
        script.type = 'module';

        script.innerHTML = `import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js';
        // If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
        import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-analytics.js';

        // Add Firebase products that you want to use
        import { getAuth } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js';
        import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js';
        import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js';

        const firebaseConfig = {
            apiKey: "AIzaSyDrX1iz_c6dClz4ZvNNfQ5xen12cNLpiF0",
            authDomain: "wlln-mimecoin.firebaseapp.com",
            databaseURL: "https://wlln-mimecoin-default-rtdb.firebaseio.com",
            projectId: "wlln-mimecoin",
            storageBucket: "wlln-mimecoin.appspot.com",
            messagingSenderId: "935752454010",
            appId: "1:935752454010:web:0c8338d042febc978750c3",
            measurementId: "G-34P6C2LS1J"
        };

        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const db = getDatabase(app);
        let _old = []

        function processData(data){
            Object.keys(data).map( key => {
                if( !_old[key] ){
                    AppendNewNode( data[key] )
                }
            })

            _old = data;
        }

        function AppendNewNode(data ){
            const root = document.getElementById("wrap-itens");

            const check  = document.getElementById("t-" + data.timestamp);
            if( check ){
                return;
            }

            const child = document.createElement('div');
            child.id = "t-" + data.timestamp;
            child.classList.add('p-2','bg-gray-200', 'rounded-2xl', 'animate-[pulse_1s_ease-in-out]')
            child.innerText = data.timestamp ;

            while( root.childElementCount >= 5 ){
                root.lastChild.remove();
            }

            root.prepend(child);
        }

        const namespaceRef = ref( db, 'space/${ namespaceId }/transactions');
        onValue( namespaceRef, (snap) => {
            const data = snap.val();
            processData( data );
        })
        `

        _pipWindow.document.body.innerHTML = pip;
        _pipWindow.document.body.appendChild(script);

        setPip( _pipWindow as any );
    }

    function teste( userId : string, namespaceId : string ){
        addData({ userId, namespaceId } )
    }

    return <div>
        <button onClick={ () => OpenPip( namespace.id ) }>Abrir</button>
        <button onClick={ () => teste( user.id, namespace.id ) }>Add Data</button>
    </div>
}