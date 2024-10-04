import { login } from './api.js';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('username').value;
        const password = document.getElementById('mdp').value;

        console.log('Nom d\'utilisateur:', email);
        console.log('Mot de passe:', password);

       const result = await login(email, password);

       /*vérifie l'existence et la validité de la réponse de l'API*/

       if (result && result.token){
        sessionStorage.setItem('authToken', result.token);
        window.location.href = 'index.html';
        

       } else {
        sessionStorage.removeItem('authToken');
        const error = document.createElement('div');
        error.classList.add("error");
        error.textContent = ('Erreur dans l’identifiant ou le mot de passe !')
        loginForm.after(error);

       }

        
    });
});



  
  