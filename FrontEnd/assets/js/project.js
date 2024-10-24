// Import des fonctions API
import { fetchWorks, fetchCategories } from './api.js';

// Export affichage des works et des catégories 
export async function initializeData() {
  const worksJson = await fetchWorks();
  const categoriesJson = await fetchCategories();

  displayWorks(worksJson);
  createCategoryButtons(categoriesJson, worksJson);
}

//Affichage dynamique des travaux//
const workContainer = document.querySelector(".gallery");

function displayWorks(works) {
  workContainer.innerHTML = "";

  works.forEach(work => {
    const workItem = document.createElement('figure');
    workItem.setAttribute('data-category', work.categoryId);
    workItem.setAttribute('data-id', work.id);

    const workImage = document.createElement('img');
    workImage.src = work.imageUrl;
    workImage.alt = work.title;

    const workCaption = document.createElement('figcaption');
    workCaption.textContent = work.title;

    workItem.appendChild(workImage);
    workItem.appendChild(workCaption);
    workContainer.appendChild(workItem);
  })
}

//Création des boutons de catégories//
function createCategoryButtons(categoriesJson, worksJson) {
  const categoriesDiv = document.querySelector('.categories-button');
  categoriesDiv.id = "contenairButton";
  workContainer.insertAdjacentElement('beforebegin', categoriesDiv);

  //Ajout du bouton 'Tous'//
  const allCategories = document.createElement('button');
  allCategories.textContent = 'Tous';
  allCategories.classList.add('active');
  categoriesDiv.appendChild(allCategories);

  allCategories.addEventListener('click', () => {
    displayWorks(worksJson);
  })

  //Création des boutons de tris//
  categoriesJson.forEach(category => {
    const categoryItem = document.createElement('button');
    categoryItem.textContent = category.name;
    categoryItem.setAttribute('data-category', category.id);

    categoriesDiv.appendChild(categoryItem);

    categoryItem.addEventListener('click', () => {
      const filterWorks = worksJson.filter(work => work.categoryId === category.id);
      displayWorks(filterWorks);
    })
  });

  //Maintien hover bouton de tris//
  const boutons = document.querySelectorAll('.categories-button button');
  boutons.forEach(button => {
    button.addEventListener('click', () => {
      boutons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    })
  })
}

// Initialisation

initializeData();




