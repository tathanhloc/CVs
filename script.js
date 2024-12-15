document.getElementById("downloadPDF").addEventListener("click", async () => {
    const container = document.querySelector(".container");
    const downloadButton = document.getElementById("downloadPDF");

    // Hide the download button before generating the PDF
    downloadButton.style.display = "none";

    // Function to get the actual rendered height of the container
    const getRenderedHeight = (element) => {
        const styles = window.getComputedStyle(element);
        const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
        return Math.ceil(element.offsetHeight + margin);
    };

    // Get the rendered dimensions
    const renderedWidth = container.offsetWidth;
    const renderedHeight = getRenderedHeight(container);

    // Set up the PDF document with the rendered dimensions
    const pdf = new jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [renderedWidth, renderedHeight],
    });

    try {
        // Use html2canvas to capture the container
        const canvas = await html2canvas(container, {
            scale: 2, // Increased scale for better quality
            useCORS: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: -window.scrollY,
            width: renderedWidth,
            height: renderedHeight,
            windowWidth: document.documentElement.clientWidth,
            windowHeight: document.documentElement.clientHeight
        });

        // Add the captured image to the PDF
        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 0, 0, renderedWidth, renderedHeight);

        // Save the PDF
        pdf.save("CV.pdf");
    } catch (error) {
        console.error("Error generating PDF: ", error);
    } finally {
        // Restore the download button visibility
        downloadButton.style.display = "block";
    }
});