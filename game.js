var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'gameCanvas',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var playerCar;
var cursors;
var otherCars;
var pedestrians;
var leadCar;
var score = 100;
var scoreText;

function preload() {
    this.load.image('road', 'assets/road.png');
    this.load.image('playerCar', 'assets/playerCar.png');
    this.load.image('otherCar', 'assets/otherCar.png');
    this.load.image('pedestrian', 'assets/pedestrian.png');
}

function create() {
    this.add.image(400, 300, 'road');
    playerCar = this.physics.add.sprite(400, 500, 'playerCar');
    cursors = this.input.keyboard.createCursorKeys();
    
    this.input.on('pointerdown', function (pointer) {
        if (pointer.x < 400) {
            playerCar.x -= 10;
        } else {
            playerCar.x += 10;
        }
    });
    
    otherCars = this.physics.add.group();
    for (var i = 0; i < 3; i++) {
        var x = Phaser.Math.Between(100, 700);
        var y = Phaser.Math.Between(0, 300);
        otherCars.create(x, y, 'otherCar');
    }
    
    pedestrians = this.physics.add.group();
    for (var i = 0; i < 2; i++) {
        var x = Phaser.Math.Between(100, 700);
        var y = Phaser.Math.Between(0, 300);
        pedestrians.create(x, y, 'pedestrian');
    }
    
    leadCar = this.physics.add.sprite(400, 400, 'otherCar');
    
    var phone = this.add.text(700, 50, '📱', { fontSize: '32px' });
    phone.setInteractive();
    phone.on('pointerdown', function () {
        score -= 20;
        scoreText.setText('Score: ' + score);
    });
    
    scoreText = this.add.text(10, 10, 'Score: ' + score, { fontSize: '20px', color: '#ffffff' });
}

function update() {
    if (cursors.left.isDown) {
        playerCar.x -= 5;
    } else if (cursors.right.isDown) {
        playerCar.x += 5;
    }
    
    otherCars.children.iterate(function (car) {
        car.y += 2;
        if (car.y > 600) {
            car.y = 0;
            car.x = Phaser.Math.Between(100, 700);
        }
    });
    
    pedestrians.children.iterate(function (ped) {
        ped.x += 1;
        if (ped.x > 800) {
            ped.x = 0;
        }
    });
    
    leadCar.y += 1;
    if (leadCar.y > 600) {
        leadCar.y = 0;
    }
    
    var distance = playerCar.y - leadCar.y;
    if (distance < 50 && distance > 0) {
        console.log('Too close to the lead car!');
    }
    
    this.physics.overlap(playerCar, pedestrians, function () {
        score -= 10;
        scoreText.setText('Score: ' + score);
    });
}