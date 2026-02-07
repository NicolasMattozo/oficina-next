"use client" 
import { useForm } from 'react-hook-form';
import { useEffect } from 'react'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from './InputField';
import { toast } from 'sonner';

    const schemaCliente = z.object({
    firstName: z.string().min(3, "O nome deve ter pelo menos 3 letras"),
    email: z.string().email("Digite um e-mail válido"),
    phone: z.string().min(8, "Telefone inválido"),
    site: z.string().url("Insira uma URL válida (ex: https://site.com)"),
    username: z.string().min(2, "Username muito curto"),
    empresa: z.string().min(1, "Nome da empresa é obrigatório"),
    cidade: z.string().min(1, "A cidade é obrigatória")
    });
    

export default function ModalCliente({modal, CloseModal, setUsers, idCliente}) {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schemaCliente) // A mágica acontece aqui!
  });
    const onSubmit = (data) => {
    const prevString = localStorage.getItem("clientes");
    const prevArray = prevString ? JSON.parse(prevString) : [];

    let novaLista;

    if (idCliente) {
        // --- LÓGICA DE EDIÇÃO ---
        novaLista = prevArray.map(item => {
            if (item.id === idCliente.id) {
                toast.info('Dados do cliente atualizados.');
                return {
                    ...item,
                    name: data.firstName,
                    username: data.username,
                    email: data.email,
                    phone: data.phone,
                    website: data.site,
                    company: { ...item.company, name: data.empresa },
                    address: { ...item.address, city: data.cidade }
                };
            }
            return item; // Retorna os outros clientes sem mexer neles
        });
    } else {
        // --- LÓGICA DE CRIAÇÃO ---
        const novoCliente = {
            id: Date.now(),
            name: data.firstName,
            username: data.username,
            email: data.email,
            phone: data.phone,
            website: data.site,
            company: { name: data.empresa },
            address: { city: data.cidade }
        };
        novaLista = [novoCliente, ...prevArray];
        toast.success('Novo cliente cadastrado!');
    }

    // Salva o resultado (seja edição ou criação)
    localStorage.setItem("clientes", JSON.stringify(novaLista));
    setUsers(novaLista);

    CloseModal();
    reset({});
};


    useEffect(() => {
        // Se o modal estiver FECHADO, não faz nada (economiza processamento)
        if (!modal) return; 

        if (idCliente) {
            // MODO EDIÇÃO
            reset({
                firstName: idCliente.name,
                email: idCliente.email,
                phone: idCliente.phone,
                site: idCliente.website,
                username: idCliente.username,
                empresa: idCliente.company?.name,
                cidade: idCliente.address?.city
            });
        } else {
            // MODO CRIAÇÃO (Garante que limpa tudo)
            reset({
                firstName: '',
                email: '',
                phone: '',
                site: '',
                username: '',
                empresa: '',
                cidade: ''
            });
        }
    }, [idCliente, reset, modal]); // <--- O SEGREDO ESTÁ AQUI (adicionei 'modal')


    return(

    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${modal ? '' : 'hidden'}`}>
    <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6">
        
        {/* TÍTULO DA MODAL */}
        <div className="mb-6 border-b pb-3">
            <h2 className="text-2xl font-bold text-slate-800">
                {idCliente ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
            </h2>
            <p className="text-sm text-slate-500">
                {idCliente ? 'Altere as informações abaixo e salve.' : 'Preencha os dados para adicionar à lista.'}
            </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            
            <InputField label="Nome" name="firstName" register={register} error={errors.firstName} placeholder="Nome" />
            <InputField label="Email" name="email" type="email" register={register} error={errors.email} placeholder="E-mail" />
            <InputField label="Telefone" name="phone" register={register} error={errors.phone} placeholder="Telefone" />
            <InputField label="Site" name="site" register={register} error={errors.site} placeholder="Site" />
            <InputField label="Cidade" name="cidade" register={register} error={errors.cidade} placeholder="Cidade" />
            <InputField label="Empresa" name="empresa" register={register} error={errors.empresa} placeholder="Empresa" />
            <InputField label="Username" name="username" register={register} error={errors.username} placeholder="Username" />

            <button
                type="submit"
                className="
                    group inline-flex items-center justify-center gap-2
                    px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg
                    shadow-[0_4px_0_0_rgba(21,128,61,1)]
                    hover:bg-green-500 hover:shadow-[0_4px_0_0_rgba(22,163,74,1)] hover:cursor-pointer
                    active:shadow-none active:translate-y-[4px]
                    transition-all duration-150 ease-in-out
                    focus:outline-none focus:ring-4 focus:ring-green-500/30
                    disabled:opacity-50 disabled:pointer-events-none
                "
            >
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {/* TEXTO DO BOTÃO DINÂMICO */}
                {idCliente ? 'Salvar Alterações' : 'Finalizar Cadastro'}
            </button>
        </form>

        <div className="mt-6 flex justify-end">
            <button
                type="button"
                onClick={() => {
                    reset({});
                    CloseModal();
                }}
                className="
                    inline-flex items-center justify-center px-5 py-2.5 
                    bg-slate-100 text-slate-700 font-medium rounded-lg
                    hover:bg-slate-200 hover:text-slate-900
                    active:scale-95 transition-all duration-200
                    focus:outline-none focus:ring-4 focus:ring-slate-200
                    cursor-pointer
                "
            >
                Cancelar
            </button>
        </div>
    </div>
    </div>


)}