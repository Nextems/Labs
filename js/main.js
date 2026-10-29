"use strict";

// Лабораторна №5: лише зміна станів уже наявних HTML-елементів.
const detailsButton = document.querySelector(".details-toggle");
const details = document.querySelector("#extra-details");

detailsButton.addEventListener("click", () => {
    const isHidden = details.classList.toggle("is-hidden");
    detailsButton.textContent = isHidden ? "Більше про сервіс" : "Приховати опис";
    detailsButton.setAttribute("aria-expanded", String(!isHidden));
});

// У версії №5 кнопки послуг уже записані в HTML, без генерації даних.
const staticServices = document.querySelector(".feature-list");
staticServices?.addEventListener("click", (event) => {
    const button = event.target.closest(".favorite-button");
    if (!button) return;
    const service = button.closest("li");
    const title = service.querySelector("strong").textContent.replace(/\.$/, "");
    const isActive = button.classList.toggle("is-active");
    service.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    button.textContent = isActive ? "Видалити з обраного" : "В обране";
    button.setAttribute("aria-label", `${isActive ? "Видалити з обраного" : "Додати в обране"}: ${title}`);
    document.querySelector("#favorite-status").textContent =
        `${title}: ${isActive ? "додано в обране" : "видалено з обраного"}.`;
});

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-nav");

function closeMenu() {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "Меню";
}

menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "Закрити меню" : "Меню";
});

navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("is-open")) {
        closeMenu();
        menuButton.focus();
    }
});

window.matchMedia("(min-width: 64rem)").addEventListener("change", closeMenu);
