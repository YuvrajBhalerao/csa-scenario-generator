// DOM Elements
const selectionScreen = document.getElementById('selection-screen');
const loadingScreen = document.getElementById('loading-screen');
const resultScreen = document.getElementById('result-screen');

// Global variable to prevent overlapping typewriter animations
let typingTimeout; 

async function generateScenario(moduleName) {
    // 1. Update UI to loading state
    selectionScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    loadingScreen.classList.remove('hidden');

    try {
        // 2. Call the FastAPI backend
        const response = await fetch('/api/generate-scenario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ module: moduleName })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        // 3. Populate the UI with AI data
        populateScenarioUI(data);

        // 4. Show results
        loadingScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');

    } catch (error) {
        console.error("Error generating scenario:", error);
        alert("Failed to generate scenario. Please try again.");
        resetApp();
    }
}

function populateScenarioUI(data) {
    document.getElementById('res-module').innerText = data.module_name || "ServiceNow Module";
    document.getElementById('res-tips').innerText = data.pro_tips || "No pro tips available.";

    // Trigger the premium Typewriter Effect for the problem statement
    const problemText = data.problem_statement || "No problem statement generated.";
    typeWriterEffect(problemText, 'res-problem', 25); // 25 milliseconds per character

    // Populate Lists (Hints, Steps, References)
    populateList('hints-container', data.hints);
    populateList('steps-container', data.guided_steps);
    populateList('res-refs', data.theoretical_references);

    // Ensure reveal sections are hidden by default on new generation
    document.getElementById('hints-container').classList.add('hidden');
    document.getElementById('steps-container').classList.add('hidden');
}

// --- NEW TYPEWRITER LOGIC ---
function typeWriterEffect(text, elementId, speed) {
    const element = document.getElementById(elementId);
    element.innerHTML = ''; // Clear previous text
    let i = 0;

    // Clear any ongoing typing animation if the user clicked rapidly
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            typingTimeout = setTimeout(type, speed);
        }
    }
    
    // Start the animation
    type();
}
// ----------------------------

function populateList(elementId, itemsArray) {
    const listElement = document.getElementById(elementId);
    listElement.innerHTML = ''; // Clear previous items

    if (itemsArray && Array.isArray(itemsArray)) {
        itemsArray.forEach(item => {
            const li = document.createElement('li');
            li.innerText = item;
            listElement.appendChild(li);
        });
    } else {
        listElement.innerHTML = '<li>Not available.</li>';
    }
}

// Utility to toggle visibility of Hints and Steps
function toggleVisibility(elementId) {
    const el = document.getElementById(elementId);
    el.classList.toggle('hidden');
}

// Return to main menu
function resetApp() {
    resultScreen.classList.add('hidden');
    loadingScreen.classList.add('hidden');
    selectionScreen.classList.remove('hidden');
    
    // Stop typing if the user clicks "Back" mid-sentence
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
}
