//criar uma classe para as cartas do baralho sem niper, mas 13 valores (1 a 10)
class Carta {
  valor;
  naipe;
  constructor(valor, naipe) {
    this.valor = valor;
    this.naipe = naipe;
  }
  getValor() {
    return this.valor;
  }
  getNaipe() {
    return this.naipe;

  }
  setValor(valor) {
    this.valor = valor;
  }
  setNaipe(naipe) {
    this.naipe = naipe;
  }
  toString() {
    return this.valor + " de " + this.naipe;
  }

  getImagem() {
    return this.imagem;
  }
  setImagem(imagem) {
    this.imagem = imagem;
  }
}

module.exports = Carta; // Usar module.exports para exportar a classe