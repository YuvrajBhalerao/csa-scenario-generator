// DOM Elements
const selectionScreen = document.getElementById('selection-screen');
const loadingScreen = document.getElementById('loading-screen');
const resultScreen = document.getElementById('result-screen');

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
    document.getElementById('res-problem').innerText = data.problem_statement || "No problem statement generated.";
    
    document.getElementById('res-tips').innerText = data.pro_tips || "No pro tips available.";

    // Populate Lists (Hints, Steps, References)
    populateList('hints-container', data.hints);
    populateList('steps-container', data.guided_steps);
    populateList('res-refs', data.theoretical_references);

    // Ensure reveal sections are hidden by default on new generation
    document.getElementById('hints-container').classList.add('hidden');
    document.getElementById('steps-container').classList.add('hidden');
}

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
}
