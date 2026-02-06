// src/app/page.js
'use client'
import { useState, useEffect } from 'react'
// Importamos nosso novo componente
import CardCliente from './components/CardCliente';
import ModalCliente from './components/ModalCliente';

export default function Home() {
  const [modal, setModal] = useState(false);
  const [contador, setContador] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [textoBusca, setTextoBusca] = useState("")
  const [favorites, setFavorites] = useState(() => {
      // Como estamos no Next.js (SSR), precisamos checar se o window existe
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("my-favorites");
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    });

  useEffect(() => {
    localStorage.setItem("my-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    // 2. Função de carregamento
    const carregarDados = async () => {
  try {
    setLoading(true);
    
    const storageLocal = localStorage.getItem("clientes");
    let salvosLocal = [];

    // Proteção: Tenta ler o que está no storage, se falhar ou não for array, mantém []
    try {
      const dadosConvertidos = storageLocal ? JSON.parse(storageLocal) : [];
      salvosLocal = Array.isArray(dadosConvertidos) ? dadosConvertidos : [];
    } catch (e) {
      salvosLocal = [];
    }

    const resposta = await fetch('https://jsonplaceholder.typicode.com/users');
    const dadosApi = await resposta.json();

    // Agora o .some() não vai mais quebrar porque garantimos que salvosLocal é um Array
    const listaFinal = [...salvosLocal];
    
    dadosApi.forEach(userApi => {
      const jaExiste = salvosLocal.some(u => u.id === userApi.id);
      if (!jaExiste) {
        listaFinal.push(userApi);
      }
    });

    setUsers(listaFinal);
    localStorage.setItem("clientes", JSON.stringify(listaFinal));
  } catch (error) {
    console.error("Erro ao sincronizar:", error);
  } finally {
    setLoading(false);
  }
};

    carregarDados();
  }, []); // O array vazio garante que rode apenas uma vez


  const usuariosFiltrados = users.filter(user => 
    user.name.toLowerCase().includes(textoBusca.toLowerCase())
  );


  return (
    <div className="min-h-screen p-8"> {/* Fundo levemente cinza */}
      
      {/* CABEÇALHO */}
      <div className="max-w-5xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to from-blue-600 to-indigo-600 mb-2">
          Oficina do Dev
        </h1>
        <p className="text-slate-500 mb-8">Gerencie seus clientes e favoritos em um só lugar.</p>
        <button onClick={() => setModal(true)} className="text-blue-500 font-bold hover:cursor-pointer mb-5">Adicionar Cliente</button>

        <ModalCliente modal={modal} setUsers={setUsers} CloseModal={() =>{ setModal(false);}}/>
        
      
        {/* INPUT DE BUSCA ESTILIZADO */}
        <div className="relative max-w-md mx-auto">
          {/* Ícone de Lupa (Absoluto para ficar "dentro" do input) */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          
          <input 
            type="text" 
            placeholder="Buscar por nome..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm text-black"
            onChange={(e) => setTextoBusca(e.target.value)} 
            value={textoBusca}
          />
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
           // Um Loading mais bonito (animate-pulse)
          <div className="text-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
             <p className="text-gray-500">Carregando dados...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usuariosFiltrados.map((user) => (
                 <CardCliente 
                    key={user.id} 
                    cliente={user} 
                    isFavorite={favorites.includes(user.id)} 
                    onToggle={() => toggleFavorite(user.id)} 
                  />
            ))}
          </div>
        )}
      </div>
      
      {/* Contador Discreto no Rodapé */}
      <div className="fixed bottom-4 right-4 bg-white/80 backdrop-blur p-3 rounded-lg shadow border text-xs text-gray-500">
          Interações: {contador} | <button onClick={() => setContador(c => c+1)} className="text-blue-500 font-bold hover:underline">Somar</button>
      </div>
    </div>
  );
}