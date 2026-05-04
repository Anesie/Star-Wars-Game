// Notion de Position par rapport à un point fixe
// C'est une valeur, donc non modifiable
class Position {
    #x; // Coordonne x de la position
    #y; // Coordonne y de la position

    // Construit une position à partir de 2 nombres
    constructor(x = 0, y = 0) {
        this.#x = x;
        this.#y = y;
    }

    // Acces en lecture aux attributs
    get x() { return this.#x; }
    get y() { return this.#y; }

    // Création d'une nouvelle position par translation
    shift(x, y) {
        return new Position(this.#x + x, this.#y + y);
    }

    // Création d'une nouvelle position à partir d'une vitesse et un temps
    move(speed, duration) {
        // Calcule le déplacement de la vitesse en fonction du temps
        let delta = speed.delta(duration);
        // calcule la nouvelle pôsition
        return this.shift(delta.x, delta.y);
    }
};


// Notion de vitesse : nombre de pixels à bouger par secondes
class Speed {
    #x;     // distance à parcourir sur l'axe des X en 1 seconde
    #y;     // distance à parcourir sur l'axe des Y en 1 seconde
    #max;   // Vitesse maximum, doit être positive

    // Indique la vitesse maximum
    constructor(max) {
        if (max <= 0) {
            throw new Error("Vitesse maximum doit être positif");
        }
        this.#x = 1;
        this.#y = 0;
        this.#max = max;
    }

    // Stoppe sur les deux axes
    stop() {
        this.#x = 0;
        this.#y = 0;
    }

    // Vrai si la vitesse est nulle. 
    isStopped() {
        return this.#x == 0 && this.#y == 0;
    }

    // Accelère si dx ou dy est positif ou freine si negatif
    change(dx, dy) {
        this.#x += dx;
        this.#y += dy;
        console.log(dx, dy, this.#x, this.#y, this);

        // Limite les vitesses
        if (this.#x > this.#max) {
            this.#x = this.#max;
        } else if (this.#x < - this.#max) {
            this.#x = - this.#max;
        }
        if (this.#y > this.#max) {
            this.#y = this.#max;
        } else if (this.#y < - this.#max) {
            this.#y = - this.#max;
        }
    }

    // Calcule un déplacement en x et y à cette vitesse pour un temps donné
    // duration: Number, temps considéré en millisecondes
    // @return: un déplacement {x,y}
    delta(duration) {
        return { x: this.#x * duration / 1000, y: this.#y * duration / 1000 };
    }
}

// Fonction qui indique si on est en dehors des limites
const outOfLimit = (min, val, max) => val <= min ? true : (val >= max ? true : false);

// Fonction qui retourne une valeur entre deux bornes
const limit = (min, val, max) => val < min ? min : (val > max ? max : val);

///////////////////////////////////////////////////////////////
// Objet qui représente l'aire du jeu
///////////////////////////////////////////////////////////////

const playground = {
    // Objet DOM de l'aire de jeu
    DOM: window.document.getElementById("playground"),
}

// Initialiste la dimension de l'aire de jeu
playground.size = playground.DOM.getBoundingClientRect();


///////////////////////////////////////////////////////////////
// Notion de sprite
///////////////////////////////////////////////////////////////

class Sprite {
    id;             // l'Id du sprite
    #DOM;           // Objet DOM qui représente le sprite
    #pos;           // Position actuelle du sprite
    #speed;         // La vitesse de déplacement actuelle en pixels par seconde
    #size;          // Taille de l'objet { height, width }
    constructor(id) {
        this.id = id;
        // Recherche l'élément DOM
        const DOM = document.getElementById(id);
        // Vérifie qu'il existe
        if (DOM == null) {
            throw new Error('HTML object ' + id + ' not found');
        }
        // Crée un objet DOM pour l'afficher
        this.#DOM = DOM.cloneNode();
        // Supprime l'attribut id
        this.#DOM.setAttribute("id", "");
        // Place l'objet dans la DOM
        playground.DOM.appendChild(this.#DOM);
        // Initialise sa position relative
        this.#pos = new Position(0, 0);
        // Vitesse en pixels par secondes : objet initialement immobile
        this.#speed = new Speed(502);
        // Calcule sa taille
        this.#size = this.#DOM.getBoundingClientRect();

    };

    getRect(pos = this.pos) {
        return new Rectangle(pos, this.size);
    }

    // Place le sprite à une position p donnée
    set pos(p) {
        // Par défaut, on autorise les sprites à être un peu hors écran (pour les avions)
        // Mais on peut ajuster ces limites
        let minX = this.minX ?? -this.#size.width;
        let minY = this.minY ?? -this.#size.height;
        let maxX = this.maxX ?? playground.size.width;
        let maxY = this.maxY ?? playground.size.height;

        let pos = new Position(limit(minX, p.x, maxX), limit(minY, p.y, maxY));
        this.#DOM.style.left = pos.x + "px";
        this.#DOM.style.top = pos.y + "px";
        this.#pos = pos;
    };

    getRect(pos = this.pos) {
        return new Rectangle(pos, this.size);
    }

    get pos() {
        return this.#pos;
    }

    get size() {
        return this.#size;
    }

    stop() {
        this.#speed.stop();
    }

    isStopped() {
        return this.#speed.isStopped();
    }

    get speed() {
        return this.#speed;
    }

    // Change la vitesse du sprite par des incréments
    changeSpeed(dx, dy) {
        this.#speed.change(dx, dy);
    }

    // Change sa position pour la nouvelle frame en fonction de sa vitesse
    update(duration) {
        // Deplace la position en fonction de la vitesse et du temps
        this.pos = this.#pos.move(this.#speed, duration);
    };
}

class Plane extends Sprite {
    // Temps avant un démmarage
    waitingTime;
    constructor(id) {
        super(id);
        this.waitingTime = 0;
    }

    // Démarre l'avion du haut de l'écran 
    start() {
            let x = playground.size.width * Math.random();
            this.pos = new Position(x, -this.size.height);
            
            // Apply level speed multiplier
            const config = game.levels[game.level];
            const baseSpeedY = 200; 
            
            // Reset current speed and apply new one
            this.stop(); 
            this.changeSpeed(3, baseSpeedY * config.speedMult);
        
    }

    // Vrai si le sprite a atteint de bas de l'aire de jeux
    isAtBottom() {
        return this.pos.y >= playground.size.height;
    }

    update(duration) {
        super.update(duration);
        // Regarde si le sprite a disparu au bas de l'écran
        if (this.isAtBottom() && !this.isStopped()) {
            // Arrete le sprite
            this.stop();
            // Place un temps d'attende avant de redémmarer
            this.waitingTime = 60;
        }
        // Si le sprite est arrété, attend puis redémmare
        if (this.isStopped()) {
            this.waitingTime -= duration;
            if (this.waitingTime <= 0) {
                this.waitingTime = 0;
                this.start();
            }
        }
    }
}
class Player extends Sprite {
    update(duration) {
        // Calcule le mouvement théorique
        const speed = game.levels[game.level].playerSpeed;
        let vx = 0;
        let vy = 0;
    
        if (game.keys["ArrowLeft"]) vx -= speed;
        if (game.keys["ArrowRight"]) vx += speed;
        if (game.keys["ArrowUp"]) vy -= speed;
        if (game.keys["ArrowDown"]) vy += speed;
    
        // Normalize diagonal movement (optional but better)
        if (vx !== 0 && vy !== 0) {
            vx *= 0.707;
            vy *= 0.707;
        }
    
        let newPos = this.pos.shift(
            vx * duration / 1000,
            vy * duration / 1000
        );
    
        let minX = 0;
        let minY = 0;
        let maxX = playground.size.width - this.size.width;
        let maxY = playground.size.height - this.size.height;
    
        this.pos = new Position(
            limit(minX, newPos.x, maxX),
            limit(minY, newPos.y, maxY)
        );
    }
}

let game = {
        run: false,
        level: 1,
        tFrameLast: 0,
        r2d2: new Player("R2D2"),
        sprites: [],
        score: 0,
        time: 180000,
        highScore: 0,
        keys: {},
        
        // Level configurations
        levels: {
            1: { speedMult: 1.0, background: "url('data/desert_sand.jpg')", scoreTarget: 100, playerSpeed: 250 },
            2: { speedMult: 1.5, background: "url('data/2ndlevel.jpg')", scoreTarget: 250, playerSpeed: 300 },
            3: { speedMult: 2.2, background: "url('data/3rdlevel.jpg')", scoreTarget: Infinity, playerSpeed: 350 }
        }
    
};


game.nextLevel = function() {
    this.level++;
    if (this.levels[this.level]) {
        console.log("Level " + this.level);
        
        // Update Background
        playground.DOM.style.backgroundImage = this.levels[this.level].background;
        playground.DOM.style.backgroundSize = "cover";
        
        // Add a bonus to time when leveling up
        this.time += 10000; 

        // Restart all planes to apply new speeds
        for (let sprite of this.sprites) {
            sprite.start();
        }
    }
};

game.update = function (tFrame) {
    // arrêt si le jeu n'est pas lancé 1
    if (document.getElementById("start-screen").style.display !== "none") return;

    let duration = tFrame - this.tFrameLast;
    this.tFrameLast = tFrame;

    if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem("highScore", this.highScore);
    }

    // Check for level up
    let currentConfig = this.levels[this.level];
    if (this.score >= currentConfig.scoreTarget) {
        this.nextLevel();
    }

    // move player
    this.r2d2.update(duration);

    // move planes + check collisions
    for (let sprite of this.sprites) {
        sprite.update(duration);

        let r1 = this.r2d2.getRect();
        let r2 = sprite.getRect();

        if (r1.areIntersecting(r2)) {
            console.log("Hit!");

            this.score += 10;

            // restart plane
            sprite.start();
        }
    }
    //mise à jour du score sur l'écran pendant la partie
    document.getElementById("timer").innerText = `Niveau: ${this.level} | Temps: ${Math.max(0, Math.ceil(this.time / 1000))}s`;
    document.getElementById("score").innerText =
    "Score: " + this.score + " | High Score: " + this.highScore;

    // timer
    this.time -= duration;
    if (this.time <= 0) {
        this.stop();
    }


}

// Reaction du jeux à l'enfoncement d'une touche
game.onkeydown = function (key) {
    const delta = 10;
    switch (key) {
        case "ArrowLeft":
            game.r2d2.changeSpeed(-delta, 0);
            break;
        case "ArrowUp":
            game.r2d2.changeSpeed(0, -delta);
            break;
        case "ArrowRight":
            game.r2d2.changeSpeed(delta, 0);
            break;
        case "ArrowDown":
            game.r2d2.changeSpeed(0, delta);
            break;
        case "s":
            game.run = false;
            break;
        default:
            console.log(key)
    }
}

// Installe la lecture des caractères
window.onkeydown = function (e) {
    game.keys[e.key] = true;
}


window.onkeyup = function (e) {
    game.keys[e.key] = false;
};

// tFrame est le temps d'appel de l'animation passé à main en ms
function main(tFrame) {
    game.stopMain = window.requestAnimationFrame(main);
    if (!game.run) {
        window.cancelAnimationFrame(game.stopMain);
        console.log("Game over");
    } else {
        game.update(tFrame);
    }
}

// Démmare le jeu
game.start = function () {
    // lance tous les sprites
    for (let sprite of this.sprites) {
        sprite.start();
    }
}

game.stop = function () {
    game.run = false;
    //Affichage d'un message au joueur pour indiquer la fin de la partie
    let gameOverDiv = document.getElementById("game-over");
    gameOverDiv.style.display = "flex";
    document.getElementById("final-score").innerText = "Score final : " + this.score;
}
game.init = function () {
    this.sprites = [];
    // Attend l'initialisation des autres sprites
    let sprite = new Plane("x_wing");
    game.sprites.push(sprite);

    sprite = new Plane("anakin_starfighter");
    game.sprites.push(sprite);

    sprite = new Plane("naboo_starfighter");
    game.sprites.push(sprite);

    sprite = new Plane("obi_wan_starfighter");
    game.sprites.push(sprite);
    if (this.level === 1) {
        let vader = new Enemy("darthvader");
        this.sprites.push(vader);
        vader.start();
    }
    
    if (this.level === 2) {
        for (let i = 0; i < 5; i++) {
            let vader = new Enemy("darthvader");
            this.sprites.push(vader);
            vader.start();
        }
    }

        
    if (this.level === 3) {
        for (let i = 0; i < 20; i++) {
            let vader = new Enemy("darthvader");
            this.sprites.push(vader);
            vader.start();
        }
    }

    this.highScore = parseInt(localStorage.getItem("highScore")) || 0;

     playground.size = playground.DOM.getBoundingClientRect();
     playground.DOM.style.backgroundImage = this.levels[1].background;
    playground.DOM.style.backgroundSize = "cover";


    this.r2d2.minX = 0;
    this.r2d2.minY = 0;
    this.r2d2.maxX = playground.size.width - this.r2d2.size.width;
    this.r2d2.maxY = playground.size.height - this.r2d2.size.height;

    this.run = true;
    this.tFrameLast = 0;

}

// L'initialisation est asynchrone donc il faut attendre
// Il faut que toutes les images soient chargées donc on
// s'acroche à l'évelment load de window
window.addEventListener("load", () => {     
    const screen = document.getElementById("start-screen");
    screen.style.display = "flex"; // On force l'affichage pour bloquer game.update[cite: 6]
    
    game.init(); 
    // On ne lance PAS main() ici, c'est startGame qui le fera.
});



class Rectangle {
    constructor(pos, size) {
        this.x = pos.x;
        this.y = pos.y;
        this.width = size.width;
        this.height = size.height;
    }

    areIntersecting(r2) {
        return !(
            r2.x > this.x + this.width ||
            r2.x + r2.width < this.x ||
            r2.y > this.y + this.height ||
            r2.y + r2.height < this.y
        );
    }
}


class Enemy extends Plane {
    update(duration) {
        super.update(duration);

        let r1 = game.r2d2.getRect();
        let r2 = this.getRect();

        if (r1.areIntersecting(r2)) {
            console.log("Bad hit!");
            game.score -= 20;
            this.start();
        }
    }
}

function startGame() {
    const screen = document.getElementById("start-screen");
    screen.style.display = "none"; // On cache l'écran
    sessionStorage.setItem("introSeen", "1");

    // RÉGLAGE RAPIDE : On remet le chrono à zéro par rapport à l'instant présent
    game.tFrameLast = performance.now();
    game.time = 180000; // 3 minutes
    
    game.run = true;
    game.start(); 
    main(performance.now()); 
}
