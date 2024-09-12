const Carta = require('./Cartas.js'); // Usar require para importar

class Mao {
  constructor() {
    this.cartas = [];
    
    this.sortearCartasAleatorias();

  }

  //getters e setters de cartas
  getCartas() {
    return this.cartas;
  }
  
  addCarta(carta) {
    this.cartas.push(carta);
  }

  //funciton para remover todas as cartas da mao
  limparMao() {
    this.cartas = [];
  }
  

  mostrarCartas() {
    return this.cartas.map(carta => carta.toString()).join(', ');
  }

  mostrarValor() {
    let valor = 0;
    this.cartas.forEach((carta) => {
      valor += carta.getValor();
    });
    return valor;
  }

  sortearCartasAleatorias() {
    const naipes = ['Copas', 'Espadas', 'Ouros', 'Paus'];
    
    const valorAleatorio = Math.floor(Math.random() * 10) + 1; // Valores de 1 a 10
    const naipeAleatorio = naipes[Math.floor(Math.random() * naipes.length)];
    
    const novaCarta = new Carta(valorAleatorio, naipeAleatorio);
    this.addCarta(novaCarta);
    
  }
}
module.exports = Mao;

//teste
// const minhaMao = new Mao();
// minhaMao.sortearCartasAleatorias();
// minhaMao.mostrarCartas();
// minhaMao.mostrarValor();
//fim do teste