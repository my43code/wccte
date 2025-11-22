(function(){
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('main-menu');
    const header = document.querySelector('.site-header');

    const updateHeaderHeight = () => {
        if(!header){
            return;
        }
        const height = header.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
    };

    updateHeaderHeight();
    window.addEventListener('load', updateHeaderHeight);

    if(menuToggle && menu){
        menuToggle.addEventListener('click', () => {
            const isOpen = menu.classList.toggle('show');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            updateHeaderHeight();
        });
    }

    const submenuLinks = document.querySelectorAll('.has-submenu > a');
    const isMobileNav = () => {
        const toggleButton = document.querySelector('.menu-toggle');
        return toggleButton ? getComputedStyle(toggleButton).display !== 'none' : window.matchMedia('(max-width: 900px)').matches;
    };

    submenuLinks.forEach(link => {
        const parent = link.parentElement;
        link.setAttribute('aria-expanded', 'false');

        link.addEventListener('click', e => {
            if(!isMobileNav()){
                return;
            }

            e.preventDefault();
            const isOpen = parent.classList.contains('open');

            document.querySelectorAll('.has-submenu.open').forEach(item => {
                if(item !== parent){
                    item.classList.remove('open');
                    const trigger = item.querySelector(':scope > a');
                    if(trigger){
                        trigger.setAttribute('aria-expanded', 'false');
                    }
                }
            });

            parent.classList.toggle('open', !isOpen);
            link.setAttribute('aria-expanded', (!isOpen).toString());
        });
    });

    window.addEventListener('resize', () => {
        updateHeaderHeight();
        if(menu && menuToggle && getComputedStyle(menuToggle).display === 'none'){
            menu.classList.remove('show');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentHash = window.location.hash;
    const navLinks = document.querySelectorAll('#main-menu a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const [normalizedPath, hashPart] = href.split('#');
        const linkHash = hashPart ? `#${hashPart}` : '';
        const matchesPage = normalizedPath === currentPage || (currentPage === '' && normalizedPath === 'index.html');
        const matchesHash = linkHash ? linkHash === currentHash : currentHash === '';

        if(matchesPage && matchesHash){
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
            const parentToggle = link.closest('.submenu')?.previousElementSibling;
            if(parentToggle){
                parentToggle.classList.add('active');
            }
        }
    });

    const yearEl = document.getElementById('year');
    if(yearEl){
        yearEl.textContent = new Date().getFullYear();
    }

    const slider = document.querySelector('.slider');
    if(slider){
        const images = Array.from(slider.querySelectorAll('#slides img'));
        if(images.length > 0){
            let idx = 0;
            const overlayTitle = document.getElementById('slideTitle');
            const overlayText = document.getElementById('slideText');
            const captions = [
                {
                    title: 'Leadership Team Committed to Excellence',
                    text: 'Waigani Christian College-Tertiary Education.'
                },
                {
                    title: 'New Facilities',
                    text: 'Waigani Christian College-Tertiary Education is Expanding!'
                },
                {
                    title: 'Modern Facilities for Students Learning and Growth',
                    text: 'Smart Learning Environment.'
                },
                {
                    title: 'Waigani Christian College in Partnership with Philippine Christian University',
                    text: 'Empowering Students Through Quality Education.'
                },
                {
                    title: 'Active classrooms built for collaboration',
                    text: 'Students learn together in fully equipped lecture spaces.'
                },
            ];

            const showSlide = (pos) => {
                images.forEach((img, i) => img.classList.toggle('active', i === pos));
                const caption = captions[pos] || captions[0];
                if(overlayTitle){
                    overlayTitle.textContent = caption.title;
                }
                if(overlayText){
                    overlayText.textContent = caption.text;
                }
            };

            showSlide(idx);
            let timer = setInterval(() => {
                idx = (idx + 1) % images.length;
                showSlide(idx);
            }, 2500);

            slider.addEventListener('mouseenter', () => clearInterval(timer));
            slider.addEventListener('mouseleave', () => {
                timer = setInterval(() => {
                    idx = (idx + 1) % images.length;
                    showSlide(idx);
                }, 2500);
            });
        }
    }

    const highlightSlider = document.querySelector('.highlight-slider');
    if(highlightSlider){
        const track = highlightSlider.querySelector('.highlight-track');
        const slides = Array.from(highlightSlider.querySelectorAll('.highlight-slide'));
        const dotsContainer = document.querySelector('.highlight-dots');
        const prev = highlightSlider.querySelector('.highlight-control.prev');
        const next = highlightSlider.querySelector('.highlight-control.next');
        let activeIndex = 0;
        let sliderTimer;

        const renderDots = () => {
            if(!dotsContainer){
                return;
            }
            dotsContainer.innerHTML = '';
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i, true));
                dotsContainer.appendChild(dot);
            });
        };

        const syncDots = () => {
            if(!dotsContainer){
                return;
            }
            dotsContainer.querySelectorAll('button').forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIndex);
                dot.setAttribute('aria-pressed', i === activeIndex ? 'true' : 'false');
            });
        };

        const resetOverlayStates = () => {
            slides.forEach(slide => {
                const overlay = slide.querySelector('.highlight-overlay');
                if(overlay){
                    overlay.classList.remove('show');
                }
            });
        };

        const goToSlide = (index, pauseAuto = false) => {
            if(!track || slides.length === 0){
                return;
            }
            activeIndex = (index + slides.length) % slides.length;
            track.style.transform = `translateX(-${activeIndex * 100}%)`;
            syncDots();
            resetOverlayStates();
            if(pauseAuto){
                restartAutoplay();
            }
        };

        const restartAutoplay = () => {
            clearInterval(sliderTimer);
            sliderTimer = setInterval(() => goToSlide(activeIndex + 1), 4500);
        };

        renderDots();
        syncDots();
        restartAutoplay();

        slides.forEach(slide => {
            slide.setAttribute('tabindex', '0');
            const overlay = slide.querySelector('.highlight-overlay');
            const toggleOverlay = () => {
                if(!overlay){
                    return;
                }
                const isVisible = overlay.classList.contains('show');
                resetOverlayStates();
                if(!isVisible){
                    overlay.classList.remove('show');
                    void overlay.offsetWidth;
                    overlay.classList.add('show');
                }
            };

            slide.addEventListener('click', toggleOverlay);
            slide.addEventListener('keydown', (e) => {
                if(e.key === 'Enter' || e.key === ' '){
                    e.preventDefault();
                    toggleOverlay();
                }
            });
        });

        prev?.addEventListener('click', () => goToSlide(activeIndex - 1, true));
        next?.addEventListener('click', () => goToSlide(activeIndex + 1, true));

        highlightSlider.addEventListener('mouseenter', () => clearInterval(sliderTimer));
        highlightSlider.addEventListener('mouseleave', restartAutoplay);
    }

    const showcaseGrid = document.getElementById('showcase-grid');
    if(showcaseGrid){
        const showcaseItems = [
            {
                type: 'image',
                src: 'images/facility1.jpg',
                title: 'Learning commons redesign',
                description: 'Students collaborate on capstone projects inside the refreshed digital commons.'
            },
            {
                type: 'image',
                src: 'images/carexpo2.jpg',
                title: 'career Expo presentations',
                description: '2025 Career, NCD, Port Moresby'
            },
            {
                type: 'image',
                src: 'images/stdcon2.jpg',
                title: 'New Classroom for the Papua New Guinea Christian Institute of Higher Education',
                description: 'Students introduced to new classroom block with smart technology and flexible seating.'
            },
            {
                type: 'image',
                src: 'images/facilities (3).jpg',
                title: 'Best Learning Environment',
                description: 'Standards Buildings for student.'
            },
           
            {
                type: 'video',
                src: 'videos/bejhistory.mp4',
                embed: false,
                title: 'The expansion of School over the years',
                description: 'The Director of the Waigani Christain College, MP for North Wagi, Hon.Benjmain Mul,visiting the school and giving a brief history of the school and its expansion over the years.'
            }
        ];

        const immersiveOverlay = document.createElement('div');
        immersiveOverlay.className = 'showcase-immersive';
        immersiveOverlay.innerHTML = `
            <div class="showcase-stage" role="dialog" aria-modal="true" aria-label="Expanded gallery item">
                <button class="showcase-close" aria-label="Close gallery">Close</button>
                <div class="media-wrapper"></div>
                <div class="showcase-caption">
                    <h3></h3>
                    <p></p>
                </div>
            </div>
        `;

        document.body.appendChild(immersiveOverlay);

        const mediaWrapper = immersiveOverlay.querySelector('.media-wrapper');
        const caption = immersiveOverlay.querySelector('.showcase-caption');
        const captionTitle = caption?.querySelector('h3');
        const captionDesc = caption?.querySelector('p');
        const closeOverlay = () => immersiveOverlay.classList.remove('active');

        immersiveOverlay.addEventListener('click', (e) => {
            if(e.target === immersiveOverlay){
                closeOverlay();
            }
        });

        immersiveOverlay.querySelector('.showcase-close')?.addEventListener('click', closeOverlay);

        document.addEventListener('keydown', (e) => {
            if(e.key === 'Escape' && immersiveOverlay.classList.contains('active')){
                closeOverlay();
            }
        });

        const openOverlay = (item) => {
            if(!mediaWrapper || !caption || !captionTitle || !captionDesc){
                return;
            }

            mediaWrapper.innerHTML = '';
            let mediaEl;
            if(item.type === 'video'){
                mediaEl = document.createElement(item.embed ? 'iframe' : 'video');
                if(item.embed){
                    mediaEl.src = item.src;
                    mediaEl.title = item.title;
                    mediaEl.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                    mediaEl.allowFullscreen = true;
                } else {
                    mediaEl.controls = true;
                    const source = document.createElement('source');
                    source.src = item.src;
                    source.type = 'video/mp4';
                    mediaEl.appendChild(source);
                }
            } else {
                mediaEl = document.createElement('img');
                mediaEl.src = item.src;
                mediaEl.alt = item.title;
            }

            mediaWrapper.appendChild(mediaEl);

            captionTitle.textContent = item.title;
            captionDesc.textContent = item.description;

            caption.classList.remove('swing-in');
            void caption.offsetWidth;
            caption.classList.add('swing-in');

            immersiveOverlay.classList.add('active');
        };

        const renderShowcase = (filter = 'all') => {
            showcaseGrid.innerHTML = '';
            const filteredItems = showcaseItems.filter(item => filter === 'all' ? true : item.type === filter);
            if(filteredItems.length === 0){
                const message = document.createElement('p');
                message.textContent = 'More media moments are being curated. Please check back soon!';
                showcaseGrid.appendChild(message);
                return;
            }

            filteredItems.forEach(item => {
                const card = document.createElement('article');
                card.className = 'showcase-card';
                let mediaEl;
                if(item.type === 'video'){
                    if(item.embed){
                        mediaEl = document.createElement('iframe');
                        mediaEl.src = item.src;
                        mediaEl.title = item.title;
                        mediaEl.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                        mediaEl.allowFullscreen = true;
                    } else {
                        mediaEl = document.createElement('video');
                        mediaEl.controls = true;
                        const source = document.createElement('source');
                        source.src = item.src;
                        source.type = 'video/mp4';
                        mediaEl.appendChild(source);
                    }
                } else {
                    mediaEl = document.createElement('img');
                    mediaEl.src = item.src;
                    mediaEl.alt = item.title;
                }

                const heading = document.createElement('h3');
                heading.textContent = item.title;
                const desc = document.createElement('p');
                desc.textContent = item.description;

                card.appendChild(mediaEl);
                card.appendChild(heading);
                card.appendChild(desc);
                card.addEventListener('click', () => openOverlay(item));
                showcaseGrid.appendChild(card);
            });
        };

        renderShowcase();

        const tabs = document.querySelectorAll('.filter-tabs .tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(btn => {
                    btn.classList.toggle('active', btn === tab);
                    btn.setAttribute('aria-pressed', btn === tab ? 'true' : 'false');
                });
                renderShowcase(tab.dataset.filter);
            });
        });
    }

    document.querySelectorAll('.view-info').forEach(button => {
        const profileBody = button.closest('.profile-body');
        const details = profileBody ? profileBody.querySelector('.profile-details') : null;
        const icon = button.querySelector('i');

        if(!details){
            return;
        }

        button.addEventListener('click', () => {
            const shouldShow = details.hasAttribute('hidden');
            details.hidden = !shouldShow;
            button.setAttribute('aria-expanded', shouldShow ? 'true' : 'false');
            button.lastChild.textContent = shouldShow ? ' Hide info' : ' View info';
            if(icon){
                icon.classList.toggle('fa-eye', !shouldShow);
                icon.classList.toggle('fa-eye-slash', shouldShow);
            }
        });
    });

    const toggleButtons = document.querySelectorAll('.toggle-requirement');
    toggleButtons.forEach(button => {
        const targetId = button.getAttribute('data-target');
        const target = targetId ? document.getElementById(targetId) : null;
        if(!target){
            return;
        }

        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', targetId);

        button.addEventListener('click', () => {
            const willShow = target.hasAttribute('hidden');
            document.querySelectorAll('.requirement-details').forEach(panel => {
                if(panel !== target){
                    panel.hidden = true;
                }
            });
            target.hidden = !willShow;
            button.setAttribute('aria-expanded', willShow ? 'true' : 'false');
        });
    });
})();
