const word = document.querySelector('#word');
const meaning = document.querySelector('#meaning')
const definition = document.querySelector('#definition');
const example = document.querySelector('#example');
const saveBtn = document.querySelector('#saveBtn');
const error = document.querySelector('#error-msg');
const flashCardSection = document.getElementById('flashcards');
const createSection = document.getElementById('main-section');
const alertContainer = document.querySelector('.flashcard-container')
const scrollCount = document.getElementById('count-flashcards');
const appendingDiv = document.querySelector('.appending');

saveBtn.addEventListener('click', CreateFlashCard);

let errorTimeout;

function CreateFlashCard(e){
    if(word.value === ''){
        TimingError();
    }else{
        // create flashcard object

        let flashCardObject = {
            id:Date.now(),
            word:word.value,
            meaning:meaning.value,
            definition:definition.value,
            example:example.value,
            isFavorite:false
        }

        // Show Alert

        const alert = document.createElement('div');
        added = document.createElement('p');
        added.textContent = 'Flashcard Added Successfuly!';
        alert.appendChild(added);
        alert.className = 'alert';

        createSection.insertBefore(alert,alertContainer);
        
        setTimeout(() => {alert.remove()}, 3000);

        // Save in localStorage

        let storedCards = JSON.parse(localStorage.getItem('flashcards') || '[]');
        storedCards.push(flashCardObject);
        scrollObject(storedCards);
        localStorage.setItem('flashcards',JSON.stringify(storedCards));

        RenderFlashcard(flashCardObject);

        word.value = '';
        meaning.value = '';
        definition.value = '';
        example.value = '';

    }
}

function LoadSavedFlashcards() {
    let savedCards = JSON.parse(localStorage.getItem('flashcards') || '[]');

    savedCards.forEach(card => {

        RenderFlashcard(card);

    })

    scrollObject(savedCards);
    
};

function RenderFlashcard(cardData) {

    const flashcard = document.createElement('div');
    flashcard.className = 'flashcard';

    const flashCardTop = document.createElement('div');
    flashCardTop.className = 'flashcard-top';

    const flashCardBottom = document.createElement('div');
    flashCardBottom.className = 'flashcard-bottom';

    const flashCardWord = document.createElement('h3');
    flashCardWord.className = 'flashcard-word';
    if (cardData.word !== ''){
        flashCardWord.innerHTML = `<span class='added'>Word:</span> ${cardData.word}`;
    };

    const flashCardMeaning = document.createElement('h3');
    flashCardMeaning.className = 'flashcard-meaning';
    if (cardData.meaning !== ''){
        flashCardMeaning.innerHTML = `<span class='added'>Meaning: </span> ${cardData.meaning}`;
    };

    flashCardTop.append(flashCardWord,flashCardMeaning);

    const flashCardDefinition = document.createElement('h4');
    flashCardDefinition.className = 'flashcard-definition';
    if (cardData.definition !== ''){
        flashCardDefinition.innerHTML = `<span class='added'>Definition: </span>  ${cardData.definition}`;
    };

    const flashCardExample = document.createElement('h4');
    flashCardExample.className = 'flashcard-example';
    if (cardData.example !== ''){
        flashCardExample.innerHTML = `<span class='added'>Example: </span> ${cardData.example}`;
    };

    flashCardBottom.append(flashCardDefinition,flashCardExample);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fa fa-trash "></i>';

    deleteBtn.addEventListener('click', () => {
        flashcard.remove();
        let savedCards = JSON.parse(localStorage.getItem('flashcards') || '[]');
        savedCards = savedCards.filter(c => c.id !== cardData.id);
        scrollObject(savedCards);
        localStorage.setItem('flashcards', JSON.stringify(savedCards));
    });

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '<i class="fa fa-pen "></i>';

    // Magnificent style

    const star = document.createElement('i');
    star.className = 'fa-regular fa-star star-icon';

    star.addEventListener('click',() => {
        // The star
        star.classList.toggle("active");
        star.classList.toggle('fa-regular');
        star.classList.toggle('fa-solid');
        // The flashcard
        flashcard.classList.toggle('favourite');
        // The text
        flashCardWord.classList.toggle('white');
        flashCardMeaning.classList.toggle('white');
        flashCardDefinition.classList.toggle('white');
        flashCardExample.classList.toggle('white');
        // The buttons
        deleteBtn.classList.toggle('active');
        editBtn.classList.toggle('active');

        cardData.isFavorite = !cardData.isFavorite;

        // Save change to localStorage
        let savedCards = JSON.parse(localStorage.getItem('flashcards') || '[]');
        savedCards = savedCards.map(c =>
            c.id === cardData.id ? {...c, isFavorite: cardData.isFavorite} : c
        );
        localStorage.setItem('flashcards', JSON.stringify(savedCards));
    })

    // end

    const containerDiv = document.createElement("div");
    containerDiv.className = 'container-div';
    containerDiv.append(deleteBtn, editBtn);

    const changingContainer = document.createElement('div');
    changingContainer.className = 'editing-container';
    changingContainer.append(star,containerDiv);

    editBtn.addEventListener('click', () => {
        // Replace view with editable inputs
        flashcard.innerHTML = '';

        const wordInput = document.createElement('input');
        wordInput.className = 'text-input';
        wordInput.value = cardData.word;

        const meaningInput = document.createElement('input');
        meaningInput.className = 'text-input';
        meaningInput.value = cardData.meaning;

        const definitionInput = document.createElement('textarea');
        definitionInput.value = cardData.definition;

        const exampleInput = document.createElement('textarea');
        exampleInput.value = cardData.example;

        const saveEditButton = document.createElement('button');
        saveEditButton.textContent = 'Save Flashcard';
        saveEditButton.className = 'save-edit-button';

        saveEditButton.addEventListener('click', () => {
            if (wordInput.value.trim() === '') {
                TimingError();
                return;
            }

            const updatedCard = {
                id: cardData.id,
                word: wordInput.value,
                meaning: meaningInput.value,
                definition: definitionInput.value,
                example: exampleInput.value,
                isFavorite:cardData.isFavorite
            };

            // Update localStorage
            let savedCards = JSON.parse(localStorage.getItem('flashcards') || '[]');
            savedCards = savedCards.map(c =>
                c.id === cardData.id ? updatedCard : c
            );
            localStorage.setItem('flashcards', JSON.stringify(savedCards));

            const flashCardTop2 = document.createElement('div');
            flashCardTop2.className = 'flashcard-top';

            const flashCardBottom2 = document.createElement('div');
            flashCardBottom2.className = 'flashcard-bottom';

            // Re-render updated card
            flashcard.innerHTML = '';

            const updatedWord = document.createElement('h3');
            updatedWord.className = 'flashcard-word';
            if(updatedCard.word !== ''){
                updatedWord.innerHTML = `<span class='added'>Word: </span> ${updatedCard.word}`;
            };

            const updatedMeaning = document.createElement('h3');
            updatedMeaning.className = 'flashcard-meaning';
            if(updatedCard.meaning !== ''){
                updatedMeaning.innerHTML = `<span class='added'>Meaning: </span> ${updatedCard.meaning}`;
            };

            flashCardTop2.append(updatedWord,updatedMeaning);

            const updatedDefinition = document.createElement('h4');
            updatedDefinition.className = 'flashcard-definition';
            if(updatedCard.definition !== ''){
                updatedDefinition.innerHTML = `<span class='added'>Definition: </span> ${updatedCard.definition}`;
            };

            const updatedExample = document.createElement('h4');
            updatedExample.className = 'flashcard-example';
            if(updatedCard.example !== ''){
                updatedExample.innerHTML = `<span class='added'>Example: </span> ${updatedCard.example}`;
            };

            if(updatedCard.isFavorite){
                // The flashcard
                flashcard.classList.add('favourite');
                // The star
                star.classList.add('active','fa-solid');
                star.classList.remove('fa-regular');
                // The text
                flashCardWord.classList.toggle('white');
                flashCardMeaning.classList.toggle('white');
                flashCardDefinition.classList.toggle('white');
                flashCardExample.classList.toggle('white');
                // The buttons
                deleteBtn.classList.toggle('active');
                editBtn.classList.toggle('active');
            }

            flashCardBottom2.append(updatedDefinition,updatedExample);

            flashcard.append(
                flashCardTop2,
                flashCardBottom2,
                changingContainer
            );
        });

        flashcard.append(wordInput, meaningInput, definitionInput, exampleInput, saveEditButton);
    });

    if (cardData.isFavorite) {
        // The flashcard
        flashcard.classList.add('favourite');
        // The star
        star.classList.add('active','fa-solid');
        star.classList.remove('fa-regular');
        // The text
        flashCardWord.classList.toggle('white');
        flashCardMeaning.classList.toggle('white');
        flashCardDefinition.classList.toggle('white');
        flashCardExample.classList.toggle('white');
        // The buttons
        deleteBtn.classList.toggle('active');
        editBtn.classList.toggle('active');
    }

    flashcard.append(
        flashCardTop,
        flashCardBottom,
        changingContainer
    );

    flashCardSection.insertBefore(flashcard,flashCardSection.firstChild);

    return { flashcard, deleteBtn, editBtn };
}


function TimingError(e){
    error.textContent = 'You should at least write the word';
    error.style.marginTop = '10px';
    errorTimeout = setTimeout(() => error.textContent = '', 3000)
};

function scrollObject(data) {
    let scrollData = data.length;
    scrollCount.textContent = scrollData;

    localStorage.setItem('scrollData', scrollData);
}

document.addEventListener('DOMContentLoaded', function () {
    LoadSavedFlashcards();

    // saveBtn.addEventListener('click', CreateFlashCard);
});
