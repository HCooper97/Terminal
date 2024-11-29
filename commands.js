// Command definitions and their responses
const commands = {
    "help": "Available commands:\nhelp - Lists all available commands with descriptions\nabout - Information about the developer\nclear - Clears the terminal\nsocials - Displays social media links\nresume - Displays my resume",
    "about": "I'm a developer with a passion for technology and creating impactful projects.\nI currently work in IT at the University of Otago, bringing my skills to support a large academic community.\nI enjoy tackling challenges and solving problems in creative ways,\nwhether through building tools for better system management or enhancing user experience through thoughtful design.\nIn my spare time, I like to work on personal projects that allow me to explore different aspects of software development.\nWith an interest in story-driven games, Rock Climbing, and fostering positive aspects of neurodiversity,\nI bring a unique and well-rounded perspective to my work and hobbies.\nYou can find me sharing my creations and connecting with like-minded individuals on platforms like GitHub and Instagram.",
    "clear": "clear",
    "socials": "Social Media:\nhttps://github.com/DeadDove13\nhttps://www.instagram.com/dead_dove13/\nhttps://www.linkedin.com/in/henry-cooper-b82317ab/",
    "resume": "Opening resume..."
};

// Add initial message to the terminal
const initialMessage = "For a list of available commands, type 'help'";
const initialMessageDiv = `<div class="output-text" id="initial-message">${initialMessage}</div>`;

// Function to convert URLs to clickable links
function convertUrlsToLinks(text) {
    return text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: #ffffff;">$1</a>');
}

// Function to get the command response
function getCommandResponse(command) {
    const output = document.getElementById("output");
    let response;
    switch (command) {
        case "resume":
            window.open('resume.pdf', '_blank');
            return;
        case "help":
        case "about":
        case "socials":
            response = commands[command];
            if (command === "socials" || command === "help") {
                response = convertUrlsToLinks(response);
            }
            break;
        case "clear":
            output.innerHTML = ""; // Clear the terminal
            return;
        default:
            response = "Command not found. For a list of commands, type 'help'.";
            break;
    }

    if (response) {
        // Append the response without adding extra div or unnecessary line breaks
        output.innerHTML += `<div class="output-text">${response}</div>`;
    }
}

// Add initial message to the terminal after DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
    const output = document.getElementById("output");
    output.innerHTML += initialMessageDiv;
});
