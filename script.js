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
            btnText.textContent = 'Downloading...';
            btnText.style.animation = 'textFadeIn 0.3s forwards';
        }, 300);

        try {
            const response = await fetch('/Steve_Ngoc_Quoc_CV.pdf');
            if (!response.ok) throw new Error('PDF not found');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'Steve_Ngoc_Quoc_CV.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            btnText.textContent = 'Downloaded!';
            btnText.style.animation = 'textFadeIn 0.3s forwards';
        } catch (error) {
            console.error('Error downloading PDF:', error);
            btnText.textContent = 'Error. Try again.';
            btnText.style.animation = 'textFadeIn 0.3s forwards';
        } finally {
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

