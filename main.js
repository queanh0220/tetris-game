let play = document.getElementById('play')
let end = document.getElementById('game-over')
let pause = document.getElementById('pause')
class Game {
    constructor() {
        this.score = 0
        this.boardWidth = 10
        this.boardHeight = 23
        this.timeId = 0
        this.paused = false
        this.speed = 500
        this.currentBoard = new Array(this.boardHeight).fill(0).map(() => new Array(this.boardWidth).fill(0))
        this.landedBoard = new Array(this.boardHeight).fill(0).map(() => new Array(this.boardWidth).fill(0))
        this.currentTetromino = this.randomTetromino() /* TODO */
        this.canvas = document.getElementById('tetris-canvas')
        this.ctx = this.canvas.getContext('2d')
        this.preTetromino = this.randomTetromino()
    }

    draw(blockSize = 24, padding = 4) {
        /* Vẽ khung của board */
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.lineWidth = 2
        this.ctx.rect(padding, padding, blockSize*this.boardWidth+padding*(this.boardWidth+1), blockSize*(this.boardHeight-3)+padding*(this.boardHeight-3+1))
        this.ctx.stroke()
    
        /* Lặp qua các phần tử của mảng board và vẽ các block tại đúng vị trí */
        for (let i = 3; i < this.boardHeight; i++) {
          for (let j = 0; j < this.boardWidth; j++) {
            /*if (this.currentBoard[i][j] > 0) {
              this.ctx.fillStyle = 'rgb(0, 0, 0)'
            } else {
              this.ctx.fillStyle = 'rgb(248, 248, 248)'
            }*/
            if (this.currentBoard[i][j] == 0) this.ctx.fillStyle = 'rgb(248, 248, 248)'
            else if (this.currentBoard[i][j] == 1) this.ctx.fillStyle = 'rgb(255, 87, 34)'
            else if (this.currentBoard[i][j] == 2) this.ctx.fillStyle = 'rgb(63, 81, 181)'
            else if (this.currentBoard[i][j] == 3) this.ctx.fillStyle = 'rgb(156, 39, 176)'
            else if (this.currentBoard[i][j] == 4) this.ctx.fillStyle = 'rgb(255, 235, 59)'
            else if (this.currentBoard[i][j] == 5) this.ctx.fillStyle = 'rgb(183, 28, 28)'
            else if (this.currentBoard[i][j] == 6) this.ctx.fillStyle = 'rgb(0, 188, 212)'
            else if (this.currentBoard[i][j] == 7) this.ctx.fillStyle = 'rgb(76, 175, 80)'
            this.ctx.fillRect(padding*2+j*(blockSize+padding), padding*2+(i-3)*(blockSize+padding), blockSize, blockSize)
          }
        }

         /* Viết ra các đoạn text */
          /* Khung khối tetromino kế tiếp */
          let x = this.preTetromino.shape.length
          let y = this.preTetromino.shape[0].length

        this.ctx.fillStyle = 'rgb(0, 0, 0)'
        this.ctx.font = '12px Arial'
        this.ctx.fillText('TIẾP THEO:', 300, 28)
        //this.ctx.rect(300, 40, blockSize*y+padding*(y+1), blockSize*x+padding*(x+1))
        this.ctx.fillText('ĐIỂM SỐ:', 300, 200)
        this.ctx.font = '13px Arial'
        this.ctx.fillText(this.score.toString(), 300, 230)
        for (let i = 3; i < this.preTetromino.shape.length+3; i++) {
          for (let j = 0; j < this.preTetromino.shape[i-3].length; j++) {
            if(this.preTetromino.shape[i-3][j] > 0) {
              this.ctx.fillStyle = this.preTetromino.color
              this.ctx.fillRect(300+padding+j*(blockSize+padding),40 + padding+(i-3)*(blockSize+padding), blockSize, blockSize)
            }
            else this.ctx.fillStyle = 'rgb(0, 0, 0)'
          }
        }
      }

    randomTetromino() {
      const randNum = Math.floor(Math.random() * Math.floor(7))
      switch (randNum) {
        case 0:
          return new LShape(1, 4)
        case 1:
          return new JShape(1, 4)
        case 2:
          return new OShape(2, 4)
        case 3:
          return new TShape(2, 4)
        case 4:
          return new SShape(2, 4)
        case 5:
          return new ZShape(2, 4)
        case 6:
          return new IShape(0, 4)
      }
    }

    play() {
      this.timeId = setInterval(() => {
        if(!this.paused) {
          this.progress()
          this.updateCurrentBoard()
          this.draw()
        }
      }, this.speed);
    }

    //kt dung bien duoi
    bottomOverlapped(tetromino) {
      if (tetromino.row + tetromino.height > this.boardHeight) {
        return true
      } else {
        return false
      }
    }

    //ktdungkhoi
    landedOverlapped(tetromino) {
      for (let i = 0; i < tetromino.height; i++) {
        for (let j = 0; j < tetromino.width; j++) {
          if (tetromino.shape[i][j] > 0 &&
            this.landedBoard[tetromino.row+i][tetromino.col+j] > 0) {
          return true
        }
      }
    }
    return false
    }

    //cap nhat land
    mergeCurrentTetromino() {
      for (let i = 0; i < this.currentTetromino.height; i++) {
        for (let j = 0; j < this.currentTetromino.width; j++) {
          if (this.currentTetromino.shape[i][j] > 0) {
            this.landedBoard[this.currentTetromino.row + i][this.currentTetromino.col + j] = this.currentTetromino.shape[i][j]
          }
        }
      }
    }
    
    progress() {
      /* TODO */
      let nextTetromino = new this.currentTetromino.constructor(this.currentTetromino.row + 1, this.currentTetromino.col, this.currentTetromino.angle)
      if (!this.bottomOverlapped(nextTetromino) && !this.landedOverlapped(nextTetromino)) {
        this.currentTetromino.fall()
      } else {
        this.mergeCurrentTetromino()
        this.addScore()
        this.gameOver()
        this.currentTetromino = this.preTetromino
        this.preTetromino =  this.randomTetromino()
        // TODO
      }
    }
    
    updateCurrentBoard() {
      for (let i = 0; i < this.boardHeight; i++) {
        for (let j = 0; j < this.boardWidth; j++) {
          this.currentBoard[i][j] = this.landedBoard[i][j]
        }
      }
  
      for (let i = 0; i < this.currentTetromino.height; i++) {
        for (let j = 0; j < this.currentTetromino.width; j++) {
          if (this.currentTetromino.shape[i][j] > 0) {
            this.currentBoard[this.currentTetromino.row + i][this.currentTetromino.col + j] = this.currentTetromino.shape[i][j]
          }
        }
      }
    }

    gameOver() {
      if (this.landedBoard[3].some(x => x > 0)) {
        clearInterval(this.timeId)
        this.timeId = 0
        end.style = 'visibility : unset'
        play.style = 'visibility : unset'
      }
    }

    addScore() {
      for (let i = 0; i < this.landedBoard.length; i++) {
        if (this.landedBoard[i].every(x => x > 0)) {
          this.score += 1;
          for (let j = i; j > 0; j--)
            for(let k = 0; k < this.landedBoard[j].length; k++)
              this.landedBoard[j][k] = this.landedBoard[j-1][k];
        }
      }
    }

    tryMoveDown() {
      if(this.timeId != 0 && !this.paused) {
        this.progress()
        this.updateCurrentBoard()
        this.draw()
      }
    }

    leftOverlapped(tetromino) {
      if (tetromino.col < 0) {
        return true
      } else {
        return false
      }
    }
    
    rightOverlapped(tetromino) {
      if (tetromino.col + tetromino.width > this.boardWidth) {
        return true
      } else {
        return false
      }
    }

    tryMoveLeft() {
      if(this.timeId != 0 && !this.paused) {
        const tempTetromino = new this.currentTetromino.constructor(this.currentTetromino.row, this.currentTetromino.col - 1, this.currentTetromino.angle)
        if (!this.leftOverlapped(tempTetromino) &&
          !this.landedOverlapped(tempTetromino)) {
          this.currentTetromino.col -= 1
          this.updateCurrentBoard()
          this.draw()
        }
      }
    }
  
    tryMoveRight() {
      if(this.timeId != 0 && !this.paused) {
        const tempTetromino = new this.currentTetromino.constructor(this.currentTetromino.row, this.currentTetromino.col + 1, this.currentTetromino.angle)
        if (!this.rightOverlapped(tempTetromino) &&
          !this.landedOverlapped(tempTetromino)) {
          this.currentTetromino.col += 1
          this.updateCurrentBoard()
          this.draw()
        }
      }
    }

    tryRotating() {
      if(this.timeId != 0 && !this.paused) {
        const tempTetromino = new this.currentTetromino.constructor(this.currentTetromino.row + 1, this.currentTetromino.col, this.currentTetromino.angle)
        tempTetromino.rotate()
        if (!this.rightOverlapped(tempTetromino) &&
          !this.bottomOverlapped(tempTetromino) &&
          !this.landedOverlapped(tempTetromino)) {
          this.currentTetromino.rotate()
          this.updateCurrentBoard()
          this.draw()
        }
      }
    }
}

class Tetromino {
  constructor(row, col, angle = 0) {
    if (this.constructor === Tetromino) {
      throw new Error("This is an abstract class.")
    }
    this.row = row
    this.col = col
    this.angle = angle
  }

  get shape() {
    return this.constructor.shapes[this.angle]
  }

  get color() {
    return this.constructor.color
  }

  get width() {
    return this.shape[0].length
  }

  get height() {
    return this.shape.length
  }

  fall() {
    this.row += 1
  }

  rotate() {
    if (this.angle < 3) {
      this.angle += 1
    } else {
      this.angle = 0
    }
  }

  move(direction) {
    if (direction === 'left') {
      this.col -= 1
    } else if (direction === 'right') {
      this.col += 1
    }
  }
}

class LShape extends Tetromino { }

LShape.shapes =
  [[[1, 0],
    [1, 0],
    [1, 1]],

   [[1, 1, 1],
    [1, 0, 0]],

   [[1, 1],
    [0, 1],
    [0, 1]],

   [[0, 0, 1],
    [1, 1, 1]]]

LShape.color = 'rgb(255, 87, 34)'

class JShape extends Tetromino { }

JShape.shapes =
  [[[0, 2],
    [0, 2],
    [2, 2]],

   [[2, 0, 0],
    [2, 2, 2]],

   [[2, 2],
    [2, 0],
    [2, 0]],

   [[2, 2, 2],
    [0, 0, 2]]]

JShape.color = 'rgb(63, 81, 181)'

class OShape extends Tetromino { }

OShape.shapes =
  [[[3, 3],
    [3, 3]],

   [[3, 3],
    [3, 3]],

   [[3, 3],
    [3, 3]],

   [[3, 3],
    [3, 3]]]

OShape.color = 'rgb(156, 39, 176)'

class TShape extends Tetromino { }

TShape.shapes =
  [[[0, 4, 0],
    [4, 4, 4]],

   [[4, 0],
    [4, 4],
    [4, 0]],

   [[4, 4, 4],
    [0, 4, 0]],

   [[0, 4],
    [4, 4],
    [0, 4]]]

TShape.color = 'rgb(255, 235, 59)'

class SShape extends Tetromino { }

SShape.shapes =
  [[[0, 5, 5],
    [5, 5, 0]],

   [[5, 0],
    [5, 5],
    [0, 5]],

   [[0, 5, 5],
    [5, 5, 0]],

   [[5, 0],
    [5, 5],
    [0, 5]]]

SShape.color = 'rgb(183, 28, 28)'

class ZShape extends Tetromino { }

ZShape.shapes =
  [[[6, 6, 0],
    [0, 6, 6]],

   [[0, 6],
    [6, 6],
    [6, 0]],

   [[6, 6, 0],
    [0, 6, 6]],

   [[0, 6],
    [6, 6],
    [6, 0]]]

ZShape.color = 'rgb(0, 188, 212)'

class IShape extends Tetromino { }

IShape.shapes =
  [[[7],
    [7],
    [7],
    [7]],

   [[7, 7, 7, 7]],

   [[7],
    [7],
    [7],
    [7]],

   [[7, 7, 7, 7]]]

IShape.color = 'rgb(76, 175, 80)'

  play.onclick = function() {
  
    document.getElementById('main').style = "background: none"
    end.style = 'visibility: hidden'
    play.style = 'visibility: hidden'
    pause.style = 'visibility: unset'
    const game = new Game()
    game.updateCurrentBoard()
    game.draw()
    game.play()
    pause.onclick = function() {
      game.paused = !(game.paused)
      if (game.paused) pause.innerHTML = 'Tiếp tục'
      else pause.innerHTML = 'Tạm dừng'
    }
    window.addEventListener('keydown', (event) => {
      switch (event.keyCode) {
        case 37: // Left
          game.tryMoveLeft()
          break
      
        case 38: // Up
          game.tryRotating()
          break
      
        case 39: // Right
          game.tryMoveRight()
          break
      
        case 40: // Down
          game.tryMoveDown()
          break
      }
    })
  }
