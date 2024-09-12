const Mao = require('./Mao.js'); // Usar require para importar

//criar uma classe jogador, com nome, e total de vitorias se chegaar ate 3 vitorias, ele ganha o jogo, se chegar a 3 derrotas, ele perde o jogo e quero que recebe uma mao da classe Mao.js da mesma pasta
class Jogador {
  //quero um atributo de vitorias
  vitorias;
  //ciar atributo mao


  constructor(nome) {
    this.nome = nome;
    this.mao = new Mao();
    this.vitorias = 0;
  }

  //criar um metodo para adicionar uma carta a mao do jogador
  adicionarCarta() {
    this.mao.sortearCartasAleatorias();
    
  }
  //criar get e set para o atributo vitorias
  getVitorias() {
    return this.vitorias;
  }
  setVitorias(vitorias) {
    this.vitorias = vitorias;
  }
  




}
module.exports = Jogador;

//teste criando 2 jogadores e comparando a mao
// const jogador1 = new Jogador("Jogador 1");
// const jogador2 = new Jogador("Jogador 2");
// jogar(jogador1, jogador2);

//quero que faca uma funcao que fique jogando e comparando o valor das cartas do jogador, quem tiver o numero maior e n'ao tiver passado de 21, ganha a rodada e faca isso se repetir ate um ganhar

// function jogar(jogador1, jogador2) {
//   while (jogador1.verificarVitoria() == false && jogador2.verificarVitoria() == false) {
    

//     console.log("mao do jogador 1: " + jogador1.mao.mostrarCartas());
//     console.log("mao do jogador 2: " + jogador2.mao.mostrarCartas());

//     if (jogador1.mao.mostrarValor() > jogador2.mao.mostrarValor()) {
//       console.log(jogador1.nome + " ganhou!");
//       jogador1.contarVitorias();
//     }else {
//       console.log(jogador2.nome + " ganhou!");
//       jogador2.contarVitorias();
//     }
//     jogador1.mao.limparMao();
//     jogador2.mao.limparMao();
//     jogador1.adicionarCarta();
//     jogador2.adicionarCarta();
//   }
// }

