//Criando uma class jogo onde vai receber 2 jogadores pegando da Pasta Objeto/Jogador.js passando o nome do jogador faz os geters e seters

const Jogador = require('./Jogador'); // Usar require para importar

class Jogo{
  turno;
  constructor(jogador1, jogador2){
    this.jogador1 = new Jogador(jogador1);
    this.jogador2 = new Jogador(jogador2);
    this.turno = 0;
  }

  getJogador1(){
    return this.jogador1;
  }

  getJogador2(){
    return this.jogador2;
  }

  setJogador1(jogador1){
    this.jogador1 = jogador1;
  }

  setJogador2(jogador2){
    this.jogador2 = jogador2;
  }
  getTurno(){
    return this.turno;
  }
  setTurno(turno){
    this.turno = turno;
  }
  //funcao para trocar de turno 0 para 1 e 1 para 0
  trocarTurno(){
    if(this.getTurno == 0){
      this.setTurno(1);
    }else{
      this.setTurno(0);

    }
  }
  //funcao para limpar a mao dos jogadores
  limparMaoJogadores(){
    this.jogador1.mao.limparMao();
    this.jogador2.mao.limparMao();
  }


}

module.exports = Jogo; //Exportar a class para ser usada em outros arquivos
