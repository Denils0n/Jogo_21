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

// Variáveis para armazenar salas e o estado dos jogos
let salas = {};
let salaCount = 0;

io.on('connection', (socket) => {
  console.log('Novo jogador conectado: ' + socket.id);

  // Quando um jogador entra no jogo
  socket.on('Jogador', (nome) => {
    console.log('Jogador adicionado:', nome);

    // Enviar a lista de salas disponíveis
    socket.emit('SalasDisponiveis', salas);
  });

  // Quando um jogador cria uma sala
  socket.on('criarSala', (nomeJogador) => {
    salaCount++;
    const salaId = `sala-${salaCount}`;
    const salaAtual = { id: salaId, players: {}, jogoAtivo: false, jogo: null };
    salas[salaId] = salaAtual;

    // Adicionar o jogador à sala criada
    salaAtual.players[socket.id] = { nome: nomeJogador, id: socket.id, jogadorNum: 1 };
    socket.join(salaId);
    console.log(`Sala ${salaId} criada por ${nomeJogador}`);

    // Emitir evento para todos os jogadores sobre a nova sala
    io.emit('novaSalaCriada', { id: salaId, jogadores: [nomeJogador] });
  });

  // Quando um jogador entra em uma sala
  socket.on('entrarSala', ({ nomeJogador, salaId }) => {
    const sala = salas[salaId];

    if (sala && Object.keys(sala.players).length < 2) {
      const numJogadores = Object.keys(sala.players).length + 1;
      sala.players[socket.id] = { nome: nomeJogador, id: socket.id, jogadorNum: numJogadores };
      socket.join(salaId);
      console.log(`${nomeJogador} entrou na sala ${salaId}`);

      // Verificar se a sala está cheia e iniciar o jogo
      if (Object.keys(sala.players).length === 2) {
        iniciarJogo(sala);
      }

      // Atualizar todos os jogadores sobre o novo jogador na sala
      io.emit('atualizarSalas', salas);
    } else {
      socket.emit('erroSala', 'Sala cheia ou inexistente.');
    }
  });

  // Quando um jogador se desconecta
  socket.on('disconnect', () => {
    console.log('Jogador desconectado: ' + socket.id);

    // Remover jogador de sua sala
    for (let idSala in salas) {
      if (salas[idSala].players[socket.id]) {
        delete salas[idSala].players[socket.id];

        // Parar o jogo se houver menos de 2 jogadores na sala
        if (Object.keys(salas[idSala].players).length < 2 && salas[idSala].jogoAtivo) {
          salas[idSala].jogoAtivo = false;
          io.to(idSala).emit('JogoParado', 'Um jogador desconectou. O jogo foi interrompido.');
        }

        // Remover a sala se não houver mais jogadores
        if (Object.keys(salas[idSala].players).length === 0) {
          delete salas[idSala];
          console.log(`Sala ${idSala} foi removida.`);
        }

        break;
      }
    }
    io.emit('atualizarSalas', salas); // Atualizar lista de salas para todos os jogadores
  });

  // Evento para pedir uma carta
  socket.on('pedirCarta', () => {
    let salaAtual = null;

    // Encontrar a sala do jogador
    for (let idSala in salas) {
      if (salas[idSala].players[socket.id]) {
        salaAtual = salas[idSala];
        break;
      }
    }

    if (salaAtual && salaAtual.jogoAtivo) {
      const jogadorAtual = salaAtual.players[socket.id].jogadorNum === 1 ? salaAtual.jogo.getJogador1() : salaAtual.jogo.getJogador2();
      jogadorAtual.adicionarCarta(); // Adiciona uma carta ao jogador
      console.log('Carta adicionada. Atualizando o estado do jogo...');

      // Atualizar estado do jogo e emitir para todos os clientes da sala
      io.to(salaAtual.id).emit('atualizarJogo', {
        players: {
          jogador1: {
            nome: salaAtual.jogo.getJogador1().nome,
            cartas: salaAtual.jogo.getJogador1().mao.mostrarCartas(),
            somaCartas: salaAtual.jogo.getJogador1().mao.mostrarValor()
          },
          jogador2: {
            nome: salaAtual.jogo.getJogador2().nome,
            cartas: salaAtual.jogo.getJogador2().mao.mostrarCartas(),
            somaCartas: salaAtual.jogo.getJogador2().mao.mostrarValor()
          }
        }
      });
    } else {
      socket.emit('foraDeTurno', 'Jogo não está ativo ou jogador não encontrado.');
    }
  });
});

function iniciarJogo(sala) {
  sala.jogoAtivo = true;
  console.log(`Jogo iniciado na ${sala.id}`);

  const playerSockets = Object.keys(sala.players);
  const jogador1 = sala.players[playerSockets[0]];
  const jogador2 = sala.players[playerSockets[1]];

  sala.jogo = new Jogo(jogador1.nome, jogador2.nome);

  io.to(sala.id).emit('JogoIniciado', {
    players: {
      jogador1: {
        nome: sala.jogo.getJogador1().nome,
        cartas: sala.jogo.getJogador1().mao.mostrarCartas(),
        somaCartas: sala.jogo.getJogador1().mao.mostrarValor()
      },
      jogador2: {
        nome: sala.jogo.getJogador2().nome,
        cartas: sala.jogo.getJogador2().mao.mostrarCartas(),
        somaCartas: sala.jogo.getJogador2().mao.mostrarValor()
      }
    }
  });
}

server.listen(3000, () => {
  console.log('listening on *:3000');
});
