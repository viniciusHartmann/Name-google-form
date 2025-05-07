import React, { useState } from 'react';

export default function App() {
  const [quantidade, setQuantidade] = useState(0);
  const [nomes, setNomes] = useState<string[]>([]);
  const [mensagem, setMensagem] = useState('');

  const handleQuantidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qtd = parseInt(e.target.value) || 0;
    setQuantidade(qtd);
    setNomes(Array(qtd).fill(''));
    setMensagem('');
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
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycby5W356U4FOgarfr5NBYi06GqaJeNCjC3yqHD2cwLZ18vPa59O-HAGZdw6taIcdSOu4/exec',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nomes }),
        }
      );

      const data = await response.json();
      if (response.ok && data.status === 'sucesso') {
        setMensagem('✅ Nomes enviados com sucesso!');
        setQuantidade(0);
        setNomes([]);
      } else {
        setMensagem('❌ Erro: ' + (data.message || 'Erro desconhecido.'));
      }
    } catch (error) {
      console.error('Erro:', error);
      setMensagem('❌ Erro ao enviar.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#ffffff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '20px',
      boxSizing: 'border-box',
      overflowY: 'auto'
    }}>
      <div>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'black' }}>Cadastro de Nomes</h2>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px' }}>
            Quantidade de Pessoas:
          </label>
          <input
            type="number"
            min="0"
            value={quantidade}
            onChange={handleQuantidadeChange}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {nomes.map((nome, index) => (
          <div key={index} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Nome {index + 1}:
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => handleNomeChange(index, e.target.value)}
              placeholder={`Digite o nome ${index + 1}`}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        ))}

        {nomes.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={handleEnviar}
              style={{
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: '#fff',
                fontSize: '16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Enviar
            </button>
          </div>
        )}

        {mensagem && (
          <p style={{ marginTop: '20px', textAlign: 'center', color: '#333' }}>
            {mensagem}
          </p>
        )}
      </div>
    </div >
  );
}
