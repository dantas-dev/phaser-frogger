// passa as configurações do jogo
const config = {
  type: Phaser.AUTO, // preferência por WebGL, caso não, irá usar o Canvas
  width: 420, // largura da tela do jogo
  height: 462, // altura da tela do jogo
  pixelArt: true, // mantem os graficos nitidos, sem essa propriedade o jogo fica meio "borrado"
  banner: false, // desativa o log ao iniciar o phaser (na aba console do navegador)
}

window.onload = () => new Game(config);

// instância que inicia o jogo
class Game extends Phaser.Game {
  constructor(config) {
    super(config);

    this.scene.add('Main', new MainScene('Main')); // adiciona essa cena ao jogo
    this.scene.start('Main'); // inicia a cena selecionada
  }
}

// cena principal do jogo
class MainScene extends Phaser.Scene {
  // key e o identificador único de uma Scene, assim não corremos riscos de ter Scenes repetidas
  constructor(key) {
    super(key);
  }

  /*
    Primeiro metodo a ser executado
    normalmente utilizamos para iniciar o estado da nossa Scene,
    como hp do jogador, ou o level que estamos
  */
  init () {
    // largura da tela
    this.gameWidth = this.sys.game.config.width;
    // altura da tela
    this.gameHeight = this.sys.game.config.height;
  }

  /*
    Segundo metodo a ser executado
    aqui nós colocamos todos os recursos do jogo, como imagens e sons para o jogo,
    note que esse metodo só ira ser finalizado quando todos os recursos forem importados para o Phaser
  */
  preload () {
    // carregando arquivo do tipo imagem
    this.load.image('background', './src/assets/background.png');
    this.load.image('car', './src/assets/car.png');
    this.load.image('truck', './src/assets/truck.png');

    // carregando spritesheet
    this.load.spritesheet('frog', './src/assets/frog.png', {
      frameWidth: 54, // largura do quadro
      frameHeight: 42, // altura do quadro
    });
  }

  /*
    Terceiro metodo a ser executado
    utilizamos para criar os objetos do nosso jogo, como por exemplo o jogador
    e onde ele irá ficar posicionado na tela
  */
  create () {
    // criando o objeto do tipo imagem
    const background = this.add.image(
      0, // X referente a tela do jogo
      0, // Y referente a tela do jogo
      'background', // chave da textura
    );
    // setando a origin do objeto para 0 (x, y)
    background.setOrigin(0);

    this.car = this.add.image(
      48,
      this.gameHeight - 140,
      'car',
    );
    // mudando a escala da imagem para 0.8
    this.car.setScale(0.8);

    this.truck = this.add.image(
      48,
      this.gameHeight - 306,
      'truck',
    );
    // mudando a escala da imagem para 0.8
    this.car.setScale(0.8);

    // Object tipo sprite
    this.player = this.add.sprite(
      this.gameWidth / 2,
      this.gameHeight - 20,
      'frog',
      0, // frame index
    );
  }
  /*
    Quarto metodo a ser executado
    irá ficar em loop executando em média 60fps, basicamente e a função que 
    realmente da "vida" ao jogo, aqui colocamos a lógica de movimentação e
    colisão do jogador por exemplo.
  */
  update () { }
}