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

    // Generate PDF from HTML content
    async function handleDownload() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Hide the download button
        const downloadButton = document.getElementById('btn-download');
        downloadButton.classList.add('hidden');

        // Temporarily disable animations
        const container = document.querySelector('.container');
        container.classList.add('no-animation');

        // Use html2canvas to capture the HTML content
        const canvas = await html2canvas(container);
        const imgData = canvas.toDataURL('image/png');

        // Add the image to the PDF
        doc.addImage(imgData, 'PNG', 10, 10, 190, 0); // Adjust dimensions as needed

        // Save the PDF
        doc.save('Steve_Ngoc_Quoc_CV.pdf');

        // Re-enable animations
        container.classList.remove('no-animation');

        // Show the download button again
        downloadButton.classList.remove('hidden');
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

