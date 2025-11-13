document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggleButton ? themeToggleButton.querySelector('i') : null;

    function applyTheme(theme) {
        body.classList.remove('dark-theme', 'light-theme');
        body.classList.add(theme);
        localStorage.setItem('theme', theme);
        if (themeIcon) {
            themeIcon.className = theme === 'dark-theme' ? 'fas fa-sun' : 'fas fa-moon';
        }
        if (themeToggleButton) {
            themeToggleButton.setAttribute('aria-label', theme === 'dark-theme' ? 'Включить светлую тему' : 'Включить темную тему');
        }
    }

    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        currentTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-theme' : 'light-theme';
    }
    applyTheme(currentTheme);

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
            applyTheme(newTheme);
        });
    }

    function setupExpandableContent(containerSelector, buttonSelector, contentSelector) {
        const containers = document.querySelectorAll(containerSelector);
        containers.forEach(container => {
            const button = container.querySelector(buttonSelector);
            const content = container.querySelector(contentSelector);
            if (button && content) {
                button.addEventListener('click', () => {
                    const isExpanded = content.classList.toggle('expanded');
                    button.textContent = isExpanded ? 'Скрыть' : (container.classList.contains('project-card') ? 'Подробнее' : 'Читать далее');
                    button.setAttribute('aria-expanded', isExpanded);
                });
            }
        });
    }
    if (document.getElementById('portfolio-page')) {
        setupExpandableContent('.project-card', '.details-btn', '.project-details');
    }
    if (document.getElementById('blog-page')) {
        setupExpandableContent('.article-card', '.read-more-btn', '.article-full-content');
    }

    document.querySelectorAll('.hide-card-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            if (card) {
                card.style.display = 'none';
            }
        });
    });

    document.querySelectorAll('.hide-block-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetSelector = button.dataset.target;
            if (targetSelector) {
                const targetElement = document.querySelector(targetSelector);
                if (targetElement) {
                    const isHidden = targetElement.style.display === 'none';
                    targetElement.style.display = isHidden ? '' : 'none';
                    const blockName = button.textContent.includes('Показать') ? 
                                      button.textContent.replace('Показать ', '') : 
                                      button.textContent.replace('Скрыть ', '');
                    button.textContent = isHidden ? `Скрыть ${blockName}` : `Показать ${blockName}`;
                }
            }
        });
    });

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const formStatus = document.getElementById('form-status');

 
    contactForm.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
        });
    });

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        let isValid = true;


        this.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        this.querySelectorAll('input, textarea, select').forEach(el => {
            el.style.borderColor = '';
            el.removeAttribute('aria-invalid');
        });
        
        if (formStatus) {
            formStatus.textContent = '';
            formStatus.className = '';
        }


        const fieldsToValidate = [
            document.getElementById('name'),
            document.getElementById('email'),
            document.getElementById('service'),
            document.getElementById('message')
        ];

        fieldsToValidate.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            if (formStatus) {
                formStatus.textContent = 'Сообщение успешно отправлено! (Это демо-режим, данные не уходят на сервер).';
                formStatus.className = 'success';
            }
            setTimeout(() => {
                contactForm.reset();
                if (formStatus) {
                    formStatus.textContent = '';
                    formStatus.className = '';
                }
            }, 3000);
        } else {
            if (formStatus) {
                formStatus.textContent = 'Пожалуйста, исправьте ошибки в форме и попробуйте снова.';
                formStatus.className = 'error';
            }
        }
    });

    function validateField(field) {
        let isValid = true;
        const errorContainer = field.closest('.form-group');
        const errorElement = errorContainer ? errorContainer.querySelector('.error-message') : null;


        if (field.required && !field.value.trim()) {
            displayError(field, 'Это поле обязательно для заполнения.');
            isValid = false;
        }

        else if (field.pattern && !new RegExp(field.pattern).test(field.value)) {
            displayError(field, field.title || 'Пожалуйста, введите корректные данные.');
            isValid = false;
        }

        else if (field.minLength && field.value.length < field.minLength) {
            displayError(field, field.title || `Минимальная длина: ${field.minLength} символов.`);
            isValid = false;
        }

        else if (field.tagName === 'SELECT' && field.value === "") {
            displayError(field, 'Пожалуйста, выберите тему обращения.');
            isValid = false;
        }

        else if (errorElement) {
            errorElement.textContent = '';
            field.style.borderColor = '';
            field.removeAttribute('aria-invalid');
        }

        return isValid;
    }

    function displayError(inputElement, message) {
        const errorContainer = inputElement.closest('.form-group');
        if (!errorContainer) return;
        const errorElement = errorContainer.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
        }
        inputElement.style.borderColor = 'var(--accent-color)';
        inputElement.setAttribute('aria-invalid', 'true');
    }
}

    const navLinks = document.querySelectorAll('header nav ul li a');
    const currentPath = window.location.pathname.split("/").pop() || 'index.html';

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = link.getAttribute('href').split("/").pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
});