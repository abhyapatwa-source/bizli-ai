import { CONFIG } from './config.js';
import { getTheme, setTheme, toggleTheme, getHistory, saveHistory, scrollToBottom, sleep } from './utils.js';

// DOM REFS
export const chatBox = document.getElementById('chatBox');
export const historyBox = document.getElementById('history');
export const sidebar = document.getElementById('sidebar');
export const menu = document.getElementById('menu');

// THEME + SIDEBAR
export function initTheme() {
  setTheme(getTheme());
}

export function toggleSidebar() {
  sidebar.classList.toggle('open');
}

export function toggleMenu() {
  menu.classList.toggle('show');
}

// MESSAGE BUBBLES
export function createMessageBubble(who) {
  const div = document.createElement('div');
  div.className = `msg ${who}`;
  chatBox.appendChild(div);
  return div;
}

export function addStaticMessage(text, who) {
  const div = createMessageBubble(who);
  div.textContent = text;
  scrollToBottom(chatBox);
  return div;
}

// TYPING INDICATOR: "Bizli is typing..." for 3-6s
export async function showTypingIndicator(userMessage) {
  const delay = userMessage.length < 5? CONFIG.TYPING_DELAY_SHORT : CONFIG.TYPING_DELAY_LONG;
  const typing = createMessageBubble('ai');
  typing.classList.add('typing');
  typing.textContent = 'Bizli is typing...';
  scrollToBottom(chatBox);
  await sleep(delay);
  typing.remove();
  return createMessageBubble('ai'); // Return empty AI bubble for streaming
}

// CHATGPT WORD-BY-WORD UPDATE
export function updateBubbleText(bubble, text) {
  bubble.textContent = text;
  scrollToBottom(chatBox);
}

// HISTORY SIDEBAR
export function renderHistory(loadChatFn) {
  const history = getHistory();
  historyBox.innerHTML = '';
  history.forEach(h => {
    const btn = document.createElement('button');
    btn.className = 'history-btn';
    btn.textContent = h.title;
    btn.onclick = () => loadChatFn(h.id);
    historyBox.appendChild(btn);
  });
}

export function saveChatToHistory(currentChat) {
  if (!currentChat.length) return;
  const history = getHistory();
  const title = currentChat[0].parts[0].text.slice(0, 30);
  history.unshift({ id: Date.now(), title, msgs: currentChat });
  saveHistory(history);
}
