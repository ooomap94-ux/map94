const fetch = require("node-fetch");

const TOKEN = process.env.BOT_TOKEN;
const MANAGER_CHAT_ID = process.env.MANAGER_CHAT_ID || "";
const PRICE_URL = process.env.PRICE_URL || "https://drive.google.com/";
const COMPANY_PHONE = process.env.COMPANY_PHONE || "+998901234567";
const COMPANY_TELEGRAM = process.env.COMPANY_TELEGRAM || "https://t.me/yourmanager";
const COMPANY_ADDRESS = process.env.COMPANY_ADDRESS || "Ташкент, Узбекистан";

const API = `https://api.telegram.org/bot${TOKEN}`;

async function telegram(method, body) {
  const res = await fetch(`${API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

function mainMenu() {
  return {
    inline_keyboard: [
      [{ text: "🌐 Открыть Web App", web_app: { url: "https://map94.vercel.app/webapp.html" } }],
      [{ text: "🏢 О компании", callback_data: "about" }],
      [{ text: "📦 Каталог продукции", callback_data: "catalog" }],
      [{ text: "📍 Со склада", callback_data: "stock" }],
      [{ text: "🚚 Под заказ", callback_data: "custom_order" }],
      [{ text: "📄 Прайс-лист", url: PRICE_URL }],
      [{ text: "📞 Контакты", callback_data: "contacts" }],
      [{ text: "✉️ Связаться с менеджером", callback_data: "manager" }]
    ]
  };
}

function backToMain() {
  return {
    inline_keyboard: [
      [{ text: "⬅️ Назад в главное меню", callback_data: "main_menu" }]
    ]
  };
}

function catalogMenu() {
  return {
    inline_keyboard: [
      [{ text: "⚙️ Металлопрокат", callback_data: "metal" }],
      [{ text: "🧪 Химическая продукция", callback_data: "chemistry" }],
      [{ text: "📄 Открыть прайс-лист", url: PRICE_URL }],
      [{ text: "⬅️ Назад", callback_data: "main_menu" }]
    ]
  };
}

function metalMenu() {
  return {
    inline_keyboard: [
      [{ text: "Круги", callback_data: "metal_circles" }],
      [{ text: "Швеллера", callback_data: "metal_channels" }],
      [{ text: "Листы", callback_data: "metal_sheets" }],
      [{ text: "Трубы", callback_data: "metal_pipes" }],
      [{ text: "Арматура", callback_data: "metal_rebar" }],
      [{ text: "Уголки", callback_data: "metal_angles" }],
      [{ text: "⬅️ Назад в каталог", callback_data: "catalog" }]
    ]
  };
}

function chemistryMenu() {
  return {
    inline_keyboard: [
      [{ text: "Каустическая сода", callback_data: "chem_caustic" }],
      [{ text: "Другие химические позиции", callback_data: "chem_other" }],
      [{ text: "⬅️ Назад в каталог", callback_data: "catalog" }]
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

module.exports = async (req, res) => {
  if (req.method === "GET") {
    return res.status(200).send("MAP94 bot is working");
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const update = req.body;

    // Обработка обычных сообщений
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const text = msg.text || "";
      const user = msg.from;
if (msg.web_app_data) {
  const raw = msg.web_app_data.data;

  let data = {};
  try {
    data = JSON.parse(raw);
  } catch (e) {
    data = { raw };
  }

  if (MANAGER_CHAT_ID) {
    await sendMessage(
      MANAGER_CHAT_ID,
      `<b>Новая заявка из Web App</b>\n\n` +
      `<b>Имя:</b> ${user.first_name || "-"} ${user.last_name || ""}\n` +
      `<b>Username:</b> ${user.username ? "@" + user.username : "-"}\n` +
      `<b>User ID:</b> ${user.id}\n\n` +
      `<b>Товар:</b> ${data.product || "-"}\n` +
      `<b>Размер / марка:</b> ${data.size || "-"}\n` +
      `<b>Количество:</b> ${data.quantity || "-"}\n` +
      `<b>Город:</b> ${data.city || "-"}\n` +
      `<b>Комментарий:</b> ${data.comment || "-"}`
    );
  }

  await sendMessage(
    chatId,
    `Ваша заявка отправлена менеджеру. Мы скоро свяжемся с вами.`,
    mainMenu()
  );

  return res.status(200).json({ ok: true });
}
      if (text === "/start") {
        await sendMessage(
          chatId,
          `<b>Добро пожаловать в MAP94</b>\n\n` +
          `Мы занимаемся поставками металлопроката и химической продукции.\n` +
          `Предлагаем позиции <b>со склада</b> и <b>под заказ</b>.\n\n` +
          `Выберите нужный раздел ниже:`,
          mainMenu()
        );
      } else {
        // Если пользователь пишет обычный текст — пересылаем менеджеру как заявку
        if (MANAGER_CHAT_ID) {
          await sendMessage(
            MANAGER_CHAT_ID,
            `<b>Новая заявка от пользователя</b>\n\n` +
            `<b>Имя:</b> ${user.first_name || "-"} ${user.last_name || ""}\n` +
            `<b>Username:</b> ${user.username ? "@" + user.username : "-"}\n` +
            `<b>User ID:</b> ${user.id}\n\n` +
            `<b>Сообщение:</b>\n${text}`
          );
        }

        await sendMessage(
          chatId,
          `Ваше сообщение принято. Менеджер свяжется с вами.\n\nИли выберите раздел в меню:`,
          mainMenu()
        );
      }
    }

    // Обработка inline-кнопок
    if (update.callback_query) {
      const cq = update.callback_query;
      const data = cq.data;
      const chatId = cq.message.chat.id;
      const messageId = cq.message.message_id;
      const user = cq.from;

      await answerCallbackQuery(cq.id);

      if (data === "main_menu") {
        await editMessage(
          chatId,
          messageId,
          `<b>Главное меню MAP94</b>\n\nВыберите нужный раздел:`,
          mainMenu()
        );
      }

      if (data === "about") {
        await editMessage(
          chatId,
          messageId,
          `<b>О компании</b>\n\n` +
          `MAP94 занимается поставками металлопроката и химической продукции.\n\n` +
          `Мы работаем по двум основным направлениям:\n` +
          `• поставка товаров со склада\n` +
          `• поставка под заказ\n\n` +
          `Наша цель — предложить клиенту нужную позицию, подходящий объем и удобные условия поставки.`,
          backToMain()
        );
      }

      if (data === "catalog") {
        await editMessage(
          chatId,
          messageId,
          `<b>Каталог продукции</b>\n\nВыберите категорию:`,
          catalogMenu()
        );
      }

      if (data === "metal") {
        await editMessage(
          chatId,
          messageId,
          `<b>Металлопрокат</b>\n\nВыберите интересующую позицию:`,
          metalMenu()
        );
      }

      if (data === "chemistry") {
        await editMessage(
          chatId,
          messageId,
          `<b>Химическая продукция</b>\n\nВыберите раздел:`,
          chemistryMenu()
        );
      }

      if (data === "metal_circles") {
        await editMessage(
          chatId,
          messageId,
          `<b>Круги</b>\n\n` +
          `Поставка кругов возможна со склада или под заказ.\n\n` +
          `Для уточнения размеров, марки стали, объема и цены отправьте сообщение в бот или свяжитесь с менеджером.`,
          {
            inline_keyboard: [
              [{ text: "✉️ Связаться с менеджером", callback_data: "manager" }],
              [{ text: "⬅️ Назад", callback_data: "metal" }]
            ]
          }
        );
      }

      if (data === "metal_channels") {
        await editMessage(
          chatId,
          messageId,
          `<b>Швеллера</b>\n\n` +
          `Доступны варианты со склада и под заказ.\n\n` +
          `Чтобы получить актуальную цену и наличие, откройте прайс-лист или напишите менеджеру.`,
          {
            inline_keyboard: [
              [{ text: "📄 Прайс-лист", url: PRICE_URL }],
              [{ text: "✉️ Связаться с менеджером", callback_data: "manager" }],
              [{ text: "⬅️ Назад", callback_data: "metal" }]
            ]
          }
        );
      }

      if (data === "metal_sheets") {
        await editMessage(
          chatId,
          messageId,
          `<b>Листы</b>\n\n` +
          `Поставляем листовой металлопрокат в разных размерах и объемах.\n\n` +
          `Уточнение по наличию и условиям поставки — через менеджера.`,
          {
            inline_keyboard: [
              [{ text: "✉️ Связаться с менеджером", callback_data: "manager" }],
              [{ text: "⬅️ Назад", callback_data: "metal" }]
            ]
          }
        );
      }

      if (data === "metal_pipes") {
        await editMessage(
          chatId,
          messageId,
          `<b>Трубы</b>\n\n` +
          `Поставка труб возможна со склада и под заказ по параметрам клиента.`,
          {
            inline_keyboard: [
              [{ text: "✉️ Связаться с менеджером", callback_data: "manager" }],
              [{ text: "⬅️ Назад", callback_data: "metal" }]
            ]
          }
        );
      }

      if (data === "metal_rebar") {
        await editMessage(
          chatId,
          messageId,
          `<b>Арматура</b>\n\n` +
          `Для получения актуальных цен и наличия воспользуйтесь прайс-листом или отправьте заявку менеджеру.`,
          {
            inline_keyboard: [
              [{ text: "📄 Прайс-лист", url: PRICE_URL }],
              [{ text: "✉️ Связаться с менеджером", callback_data: "manager" }],
              [{ text: "⬅️ Назад", callback_data: "metal" }]
            ]
          }
        );
      }

      if (data === "metal_angles") {
        await editMessage(
          chatId,
          messageId,
          `<b>Уголки</b>\n\n` +
          `Поставляем уголки со склада и под заказ в зависимости от требуемых параметров.`,
          {
            inline_keyboard: [
              [{ text: "✉️ Связаться с менеджером", callback_data: "manager" }],
              [{ text: "⬅️ Назад", callback_data: "metal" }]
            ]
          }
        );
      }

      if (data === "chem_caustic") {
        await editMessage(
          chatId,
          messageId,
          `<b>Каустическая сода</b>\n\n` +
          `Поставляем каустическую соду в наличии и под заказ.\n\n` +
          `Для уточнения фасовки, объема, сроков и цены — свяжитесь с менеджером.`,
          {
            inline_keyboard: [
              [{ text: "✉️ Связаться с менеджером", callback_data: "manager" }],
              [{ text: "⬅️ Назад", callback_data: "chemistry" }]
            ]
          }
        );
      }

      if (data === "chem_other") {
        await editMessage(
          chatId,
          messageId,
          `<b>Другие химические позиции</b>\n\n` +
          `Ассортимент может расширяться.\n` +
          `Если вам нужна конкретная химическая продукция, отправьте запрос менеджеру.`,
          {
            inline_keyboard: [
              [{ text: "✉️ Связаться с менеджером", callback_data: "manager" }],
              [{ text: "⬅️ Назад", callback_data: "chemistry" }]
            ]
          }
        );
      }

      if (data === "stock") {
        await editMessage(
          chatId,
          messageId,
          `<b>Поставка со склада</b>\n\n` +
          `Мы можем предложить ряд позиций со склада.\n\n` +
          `Чтобы получить актуальное наличие, откройте прайс-лист или отправьте запрос менеджеру.`,
          {
            inline_keyboard: [
              [{ text: "📄 Открыть прайс-лист", url: PRICE_URL }],
              [{ text: "✉️ Связаться с менеджером", callback_data: "manager" }],
              [{ text: "⬅️ Назад", callback_data: "main_menu" }]
            ]
          }
        );
      }

      if (data === "custom_order") {
        await editMessage(
          chatId,
          messageId,
          `<b>Поставка под заказ</b>\n\n` +
          `Если нужной позиции нет в наличии, мы можем организовать поставку под заказ.\n\n` +
          `Для расчета укажите:\n` +
          `• наименование товара\n` +
          `• размер / параметры\n` +
          `• объем\n` +
          `• город поставки`,
          {
            inline_keyboard: [
              [{ text: "✉️ Отправить запрос менеджеру", callback_data: "manager" }],
              [{ text: "⬅️ Назад", callback_data: "main_menu" }]
            ]
          }
        );
      }

      if (data === "contacts") {
        await editMessage(
          chatId,
          messageId,
          `<b>Контакты</b>\n\n` +
          `<b>Телефон:</b> ${COMPANY_PHONE}\n` +
          `<b>Telegram:</b> ${COMPANY_TELEGRAM}\n` +
          `<b>Адрес:</b> ${COMPANY_ADDRESS}\n\n` +
          `Для быстрого запроса также можете написать прямо в этот бот.`,
          backToMain()
        );
      }

      if (data === "manager") {
        if (MANAGER_CHAT_ID) {
          await sendMessage(
            MANAGER_CHAT_ID,
            `<b>Пользователь запросил связь с менеджером</b>\n\n` +
            `<b>Имя:</b> ${user.first_name || "-"} ${user.last_name || ""}\n` +
            `<b>Username:</b> ${user.username ? "@" + user.username : "-"}\n` +
            `<b>User ID:</b> ${user.id}`
          );
        }

        await editMessage(
          chatId,
          messageId,
          `<b>Связь с менеджером</b>\n\n` +
          `Напишите следующим сообщением:\n` +
          `• какой товар вам нужен\n` +
          `• размер / марка / фасовка\n` +
          `• количество\n` +
          `• ваш город\n\n` +
          `Сообщение будет передано менеджеру.`,
          {
            inline_keyboard: [
              [{ text: "⬅️ Назад в главное меню", callback_data: "main_menu" }]
            ]
          }
        );
      }
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
