const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();

  try {
    tg.setHeaderColor("#0f172a");
    tg.setBackgroundColor("#0b1220");
  } catch (e) {
    console.log("Telegram WebApp styles not applied:", e);
  }
}

const categoryButtons = document.querySelectorAll(".tile");
const productInput = document.getElementById("product");
const sendBtn = document.getElementById("sendBtn");
const contactBtn = document.getElementById("contactBtn");

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((btn) => btn.classList.remove("tile--accent"));
    button.classList.add("tile--accent");

    const category = button.dataset.category;
    if (productInput) {
      productInput.value = category;
    }
  });
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
  } else {
    console.log("Отправка данных:", data);
    alert("Заявка сформирована");
  }
});

contactBtn?.addEventListener("click", () => {
  const username = "map94bot";
  const url = `https://t.me/${username}`;

  if (tg?.openTelegramLink) {
    tg.openTelegramLink(url);
  } else if (tg?.openLink) {
    tg.openLink(url);
  } else {
    window.open(url, "_blank");
  }
});
