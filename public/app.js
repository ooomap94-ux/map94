
const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const productInput = document.getElementById("product");
const sizeInput = document.getElementById("size");
const quantityInput = document.getElementById("quantity");
const cityInput = document.getElementById("city");
const commentInput = document.getElementById("comment");
const sendBtn = document.getElementById("sendBtn");

document.querySelectorAll(".category").forEach((btn) => {
  btn.addEventListener("click", () => {
    productInput.value = btn.textContent.trim();
  });
});

sendBtn.addEventListener("click", () => {
  const data = {
    product: productInput.value.trim(),
    size: sizeInput.value.trim(),
    quantity: quantityInput.value.trim(),
    city: cityInput.value.trim(),
    comment: commentInput.value.trim()
  };

  if (!data.product || !data.quantity) {
    tg.showAlert("Заполните хотя бы товар и количество");
    return;
  }

  tg.sendData(JSON.stringify(data));
  tg.close();
});
