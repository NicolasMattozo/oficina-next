"use client" 
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

    const schemaCliente = z.object({
    firstName: z.string().min(3, "O nome deve ter pelo menos 3 letras"),
    email: z.string().email("Digite um e-mail válido"),
    phone: z.string().min(8, "Telefone inválido"),
    site: z.string().url("Insira uma URL válida (ex: https://site.com)"),
    username: z.string().min(2, "Username muito curto"),
    empresa: z.string().min(1, "Nome da empresa é obrigatório"),
    cidade: z.string().min(1, "A cidade é obrigatória")
    });

export default function ModalCliente({modal, CloseModal, setUsers,}) {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schemaCliente) // A mágica acontece aqui!
  });
    const onSubmit = (data) => {
        const prevString = localStorage.getItem("clientes");
        const prevArray = prevString ? JSON.parse(prevString) : [];

        const novoCliente = {
        id: Date.now(),
        name: data.firstName,     // Traduz firstName -> name
        username: data.username,
        email: data.email,
        phone: data.phone,
        website: data.site,       // Traduz site -> website
        company: { name: data.empresa }, // Estrutura como a API (opcional)
        address: { city: data.cidade }   // Estrutura como a API (opcional)
    };

        // 3. Criamos a nova lista combinando os dois
        const novaLista = [novoCliente, ...prevArray];

        // 4. Salvamos no LocalStorage E no Estado do React
        localStorage.setItem("clientes", JSON.stringify(novaLista));
        setUsers(novaLista);

        // 5. Limpamos e fechamos
        CloseModal();
        reset({}); 
         };

    return(

    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${modal ? '' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6">
        
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div>
                    <label className="text-black" htmlFor="firstName">Nome</label>
                    <input 
                    {...register("firstName")} 
                    placeholder="Nome"
                    className="w-full p-2 mb-2 border border-slate-300 rounded-md text-black focus:outline-blue-500" 
                    />
                    {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message}</span>}
                </div>

                <div>
                    <label className="text-black" htmlFor="email">Email</label>
                <input 
                    {...register("email")} 
                    placeholder="E-mail"
                    className="w-full p-2 mb-2 border border-slate-300 rounded-md text-black focus:outline-blue-500" 
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>

                <div>
                    <label className="text-black" htmlFor="phone">Telefone</label>
                    <input 
                    {...register("phone")} 
                    placeholder="Telefone"
                    className="w-full p-2 mb-2 border border-slate-300 rounded-md text-black focus:outline-blue-500" 
                    />
                    {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                </div>

                <div>
                    <label className="text-black" htmlFor="site">Site</label>
                    <input 
                    {...register("site")} 
                    placeholder="Site"
                    className="w-full p-2 mb-2 border border-slate-300 rounded-md text-black focus:outline-blue-500"
                    />
                    {errors.site && <span className="text-red-500 text-sm">{errors.site.message}</span>}
                </div>
                <div>
                    <label className="text-black" htmlFor="cidade">Cidade</label>
                    <input 
                    {...register("cidade")} 
                    placeholder="Cidade"
                    className="w-full p-2 mb-2 border border-slate-300 rounded-md text-black focus:outline-blue-500"
                    />
                    {errors.cidade && <span className="text-red-500 text-sm">{errors.cidade.message}</span>}
                </div>

                <div>
                    <label className="text-black" htmlFor="empresa">Empresa</label>
                    <input 
                    {...register("empresa")} 
                    placeholder="Empresa"
                    className="w-full p-2 mb-2 border border-slate-300 rounded-md text-black focus:outline-blue-500"
                    />
                    {errors.empresa && <span className="text-red-500 text-sm">{errors.empresa.message}</span>}
                </div>

                <div>
                    <label className="text-black" htmlFor="username">Username</label>
                    <input 
                    {...register("username")} 
                    placeholder="Username"
                    className="w-full p-2 mb-2 border border-slate-300 rounded-md text-black focus:outline-blue-500"
                    />
                    {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
                </div>
                <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
                    Salvar Cliente
                </button>
                </form>
                
                <div className="mt-6 flex justify-end">
                <button type="button" onClick={() => { reset({}); CloseModal(); }} 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Fechar
                </button>
                </div>
                
            </div>
    </div>

)}