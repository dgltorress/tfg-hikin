'use strict';

let userPfpForm;

const enviarPfp = () => {
    const xhr = new XMLHttpRequest();
    const url = `http://localhost:3000/api/usuarios/1/imagen`;

    xhr.open( 'POST' , url , true );
    xhr.setRequestHeader( 'Authorization' , 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJpc0FkbWluIjpmYWxzZX0sImlhdCI6MTY3OTU4Nzk4OCwiZXhwIjozMzIzNzE4Nzk4OH0.W-xkQDq_zSqJZxdYTQeAus0ppNKWgeSslgWthrAWmEw' );

    xhr.onload = ( event ) => {
        console.log( event );
    }
    xhr.onerror = ( err ) => { console.error( err ); }
    xhr.send();

    return false;
}

window.onload = () => {
    //userPfpForm = document.getElementById( 'userPfpForm' );

    //userPfpForm.addEventListener( 'submit' , () => { return enviarPfp(); } );
}