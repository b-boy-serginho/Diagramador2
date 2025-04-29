//importando los modulos de firebase
// import {appFirebase, fireStore} from "./Firebase";
import { app } from "../firebase-confing/Firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import Login from "./Login";
import Board from "./Board";

const auth = getAuth(app);

function Redirigir(){
    const [usuario, setUsuario] = useState(null);

    onAuthStateChanged(auth, (usuarioFirebase) =>{
        if(usuarioFirebase){
            setUsuario(usuarioFirebase)
        }else{
            setUsuario(null)
        }        
    })

    return (
        <div>
            {/* {usuario ? <Bienvenido correoUsuario={usuario.email}/> : <Login/>} */}
            {usuario ? <Board correoUsuario={usuario.email}/> : <Login/>}
        </div>
    )
}

export default Redirigir; 