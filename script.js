"use strict";


/* =========================================================
   ELEMENTS
========================================================= */

const intro =
    document.querySelector(".intro");

const introContent =
    document.querySelector(".intro__content");

const introStripes =
    document.querySelector(".intro__stripes");

const header =
    document.querySelector("#header");

const menuToggle =
    document.querySelector("#menuToggle");

const navigation =
    document.querySelector("#navigation");

const modal =
    document.querySelector("#orderModal");

const modalWindow =
    modal.querySelector(".modal__window");

const openModalButtons =
    document.querySelectorAll(".js-open-modal");

const closeModalButtons =
    document.querySelectorAll("[data-close-modal]");

const productSelect =
    document.querySelector("#productSelect");

const orderForm =
    document.querySelector("#orderForm");

const contactForm =
    document.querySelector("#contactForm");

let lastFocusedElement = null;


/* =========================================================
   INTRO ANIMATION
========================================================= */

function animateIntro() {

    const scrollY =
        window.scrollY;

    const introHeight =
        intro.offsetHeight;

    const progress =
        Math.min(
            Math.max(
                scrollY / introHeight,
                0
            ),
            1
        );


    /*
    Название постепенно увеличивается
    и растворяется при прокрутке.
    */

    introContent.style.opacity =
        String(
            Math.max(
                1 - progress * 1.35,
                0
            )
        );


    introContent.style.transform =
        `
        translateY(${progress * -45}px)
        scale(${1 + progress * 0.1})
        `;


    /*
    Полосы немного увеличиваются.
    */

    introStripes.style.transform =
        `
        scale(${1.03 + progress * 0.07})
        `;


    /*
    Меню появляется ближе
    к окончанию первого экрана.
    */

    if (
        scrollY >
        introHeight * 0.72
    ) {

        header.classList.add(
            "visible"
        );

    } else {

        header.classList.remove(
            "visible"
        );

    }

}


window.addEventListener(
    "scroll",
    animateIntro,
    {
        passive: true
    }
);


animateIntro();


/* =========================================================
   SMOOTH SCROLL
========================================================= */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });


                navigation.classList.remove(
                    "open"
                );


                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }
        );

    });


/* =========================================================
   REVEAL ANIMATION
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );


const revealObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target
                            .classList
                            .add(
                                "visible"
                            );


                        revealObserver
                            .unobserve(
                                entry.target
                            );

                    }

                }
            );

        },

        {
            threshold: 0.08,

            rootMargin:
                "0px 0px -30px 0px"
        }

    );


revealElements.forEach(
    element => {

        revealObserver.observe(
            element
        );

    }
);


/* =========================================================
   MOBILE MENU
========================================================= */

menuToggle.addEventListener(
    "click",
    () => {

        const isOpen =
            navigation
                .classList
                .toggle(
                    "open"
                );


        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    }
);


/* =========================================================
   CATALOG ACCORDION
========================================================= */

const catalogItems =
    document.querySelectorAll(
        ".catalog-item"
    );


catalogItems.forEach(item => {

    const button =
        item.querySelector(
            ".catalog-item__main"
        );


    button.addEventListener(
        "click",
        () => {

            const alreadyOpen =
                item.classList.contains(
                    "open"
                );


            /*
            Закрываем остальные категории.
            */

            catalogItems.forEach(
                otherItem => {

                    otherItem
                        .classList
                        .remove(
                            "open"
                        );


                    const otherButton =
                        otherItem
                            .querySelector(
                                ".catalog-item__main"
                            );


                    otherButton
                        .setAttribute(
                            "aria-expanded",
                            "false"
                        );

                }
            );


            /*
            Если текущая была закрыта —
            открываем её.
            */

            if (!alreadyOpen) {

                item.classList.add(
                    "open"
                );


                button.setAttribute(
                    "aria-expanded",
                    "true"
                );

            }

        }
    );

});


/* =========================================================
   MODAL
========================================================= */

function openModal(
    product = ""
) {

    lastFocusedElement =
        document.activeElement;


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );


    /*
    Если нажали кнопку заказа
    внутри определённой категории,
    автоматически выбираем продукт.
    */

    if (
        product &&
        productSelect
    ) {

        productSelect.value =
            product;

    }


    setTimeout(
        () => {

            const firstField =
                modal.querySelector(
                    "input, select, textarea, button"
                );


            firstField?.focus();

        },
        100
    );

}


function closeModal() {

    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );


    if (lastFocusedElement) {

        lastFocusedElement.focus();

    }

}


/* OPEN BUTTONS */

openModalButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            event => {

                /*
                Не даём клику случайно
                переключить accordion.
                */

                event.stopPropagation();


                const product =
                    button.dataset.product ||
                    "";


                openModal(
                    product
                );

            }
        );

    }
);


/* CLOSE BUTTONS */

closeModalButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            closeModal
        );

    }
);


/* ESC CLOSE */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            modal.classList.contains(
                "active"
            )
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   MODAL FOCUS TRAP
========================================================= */

modal.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Tab"
        ) {
            return;
        }


        const focusable =
            modalWindow
                .querySelectorAll(
                    `
                    button,
                    input,
                    select,
                    textarea,
                    a[href],
                    [tabindex]:not([tabindex="-1"])
                    `
                );


        if (!focusable.length) {
            return;
        }


        const first =
            focusable[0];


        const last =
            focusable[
                focusable.length - 1
            ];


        if (
            event.shiftKey &&
            document.activeElement ===
            first
        ) {

            event.preventDefault();

            last.focus();

        }


        else if (
            !event.shiftKey &&
            document.activeElement ===
            last
        ) {

            event.preventDefault();

            first.focus();

        }

    }
);


/* =========================================================
   FORM VALIDATION
========================================================= */

function clearError(field) {

    const wrapper =
        field.closest(
            ".form-field"
        );


    const error =
        wrapper?.querySelector(
            ".form-error"
        );


    wrapper?.classList.remove(
        "invalid"
    );


    if (error) {

        error.textContent =
            "";

    }

}


function showError(
    field,
    message
) {

    const wrapper =
        field.closest(
            ".form-field"
        );


    const error =
        wrapper?.querySelector(
            ".form-error"
        );


    wrapper?.classList.add(
        "invalid"
    );


    if (error) {

        error.textContent =
            message;

    }

}


/* PHONE */

function validatePhone(phone) {

    const digits =
        phone.replace(
            /\D/g,
            ""
        );


    return (
        digits.length >= 10 &&
        digits.length <= 12
    );

}


/* NAME */

function validateName(name) {

    return (
        name.trim().length >= 2
    );

}


/* WHOLE FORM */

function validateForm(form) {

    let isValid =
        true;


    const requiredFields =
        form.querySelectorAll(
            "[required]"
        );


    requiredFields.forEach(
        field => {

            clearError(
                field
            );


            if (
                !field.value.trim()
            ) {

                showError(
                    field,
                    "Заполните это поле"
                );


                isValid =
                    false;


                return;

            }


            /*
            Проверка телефона
            */

            if (
                field.type ===
                "tel"
            ) {

                if (
                    !validatePhone(
                        field.value
                    )
                ) {

                    showError(
                        field,
                        "Введите корректный номер телефона"
                    );


                    isValid =
                        false;

                }

            }


            /*
            Проверка имени
            */

            if (
                field.name ===
                "name"
            ) {

                if (
                    !validateName(
                        field.value
                    )
                ) {

                    showError(
                        field,
                        "Введите имя"
                    );


                    isValid =
                        false;

                }

            }

        }
    );


    return isValid;

}


/* =========================================================
   REMOVE ERRORS WHILE TYPING
========================================================= */

document
    .querySelectorAll(
        "input, textarea, select"
    )
    .forEach(
        field => {

            field.addEventListener(
                "input",
                () => {

                    clearError(
                        field
                    );

                }
            );

            field.addEventListener(
                "change",
                () => {

                    clearError(
                        field
                    );

                }
            );

        }
    );


/* =========================================================
   ORDER FORM
========================================================= */

orderForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const success =
            document.querySelector(
                "#orderSuccess"
            );


        success.textContent =
            "";


        if (
            !validateForm(
                orderForm
            )
        ) {

            const firstInvalid =
                orderForm.querySelector(
                    ".invalid input, .invalid select, .invalid textarea"
                );


            firstInvalid?.focus();


            return;

        }


        success.textContent =
            "Спасибо! Заявка принята. Мы скоро свяжемся с вами.";


        orderForm.reset();


        setTimeout(
            () => {

                success.textContent =
                    "";


                closeModal();

            },
            2500
        );

    }
);


/* =========================================================
   CONTACT FORM
========================================================= */

contactForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const success =
            document.querySelector(
                "#contactSuccess"
            );


        success.textContent =
            "";


        if (
            !validateForm(
                contactForm
            )
        ) {

            const firstInvalid =
                contactForm.querySelector(
                    ".invalid input, .invalid textarea"
                );


            firstInvalid?.focus();


            return;

        }


        success.textContent =
            "Спасибо! Сообщение отправлено.";


        contactForm.reset();

    }
);


/* =========================================================
   MINIMUM DATE
========================================================= */

const orderDate =
    document.querySelector(
        "#orderDate"
    );


if (orderDate) {

    const today =
        new Date();


    const localDate =
        new Date(
            today.getTime() -
            today.getTimezoneOffset()
            * 60000
        )
            .toISOString()
            .split("T")[0];


    orderDate.min =
        localDate;

}