const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();

  try {
    tg.setHeaderColor("#f8fafc");
    tg.setBackgroundColor("#eef2f6");
  } catch (e) {
    console.log("Telegram WebApp styles not applied:", e);
  }
}

const PRICE_URL = "https://drive.google.com/drive/folders/1Hxsm1rJMQH8j9zVVU_VKeEWl3i2ZQ0dH?usp=sharing";

const categoryButtons = document.querySelectorAll(".tile");
const productInput = document.getElementById("product");
const sendBtn = document.getElementById("sendBtn");

const goOrderBtn = document.getElementById("goOrderBtn");
const priceLinkBtn = document.getElementById("priceLinkBtn");
const contactsManagersBtn = document.getElementById("contactsManagersBtn");
const openManagersBtn = document.getElementById("openManagersBtn");

const openAboutBtn = document.getElementById("openAboutBtn");
const openStaffBtn = document.getElementById("openStaffBtn");
const openFirmContactsBtn = document.getElementById("openFirmContactsBtn");

const catalogSection = document.getElementById("catalogSection");
const orderSection = document.getElementById("orderSection");

const modal = document.getElementById("modal");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");

function scrollToSection(element) {
  if (!element) return;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openModal(title, html) {
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  modal.classList.add("modal--open");
  document.body.classList.add("body--locked");
}

function closeModal() {
  modal.classList.remove("modal--open");
  document.body.classList.remove("body--locked");
}

modalOverlay?.addEventListener("click", closeModal);
modalClose?.addEventListener("click", closeModal);

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((btn) => btn.classList.remove("tile--accent"));
    button.classList.add("tile--accent");

    const category = button.dataset.category;
    if (productInput) {
      productInput.value = category;
    }

    scrollToSection(orderSection);
  });
});


goOrderBtn?.addEventListener("click", () => {
  scrollToSection(orderSection);
});

priceLinkBtn?.addEventListener("click", () => {
  if (tg?.openLink) {
    tg.openLink(PRICE_URL);
  } else {
    window.open(PRICE_URL, "_blank");
  }
});

const staffHtml = `
  <div class="modal-card-list">
    <div class="modal-card">
      <div class="modal-person__name">Агзамходжаев Саидкомил Саидматлабович</div>
      <div class="modal-person__role">Генеральный директор ООО «МАР»</div>
      <div class="modal-person__meta">Телефон: +99898 124 99 95</div>
    </div>

    <div class="modal-card">
      <div class="modal-person__name">Усманов Дилшод Джасурович</div>
      <div class="modal-person__role">Заместитель генерального директора ООО «МАР»</div>
      <div class="modal-person__meta">Телефон: +99893 384 88 80</div>
    </div>

    <div class="modal-card">
      <div class="modal-person__name">Ахмедходжаева Дилёра Рахимовна</div>
      <div class="modal-person__role">Менеджер по продажам ООО «МАР»</div>
      <div class="modal-person__meta">Телефон: +99890 805 18 84</div>
      <div class="modal-person__meta">Telegram: @mapgroup94</div>
    </div>

    <div class="modal-card">
      <div class="modal-person__name">Тухбатуллина Зайтуна Фатыховна</div>
      <div class="modal-person__role">Главный бухгалтер ООО «МАР»</div>
      <div class="modal-person__meta">Телефон: +99897 750 95 56</div>
    </div>

    <div class="modal-card">
      <div class="modal-person__name">Носиров Козим Аскархужа угли</div>
      <div class="modal-person__role">Заведующий склада</div>
      <div class="modal-person__meta">Телефон: +99899 859 95 21</div>
    </div>
  </div>
`;

const aboutHtml = `
  <div class="modal-card">
    <p class="modal-text">
      <strong>ООО «MAP»</strong> — один из надёжных поставщиков металлопроката на рынке Узбекистана
      с более чем <strong>30-летним опытом работы</strong>. Компания специализируется на оптовых поставках
      металлопродукции со склада в городе Ташкенте.
    </p>

    <p class="modal-text">
      В ассортименте представлены листы, трубы, круги, арматура, швеллеры и другие виды металлопроката
      от производителей стран СНГ и Европы.
    </p>

    <p class="modal-text">
      Также в продаже имеется <strong>каустическая сода (NaOH)</strong> китайского производства
      с массовой долей гидроксида натрия не менее <strong>98%</strong>, фасовка по <strong>25 кг</strong>.
    </p>

    <p class="modal-text">
      Мы поставляем продукцию как со склада, так и под заказ — от небольших партий до крупных объёмов.
      Вся продукция соответствует требованиям качества, имеет сертификаты и может реализовываться
      через биржевые торги.
    </p>
  </div>
`;

const firmContactsHtml = `
  <div class="modal-card-list">
    <div class="modal-card">
      <div class="modal-contact-row">
        <span class="modal-contact-label">Компания</span>
        <span class="modal-contact-value">ООО «MAP»</span>
      </div>

      <div class="modal-contact-row">
        <span class="modal-contact-label">Город</span>
        <span class="modal-contact-value">Ташкент, Узбекистан</span>
      </div>

      <div class="modal-contact-row">
        <span class="modal-contact-label">Раб.</span>
        <span class="modal-contact-value">+998 71 254 94 95</span>
      </div>

      <div class="modal-contact-row">
        <span class="modal-contact-label">Раб.</span>
        <span class="modal-contact-value">+998 71 255 76 74</span>
      </div>

      <div class="modal-contact-row">
        <span class="modal-contact-label">Моб.</span>
        <span class="modal-contact-value">+998 90 805 18 84</span>
      </div>

      <div class="modal-contact-row">
        <span class="modal-contact-label">Telegram</span>
        <span class="modal-contact-value">@mapgroup94</span>
      </div>
    </div>
  </div>
`;

contactsManagersBtn?.addEventListener("click", () => {
  openModal("Сотрудники", staffHtml);
});

openManagersBtn?.addEventListener("click", () => {
  openModal("Сотрудники", staffHtml);
});

openAboutBtn?.addEventListener("click", () => {
  openModal("О компании", aboutHtml);
});

openStaffBtn?.addEventListener("click", () => {
  openModal("Сотрудники", staffHtml);
});

openFirmContactsBtn?.addEventListener("click", () => {
  openModal("Контакты фирмы", firmContactsHtml);
});

sendBtn?.addEventListener("click", () => {
  const name = document.getElementById("name")?.value.trim() || "";
  const phone = document.getElementById("phone")?.value.trim() || "";
  const product = document.getElementById("product")?.value.trim() || "";
  const size = document.getElementById("size")?.value.trim() || "";
  const quantity = document.getElementById("quantity")?.value.trim() || "";
  const city = document.getElementById("city")?.value.trim() || "";
  const comment = document.getElementById("comment")?.value.trim() || "";

  if (!product || !quantity) {
    if (tg?.showAlert) {
      tg.showAlert("Заполните хотя бы товар и количество");
    } else {
      alert("Заполните хотя бы товар и количество");
    }
    return;
  }

  const data = {
    type: "order_request",
    name,
    phone,
    product,
    size,
    quantity,
    city,
    comment
  };

  if (tg) {
    tg.sendData(JSON.stringify(data));
    if (tg.showAlert) {
      tg.showAlert("Заявка отправлена менеджеру");
    }
  } else {
    console.log("Отправка данных:", data);
    alert("Заявка сформирована");
  }
});
