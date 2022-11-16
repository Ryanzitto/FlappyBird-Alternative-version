console.log('Flappy Bird Game');

const somDeQueda = new Audio();
somDeQueda.src ='./assets/sound/fart.mp3';

const sprites = new Image();
sprites.src = './assets/sprites/sprites.png';

const enemySprite = new Image();
enemySprite.src = './assets/sprites/pngwing.com.png';

const poderSprite = new Image();
poderSprite.src = './assets/sprites/poder.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const globais = {};
let telaAtiva = {};
let frames = 0;
let frameContador = 0;

//variavel que ajuda na lógica de movimento do poder
let poderDisponivel = true;

//função que define de quantos em quantos frames o pássaro pode usar o poder
function passouFrames(){
    const passou300Frames = frames % 300 === 0;
    if(passou300Frames) {
        poderDisponivel = true;
    }
}
  
//Objeto referente aos pontos finais na tela de game over
 const placarFinal= {
    desenha(){
        contexto.font = '30px "VT323"';
        contexto.textAlign = 'center';
        contexto.fillStyle = 'white';
        contexto.fillText(pts, canvas.width -82, 145);
    },   
}

//Objeto referente ao Background e os dados relacionados
const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0,0, canvas.width, canvas.height)

        contexto.drawImage( 
            sprites,
           planoDeFundo.spriteX, planoDeFundo.spriteY, 
           planoDeFundo.largura, planoDeFundo.altura, 
           planoDeFundo.x, planoDeFundo.y,
           planoDeFundo.largura, planoDeFundo.altura,
       );
        contexto.drawImage( 
            sprites,
           planoDeFundo.spriteX, planoDeFundo.spriteY, 
           planoDeFundo.largura, planoDeFundo.altura, 
           planoDeFundo.x + planoDeFundo.largura, planoDeFundo.y,
           planoDeFundo.largura, planoDeFundo.altura,
       );
    }
}
//Objeto referente a tela de Game Over
const gameOver= {
    sX: 134,
    sY: 153,
    w: 226,
    h: 199,
    x:(canvas.width / 2) - 210 / 2,
    y: 50,
    desenha(){
        contexto.drawImage( 
            sprites,
            gameOver.sX, gameOver.sY, 
            gameOver.w, gameOver.h, 
            gameOver.x, gameOver.y,
            gameOver.w, gameOver.h,
       );
    }
}
//Objeto referente as medalhas na tela de Game Over
//OBS: ainda não foi implementado
const medalhas = 
{
    sX: 0,
    sY: 79,
    w: 44,
    h: 44,
    x: 80,
    y: 138,
    desenha(){
        contexto.drawImage(
            sprites,
            medalhas.sX, medalhas.sY, 
            medalhas.w, medalhas.h, 
            medalhas.x, medalhas.y,
            medalhas.w, medalhas.h,
        );
    }
}

//Objeto referente a mensagem de inicio
const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x:(canvas.width / 2) - 174 / 2,
    y: 50,
    desenha(){
        contexto.drawImage( 
            sprites,
            mensagemGetReady.sX, mensagemGetReady.sY, 
            mensagemGetReady.w, mensagemGetReady.h, 
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.w, mensagemGetReady.h,
       );
    }
}
//função que avalia se houve colisão entre o poder do flappy e o monstro 
function hitMonstro(){
    if(globais.poder.x === globais.enemy.x){
        console.log(globais.enemy.vida)
        globais.enemy.vida = globais.enemy.vida - 25
        console.log('houve colisão')
        console.log(globais.enemy.vida)      
    }
    return true;
}

//função que seta o x e y do poder pros mesmos do flappy
//fazendo a lógica do poder sair do flappy
function liberaPoder(){
    if(poderDisponivel == true){
        globais.poder.x = globais.flappyBird.x
        globais.poder.y = globais.flappyBird.y
        poderDisponivel = false
    }
}

//função responsável por criar o poder
function criaPoder(){
    const poder ={
        spriteX: 22,
        spriteY: 160,
        largura: 180,
        altura: 150,
        x: -50,
        y: 0,
        
        movimentos:[
            {spriteX: 22, spriteY:160, }, // sprite 1
            {spriteX: 224, spriteY:160, }, // sprite 2
            {spriteX: 456, spriteY:160, }, // sprite 3 
        ],
    
        frameAtual: 0,
            atualizaOFrameAtual(){
                const intervaloDeFrames = 10;
                const passouOIntervalo = frames % intervaloDeFrames
                
                if(passouOIntervalo === 0){
                    const baseDoIncremento = 1;
                    const incremento = baseDoIncremento + poder.frameAtual;
                    const baseRepeticao = poder.movimentos.length;
                    poder.frameAtual = incremento % baseRepeticao
                  }
            },
            desenha(){ 
                    poder.atualizaOFrameAtual()                  
                    const{spriteX, spriteY} = poder.movimentos[poder.frameAtual];

                    contexto.drawImage( 
                    poderSprite,
                    spriteX, spriteY,
                    poder.largura, poder.altura, 
                    poder.x, poder.y,
                    poder.largura/4, poder.altura/4,
                    );
                    if(poderDisponivel == false){
                        poder.x +=3
                    }                        
            },
            espacePush(){
                liberaPoder();
            },
            atualiza(){
                passouFrames()
            },
        }
        return poder;
}

//função que cria o monstro
function criaMonstro(){
    const enemy = {
        spriteX: 0,
        spriteY: 0,
        largura: 130,
        altura: 114,
        x: 320,
        y: canvas.height- 200,
        vida : 100,
        movimentos:[
            {spriteX: 0, spriteY:0, }, // Parado 1
            {spriteX: 130, spriteY:148, }, // Parado 2
            {spriteX: 265, spriteY:148, }, // Parado 3 
            {spriteX: 546, spriteY:126, largura: 130, altura: 137, }, //abre a boca 1
            {spriteX: 409, spriteY:126, largura: 130, altura: 137, }, //abre a boca 2
                 
        ],
        hurt:[
            {spriteX: 0, spriteY :403, largura: 130, altura: 100, },
        ],
        frameAtual: 0,
            atualizaOFrameAtual(){
                const intervaloDeFrames = 10;
                const passouOIntervalo = frames % intervaloDeFrames
                
                if(passouOIntervalo === 0){
                    const baseDoIncremento = 1;
                    const incremento = baseDoIncremento + enemy.frameAtual;
                    const baseRepeticao = enemy.movimentos.length;
                    enemy.frameAtual = incremento % baseRepeticao
                    //console.log(frames)
                  } 
            }, 
            atualiza(){
                this.primeiraAparição();
                this.segundaAparição();
            },
            //função que cria a lógica da primeira vez que o cogumelo-monstro aparece 
            primeiraAparição(){
                frameMonstro = frames;
             if(frameMonstro > 500  && frameMonstro < 560){
                enemy.x = enemy.x -2
             }
             else if( frameMonstro > 900 && frameMonstro < 960){
                enemy.x = enemy.x +2
            }
         },
            segundaAparição(){
                frameMonstro = frames;
             if(frameMonstro > 1200 && frameMonstro < 1260){
                enemy.x = enemy.x -2
             }
            //  else if( frameMonstro > 900 && frameMonstro < 960){
            //     enemy.x = enemy.x +2
            // }
         },
            desenha(){
                enemy.atualizaOFrameAtual()
                const{spriteX, spriteY} = enemy.movimentos[enemy.frameAtual];
                contexto.drawImage( 
                    enemySprite,
                    spriteX, spriteY,
                    enemy.largura +10, enemy.altura +23, 
                    enemy.x, enemy.y,
                    enemy.largura, enemy.altura,
               );
            },
    }
    return enemy;
}

//função que facilita acesso de uma variavel 
function pontosFinais(pontuacao){
    pts = pontuacao
    return pts;
 }

//Função responsável por redefinir o valor do objeto medalha a cada rodada
function zeraMedalha(){
    medalhas.sX = 0;
    medalhas.sY = 79;
}

function qualMedalha(pontos){
    if(pontos >=20){
        medalhas.sX = 48;
        medalhas.sY= 78;
    }
    if(pontos >=50){
        medalhas.sX = 0;
        medalhas.sY = 124;
    }
    if(pontos >= 70){
        medalhas.sX = 48;
        medalhas.sY = 124;
    }
}

//FUNÇÃO QUE INICIALIZA CADA UMA DESSAS OUTRAS FUNÇÕES DE CRIAR ALGO
function inicializa(){
    globais.flappyBird = criaFlappyBird();
    globais.chao = criaChao();
    globais.canos = criaCanos();
    globais.placar = criaPlacar();
    globais.enemy = criaMonstro();
    globais.poder = criaPoder();
}

//funçao responsável por captar qual é a tela atual e caso necessesário, inicializa uma função
function mudaParaTela(novaTela){
    telaAtiva = novaTela;
    if(telaAtiva.inicializa){
       inicializa()
    }
}

//FUNÇÃO QUE CRIA CANOS
function criaCanos(){
    const canos = {
        largura: 52,
        altura: 400,

        chao:{
            spriteX: 0,
            spriteY: 169,
        },

        ceu:{
            spriteX: 52,
            spriteY: 169,
        },

        espace: 80,

        desenha(){
                canos.pares.forEach(function(par){
                    const yRandom = par.y;
                    const espaçoEntreCanos = 90;
                    const canoCeuX = par.x;
                    const canoCeuY = yRandom;
                    //cano do céu
                    contexto.drawImage(
                        sprites,
                        canos.ceu.spriteX, canos.ceu.spriteY,
                        canos.largura, canos.altura,
                        canoCeuX, canoCeuY,
                        canos.largura, canos.altura
                    )
        
                    const canoChaoX = par.x;
                    const canoChaoY = canos.altura + espaçoEntreCanos + yRandom;
        
                    //cano do chao
                    contexto.drawImage(
                        sprites,
                        canos.chao.spriteX, canos.chao.spriteY,
                        canos.largura, canos.altura,
                        canoChaoX, canoChaoY,
                        canos.largura, canos.altura
                    )
                    par.canoCeu = {
                        x: canoCeuX.Audio,
                        y: canos.altura + canoCeuY
                    }

                    par.canoChao = {
                        x: canoChaoX,
                        y: canoChaoY
                    }   
                })   
        },
        temColisaoComOFlappyBird(par){
            const cabeçaDoFlappy = globais.flappyBird.y;
            const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

            if((globais.flappyBird.x + 25) >= par.x){
              
                if(cabeçaDoFlappy <= par.canoCeu.y){
                    poderDisponivel = true;
                    return true;
                }
                if(peDoFlappy >+ par.canoChao.y){
                    poderDisponivel = true;
                    return true;
                }
            }            
            return false;
        },

        pares: [],
        atualiza(){
            const passou100Frames = frames % 100 === 0;
            if(passou100Frames) {
                canos.pares.push({
                    x:canvas.width,
                    y:-150 * (Math.random() + 1),
                });
            }
            canos.pares.forEach(function(par){
                par.x = par.x - 2;

                if (canos.temColisaoComOFlappyBird(par)){
                    poderDisponivel = true;
                    somDeQueda.play();
                    mudaParaTela(telas.FIM)   
                }
                if(par.x + canos.largura <=0){
                    canos.pares.shift();
                }
            });
        }
    }
    return canos;
}

//FUNÇÃO QUE CRIA O CHÃO
function criaChao(){
//Objeto referente ao chão e os dados relacionados
const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza(){
        const movimentoDoChao = 1;
        const repeteEm = chao.largura / 2;
        const movimentacao = chao.x - movimentoDoChao;
        chao.x = movimentacao % repeteEm 
    },
    desenha() {
        contexto.drawImage( 
            sprites,
            chao.spriteX, chao.spriteY, 
            chao.largura, chao.altura, 
            chao.x, chao.y,
            chao.largura, chao.altura,
       );
        contexto.drawImage( 
            sprites,
            chao.spriteX, chao.spriteY, 
            chao.largura, chao.altura, 
            chao.x + chao.largura, chao.y,
            chao.largura, chao.altura,
       );
    }
}
return chao;
}

//FUNÇÃO QUE CRIA O FLAPPYBIRD
function criaFlappyBird(){
    //Objeto referente ao pássaro e os dados relacionados
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 3.5,
        pula(){        
            flappyBird.velocidade = -flappyBird.pulo
        },
        gravidade: 0.15,
        velocidade: 0,
        atualiza(){
            if (fazColisao(flappyBird, globais.chao)) {
                poderDisponivel = true;
                somDeQueda.play();
                mudaParaTela(telas.FIM)            
                return ;
            }
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos:[
            {spriteX: 0, spriteY:0, }, // asa pra cima
            {spriteX: 0, spriteY:26, }, // asa no meio
            {spriteX: 0, spriteY:52, }, // asa pra baixo       
        ],
        frameAtual: 0,
        atualizaOFrameAtual(){
            const intervaloDeFrames = 10;
            const passouOIntervalo = frames % intervaloDeFrames
            
            if(passouOIntervalo === 0){
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao 
            }           
        },

        desenha() {
           flappyBird.atualizaOFrameAtual()
            const{ spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];

            contexto.drawImage( 
                sprites,
                spriteX, spriteY, 
                flappyBird.largura, flappyBird.altura, 
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,
           );
        }
    }
    return flappyBird;
}
//FUNÇÃO QUE CRIA O PLACAR
function  criaPlacar(){
    const placar = {
       pontuacao: 0,
        desenha(){
            contexto.font = '35px "VT323"';
            contexto.textAlign = 'right';
            contexto.fillStyle = 'white';
            contexto.fillText(`${placar.pontuacao}`, canvas.width -5, 35);
        },
        
        atualiza(){
            const intervaloDeFrames = 20;
            const passouOIntervalo = frames % intervaloDeFrames === 0;  
            if(passouOIntervalo){
                placar.pontuacao = placar.pontuacao + 1;   
                qualMedalha(this.pontuacao);  
                pontosFinais(this.pontuacao)   
            }
        }
    }
    return placar;
}
//FUNÇÃO QUE AVALIA SE HOUOVE COLISÃO ENTRE O FLAPPY E O CHÃO
function fazColisao(flappyBird, chao){
    const flappyBirdY = flappyBird.y + flappyBird.altura
    const chaoY = globais.chao.y
    if( flappyBirdY >= chaoY){
        poderDisponivel = true;
        return true;
    }
    return false;
}

//TELAS
const telas = {
    inicio:{
        inicializa(){
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos(); 
        },
        desenha(){  
            planoDeFundo.desenha();
            globais.flappyBird.desenha();
            globais.chao.desenha();
            mensagemGetReady.desenha(); 
        },
        click(){
            mudaParaTela(telas.JOGO);
        },
        atualiza(){
            globais.chao.atualiza();
            zeraMedalha();
            frames = 0;
        }
    }
}

telas.JOGO = {
    inicializa(){
        globais.placar = criaPlacar();
        globais.enemy = criaMonstro();
        globais.poder.criaPoder();
    },
    desenha(){
        planoDeFundo.desenha(); //função que desenha o background
        globais.canos.desenha();
        globais.chao.desenha(); //funcão que desenha o chaos
        globais.flappyBird.desenha(); //função que desenha o pássaro
        globais.placar.desenha();
        globais.enemy.desenha();
        globais.poder.desenha();
    },
    click(){
        globais.flappyBird.pula();
    },
    atualiza(){
        globais.flappyBird.atualiza();  //funcão que atualiza a posição do pássaro
        globais.chao.atualiza();
        globais.canos.atualiza();
        globais.placar.atualiza();
        globais.enemy.atualiza();
        globais.poder.atualiza();   
    },
    espacePush(){
        globais.poder.espacePush();
    },
};

telas.FIM = {
    inicializa(){},

    desenha(){
        planoDeFundo.desenha(); //função que desenha o background
        globais.canos.desenha();
        globais.chao.desenha(); //funcão que desenha o chao
        globais.flappyBird.desenha(); //função que desenha o pássaro
        gameOver.desenha();    
        medalhas.desenha(); 
        placarFinal.desenha();
    },

    click(){
        mudaParaTela(telas.inicio)      
    },

    atualiza(){
        frames = 0;
    }
}
     
// Essa função se repete varias vezes por segundo
function loop(){
    telaAtiva.desenha();
    telaAtiva.atualiza();
    frames += 1;
    frameContador +=1;
    hitMonstro();
    requestAnimationFrame(loop); 
}

//função responsavel por ativar o evento de click caso a tela atual tenha um evento do tipo
window.addEventListener('click', function(){
  if (telaAtiva.click) {
    telaAtiva.click();
  }
});
        
//função responsavel por ativar evento da tecla "Espaço"
window.addEventListener('keydown',(evento)=>{
    key = evento.keyCode
    if(key == 32 && telaAtiva.espacePush){
        telaAtiva.espacePush();
    }
})

//função que traz a tela inicial para começar a interação do usuario
mudaParaTela(telas.inicio);
loop();