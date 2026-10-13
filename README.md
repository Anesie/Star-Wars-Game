# 🌌 Star Game : R2-D2 Rescue

## 🎮 About the Game
In this 2D arcade game based on the Star Wars universe, you control the droid R2-D2. The objective is to intercept allied ships (X-Wing, Naboo Starfighter, Obi-Wan Starfighter, Anakin Starfighter) descending on the screen to accumulate points while avoiding Darth Vader's enemy ships. The game takes place under a time limit, starting with an initial 180-second timer.

## 🕹️ Mechanics and Rules
- **Positive Score:** Each intercepted allied ship awards 10 points.
- **Negative Score:** Each collision with a Darth Vader ship deducts 20 points.
- **Progression:** The game features 3 levels that increase difficulty by adjusting speed and the number of enemies:
    * **Level 1:** Base speed, 1 enemy ship. Target: 100 points.
    * **Level 2:** Speed multiplied by 1.5, 5 enemy ships. Target: 250 points.
    * **Level 3:** Speed multiplied by 2.2, 20 enemy ships.
- **Time Bonus:** Advancing to the next level adds 10 seconds to the timer.
- **Saving:** The best score (*High Score*) is stored locally in the browser.

## ⌨️ Controls
- **Arrow Keys (Up, Down, Left, Right):** Move R2-D2.
- **'S' Key:** Stop the game.

## 🛠️ Technologies Used
- **Language:** Vanilla JavaScript (ES6) structured using Object-Oriented Programming (`Sprite`, `Plane`, `Player`, `Enemy`, and `Speed` classes).
- **Graphics Engine:** Direct manipulation of DOM elements (`.style.left`, `.style.top`) and smooth animation loop via `requestAnimationFrame`.

## 🚀 Installation and Launch
The game runs natively in the browser, without any server or complex dependencies:

1. Clone this repository to your local machine:
   ```bash
   git clone [https://github.com/Anesie/starGame.git](https://github.com/Anesie/starGame.git)
    ```

2. Navigate to the game folder:
   ```bash
   cd starGame
   ```
   
3. Open the main index.html file in your preferred web browser.

### 👥 Authors
Andrea Behar & Anesie Martiniani - Development (M1 MIASHS-IC)
   
