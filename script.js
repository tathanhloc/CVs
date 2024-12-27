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

    // Updated PDF download functionality
    async function handleDownload() {
        const downloadButton = document.getElementById('btn-download');
        const btnText = downloadButton.querySelector('.btn-text');
    
        downloadButton.classList.add('downloaded');
        btnText.style.animation = 'textFadeOut 0.3s forwards';

        setTimeout(() => {
            btnText.textContent = 'Generating PDF...';
            btnText.style.animation = 'textFadeIn 0.3s forwards';
        }, 300);

        // Temporarily hide the download button and theme toggle
        downloadButton.style.display = 'none';
        themeToggle.style.display = 'none';

        // Add print-specific styles
        const style = document.createElement('style');
        style.textContent = `
            @media print {
                body {
                    width: 210mm;
                    height: 297mm;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 100%;
                    height: 100%;
                    box-shadow: none !important;
                }
                #btn-download, #themeToggle {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Wait for styles to apply
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            const container = document.querySelector('.container');
            const canvas = await html2canvas(container, {
                scale: 2,
                useCORS: true,
                logging: false,
                allowTaint: true,
                foreignObjectRendering: true
            });

            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Steve_Ngoc_Quoc_CV.pdf');

            btnText.textContent = 'Downloaded!';
            btnText.style.animation = 'textFadeIn 0.3s forwards';
        } catch (error) {
            console.error('Error generating PDF:', error);
            btnText.textContent = 'Error. Try again.';
            btnText.style.animation = 'textFadeIn 0.3s forwards';
        } finally {
            // Clean up
            document.head.removeChild(style);
            downloadButton.style.display = '';
            themeToggle.style.display = '';

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

