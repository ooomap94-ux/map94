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

const categoryButtons = document.querySelectorAll(".tile");
const productInput = document.getElementById("product");
const sendBtn = document.getElementById("sendBtn");
const contactBtn = document.getElementById("contactBtn");
const goCatalogBtn = document.getElementById("goCatalogBtn");
const goOrderBtn = document.getElementById("goOrderBtn");
const stockBtn = document.getElementById("stockBtn");
const priceBtn = document.getElementById("priceBtn");
const catalogSection = document.getElementById("catalogSection");
const orderSection = document.getElementById("orderSection");

const STOCK_URL = "https://drive.google.com/drive/folders/1Hxsm1rJMQH8j9zVVU_VKeEWl3i2ZQ0dH?usp=sharing";

function scrollToSection(element) {
  if (!element) return;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

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

goCatalogBtn?.addEventListener("click", () => {
  scrollToSection(catalogSection);
});

goOrderBtn?.addEventListener("click", () => {
  scrollToSection(orderSection);
});

stockBtn?.addEventListener("click", () => {
  if (tg?.openLink) {
    tg.openLink(STOCK_URL);
  } else {
    window.open(STOCK_URL, "_blank");
  }
});

priceBtn?.addEventListener("click", () => {
  const data = {
    type: "price_request",
    text: "Клиент запросил прайс-лист"
  };

  if (tg) {
    tg.sendData(JSON.stringify(data));
    if (tg.showAlert) {
      tg.showAlert("Запрос на прайс-лист отправлен менеджеру");
    }
  } else {
    console.log("Запрос прайс-листа:", data);
    alert("Запрос на прайс-лист отправлен");
  }
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

contactBtn?.addEventListener("click", () => {
  const username = "mapgroup94";
  const url = `https://t.me/${username}`;

  if (tg?.openTelegramLink) {
    tg.openTelegramLink(url);
  } else if (tg?.openLink) {
    tg.openLink(url);
  } else {
    window.open(url, "_blank");
  }
});
