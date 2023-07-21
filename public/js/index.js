// Function to generate a unique number
function generateUniqueNumber() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

// Set the unique number in the hidden field when the form is loaded
document.addEventListener("DOMContentLoaded", function() {
    const uniqueNumber = generateUniqueNumber();
    document.getElementById("uniqueNumberField").value = uniqueNumber;
});

// Set a new unique number in the hidden field when the form is submitted
document.getElementById("myForm").addEventListener("submit", function(event) {
    const uniqueNumber = generateUniqueNumber();
    document.getElementById("uniqueNumberField").value = uniqueNumber;
});