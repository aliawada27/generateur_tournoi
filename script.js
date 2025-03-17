document.addEventListener('DOMContentLoaded', function() {
    // Elements du DOM
    const teamCountSelect = document.getElementById('team-count');
    const teamsContainer = document.getElementById('teams-container');
    const generateButton = document.getElementById('generate-bracket');
    const bracketContainer = document.getElementById('bracket-container');
    const saveBracketButton = document.getElementById('save-bracket');
    const loadBracketButton = document.getElementById('load-bracket');
    const resetBracketButton = document.getElementById('reset-bracket');
    
    // État de l'application
    let teams = [];
    let matches = [];
    let bracketData = {
        tournamentName: '',
        rounds: []
    };
    
    // Initialisation
    generateTeamInputs();
    
    // Événements
    teamCountSelect.addEventListener('change', generateTeamInputs);
    generateButton.addEventListener('click', generateBracket);
    saveBracketButton.addEventListener('click', saveBracket);
    loadBracketButton.addEventListener('click', loadBracket);
    resetBracketButton.addEventListener('click', resetBracket);
    
    // Génère les champs pour les équipes
    function generateTeamInputs() {
        const teamCount = parseInt(teamCountSelect.value);
        teamsContainer.innerHTML = '';
        
        for (let i = 0; i < teamCount; i++) {
            const teamDiv = document.createElement('div');
            teamDiv.className = 'team-input';
            
            const teamNumber = document.createElement('div');
            teamNumber.className = 'team-number';
            teamNumber.textContent = (i + 1);
            
            const teamInput = document.createElement('input');
            teamInput.type = 'text';
            teamInput.placeholder = `Équipe ${i + 1}`;
            teamInput.dataset.teamId = i;
            
            teamDiv.appendChild(teamNumber);
            teamDiv.appendChild(teamInput);
            teamsContainer.appendChild(teamDiv);
        }
    }
    
    // Génère le bracket du tournoi
    function generateBracket() {
        const teamCount = parseInt(teamCountSelect.value);
        const tournamentName = document.getElementById('tournament-name').value || 'Mon tournoi';
        
        // Récupère les noms d'équipes
        teams = [];
        const teamInputs = teamsContainer.querySelectorAll('input');
        teamInputs.forEach(input => {
            const teamName = input.value.trim() || `Équipe ${parseInt(input.dataset.teamId) + 1}`;
            teams.push({
                id: parseInt(input.dataset.teamId),
                name: teamName
            });
        });
        
        // Mélange les équipes (facultatif, décommentez si souhaité)
        // teams = shuffleArray(teams);
        
        // Initialise la structure du bracket
        bracketData = {
            tournamentName: tournamentName,
            rounds: generateRounds(teams)
        };
        
        // Affiche le bracket
        renderBracket();
        
        // Affiche le conteneur de bracket
        bracketContainer.style.display = 'block';
    }
    
    // Génère tous les tours du bracket
    function generateRounds(teamsList) {
        const rounds = [];
        const teamCount = teamsList.length;
        const roundCount = Math.log2(teamCount);
        
        // Premier tour avec toutes les équipes
        let currentRound = [];
        for (let i = 0; i < teamCount; i += 2) {
            currentRound.push({
                team1: teamsList[i],
                team2: teamsList[i + 1],
                winner: null
            });
        }
        rounds.push(currentRound);
        
        // Génère les tours suivants avec des espaces vides
        for (let i = 1; i < roundCount; i++) {
            const matchCount = teamCount / Math.pow(2, i + 1);
            currentRound = [];
            
            for (let j = 0; j < matchCount; j++) {
                currentRound.push({
                    team1: null,
                    team2: null,
                    winner: null
                });
            }
            
            rounds.push(currentRound);
        }
        
        return rounds;
    }
    
    // Affiche le bracket dans le DOM
    function renderBracket() {
        bracketContainer.innerHTML = '';
        
        // Titre du tournoi
        const title = document.createElement('h2');
        title.textContent = bracketData.tournamentName;
        bracketContainer.appendChild(title);
        
        // Crée la structure du bracket
        const bracketDiv = document.createElement('div');
        bracketDiv.className = 'bracket';
        
        // Génère chaque tour
        bracketData.rounds.forEach((round, roundIndex) => {
            const roundDiv = document.createElement('div');
            roundDiv.className = 'round';
            
            // Titre du tour
            const roundTitle = document.createElement('div');
            roundTitle.className = 'round-title';
            
            switch (roundIndex) {
                case bracketData.rounds.length - 1:
                    roundTitle.textContent = 'Finale';
                    break;
                case bracketData.rounds.length - 2:
                    roundTitle.textContent = 'Demi-finales';
                    break;
                case bracketData.rounds.length - 3:
                    roundTitle.textContent = 'Quarts de finale';
                    break;
                default:
                    roundTitle.textContent = `Tour ${roundIndex + 1}`;
            }
            
            roundDiv.appendChild(roundTitle);
            
            // Génère chaque match du tour
            round.forEach((match, matchIndex) => {
                const matchDiv = document.createElement('div');
                matchDiv.className = 'match';
                matchDiv.dataset.round = roundIndex;
                matchDiv.dataset.match = matchIndex;
                
                // Équipe 1
                const team1Div = createTeamElement(match.team1, roundIndex, matchIndex, 1);
                matchDiv.appendChild(team1Div);
                
                // Équipe 2
                const team2Div = createTeamElement(match.team2, roundIndex, matchIndex, 2);
                matchDiv.appendChild(team2Div);
                
                // Si un gagnant est déjà défini
                if (match.winner) {
                    if (match.team1 && match.winner.id === match.team1.id) {
                        team1Div.classList.add('winner');
                        team2Div.classList.add('loser');
                    } else if (match.team2 && match.winner.id === match.team2.id) {
                        team2Div.classList.add('winner');
                        team1Div.classList.add('loser');
                    }
                }
                
                roundDiv.appendChild(matchDiv);
            });
            
            bracketDiv.appendChild(roundDiv);
        });
        
        bracketContainer.appendChild(bracketDiv);
        
        // Ajoute les événements de drag & drop
        addDragDropEvents();
    }
    
    // Crée un élément pour une équipe
    function createTeamElement(team, roundIndex, matchIndex, teamNumber) {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team';
        teamDiv.draggable = true;
        
        // Ajoute les données pour le drag & drop
        if (team) {
            teamDiv.textContent = team.name;
            teamDiv.dataset.teamId = team.id;
            teamDiv.dataset.round = roundIndex;
            teamDiv.dataset.match = matchIndex;
            teamDiv.dataset.teamNumber = teamNumber;
        } else {
            teamDiv.textContent = '---';
            teamDiv.classList.add('empty');
        }
        
        return teamDiv;
    }
    
    // Ajoute les événements de drag & drop
    function addDragDropEvents() {
        const teamElements = document.querySelectorAll('.team');
        
        teamElements.forEach(team => {
            team.addEventListener('dragstart', handleDragStart);
            team.addEventListener('dragover', handleDragOver);
            team.addEventListener('dragenter', handleDragEnter);
            team.addEventListener('dragleave', handleDragLeave);
            team.addEventListener('drop', handleDrop);
            team.addEventListener('dragend', handleDragEnd);
            
            // Ajoute également le clic pour sélectionner un gagnant
            team.addEventListener('click', handleTeamClick);
        });
    }
    
    // Gère le début du drag
    function handleDragStart(e) {
        this.classList.add('dragging');
        
        // Stocke les informations de l'équipe
        e.dataTransfer.setData('text/plain', JSON.stringify({
            teamId: this.dataset.teamId,
            round: this.dataset.round,
            match: this.dataset.match,
            teamNumber: this.dataset.teamNumber
        }));
    }
    
    // Permet le drop
    function handleDragOver(e) {
        e.preventDefault();
    }
    
    // Ajoute une classe lors de l'entrée dans une zone
    function handleDragEnter(e) {
        this.classList.add('drop-zone');
    }
    
    // Retire la classe lors de la sortie
    function handleDragLeave(e) {
        this.classList.remove('drop-zone');
    }
    
    // Gère le drop d'une équipe
    function handleDrop(e) {
        e.preventDefault();
        this.classList.remove('drop-zone');
        
        // Récupère les données de l'équipe traînée
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const draggedTeam = getTeamById(parseInt(data.teamId));
        
        // Récupère les coordonnées du drop
        const targetRound = parseInt(this.dataset.round);
        const targetMatch = parseInt(this.dataset.match);
        const targetTeamNumber = parseInt(this.dataset.teamNumber);
        
        // Vérifie si le drop est valide (seulement sur le tour suivant)
        const draggedRound = parseInt(data.round);
        if (targetRound !== draggedRound + 1) {
            return;
        }
        
        // Met à jour les données du bracket
        if (targetTeamNumber === 1) {
            bracketData.rounds[targetRound][targetMatch].team1 = draggedTeam;
        } else {
            bracketData.rounds[targetRound][targetMatch].team2 = draggedTeam;
        }
        
        // Réaffiche le bracket
        renderBracket();
    }
    
    // Termine le drag
    function handleDragEnd(e) {
        this.classList.remove('dragging');
    }
    
    // Gère le clic sur une équipe pour désigner un gagnant
    function handleTeamClick(e) {
        const round = parseInt(this.dataset.round);
        const match = parseInt(this.dataset.match);
        const teamId = parseInt(this.dataset.teamId);
        
        if (isNaN(teamId)) return; // Ignore les équipes vides
        
        const currentMatch = bracketData.rounds[round][match];
        const clickedTeam = getTeamById(teamId);
        
        // Vérifie si les deux équipes sont présentes
        if (!currentMatch.team1 || !currentMatch.team2) return;
        
        // Désigne cette équipe comme gagnante
        currentMatch.winner = clickedTeam;
        
        // Si ce n'est pas le dernier tour, avance l'équipe au prochain tour
        if (round < bracketData.rounds.length - 1) {
            const nextMatch = Math.floor(match / 2);
            const nextTeamNumber = match % 2 === 0 ? 1 : 2;
            
            if (nextTeamNumber === 1) {
                bracketData.rounds[round + 1][nextMatch].team1 = clickedTeam;
            } else {
                bracketData.rounds[round + 1][nextMatch].team2 = clickedTeam;
            }
        }
        
        // Réaffiche le bracket
        renderBracket();
    }
    
    // Récupère une équipe par son ID
    function getTeamById(id) {
        return teams.find(team => team.id === id);
    }
    
    // Sauvegarde le bracket dans le localStorage
    function saveBracket() {
        if (bracketData.rounds.length === 0) {
            alert('Veuillez d\'abord générer un bracket !');
            return;
        }
        
        localStorage.setItem('tournamentBracket', JSON.stringify({
            bracketData: bracketData,
            teams: teams
        }));
        
        alert('Bracket sauvegardé !');
    }
    
    // Charge le bracket depuis le localStorage
    function loadBracket() {
        const savedData = localStorage.getItem('tournamentBracket');
        
        if (!savedData) {
            alert('Aucun bracket sauvegardé !');
            return;
        }
        
        const data = JSON.parse(savedData);
        bracketData = data.bracketData;
        teams = data.teams;
        
        // Met à jour le nom du tournoi
        document.getElementById('tournament-name').value = bracketData.tournamentName;
        
        // Met à jour le nombre d'équipes
        teamCountSelect.value = teams.length;
        generateTeamInputs();
        
        // Remplit les noms d'équipes
        const teamInputs = teamsContainer.querySelectorAll('input');
        teamInputs.forEach(input => {
            const teamId = parseInt(input.dataset.teamId);
            const team = teams.find(t => t.id === teamId);
            if (team) {
                input.value = team.name;
            }
        });
        
        // Affiche le bracket
        renderBracket();
        bracketContainer.style.display = 'block';
    }
    
    // Réinitialise le bracket
    function resetBracket() {
        // Efface les données
        bracketData = {
            tournamentName: '',
            rounds: []
        };
        teams = [];
        
        // Cache le bracket
        bracketContainer.style.display = 'none';
        
        // Réinitialise le formulaire
        document.getElementById('tournament-name').value = '';
        teamCountSelect.value = '8';
        generateTeamInputs();
    }
    
    // Utilitaire pour mélanger un tableau (méthode Fisher-Yates)
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
});