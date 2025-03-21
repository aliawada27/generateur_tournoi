# Générateur de Brackets de Tournoi

Une application web simple et intuitive qui permet de créer et gérer des brackets de tournoi pour vos compétitions.

## Fonctionnalités

- **Configuration rapide** : Créez des tournois de 4, 8 ou 16 équipes en quelques clics
- **Personnalisation complète** : Nommez votre tournoi et toutes les équipes participantes
- **Interface drag & drop** : Faites progresser les équipes entre les tours par simple glisser-déposer
- **Sélection des gagnants** : Cliquez sur une équipe pour la désigner comme gagnante d'un match
- **Sauvegarde locale** : Enregistrez vos brackets dans le navigateur pour y revenir plus tard
- **Réinitialisation facile** : Recommencez à zéro quand vous le souhaitez
- **Design responsive** : Fonctionne sur desktop et mobile

## Technologies utilisées

- HTML5
- CSS3
- JavaScript (vanilla, sans frameworks)
- LocalStorage pour la persistance des données

## Comment l'utiliser

1. Définissez le nom de votre tournoi
2. Choisissez le nombre d'équipes participantes (4, 8 ou 16)
3. Entrez le nom de chaque équipe (ou laissez les noms par défaut)
4. Cliquez sur "Générer le bracket" pour créer votre tableau
5. Pour avancer une équipe au tour suivant, vous pouvez :
   - La faire glisser vers l'emplacement souhaité dans le tour suivant
   - Cliquer sur l'équipe pour la désigner comme gagnante (met à jour automatiquement le tour suivant)
6. Utilisez les boutons en bas pour :
   - **Sauvegarder** : Enregistre l'état actuel du bracket
   - **Charger** : Récupère le dernier bracket sauvegardé
   - **Réinitialiser** : Efface tout et recommence à zéro

## Installation

Aucune installation spéciale n'est requise. Téléchargez simplement les fichiers et ouvrez `index.html` dans votre navigateur, ou hébergez-les sur n'importe quel serveur web.

```
git clone https://github.com/aliawada27/generateur-brackets-tournoi.git
cd generateur-brackets-tournoi
```

## Personnalisation

Vous pouvez facilement modifier l'apparence en éditant le fichier `styles.css` ou ajouter des fonctionnalités supplémentaires en modifiant `script.js`.
