"use client" 
import Link from 'next/link';


export default function CardCliente({ cliente, isFavorite, onToggle }) {

    return (
    <div className={`
        relative flex flex-col p-6 rounded-2xl transition-all duration-300 border
        hover:-translate-y-1 hover:shadow-xl group
        ${isFavorite ? 'bg-amber-50 border-amber-200 shadow-md' : 'bg-white border-slate-100 shadow-sm'}
    `}>
        {/* Ícone de Favorito Flutuante (Visual) */}
        {isFavorite && (
            <span className="absolute top-4 right-4 text-2xl transition-all duration-500 ease-out animate-in fade-in zoom-in slide-in-from-bottom-2">⭐</span>
        )}

        <div className='flex items-center gap-4 mb-4'>
             <img 
                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${cliente.name}`} 
                alt="Avatar" 
                className="w-14 h-14 rounded-full bg-slate-100 border-2 border-white shadow-sm"
            />
            
            <div className="overflow-hidden">
                <Link href={`/cliente/${cliente.id}`} className="block">
                    <h3 className="font-bold text-lg text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                        {cliente.name}
                    </h3>
                </Link>
                <p className="text-slate-500 text-sm truncate">{cliente.email}</p>
            </div>
        </div>

        {/* Informações Extras com Badges */}
        <div className="mt-auto space-y-2 mb-6">
            <div className="flex items-center text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                <span className="font-semibold mr-2">🏢 Empresa:</span> {cliente.company.name}
            </div>
            <div className="flex items-center text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                <span className="font-semibold mr-2">📍 Cidade:</span> {cliente.address.city}
            </div>
        </div>

        {/* Botão Full Width */}
        <button 
            onClick={onToggle} 
            className={`
                w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2
                ${isFavorite 
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                    : 'bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white'}
            `}
        >
            {isFavorite ? (
                <>Remover dos Favoritos</>
            ) : (
                <>❤️ Adicionar aos Favoritos</>
            )}
        </button>
    </div>
);
}