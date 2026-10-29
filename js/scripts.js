"use strict";

// Лабораторна №6: локальні дані. Фото вже було в початковому проєкті.
const services = [
    { id: 1, title: "Комп’ютерна діагностика", category: "diagnostics", description: "Перевірка електронних систем і пошук помилок двигуна.", image: "static/images/image.png" },
    { id: 2, title: "Діагностика ходової частини", category: "diagnostics", description: "Огляд підвіски, амортизаторів та рульового керування.", image: "static/images/image.png" },
    { id: 3, title: "Заміна мастила та фільтра", category: "maintenance", description: "Планове обслуговування двигуна: нове моторне мастило й масляний фільтр.", image: "static/images/image.png" },
    { id: 4, title: "Заміна технічних рідин", category: "maintenance", description: "Оновлення охолоджувальної та гальмівної рідини за регламентом автомобіля.", image: "static/images/image.png" },
    { id: 5, title: "Ремонт двигуна", category: "repair", description: "Заміна ременя ГРМ, усунення витоків та ремонт вузлів двигуна.", image: "static/images/image.png" },
    { id: 6, title: "Заміна гальмівних колодок", category: "repair", description: "Обслуговування гальмівної системи, перевірка дисків і заміна колодок.", image: "static/images/image.png" },
    { id: 7, title: "Розвал-сходження", category: "wheels", description: "Регулювання кутів установлення коліс на сучасному 3D-обладнанні.", image: "static/images/image.png" },
    { id: 8, title: "Шиномонтаж і балансування", category: "wheels", description: "Сезонна заміна шин, балансування чотирьох коліс та перевірка тиску.", image: "static/images/image.png" },
    { id: 9, title: "Оцінка після ДТП", category: "Оцінка", description: "Аналіз після дтп, оцінка шкоди для страхової компанії.", image: "static/images/image.png" }
];

const categoryLabels = {
    diagnostics: "Діагностика",
    maintenance: "Технічне обслуговування",
    repair: "Ремонт",
    wheels: "Колеса"
};

const grid = document.querySelector("#service-grid");
const searchInput = document.querySelector("#service-search");
const categorySelect = document.querySelector("#category-filter");
const resultsCount = document.querySelector("#results-count");
const emptyMessage = document.querySelector("#empty-message");
const resetButton = document.querySelector("#reset-filters");
const favoritesOnly = document.querySelector("#favorites-only");
const favoriteStatus = document.querySelector("#favorite-status");
// Зберігаємо ID незалежно від поточного набору відфільтрованих карток.
const favoriteIds = new Set();

// innerHTML отримує лише статичні дані розробника, без введеного користувачем тексту.
function createCard(service) {
    const isFavorite = favoriteIds.has(service.id);
    return `
        <article class="service-card${isFavorite ? " is-active" : ""}" data-id="${service.id}">
            <div class="service-card__content">
                <p class="service-card__category">${categoryLabels[service.category]}</p>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <button class="favorite-button button${isFavorite ? " is-active" : ""}"
                    type="button" aria-pressed="${isFavorite}"
                    aria-label="${isFavorite ? "Видалити з обраного" : "Додати в обране"}: ${service.title}">
                    ${isFavorite ? "Видалити з обраного" : "В обране"}
                </button>
            </div>
        </article>`;
}

function renderItems(itemsToRender) {
    grid.innerHTML = itemsToRender.map(createCard).join("");
    resultsCount.textContent = `Знайдено послуг: ${itemsToRender.length} із ${services.length}`;
    emptyMessage.classList.toggle("is-hidden", itemsToRender.length !== 0);
}

function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCategory = categorySelect.value;
    const filteredServices = services.filter((service) => {
        const searchableText = `${service.title} ${service.description}`.toLowerCase();
        const matchesText = searchableText.includes(query);
        const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
        const matchesFavorites = !favoritesOnly.checked || favoriteIds.has(service.id);
        return matchesText && matchesCategory && matchesFavorites;
    });
    renderItems(filteredServices);
}

searchInput.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);
favoritesOnly.addEventListener("change", applyFilters);
grid.addEventListener("click", (event) => {
    const button = event.target.closest(".favorite-button");
    if (!button) return;
    const card = button.closest(".service-card");
    const id = Number(card.dataset.id);
    const isFavorite = !favoriteIds.has(id);
    if (isFavorite) favoriteIds.add(id);
    else favoriteIds.delete(id);

    favoriteStatus.textContent = `Обрано послуг: ${favoriteIds.size}. Вибір діє до перезавантаження сторінки.`;
    // Оновлюємо поточний вузол, щоб клавіатурний фокус залишався на кнопці.
    card.classList.toggle("is-active", isFavorite);
    button.classList.toggle("is-active", isFavorite);
    button.setAttribute("aria-pressed", String(isFavorite));
    button.textContent = isFavorite ? "Видалити з обраного" : "В обране";
    button.setAttribute("aria-label", `${isFavorite ? "Видалити з обраного" : "Додати в обране"}: ${card.querySelector("h3").textContent}`);
    if (favoritesOnly.checked && !isFavorite) {
        applyFilters();
        const nextButton = grid.querySelector(".favorite-button");
        (nextButton || favoritesOnly).focus();
    }
});
resetButton.addEventListener("click", () => {
    searchInput.value = "";
    categorySelect.value = "all";
    favoritesOnly.checked = false;
    applyFilters();
    searchInput.focus();
});

renderItems(services);
