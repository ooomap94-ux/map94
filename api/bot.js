const fetch = require("node-fetch");

const TOKEN = process.env.BOT_TOKEN;
const MANAGER_CHAT_ID = process.env.MANAGER_CHAT_ID || "";

const API = `https://api.telegram.org/bot${TOKEN}`;

async function telegram(method, body) {
  const res = await fetch(`${API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!data.ok) {
    console.error(`Telegram API error in ${method}:`, data);
  }

  return data;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function mainMenu() {
  return {
    inline_keyboard: [
      [
        {
          text: "🌐 Открыть меню",
          web_app: { url: "https://map94.vercel.app/webapp.html" }
        }
      ]
    ]
  };
}

async function sendMessage(chat_id, text, reply_markup = null) {
  return telegram("sendMessage", {
    chat_id,
    text,
    parse_mode: "HTML",
    reply_markup
  });
}

async function editMessage(chat_id, message_id, text, reply_markup = null) {
  return telegram("editMessageText", {
    chat_id,
    message_id,
    text,
    parse_mode: "HTML",
    reply_markup
  });
}

async function answerCallbackQuery(callback_query_id) {
  return telegram("answerCallbackQuery", {
    callback_query_id
  });
}

function buildUserBlock(user) {
  const fullName = `${user?.first_name || "-"} ${user?.last_name || ""}`.trim();
  const username = user?.username ? `@${user.username}` : "-";
  const userId = user?.id || "-";

  return (
    `<b>Клиент:</b> ${escapeHtml(fullName)}\n` +
    `<b>Username:</b> ${escapeHtml(username)}\n` +
    `<b>User ID:</b> ${escapeHtml(userId)}\n`
  );
}

function buildOrderMessage(user, data) {
  return (
    `<b>📥 Новая заявка из Web App</b>\n\n` +
    buildUserBlock(user) +
    `\n` +
    `<b>Имя в форме:</b> ${escapeHtml(data.name || "-")}\n` +
    `<b>Телефон:</b> ${escapeHtml(data.phone || "-")}\n` +
    `<b>Товар:</b> ${escapeHtml(data.product || "-")}\n` +
    `<b>Размер / марка / фасовка:</b> ${escapeHtml(data.size || "-")}\n` +
    `<b>Количество:</b> ${escapeHtml(data.quantity || "-")}\n` +
    `<b>Город доставки:</b> ${escapeHtml(data.city || "-")}\n` +
    `<b>Комментарий:</b> ${escapeHtml(data.comment || "-")}`
  );
}

function buildPriceRequestMessage(user) {
  return (
    `<b>📄 Запрос прайс-листа</b>\n\n` +
    buildUserBlock(user)
  );
}

function buildPlainUserMessage(user, text) {
  return (
    `<b>✉️ Новое сообщение от пользователя</b>\n\n` +
    buildUserBlock(user) +
    `\n` +
    `<b>Сообщение:</b>\n${escapeHtml(text || "-")}`
  );
}

module.exports = async (req, res) => {
  if (req.method === "GET") {
    return res.status(200).send("MAP bot is working");
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const update = req.body;

    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const text = msg.text || "";
      const user = msg.from;

      if (msg.web_app_data?.data) {
        const raw = msg.web_app_data.data;

        let data = {};
        try {
          data = JSON.parse(raw);
        } catch (e) {
          data = { raw };
        }

        if (MANAGER_CHAT_ID) {
          if (data.type === "price_request") {
            await sendMessage(
              MANAGER_CHAT_ID,
              buildPriceRequestMessage(user)
            );
          } else {
            await sendMessage(
              MANAGER_CHAT_ID,
              buildOrderMessage(user, data)
            );
          }
        }

        await sendMessage(
          chatId,
          `Ваша заявка отправлена менеджеру. Мы скоро свяжемся с вами.\n\nВы можете снова открыть меню по кнопке ниже:`,
          mainMenu()
        );

        return res.status(200).json({ ok: true });
      }

      if (text === "/start") {
        await sendMessage(
          chatId,
          `<b>Добро пожаловать в MAP</b>\n\n` +
            `ООО «МАР»\n` +
            `Металлопрокат в ассортименте, чёрный и нержавеющий прокат.\n\n` +
            `В нашем Web App вы можете:\n` +
            `• открыть актуальный прайс-лист\n` +
            `• оставить заявку на заказ\n` +
            `• связаться с менеджером\n` +
            `• посмотреть информацию о компании\n` +
            `• открыть контакты фирмы\n\n` +
            `<b>Контакты:</b>\n` +
            `🌐 mapgroup.uz\n` +
            `📢 t.me/ooomap\n` +
            `✉️ mapgroup94@gmail.com\n` +
            `☎️ +998712549495\n` +
            `☎️ +998712557674\n` +
            `📱 +998908051884\n` +
            `📍 г. Ташкент, ул. Бабура 87/1Б\n` +
            `Ориентир: Аэропорт Корзинка\n\n` +
            `Нажмите кнопку ниже, чтобы открыть меню:`,
          mainMenu()
        );

        return res.status(200).json({ ok: true });
      }

      if (text && MANAGER_CHAT_ID) {
        await sendMessage(
          MANAGER_CHAT_ID,
          buildPlainUserMessage(user, text)
        );
      }

      await sendMessage(
        chatId,
        `Ваше сообщение принято. Менеджер свяжется с вами.\n\nДля работы с каталогом и заявками откройте меню ниже:`,
        mainMenu()
      );

      return res.status(200).json({ ok: true });
    }

    if (update.callback_query) {
      const cq = update.callback_query;
      const data = cq.data;
      const chatId = cq.message.chat.id;
      const messageId = cq.message.message_id;

      await answerCallbackQuery(cq.id);

      if (data === "main_menu") {
        await editMessage(
          chatId,
          messageId,
          `<b>Добро пожаловать в MAP</b>\n\n` +
            `ООО «МАР»\n` +
            `Металлопрокат в ассортименте, чёрный и нержавеющий прокат.\n\n` +
            `Нажмите кнопку ниже, чтобы открыть меню компании:`,
          mainMenu()
        );
      }

      return res.status(200).json({ ok: true });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("BOT ERROR:", error);
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};
