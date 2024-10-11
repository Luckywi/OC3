
/*Export de l'API GET works*/

export async function fetchWorks() {
    const response = await fetch('http://localhost:5678/api/works');
    return await response.json();
}


/*Export de l'API GET catégories*/

export async function fetchCategories() {
    const response = await fetch('http://localhost:5678/api/categories');
    return await response.json();
}


/*Export de l'API POST login*/

export async function login(email, password) {
    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })
    });
    return await response.json();
}

/*Export de l'API DELETE works*/


export async function deleteWork(id, authToken) {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
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


/*Export de l'API POST works*/

export async function sendWork(formData, authToken) {
    const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return response;
}
