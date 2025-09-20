const searchBar = document.getElementById('searchInput');
const searchBtn = document.getElementById('search');
const result = document.getElementById('searchResults');

searchBtn.addEventListener('click', SearchFlashCards);

const clearBtn = document.createElement('button');
clearBtn.className = 'clear';
clearBtn.innerHTML = '<i class="fa-solid fa-eraser fa-2x"></i>';
// flashcard.append(clearBtn);
clearBtn.addEventListener('click', () => result.innerHTML = '');

function SearchFlashCards() {
    // Clear previous results
    result.innerHTML = '';

    const searchValue = searchBar.value.trim().toLowerCase();
    if (!searchValue){
        result.textContent = 'You need to write something';
        return;
    };

    // Get saved flashcards
    let savedCards = JSON.parse(localStorage.getItem('flashcards') || '[]');

    // Filter for matching flashcards
    const matches = savedCards.filter(c =>
        c.word.toLowerCase().includes(searchValue) ||
        c.meaning.toLowerCase().includes(searchValue)
    );

    if (matches.length === 0) {
        const errorMsg = document.createElement('div');
        errorMsg.textContent = 'No results found.';
        errorMsg.className = 'error-msg';
        result.append(errorMsg);
        return;
    }

    // Display matching flashcards
    matches.forEach(card => {

        const cardId = `card-${card.id}`;

        // Prevent duplicates by ID
        if (document.getElementById(cardId)) return;

        // Create flashcard element INSIDE the loop
        const flashcard = document.createElement('div');
        flashcard.className = 'flashcard';
        flashcard.id = cardId;

        const flashCardTop = document.createElement('div');
        flashCardTop.className = 'flashcard-top';

        const flashCardBottom = document.createElement('div');
        flashCardBottom.className = 'flashcard-bottom';

        const word = document.createElement('h3');
        if(card.word !== ''){
            word.innerHTML = `<span class='added'>Word: </span> ${card.word}`;
        }

        const meaning = document.createElement('h3');
        if(card.meaning !== ''){
            meaning.innerHTML = `<span class='added'>Meaning: </span> ${card.meaning}`;
        }

        flashCardTop.append(word,meaning);

        const definition = document.createElement('h4');
        definition.className = 'definition';
        if(card.definition !== ''){
            definition.innerHTML = `<span class='added'>Definition: </span> ${card.definition}`;
        }

        const example = document.createElement('h4');
        if(card.example !== ''){
            example.innerHTML = `<span class='added'>Example: </span> ${card.example}`;
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fa fa-trash "></i>';

        deleteBtn.addEventListener('click', () => {
            flashcard.remove();
            let savedCards = JSON.parse(localStorage.getItem('flashcards') || '[]');
            savedCards = savedCards.filter(c => c.id !== card.id);
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
            word.classList.toggle('white');
            meaning.classList.toggle('white');
            definition.classList.toggle('white');
            example.classList.toggle('white');
            // The buttons
            deleteBtn.classList.toggle('active');
            editBtn.classList.toggle('active');

            card.isFavorite = !card.isFavorite;

            // Save change to localStorage
            let savedCards = JSON.parse(localStorage.getItem('flashcards') || '[]');
            savedCards = savedCards.map(c =>
                c.id === card.id ? {...c, isFavorite: card.isFavorite} : c
            );
            localStorage.setItem('flashcards', JSON.stringify(savedCards));
        })

        const containerDiv = document.createElement("div");
        containerDiv.className = 'container-div';
        containerDiv.append(deleteBtn, editBtn);

        const changingContainer = document.createElement('div');
        changingContainer.className = 'editing-container';
        changingContainer.append(star,containerDiv);

        // end

        editBtn.addEventListener('click', () => {
            // Replace view with editable inputs
            flashcard.innerHTML = '';

            const wordInput = document.createElement('input');
            wordInput.className = 'text-input';
            wordInput.value = card.word;

            const meaningInput = document.createElement('input');
            meaningInput.className = 'text-input';
            meaningInput.value = card.meaning;

            const definitionInput = document.createElement('textarea');
            definitionInput.value = card.definition;

            const exampleInput = document.createElement('textarea');
            exampleInput.value = card.example;

            const saveEditButton = document.createElement('button');
            saveEditButton.textContent = 'Save Flashcard';
            saveEditButton.className = 'save-edit-button';

            saveEditButton.addEventListener('click', () => {
                if (wordInput.value.trim() === '') {
                    TimingError();
                    return;
                }

                const updatedCard = {
                    id: card.id,
                    word: wordInput.value,
                    meaning: meaningInput.value,
                    definition: definitionInput.value,
                    example: exampleInput.value,
                    isFavorite:card.isFavorite
                };

                // Update localStorage
                let savedCards = JSON.parse(localStorage.getItem('flashcards') || '[]');
                savedCards = savedCards.map(c =>
                    c.id === card.id ? updatedCard : c
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
                    updatedWord.classList.toggle('white');
                    updatedMeaning.classList.toggle('white');
                    updatedDefinition.classList.toggle('white');
                    updatedExample.classList.toggle('white');
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
                
        if(card.isFavorite){
            // The star
            star.classList.toggle("active");
            star.classList.toggle('fa-regular');
            star.classList.toggle('fa-solid');
            // The flashcard
            flashcard.classList.toggle('favourite');
            // The text
            word.classList.toggle('white');
            meaning.classList.toggle('white');
            definition.classList.toggle('white');
            example.classList.toggle('white');
            // The buttons
            deleteBtn.classList.toggle('active');
            editBtn.classList.toggle('active');
        }

        flashCardBottom.append(definition,example);

        flashcard.append(flashCardTop,flashCardBottom,changingContainer);
        result.appendChild(flashcard);
    });

    result.appendChild(clearBtn);


}
