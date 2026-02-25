// DOM Elements
const selectionScreen = document.getElementById('selection-screen');
const loadingScreen = document.getElementById('loading-screen');
const resultScreen = document.getElementById('result-screen');

// Global variable to prevent overlapping typewriter animations
let typingTimeout; 

// 1. Define the exact valid modules for the frontend randomizer
const VALID_MODULES = [
    "ServiceNow Overview", 
    "User Interface & Navigation", 
    "Lists, Filters & Forms",
    "Data Schema & Tables", 
    "Self-Service, Knowledge-Catalog & Workflows",
    "Reporting & Dashboards, Platform Analytics", 
    "ServiceNow Utilities", 
    "Security in ServiceNow Platform"
];

async function generateScenario(moduleName) {
    // 2. Intercept 'Random' and pick a real module BEFORE sending to the backend
    let targetModule = moduleName;
    if (moduleName === 'Random') {
        const randomIndex = Math.floor(Math.random() * VALID_MODULES.length);
        targetModule = VALID_MODULES[randomIndex];
    }

    // 3. Update UI to loading state
    selectionScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    loadingScreen.classList.remove('hidden');

    try {
        // 4. Call the FastAPI backend with the validated module
        const response = await fetch('/api/generate-scenario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ module: targetModule })
        });

        if (!response.ok) {
            // Attempt to read the exact error from FastAPI
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Server error: ${response.status}`);
        }

        const data = await response.json();

        // Check if our Python backend returned a custom error string
        if (data.error) {
            throw new Error(data.error);
        }

        // 5. Populate the UI with AI data
        populateScenarioUI(data);

        // 6. Show results
        loadingScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');

    } catch (error) {
        console.error("Error generating scenario:", error);
        alert("Failed to generate scenario.\nError details: " + error.message);
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

// --- UPGRADED SMART TYPEWRITER LOGIC ---
function typeWriterEffect(text, elementId, speed) {
    const element = document.getElementById(elementId);
    let i = 0;
    let currentHTML = '';

    // Convert Markdown bold (**text**) to HTML <strong> tags with our neon color
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--accent-cyan); font-weight: 600;">$1</strong>');

    // Clear any ongoing typing animation if the user clicked rapidly
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }

    function type() {
        if (i < formattedText.length) {
            // If we detect an HTML tag, process the whole tag instantly
            if (formattedText.charAt(i) === '<') {
                while (formattedText.charAt(i) !== '>' && i < formattedText.length) {
                    currentHTML += formattedText.charAt(i);
                    i++;
                }
                currentHTML += '>'; // Add the closing bracket
                i++; // Move to the next character
                
                // Call type() immediately to skip the typing delay for hidden HTML tags
                type(); 
                return;
            }
            
            // Otherwise, type the normal text character by character
            currentHTML += formattedText.charAt(i);
            element.innerHTML = currentHTML;
            i++;
            typingTimeout = setTimeout(type, speed);
        }
    }
    
    // Start the animation
    type();
}

function populateList(elementId, itemsArray) {
    const listElement = document.getElementById(elementId);
    listElement.innerHTML = ''; // Clear previous items

    if (itemsArray && Array.isArray(itemsArray) && itemsArray.length > 0) {
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

// --- Smooth Scroll Function ---
function scrollToApp() {
    const appSection = document.getElementById('app-section');
    appSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
