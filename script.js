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

    // Existing PDF download functionality
    const downloadButton = document.getElementById('downloadPDF');
    downloadButton.addEventListener('click', generatePDF);

    function generatePDF() {
        const element = document.querySelector('.container');
        const downloadButton = document.getElementById('downloadPDF');
        const themeToggle = document.getElementById('themeToggle');
        
        // Temporarily hide the download button and theme toggle
        downloadButton.style.display = 'none';
        themeToggle.style.display = 'none';

        html2canvas(element, {
            scale: 1,
            useCORS: true,
            logging: false,
        }).then(function(canvas) {
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('steve_ngoc_quoc_resume.pdf');

            // Show the download button and theme toggle again
            downloadButton.style.display = '';
            themeToggle.style.display = '';
        });
    }
});

