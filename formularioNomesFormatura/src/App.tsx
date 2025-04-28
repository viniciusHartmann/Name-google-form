import React, { useState } from 'react';

export default function App() {
  const [quantidade, setQuantidade] = useState(0);
  const [nomes, setNomes] = useState<string[]>([]);
  const [mensagem, setMensagem] = useState('');

  const handleQuantidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qtd = parseInt(e.target.value) || 0;
    setQuantidade(qtd);
    setNomes(Array(qtd).fill('')); // Cria um array de strings vazias com a quantidade informada
  };

  const handleNomeChange = (index: number, value: string) => {
    const novosNomes = [...nomes];
    novosNomes[index] = value;
    setNomes(novosNomes);
  };

  const handleEnviar = async () => {
    // Verifica se todos os campos foram preenchidos
    if (nomes.some(nome => !nome.trim())) {
      setMensagem('Por favor, preencha todos os nomes.');
      return;
    }

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwLjGzE-bnDtF7M1oa2DUHeuMlNfzMERmOosVYc-ujY2a_wuHyU9CSGiYN2YQYstQTVhw/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nomes }) // Enviando o array de nomes
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem('Nomes enviados com sucesso!');
        setQuantidade(0);
        setNomes([]);
      } else {
        setMensagem('Erro: ' + data.message);
      }
    } catch (error) {
      console.error('Erro:', error);
      setMensagem('Erro ao enviar.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div>
        <label>
          Quantidade de Pessoas:
          <input
            type="number"
            min="0"
            value={quantidade}
            onChange={handleQuantidadeChange}
            style={{ marginLeft: '10px', marginRight: '10px' }}
          />
        </label>
      </div>

      {nomes.map((nome, index) => (
        <div key={index} style={{ marginTop: '10px' }}>
          <label>
            Nome {index + 1}:
            <input
              type="text"
              value={nome}
              onChange={(e) => handleNomeChange(index, e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
      ))}

      {nomes.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleEnviar}>Enviar</button>
        </div>
      )}

      <p>{mensagem}</p>
    </div>
  );
}
