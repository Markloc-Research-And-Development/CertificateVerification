window.onload = async () => {
    const statusDiv = document.getElementById('verification-status');
    const params = new URLSearchParams(window.location.search);
    const certificateId = params.get('id');

    if (!certificateId) {
        statusDiv.innerHTML = '<h2>Welcome</h2><p>Please use the verification link from a PDF certificate to check its validity.</p>';
        return;
    }

    statusDiv.innerHTML = `<p>Looking up Certificate ID: <strong>${certificateId}</strong>...</p>`;

    try {
        // Construct the URL to the JSON record file in the '/records/' folder
        const recordUrl = `./records/${certificateId}.json`;

        const response = await fetch(recordUrl);

        // This is the core verification step: Check if the file exists (response.ok is true for 2xx statuses)
        if (!response.ok) {
            // If the response is not OK (e.g., 404 Not Found), the certificate is considered invalid.
            throw new Error('This Certificate ID was not found in our records.');
        }

        // If the file was found, parse the JSON data
        const certificateData = await response.json();

        // Construct the URL to the original PDF file
        const pdfUrl = `./certificates/${certificateId}.pdf`;

        // Display the successful verification details
        statusDiv.innerHTML = `
            <div class="valid">
                <h2>✔️ Certificate ID Found</h2>
                <p>This is a valid Certificate ID registered in our system.</p>
                <hr>
                <p><strong>Recipient:</strong> ${certificateData.recipientName}</p>
                <p><strong>Program:</strong> ${certificateData.courseName}</p>
                <p><strong>Date Issued:</strong> ${certificateData.issueDate}</p>
                <p><strong>Issuer:</strong> ${certificateData.issuer}</p>
                <hr>
                <a href="${pdfUrl}" class="button" target="_blank">View Official PDF</a>
            </div>
        `;

    } catch (error) {
        statusDiv.innerHTML = `
            <div class="invalid">
                <h2>❌ Certificate ID Not Found</h2>
                <p><strong>Certificate ID:</strong> ${certificateId}</p>
                <p>This ID could not be found. Please check the ID and try again. The certificate may not be authentic.</p>
            </div>
        `;
    }
};