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

    // min e max velocidade de movimento do inimigo
    this.enemyMinSpeed = 1;
    this.enemyMaxSpeed = 4;

    // utilizando KeyboardPlugin para utilizar a tecla "space"
    this.spaceKey = this.input.keyboard.createCursorKeys().space;
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
    // adicionando propriedade speed ao car
    this.car.speed = this.setSpeed();

    this.truck = this.add.image(
      48,
      this.gameHeight - 306,
      'truck',
    );
    // mudando a escala da imagem para 0.8
    this.car.setScale(0.8);
    // adicionando propriedade speed ao truck
    this.truck.speed = this.setSpeed();

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
  update () {
    // a cada loop o método e executado novamente
    this.carMovement();
    this.truckMovement();
    this.playerMovement();
    this.checkCollisions();
  }

  /*
    Responsavel por criar de forma aleatoria a velocidade do inimigo  
  */
  setSpeed () {
    const dir = this.setDirection(); // seta a direção do inimigo
    // seta a velocidade de acordo com o min e max
    const speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
    return dir * speed; // retorna a velocida (negativa ou positiva)
  }

  /* Responsavel por gerar uma direção aleatoria  */
  setDirection () {
    // chance de 50%
    return Math.random() < 0.5 ? 1 : -1;
  }

  /* Movimentação do carro */
  carMovement () {
    // adiciona movimento ao carro (pode ser negativo ou positivo)
    this.car.x += this.car.speed;

    // caso o carro esteja saindo da tela pela esquerda
    const conditionLeft = this.car.speed < 0 && this.car.x <= -this.car.width;
    // casso o carro esteja saindo da tela pela direita
    const conditionRight = this.car.speed > 0 && this.car.x >= this.gameWidth + this.car.width;

    if (conditionLeft) {
      // muda a direção do carro  
      this.car.speed *= -1;
      // deixa a imagem do carro no eixo X na sua forma padrão
      this.car.flipX = false;

      // muda o carro de pista
      if (!this.car.moveToDown) {
        this.car.setPosition(this.car.x, this.car.y + this.car.height);
        this.car.moveToDown = true;
      }

    } else if (conditionRight) {
      // muda a direção do carro
      this.car.speed *= -1;
      // inverte a imagem do carro no eixo X
      this.car.flipX = true;

      // muda o carro de pista
      if (this.car.moveToDown) {
        this.car.setPosition(this.car.x, this.car.y - this.car.height);
        this.car.moveToDown = false;
      }
    }
  }

  /* Movimentação do caminhão */
  truckMovement () {
    // adiciona movimento ao caminhão (pode ser negativo ou positivo)
    this.truck.x += this.truck.speed;

    // gira o caminhão no eixo X (pode ser esquerda ou direita)
    if (this.truck.speed < 0) {
      this.truck.flipX = true;
    } else {
      this.truck.flipX = false;
    }

    const conditionLeft = this.truck.speed < 0 && this.truck.x <= -this.truck.width;
    const conditionRight = this.truck.speed > 0 && this.truck.x >= this.gameWidth + this.truck.width;

    // move o caminhão de faixa com uma chance de 3%
    if (Math.random() < 0.003) {
      if (!this.truck.moveToDown) {
        this.truck.setPosition(this.truck.x, this.truck.y + this.truck.height);
        this.truck.moveToDown = true;
      } else {
        this.truck.setPosition(this.truck.x, this.truck.y - this.truck.height);
        this.truck.moveToDown = false;
      }
    }

    // muda o caminhão de direção
    if (conditionLeft) {
      this.truck.speed *= -1;
    } else if (conditionRight) {
      this.truck.speed *= -1;
    }
  }

  /* Movimentação do jogador */
  playerMovement () {
    // justDown = só irá executar 1 vez ao pressionar
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      // cada vez que a tecla for pressionada, o jogador irá para cima
      this.player.y -= this.player.height;
      // muda para o frame de movimento (o jogador possui o 0 e 1)
      this.player.setFrame(1);
    } else {
      // muda para o frame parado
      this.player.setFrame(0);
    }
  }

  // verifica colisões entre jogador/inimigo e jogador/topo da tela
  checkCollisions () {
    /*
      getBounds retorna um objeto com a posição e tamanho do jogador/inimigo
    */
    const playerRect = this.player.getBounds();
    const carRect = this.car.getBounds();
    const truckRect = this.truck.getBounds();

    // RectangleToRectangle verifica se o jogador está colidindo com os inigmios
    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, carRect)
      || Phaser.Geom.Intersects.RectangleToRectangle(playerRect, truckRect)) {
      console.log('o carro/caminhão me acertou, perdi!')
      return;
    }

    // verifica se o jogador passou por todas as pistas e terminou o jogo
    if (this.player.y <= 80) {
      console.log('venci!')
      return;
    }
  }
}