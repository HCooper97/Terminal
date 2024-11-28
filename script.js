document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("input");
    const output = document.getElementById("output");
    const promptText = "User@Henry.com:~$ ";
    const terminal = document.getElementById("terminal");

    // Event listener to make the input field focused when clicking anywhere in the terminal
    terminal.addEventListener("click", () => {
        input.focus();
    });

    // Function to process commands
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const command = input.value.trim(); // Trim input to remove trailing spaces

            if (command.length > 0) {
                // Append the prompt and command entered by the user to the output
                output.innerHTML += `<div class="command"><span id="prompt">${promptText}</span>${command}</div>`;
            }

            // Get and process the command response
            const response = getCommandResponse(command);

            // Clear the input field
            input.value = "";

            // Scroll to the bottom of the output div
            output.scrollTop = output.scrollHeight;

            // Scroll the terminal window to the bottom as well
            terminal.scrollTop = terminal.scrollHeight;
        }
    });
});
