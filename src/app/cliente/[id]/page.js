// src/app/cliente/[id]/page.js
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation' // Hook para pegar o ID da URL
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleLeft } from '@fortawesome/free-solid-svg-icons'



export default function DetalhesCliente() {
    const params = useParams(); 
    const id = params.id; // Aqui pegamos o "5", "10", etc.

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!id) return;

        // Busca APENAS o usuário específico
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
            .then(res => res.json())
            .then(dados => setUser(dados))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-black">Carregando...</div>
    if (!user) return <div className="min-h-screen flex items-center justify-center text-black">Usuário não encontrado.</div>

    return (
        <div className="min-h-screen p-10 flex flex-col items-center">
             <div className="w-full max-w-2xl mb-4">
                <Link href="/" className="text-white hover:underline">
                     <FontAwesomeIcon icon={faCircleLeft} style={{color: "#4b6e86",}} /> Voltar para a lista
                </Link>
             </div>
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-black">
                <div className="flex flex-col items-center mb-6">
                    <img 
                        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name}`} 
                        alt="Avatar" 
                        className="w-32 h-32 rounded-full border-4 bg-neutral-100 border-blue-100 mb-4 hover:border-blue-200 hover:translate-y-1 hover:shadow-xl hover:cursor-pointer"
                    />
                    <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                    <p className="text-gray-500">@{user.username}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-semibold text-lg mb-2 text-blue-600 self-center">Dados Pessoais</h2>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Telefone:</strong> {user.phone}</p>
                        <p><strong>Site:</strong> {user.website}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="font-semibold text-lg mb-2 text-blue-600 self-center">Empresa</h2>
                        <p><strong>Nome:</strong> {user.company.name}</p>
                        <p className="text-sm italic text-gray-600">"{user.company.catchPhrase}"</p>
                    </div>
                </div>
            </div>
        </div>
    );
}