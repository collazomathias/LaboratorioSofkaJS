class Board{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }
    get elements(){
        var elements = this.bars.map(function(bar){ return bar; });
        elements.push(this.ball);
        return elements;
    }
}

class BoardView{
    constructor(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.context = canvas.getContext("2d");
    }

    play(){
        if(this.board.playing){
            this.clean();
            this.draw();
            this.check_collision();
            this.board.ball.move();
        }
    }

    clean(){
        this.context.clearRect(0,0,board.width, board.height);
    }

    draw(){
        for(var i = this.board.elements.length - 1; i >= 0; i--){
            var elem = this.board.elements[i];
            this.drawElem(this.context, elem);
        }
    }

    drawElem(context, element){
        switch(element.kind){
            case "rectangle":
                context.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                context.beginPath();
                context.arc(element.x, element.y, element.radius, 0, 7);
                context.fill();
                context.closePath();
                break;
        }
    }

    check_collision(){
        for(var i = this.board.bars.length - 1; i >= 0; i--){
            var bar = this.board.bars[i];
            if(hit(bar, this.board.ball)){
                this.board.ball.collision(bar);
            }
        }
    }
}

function hit(a, b){
    var hit = false;
    if(b.x + b.width >= a.x && b.x < a.x + a.width){
        if (b.y + b.height >= a.y && b.y < a.y + a.height) 
            hit = true;
    }
    if(b.x <= a.x && b.x + b.width >= a.x + a.width){
        if (b.y <= a.y && b.y + b.height >= a.y + a.height) 
            hit = true;
    }
    if(a.x <= b.x && a.x + a.width >= b.x + b.width){
        if (a.y <= b.y && a.y + a.height >= b.y + b.height) 
            hit = true;
    }
    return hit;
}


class Bar{
    constructor(x, y, width, height, board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 10;
    }

    down(){
        this.y += this.speed;
    }

    up(){
        this.y -= this.speed;
    }

    toString(){
        return "| x: "+this.x+" | | y: "+this.y+" |";
    }
}

class Ball {
    constructor(x, y, radius, board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.board = board;
        this.speed_y = 0;
        this.speed_x = 3;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.kind = "circle";
        this.speed = 3;
        board.ball = this;
    }

    get width(){
        return this.radius * 2;
    }

    get height(){
        return this.radius * 2;
    }

    move(){
        this.x += (this.speed_x * this.direction);
        this.y += (this.speed_y);
    }

    collision(bar){
        var relative_intersect_y = ( bar.y + (bar.height / 2) ) - this.y;
        var normalized_intersect_y = relative_intersect_y / (bar.height / 2);
        this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

        this.speed_y = this.speed * -Math.sin(this.bounce_angle);
        this.speed_x = this.speed * Math.cos(this.bounce_angle);

        if (this.x > (this.board.width / 2)) 
            this.direction = -1;
        else 
            this.direction = 1;
    }
}

var board = new Board(800, 400);
var canvas = document.getElementById("canvas");
var barIzq = new Bar(10, 100, 40, 100, board);
var barDer = new Bar(750, 100, 40, 100, board);
var board_view = new BoardView(canvas, board);
var ball = new Ball(350, 100, 10, board);

board_view.draw();
window.requestAnimationFrame(controller);
setTimeout(function(){
    ball.direction = -1;
}, 4000);

document.addEventListener("keydown", function(event){
    console.log(barIzq.toString(), barDer.toString());
    if(event.keyCode == 38){
        event.preventDefault();
        barIzq.up();
    } else if(event.keyCode == 40){
        event.preventDefault();
        barIzq.down();
    } else if(event.keyCode == 87){
        event.preventDefault();
        barDer.up();
    } else if(event.keyCode == 83){
        event.preventDefault();
        barDer.down();
    } else if(event.keyCode == 32){
        event.preventDefault();
        board.playing = !board.playing;
    }
});

function controller(){
    board_view.play();
    window.requestAnimationFrame(controller);
}