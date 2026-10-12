# 🌌 Star Game : R2-D2 Rescue

## 🎮 À propos du jeu
Dans ce jeu d'arcade 2D basé sur l'univers de Star Wars, vous contrôlez le droïde R2-D2. L'objectif est d'intercepter les vaisseaux alliés (X-Wing, Naboo Starfighter, Obi-Wan Starfighter, Anakin Starfighter) qui descendent à l'écran pour accumuler des points, tout en évitant les vaisseaux ennemis de Dark Vador. Le jeu se déroule en temps limité, avec un chronomètre initial de 180 secondes.

## 🕹️ Mécaniques et Règles
*   **Score positif :** Chaque vaisseau allié intercepté rapporte 10 points.
*   **Score négatif :** Chaque collision avec un vaisseau de Dark Vador retire 20 points.
*   **Progression :** Le jeu comporte 3 niveaux qui augmentent la difficulté en ajustant la vitesse et le nombre d'ennemis :
    *   **Niveau 1 :** Vitesse de base, 1 vaisseau ennemi. Objectif : 100 points.
    *   **Niveau 2 :** Vitesse multipliée par 1.5, 5 vaisseaux ennemis. Objectif : 250 points.
    *   **Niveau 3 :** Vitesse multipliée par 2.2, 20 vaisseaux ennemis.
*   **Bonus de temps :** Passer au niveau supérieur ajoute 10 secondes au chronomètre.
*   **Sauvegarde :** Le meilleur score (*High Score*) est enregistré localement dans le navigateur.

## ⌨️ Contrôles
*   **Flèches directionnelles (Haut, Bas, Gauche, Droite) :** Déplacer R2-D2.
*   **Touche 'S' :** Stopper la partie.

## 🛠️ Technologies utilisées
*   **Langage :** JavaScript Vanilla (ES6) structuré en Programmation Orientée Objet (classes `Sprite`, `Plane`, `Player`, `Enemy`, `Speed`).
*   **Moteur graphique :** Manipulation directe des éléments du DOM (`.style.left`, `.style.top`) et boucle d'animation fluide via `requestAnimationFrame`.

## 🚀 Installation et Lancement
Le jeu fonctionne nativement dans le navigateur, sans serveur ni dépendances complexes :

1. Clonez ce dépôt sur votre machine locale :
   ```bash
   git clone [https://github.com/Anesie/starGame.git](https://github.com/Anesie/starGame.git)
