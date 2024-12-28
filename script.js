document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Function to set the theme
    function setTheme(isDark) {
        body.classList.toggle('dark-theme', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateIcon(isDark);
    }

    // Function to update the icon
    function updateIcon(isDark) {
        icon.className = isDark ? 'fas fa-lightbulb' : 'fas fa-moon';
    }

    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme === 'dark');
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark);
    }

    // Listen for theme toggle button clicks
    themeToggle.addEventListener('click', function() {
        setTheme(!body.classList.contains('dark-theme'));
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addListener(function(e) {
        setTheme(e.matches);
    });

    // PDF download functionality with animation handling
    async function handleDownload() {
        const downloadButton = document.getElementById('btn-download');
        const btnText = downloadButton.querySelector('.btn-text');

        // Hide buttons during PDF generation
        downloadButton.style.display = 'none';
        themeToggle.style.display = 'none';

        downloadButton.classList.add('downloaded');
        btnText.style.animation = 'textFadeOut 0.3s forwards';

        setTimeout(() => {
            btnText.textContent = 'Downloading...';
            btnText.style.animation = 'textFadeIn 0.3s forwards';
        }, 300);

        // Temporarily switch to light theme for PDF generation
        const wasDarkTheme = body.classList.contains('dark-theme');
        if (wasDarkTheme) {
            body.classList.remove('dark-theme');
        }

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Temporarily disable animations by adding the no-animation class
            const container = document.querySelector('.container');
            container.classList.add('no-animation');

            // Use html2canvas to capture the HTML content
            const canvas = await html2canvas(container, {
                scale: 2, // Increase the scale for better quality
                useCORS: true, // Enable CORS if needed
                logging: false // Disable logging for production
            });
            const imgData = canvas.toDataURL('image/png');

            // Add the image to the PDF
            const imgWidth = 190; // Width of the PDF page
            const pageHeight = 295; // Height of the PDF page
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 10;

            doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Save the PDF
            doc.save('Steve_Ngoc_Quoc_CV.pdf');

            // Re-enable animations
            container.classList.remove('no-animation');

            btnText.textContent = 'Downloaded!';
            btnText.style.animation = 'textFadeIn 0.3s forwards';
        } catch (error) {
            console.error('Error downloading PDF:', error);
            btnText.textContent = 'Error. Try again.';
            btnText.style.animation = 'textFadeIn 0.3s forwards';
        } finally {
            // Restore the original theme
            if (wasDarkTheme) {
                body.classList.add('dark-theme');
            }

            // Show buttons again after PDF generation
            downloadButton.style.display = 'flex';
            themeToggle.style.display = 'block';

            setTimeout(() => {
                downloadButton.classList.remove('downloaded');
                btnText.textContent = 'Download CV';
                btnText.style.animation = '';
            }, 3000);
        }
    }

    // Update the event listener for the download button
    const downloadButton = document.getElementById('btn-download');
    downloadButton.addEventListener('click', handleDownload);

    // Intersection Observer for experience items
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe experience items
    const experienceItems = document.querySelectorAll('.experience-item');
    experienceItems.forEach(item => {
        observer.observe(item);
    });
});
