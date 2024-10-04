import { 
    deleteWork,   // API DELETE works
    sendWork,     // API POST works
    fetchCategories, // API GET catégories
    fetchWorks    // API GET works
} from './api.js';

/*Vérification Token et UI admin*/

document.addEventListener('DOMContentLoaded', function () {

    const authToken = sessionStorage.getItem('authToken');

    if (authToken) {
        const loginLogout = document.getElementById('logout');
        loginLogout.textContent = "Logout"

        const removeFilterButton = document.querySelector('.categories-button');
        removeFilterButton.style.display = "none";

        const modifierDiv = document.createElement('div');
        modifierDiv.classList.add("modifier-bouton");

        const modifierButton = document.createElement('button');
        modifierButton.innerHTML = '<i class="fas fa-edit"></i> modifier';

        modifierDiv.appendChild(modifierButton);

        const mesProjets = document.getElementById('portfolio');
        const h2 = mesProjets.querySelector('h2');

        h2.appendChild(modifierDiv);

    } else {
        console.log('Aucun utilisateur');
    }
});


/*Fonctions déconexions*/

document.addEventListener('DOMContentLoaded', function () {

    const loginLogout = document.getElementById('logout');
    loginLogout.addEventListener('click', function (event) {
        sessionStorage.removeItem('authToken');
    }
    )
})


/* Modale */

document.addEventListener('DOMContentLoaded', function () {
    const ouvrirModaleBtn = document.querySelector('.modifier-bouton');
    const workModaleContainer = document.querySelector(".modale-content");
    const fermerModaleBtn = document.getElementById('close-modale');
    const retourModaleBtn = document.getElementById('back-module');
    const envoyer = document.getElementById('envoyer-modale');
    const modale = document.querySelector('.modale-overlay');
    const ajouterPhoto = document.getElementById('submit-modale');
    const modaleTitle = document.querySelector('.titre-modale');
    const photoUpload = document.querySelector('.photo-upload-container');
    const selectTitle = document.querySelector('.select-title');
    const modale2 = document.querySelector('.modale-content2')
    const selectCategorie = document.querySelector('.select-categorie');



    //Première page modale et affichage des travaux

    async function ouvrirModale() {
        try {
            const works = await fetchWorks();

            retourModaleBtn.style.display = 'none';
            photoUpload.style.display = 'none';
            fermerModaleBtn.innerHTML = '<i class="fas fa-times"></i>';
            modale.style.display = "flex";
            document.body.classList.add('body-no-scroll');
            workModaleContainer.style.display = 'flex';
            selectTitle.style.display = 'none';
            selectCategorie.style.display = 'none';
            envoyer.style.display = 'none';
            ajouterPhoto.style.display = 'flex';
            modaleTitle.textContent = 'Galerie';


            workModaleContainer.innerHTML = "";
            works.forEach(work => {

                const workItem = document.createElement('figure');
                workItem.setAttribute('data-category', work.categoryId);
                workItem.setAttribute('data-id', work.id);
                workItem.className = 'workObject';

                const workImage = document.createElement('img');
                workImage.src = work.imageUrl;
                workImage.alt = work.title;

                const deleteBtn = document.createElement('button');
                deleteBtn.className = "bouton-supprimer"; 
                deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'; 
                deleteBtn.addEventListener('click', supprimerWork); 
    
                workItem.appendChild(deleteBtn);
                workItem.appendChild(workImage);
                workModaleContainer.appendChild(workItem);
            }); 

        } catch (error) {
            console.error("Erreur lors de la récupération des travaux :", error);
        }
    }

    // Fonction de suppression des travaux 


    async function supprimerWork(event) {
        const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce travail ?");
        if (confirmation){}
        event.preventDefault();
        event.stopPropagation();

    
        const work = event.target.closest('figure');
        const id = work.dataset.id;

        try {
            await deleteWork(id);
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    }  


    // Fonction d'ajout de nouveaux travaux

    async function ajoutPhoto() {
        try {
            const categoriesJson = await fetchCategories();

            retourModaleBtn.style.display = 'inline';
            photoUpload.style.display = 'flex';
            retourModaleBtn.innerHTML = '<i class="fas fa-arrow-left"></i>';
            modaleTitle.textContent = 'Ajout photo';
      
            selectTitle.style.display = 'flex';
            selectCategorie.style.display = 'flex';
            ajouterPhoto.style.display = 'none';
            envoyer.style.display = 'flex';
            
            const envoyerContenair = document.createElement('div');
            envoyerContenair.className = 'envoyer-content';

            envoyerContenair.appendChild(photoUpload);
            envoyerContenair.appendChild(selectTitle);
            envoyerContenair.appendChild(selectCategorie);

            workModaleContainer.innerHTML = "";
            workModaleContainer.appendChild(envoyerContenair);
         
            const select = document.getElementById('optionsMultiples');
            
            categoriesJson.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            });

        } catch (error) {
            console.error("Erreur lors de la récupération des travaux :", error);
        }

    }

    //Fonction d'envoie des nouveaux travaux vers l'API

    async function envoyerWork(event) {
        event.preventDefault();

        const titreElement = document.getElementById('titre');
        const categorieElement = document.getElementById('optionsMultiples');
        const imageElement = document.querySelector('.photo-upload-container input[type="file"]');
       
        const titre = titreElement.value;
        const categoryId = categorieElement.value;
        const image = imageElement.files[0];

        if (!titre || !categoryId || !image) {
            alert('Veuillez remplir tous les champs correctement');
        }

        const formData = new FormData();
        formData.append('title', titre);
        formData.append('category', categoryId);
        formData.append('image', image);

        try {const newWork = await sendWork(formData);} 
        catch (error) {alert("Erreur lors de l'envoie des travaux")}
    }

    //Appel de fonction et fermeture de la modale 

    function fermerModale() {
        modale.style.display = "none";
        document.body.classList.remove('body-no-scroll');
    }

    ouvrirModaleBtn.addEventListener('click', ouvrirModale);

    fermerModaleBtn.addEventListener('click', fermerModale);

    ajouterPhoto.addEventListener('click', ajoutPhoto);

    retourModaleBtn.addEventListener('click', ouvrirModale);

    envoyer.addEventListener('click', envoyerWork);

    window.addEventListener('click', function (event) {
        if (event.target == modale) {
            fermerModale();
        }
    });
});