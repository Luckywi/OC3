// URL de base pour éviter la répétition
const API_URL = 'http://localhost:5678/api';

/* Récupération des works */
export async function fetchWorks() {
    const response = await fetch(`${API_URL}/works`);
    return await response.json();
}

/* Récupération des catégories */
export async function fetchCategories() {
    const response = await fetch(`${API_URL}/categories`);
    return await response.json();
}

/* Connexion utilisateur */
export async function login(email, password) {
    const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })
    });
    return await response.json();
}

/* Suppression d'un work */
export async function deleteWork(id, authToken) {
    const response = await fetch(`${API_URL}/works/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return response;
}

/* Envoi d'un nouveau work */
export async function sendWork(formData, authToken) {
    const response = await fetch(`${API_URL}/works`, {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return response;
}