import './style.css'
import Phaser from 'phaser'


const sizes={
  width:500,
  height:500
}

const speedDown=150

//this is the second step
class GameScene extends Phaser.Scene{
  constructor(){
    super('scene-game')
    this.player
    this.cursor
    this.playerSpeed=speedDown+50
    this.target
    this.point=0
    this.textScore
    this.textTime
    this.timedEvent
    this.remainingTime
    this.coinMusic,
    this.bgMusic,
    this.emmiter
  }

  preload(){
    this.load.image('bg','/assets/bg.png')
    this.load.image('basket','/assets/basket.png')
    this.load.image('apple','/assets/apple.png')
    this.load.audio('bgmusic','/assets/bgMusic.mp3')
    this.load.audio('coin','/assets/coin.mp3')
    this.load.image('money','assets/money.png')


  }
//setOrigin make the game objects indide the canvas
  create(){
    this.coinMusic=this.sound.add('coin')
    this.bgMusic=this.sound.add('bgmusic')
    this.bgMusic.play();
    this.bgMusic.stop()


    this.add.image(0,0,'bg').setOrigin(0,0) //to get the fullside on the canvas
    this.player=this.physics.add.image(0,sizes.height-100,'basket').setOrigin(0,0)
    this.player.setImmovable(true)
    this.player.body.allowGravity=false
    this.player.setCollideWorldBounds(true)
    this.cursor=this.input.keyboard.createCursorKeys()
    this.player.setSize(this.player.width-this.player.width/4, this.player.height/6).setOffset(this.player.width/10,this.player.height-this.player.height/10)
    this.target=this.physics.add.image(0,0,'apple').setOrigin(0,0);
   this.target.setMaxVelocity(0,speedDown)
   this.textScore=this.add.text(380,10,"Score:0",{
    font:'25px Arial',
    fill:'#000000'
   })
   this.textTime=this.add.text(20,10,"Remaining Time:00",{
    font:'25px Arial',
    fill:'#000000'
   })

   this.timedEvent=this.time.delayedCall(50000,this.gameOver())

    this.physics.add.overlap(this.target, this.player,this.targetHit,null, this)

   this.emitter=this.add.particles(0,0,'money',{
      speed:100,
      gravityY:speedDown,
      scale:0.04,
      duration:100,
      emitting:false
   })
  } 

  update(){
    this.remainingTime=this.timedEvent.getRemainingSeconds()
    this.textTime.setText(`Remaining Time: ${Math.round(this.remainingTime).toString()}`)
    if(this.target.y >=sizes.height){
      this.target.setY(0)
      this.target.setX(this.getRandomX())
    }
    const {left,right}=this.cursor;

    if(left.isDown){
      this.player.setVelocityX(-this.playerSpeed)
    }else if(right.isDown){
      this.player.setVelocityX(this.playerSpeed)
    }else{
      this.player.setVelocityX(0)
    }
  }

  getRandomX(){
    return Math.floor(Math.random()*480);
  }

  targetHit(){
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.point++;
    this.textScore.setText(`Score: ${this.point}`)
    this.coinMusic.play();
    this.emitter.start()
  }

  gameOver(){
    console.log("Game Over")
  }
}

//this is the first step
const config={
  type:Phaser.WEBGL,
  width:sizes.width,
  height:sizes.height,
  canvas:gameCanvas,
  physics:{
    default:'arcade',
    arcade:{
      gravity:{
        y:speedDown
      },
      debug:true
    }
  },
  scene:[GameScene]
}



const game=new Phaser.Game(config)



