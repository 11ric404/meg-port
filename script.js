/**
 * Simple View Manager for Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
    // Navigation Links
    const navProjects = document.getElementById('navProjects');
    const navAbout = document.getElementById('navAbout');
    const navContact = document.getElementById('navContact');
    const logoLink = document.getElementById('logoLink');
    const backButton = document.getElementById('backButton');

    // Views
    const projectsGrid = document.getElementById('projectsGrid');
    const projectDetail = document.getElementById('projectDetail');
    const detailContent = document.getElementById('detailContent');
    const aboutSection = document.getElementById('aboutSection');
    const contactSection = document.getElementById('contactSection');

    // All views array for easy toggling
    const views = [projectsGrid, projectDetail, aboutSection, contactSection];
    const navLinks = [navProjects, navAbout, navContact];

    function showView(viewToShow) {
        // Hide all views
        views.forEach(view => {
            view.classList.remove('active-view');
            view.style.display = 'none';
        });

        // Show requested view
        viewToShow.style.display = 'block';
        // Small timeout to allow display block to apply before adding class for animation
        setTimeout(() => {
            viewToShow.classList.add('active-view');
        }, 10);

        window.scrollTo(0, 0);
    }

    function setActiveNav(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) activeLink.classList.add('active');
    }

    // --- Interaction Handlers ---

    // 1. Projects / Logo Click -> Show Grid
    function showHome() {
        showView(projectsGrid);
        setActiveNav(navProjects);
    }

    navProjects.addEventListener('click', (e) => {
        e.preventDefault();
        showHome();
    });

    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        showHome();
    });

    backButton.addEventListener('click', () => {
        showHome();
    });

    // 2. About Click
    navAbout.addEventListener('click', (e) => {
        e.preventDefault();
        showView(aboutSection);
        setActiveNav(navAbout);
    });

    // 3. Contact Click
    navContact.addEventListener('click', (e) => {
        e.preventDefault();
        showView(contactSection);
        setActiveNav(navContact);
    });

    // 4. Other Work Click
    const navOtherWork = document.getElementById('navOtherWork');
    const otherWorkSection = document.getElementById('otherWorkSection');

    // Add to shared arrays
    views.push(otherWorkSection);
    navLinks.push(navOtherWork);

    navOtherWork.addEventListener('click', (e) => {
        e.preventDefault();
        showView(otherWorkSection);
        setActiveNav(navOtherWork);
    });

    // 4. Project Card Click -> Show Detail
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.dataset.project;
            const template = document.getElementById(`tpl-${projectId}`);

            if (template) {
                // Clone content from template
                detailContent.innerHTML = '';
                detailContent.appendChild(template.content.cloneNode(true));

                showView(projectDetail);
                // Keep 'Projects' active in nav since we are in a sub-view of projects
                setActiveNav(navProjects);
            }
        });
    });

    // Initial State
    showHome();

    // --- Lightbox Logic ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentImages = []; // Array of image sources in the current gallery
    let currentIndex = 0;

    // Open Lightbox (Main Projects)
    detailContent.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            // 1. Build list of potential gallery images from the current detail view
            const images = Array.from(detailContent.querySelectorAll('img'));

            // Filter out any icons if they existed, but we mainly want the content images
            currentImages = images.map(img => img.src);
            currentIndex = currentImages.indexOf(e.target.src);

            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            e.stopPropagation(); // Prevent bubbling issues
        }
    });

    // Open Lightbox (Other Work)
    otherWorkSection.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            const images = Array.from(otherWorkSection.querySelectorAll('img'));

            currentImages = images.map(img => img.src);
            currentIndex = currentImages.indexOf(e.target.src);

            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            e.stopPropagation();
        }
    });

    function updateLightboxImage() {
        if (currentIndex < 0) return; // Safety check
        const src = currentImages[currentIndex];
        lightboxImg.src = src;

        // Extract filename for caption
        const filename = src.split('/').pop().split('.')[0].replace(/%20/g, ' '); // Clean URL encoding
        lightboxCaption.textContent = filename;
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightboxImage();
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateLightboxImage();
    }

    // Nav Click Handlers
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
    });

    // Close Lightbox functions
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
});
