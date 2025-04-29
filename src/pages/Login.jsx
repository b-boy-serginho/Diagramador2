import React, { useState } from "react";
import Imagen from "../assets/img1.webp";
import ImageProfile from "../assets/images1.jpeg";
import { app } from "../firebase-confing/Firebase";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(app);

function Login() {
    const [registrando, setregistrando] = useState(false);

    const funcAutenticacion = async (e) => {
        e.preventDefault();
        const correo = e.target.email.value;
        const contrasena = e.target.password.value;
        if (registrando) {
            try {
                await createUserWithEmailAndPassword(auth, correo, contrasena)
            } catch (error) {
                alert("Asegúrese que la contraseña tenga más de 8 caracteres")
            }
        } else {
            try {
                await signInWithEmailAndPassword(auth, correo, contrasena)
            } catch (error) {
                alert("El correo o la contraseña son incorrectos");
            }
        }
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-4 bg-gray-100">
            {/* Formulario */}
            <div className="w-full md:w-1/3">
                <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center">
                    <img src={ImageProfile} alt="Profile" className="w-28 h-28 rounded-full mb-6" />
                    <form onSubmit={funcAutenticacion} className="w-full">
                        <input type="email" id="email" placeholder="Ingresa tu correo" className="w-full p-3 mb-4 rounded-full bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        <input type="password" id="password" placeholder="Ingresa tu contraseña" className="w-full p-3 mb-4 rounded-full bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        <button className="w-full p-3 mb-4 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                            {registrando ? "Regístrate" : "Iniciar sesión"}
                        </button>
                    </form>
                    <h4 className="text-gray-600 text-lg text-center">
                        {registrando ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
                        <button
                            type="button"
                            className="ml-2 text-orange-500 hover:underline"
                            onClick={() => setregistrando(!registrando)}
                        >
                            {registrando ? "Iniciar sesión" : "Regístrate"}
                        </button>
                    </h4>
                </div>
            </div>

            {/* Imagen derecha */}
            <div className="w-full md:w-2/3 mt-8 md:mt-0 md:pl-8">
                <img src={Imagen} alt="Imagen principal" className="w-full h-auto rounded-2xl shadow-lg object-cover" />
            </div>
        </div>
    );
}

export default Login;
