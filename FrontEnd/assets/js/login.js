// Import de la fonction login depuis le fichier api.js
import { login } from './api.js';

// Attendre que la page soit chargée avant d'exécuter le code
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login');

    // Gestion de l'envoi du formulaire
    loginForm.onsubmit = async function(event) {
        event.preventDefault();

        // Récupération des valeurs du formulaire
        const email = document.getElementById('username').value.trim();
        const password = document.getElementById('mdp').value;

        try {
            const result = await login(email, password);

            // Si connexion réussie
            if (result?.token) {
                sessionStorage.setItem('authToken', result.token);
                window.location.href = 'index.html';
            
            // Si connexion échouée 
            } else {
                afficherErreur();
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            afficherErreur();
        }
    };

    // Fonction pour afficher le message d'erreur
    function afficherErreur() {
        sessionStorage.removeItem('authToken');
        const error = document.createElement('div');
        error.classList.add('error');
        error.textContent = ('Erreur dans l’identifiant ou le mot de passe !')
        loginForm.after(error);
    }
});