// Import des fonctions API
import { deleteWork, sendWork, fetchCategories, fetchWorks } from './api.js';
import { initializeData } from './project.js';

document.addEventListener('DOMContentLoaded', function (event) {

    // Déclarations des variables
    const authToken = sessionStorage.getItem('authToken');
    const loginLogout = document.getElementById('logout');
    const fermerModaleBtn = document.getElementById('close-modale');
    const retourModaleBtn = document.getElementById('back-module');
    const envoyer = document.getElementById('envoyer-modale');
    const modale = document.querySelector('.modale-overlay');
    const modaleContent = document.querySelector('.modale');
    const ajouterPhoto = document.getElementById('submit-modale');
    const modaleTitle = document.querySelector('.titre-modale');
    const photoUpload = document.querySelector('.photo-upload-container');
    const selectTitle = document.querySelector('.select-title');
    const selectCategorie = document.querySelector('.select-categorie');
    const workModaleContainer = document.querySelector(".modale-content");
    const titreElement = document.getElementById('titre');
    const imageElement = document.querySelector('.photo-upload-container input[type="file"]');

    // Configuration de l'interface administrateur
    if (authToken) {
        // Configuration de la barre admin
        loginLogout.textContent = "logout";
        const afficherBar = document.querySelector('.bar')
        afficherBar.style.display = 'flex';
        const removeFilterButton = document.querySelector('.categories-button');
        removeFilterButton.style.display = "none";

        // Création et ajout du bouton modifier
        const modifierDiv = document.createElement('div');
        modifierDiv.classList.add("modifier-bouton");
        const modifierButton = document.createElement('button');
        modifierButton.innerHTML = '<i class="fas fa-edit"></i> modifier';
        modifierDiv.appendChild(modifierButton);

        const mesProjets = document.getElementById('portfolio');
        const h2 = mesProjets.querySelector('h2');
        h2.appendChild(modifierDiv);

        // Configuration des écouteurs d'événements
        loginLogout.addEventListener('click', function () {
            sessionStorage.removeItem('authToken');
            window.location.reload();
        })

        // Écouteurs d'événements pour la modale
        modifierButton.onclick = event => ouvrirModale(event);
        fermerModaleBtn.onclick = event => fermerModale(event);
        retourModaleBtn.onclick = event => ouvrirModale(event);
        envoyer.onclick = event => envoyerWork(event);
        ajouterPhoto.onclick = event => ajoutPhoto(event);

        // Fermeture de la modale en cliquant à l'extérieur
        document.addEventListener('click', function (event) {
            if (!modaleContent.contains(event.target)) {
                fermerModale(event);
            }
        });
    }

    // Fonction d'ouverture de la modale
    // Affiche la galerie des travaux existants
    async function ouvrirModale(event) {

        try {
            const works = await fetchWorks();

            // Configuration de l'interface de la modale
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

            // Affichage des travaux dans la modale
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
                deleteBtn.onclick = function (event) { event.stopPropagation(); supprimerWork(event) };

                workItem.appendChild(deleteBtn);
                workItem.appendChild(workImage);
                workModaleContainer.appendChild(workItem);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des travaux :", error);
        }
    }

    // Fonction de suppression d'un travail
    // Gère la confirmation et la suppression via l'API
    async function supprimerWork(event) {
        event.preventDefault();
        event.stopPropagation();

        const work = event.target.closest('figure');
        const id = work.dataset.id;
        const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce travail ?");
        if (!confirmation) return;

        const deleteButton = event.target;
        deleteButton.disabled = true;

        try {
            await deleteWork(id, authToken);
            console.log('Travail supprimé avec succès');
            work.remove();
            initializeData(event);
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            alert("Une erreur est survenue lors de la suppression. Veuillez réessayer.");
        } finally {
            deleteButton.disabled = false;
        }
    }

    // Fonction d'affichage du formulaire d'ajout de photo
    // Configure l'interface pour l'ajout d'une nouvelle photo
    async function ajoutPhoto(event) {
        event.preventDefault();

        try {
            const categoriesJson = await fetchCategories();

            // Configuration de l'interface pour l'ajout de photo
            retourModaleBtn.style.display = 'inline';
            photoUpload.style.display = 'flex';
            retourModaleBtn.innerHTML = '<i class="fas fa-arrow-left"></i>';
            modaleTitle.textContent = 'Ajout photo';

            selectTitle.style.display = 'flex';
            selectCategorie.style.display = 'flex';
            ajouterPhoto.style.display = 'none';
            envoyer.style.display = 'flex';
            envoyer.style.backgroundColor = '#A7A7A7';

            // Création du conteneur du formulaire
            const envoyerContenair = document.createElement('div');
            envoyerContenair.className = 'envoyer-content';

            envoyerContenair.appendChild(photoUpload);
            envoyerContenair.appendChild(selectTitle);
            envoyerContenair.appendChild(selectCategorie);

            // Réinitialisation et configuration du formulaire
            workModaleContainer.innerHTML = "";
            workModaleContainer.appendChild(envoyerContenair);

            const select = document.getElementById('optionsMultiples');
            select.innerHTML = '';

            const titreInput = document.getElementById('titre');
            titreInput.value = '';

            const imageSrc = document.getElementById('image-preview');
            imageSrc.src = '';

            const imagePreview = document.getElementById('image-preview');
            imagePreview.style.display = 'none';

            const elementsToShow = document.querySelectorAll('.photo-upload-container .fa-image, .file-input-label,  .file-input-text');
            elementsToShow.forEach(element => {
                element.style.display = 'flex';
            });

            // Ajout des options de catégories
            categoriesJson.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories :", error);
        }
    }

    // Gestion de la prévisualisation des images
    imageElement.addEventListener('change', function () {
        const image = imageElement.files[0];
        const previewContainer = document.querySelector('.image-preview-container img')
        const imagePreview = document.getElementById('image-preview')

        const imageUrl = URL.createObjectURL(image);
        previewContainer.src = imageUrl;
        imagePreview.style.display = 'flex';

        const elementsToHide = document.querySelectorAll('.photo-upload-container .fa-image, .file-input-label,  .file-input-text');
        elementsToHide.forEach(element => {
            element.style.display = 'none';
        });
    })

    // Validation des champs du formulaire
    // Met à jour la couleur du bouton en fonction de la validité des champs
    function verifierChamps() {
        if (titreElement.value.trim() !== '' && imageElement.files.length > 0) {
            envoyer.style.backgroundColor = '#1D6154';
        } else {
            envoyer.style.backgroundColor = '#A7A7A7';
        }
    }

    document.getElementById('titre').addEventListener('input', verifierChamps);
    document.querySelector('.photo-upload-container input[type="file"]').addEventListener('change', verifierChamps);

    // Fonction d'envoi du nouveau travail
    // Vérifie et envoie les données du formulaire à l'API
    async function envoyerWork(event) {

        const titreElement = document.getElementById('titre');
        const categorieElement = document.getElementById('optionsMultiples');
        const imageElement = document.querySelector('.photo-upload-container input[type="file"]');

        const titre = titreElement.value.trim();
        const categoryId = categorieElement.value;
        const image = imageElement.files[0];

        // Validation du fichier image
        const maxSize = 4194304;
        const validTypes = ['image/jpeg', 'image/png'];

        if (image) {
            if (image.size > maxSize) {
                alert('Erreur : le fichier dépasse 4Mo')
                imageElement.value = '';
                return;
            }

            if (!validTypes.includes(image.type)) {
                alert('Erreur : Seuls les formats JPG et PNG sont acceptés')
                imageElement.value = '';
                return;
            }
        }

        // Vérification des champs obligatoires
        if (!titre || !categoryId || !image) {
            alert('Veuillez remplir tous les champs correctement');
            return false;
        }

        // Préparation et envoi des données
        const formData = new FormData();
        formData.append('title', titre);
        formData.append('category', categoryId);
        formData.append('image', image);

        try {
            const newWork = await sendWork(formData, authToken);
            workModaleContainer.innerHTML = "";
            ouvrirModale(event);
            initializeData(event);
        } catch (error) {
            console.error("Erreur lors de l'envoi des travaux :", error);
            alert("Erreur lors de l'envoi des travaux");
        }
    }

    // Fonction de fermeture de la modale
    function fermerModale(event) {
        event.preventDefault();
        modale.style.display = "none";
        document.body.classList.remove('body-no-scroll');
    }
});