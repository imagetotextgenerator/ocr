document.addEventListener("DOMContentLoaded", function() {
    const uploadBtn = document.getElementById("uploadBtn");
    const fileInput = document.getElementById("fileInput");
    const urlInput = document.getElementById("urlInput");
    const fetchBtn = document.getElementById("fetchBtn");
    const articleSection = document.querySelector(".article-section");

    // Upload button click handler
    uploadBtn.addEventListener("click", function() {
        fileInput.click();
    });

    // File input change handler
    fileInput.addEventListener("change", function() {
        const file = fileInput.files[0];
        if (file) {
            // Handle image upload here
            const reader = new FileReader();
            reader.onload = function(event) {
                const imageUrl = event.target.result;
                // Process image text (you can add OCR or other functionality here)
                // For now, we'll just log the image to simulate text extraction.
                console.log("Image uploaded: ", imageUrl);
                alert("Image uploaded! Text extraction can be added here.");
            };
            reader.readAsDataURL(file);
        }
    });

    // Fetch button click handler (for pasting URL)
    fetchBtn.addEventListener("click", function() {
        const url = urlInput.value.trim();
        if (url) {
            // Simulate text extraction from the URL (In real scenarios, use API to fetch text from the URL)
            console.log("Fetching text from URL: ", url);
            alert("Text extraction from URL will be implemented here.");
            fetchTextFromUrl(url);  // Fetch article text or other content
        } else {
            alert("Please enter a valid URL.");
        }
    });

    // Fetch article content from GitHub (via an API or JSON file)
    async function fetchTextFromUrl(url) {
        const articleFilePath = "https://raw.githubusercontent.com/YourGitHubUserName/YourRepositoryName/master/articleFolder/article1.txt"; // Example
        try {
            const response = await fetch(articleFilePath);
            const articleText = await response.text();
            displayArticle(articleText);
        } catch (error) {
            console.error("Error fetching article:", error);
            alert("Failed to fetch the article.");
        }
    }

    // Display article content in the article section
    function displayArticle(text) {
        articleSection.innerHTML = `
            <h3>Article</h3>
            <p>${text}</p>
        `;
    }
});
