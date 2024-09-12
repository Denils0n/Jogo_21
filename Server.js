const Jogo = require('./Objetos/Jogo');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Servindo arquivos estáticos (como index.html, estilos, scripts)
app.use(express.static('Public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Public/index.html');
});

// Variáveis para armazenar os dois jogadores e o estado do jogo
let players = {};
let jogoAtivo = false;
let jogo = null; // Adiciona uma variável para armazenar o jogo

io.on('connection', (socket) => {
  console.log('Novo jogador conectado: ' + socket.id);

  // Receber nome do jogador
  socket.on('Jogador', (nomeJogador) => {
    if (Object.keys(players).length < 2) {
      players[socket.id] = {
        nome: nomeJogador,
        id: socket.id,
        jogadorNum: Object.keys(players).length + 1, // Jogador 1 ou Jogador 2
      };

      console.log(`Jogador ${players[socket.id].jogadorNum} (${nomeJogador}) entrou no jogo`);

      // Verificar se dois jogadores estão conectados para iniciar o jogo
      if (Object.keys(players).length === 2) {
        iniciarJogo();
      }
    } else {
      socket.emit('JogoCheio', 'O jogo já tem dois jogadores.');
    }
  });

  // Quando um jogador se desconecta
  socket.on('disconnect', () => {
    console.log('Jogador desconectado: ' + socket.id);
    delete players[socket.id];

    // Parar o jogo se um jogador desconectar
    if (Object.keys(players).length < 2) {
      jogoAtivo = false;
      io.emit('JogoParado', 'Um jogador desconectou. O jogo foi interrompido.');
    }
  });

  // Evento para pedir uma carta
  socket.on('pedirCarta', () => {
    console.log('Evento pedirCarta recebido do jogador:', socket.id);
  
    if (jogoAtivo && players[socket.id]) {
      const jogadorAtual = players[socket.id].jogadorNum === 1 ? jogo.getJogador1() : jogo.getJogador2();
      jogadorAtual.adicionarCarta(); // Adiciona uma carta ao jogador
      console.log('Carta adicionada. Atualizando o estado do jogo...');
      
      // Atualizar estado do jogo e emitir para todos os clientes
      io.emit('atualizarJogo', {
        players: {
          jogador1: {
            nome: jogo.getJogador1().nome,
            cartas: jogo.getJogador1().mao.mostrarCartas(),
            somaCartas: jogo.getJogador1().mao.mostrarValor()
          },
          jogador2: {
            nome: jogo.getJogador2().nome,
            cartas: jogo.getJogador2().mao.mostrarCartas(),
            somaCartas: jogo.getJogador2().mao.mostrarValor()
          }
        }
      });
    } else {
      console.log('Jogo não está ativo ou jogador não encontrado.');
      socket.emit('foraDeTurno', 'Não é sua vez de jogar.');
    }
  });
});

function iniciarJogo() {
  jogoAtivo = true; // Começar o jogo
  console.log('Jogo iniciado entre os dois jogadores:');

  const playerSockets = Object.keys(players); // Pega os IDs dos jogadores
  const jogador1 = players[playerSockets[0]]; // Primeiro jogador
  const jogador2 = players[playerSockets[1]]; // Segundo jogador
  console.log('Jogador1:' + players[playerSockets[0]].nome);

  console.log(`${jogador1.nome} vs ${jogador2.nome}`);

  jogo = new Jogo(jogador1.nome, jogador2.nome); // Inicializa a variável jogo

  // Enviar o estado inicial do jogo para o cliente
  io.emit('JogoIniciado', {
    players: {
      jogador1: {
        nome: jogo.getJogador1().nome,
        cartas: jogo.getJogador1().mao.mostrarCartas(),
        somaCartas: jogo.getJogador1().mao.mostrarValor()
      },
      jogador2: {
        nome: jogo.getJogador2().nome,
        cartas: jogo.getJogador2().mao.mostrarCartas(),
        somaCartas: jogo.getJogador2().mao.mostrarValor()
      }
    },

  });
}

server.listen(3000, () => {
  console.log('listening on *:3000');
});
