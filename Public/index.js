const socket = io(); // Inicializa o Socket.IO
let meuNome;

window.onload = () => {
  const form = document.getElementById('form');
  const pedirCartaBtn = document.getElementById('pedirCarta');
  const reiniciarJogoBtn = document.getElementById('reiniciarJogo');

  if (!form || !pedirCartaBtn || !reiniciarJogoBtn) {
    console.error('Elementos necessários não encontrados no DOM.');
    return;
  }

  form.onsubmit = (e) => {
    e.preventDefault();
    meuNome = document.getElementById('nome').value;
    socket.emit('Jogador', meuNome);
    form.style.display = 'none'; // Ocultar o formulário após o envio do nome
  };

  socket.on('JogoIniciado', (data) => {
    if (data && data.players) {
      atualizarDadosJogo(data);
      reiniciarJogoBtn.style.display = 'none'; // Esconde o botão de reinício após o início do jogo
    } else {
      console.error('Dados inválidos recebidos:', data);
    }
  });

  socket.on('atualizarJogo', (data) => {
    if (data && data.players) {
      console.log('Dados recebidos:', JSON.stringify(data, null, 2)); // Exibe os dados como JSON no console
      atualizarDadosJogo(data); // Atualiza os dados no DOM
    } else {
      console.error('Dados inválidos recebidos:', data);
    }
  });

  function atualizarDadosJogo(data) {
    const { jogador1, jogador2 } = data.players;
  
    // Atualizar o nome do jogador no topo da tela
    document.getElementById('nomeJogador1').innerText = jogador1.nome;
    document.getElementById('nomeJogador2').innerText = jogador2.nome;
  
    // Exibir informações gerais do jogo
    document.getElementById('info').innerText = `Jogo iniciado entre: ${jogador1.nome} e ${jogador2.nome}`;
  
    console.log('Jogador 1:', jogador1.cartas);
    console.log('Jogador 2:', jogador2.cartas);
    
    document.getElementById('soma1').innerText = `Soma: ${jogador1.somaCartas}`;
    document.getElementById('soma2').innerText = `Soma: ${jogador2.somaCartas}`;
  
    document.getElementById('cartas1').innerText = `${jogador1.cartas}`;
    document.getElementById('cartas2').innerText = `${jogador2.cartas}`;
  
    // Mostrar o botão de reinício se o jogo terminou
    if (jogador1.somaCartas > 21) {
      alert(`${jogador1.nome} ultrapassou 21!`);
      reiniciarJogoBtn.style.display = 'block';
    } else if (jogador2.somaCartas > 21) {
      alert(`${jogador2.nome} ultrapassou 21!`);
      reiniciarJogoBtn.style.display = 'block';
    }
  }
  



  pedirCartaBtn.onclick = () => {
    socket.emit('pedirCarta');
  };

  reiniciarJogoBtn.onclick = () => {
    socket.emit('reiniciarJogo');
    limparMensagens();
  };

  function limparMensagens() {
    // Limpar mensagens e divs
    document.getElementById('info').innerText = '';
    document.getElementById('cartas1').innerHTML = '';
    document.getElementById('cartas2').innerHTML = '';
    document.getElementById('soma1').innerText = '';
    document.getElementById('soma2').innerText = '';
    reiniciarJogoBtn.style.display = 'none'; // Esconde o botão de reinício
    document.getElementById('form').style.display = 'block'; // Reexibir o formulário
  }
};
