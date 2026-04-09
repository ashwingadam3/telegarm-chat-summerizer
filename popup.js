document.getElementById('analyze-btn').addEventListener('click', async () => {
  const btnText = document.querySelector('.btn-text');
  const loader = document.querySelector('.loader');
  const results = document.getElementById('results');
  const errorMsg = document.getElementById('error-msg');

  // Reset UI
  btnText.classList.add('hidden');
  loader.classList.remove('hidden');
  results.classList.add('hidden');
  errorMsg.classList.add('hidden');

  try {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url.includes('web.telegram.org')) {
      throw new Error('Please open a Telegram Web page to use this tool.');
    }

    // Inject and run script
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    }, (injectionResults) => {
      // Revert button
      loader.classList.add('hidden');
      btnText.classList.remove('hidden');

      if (chrome.runtime.lastError || !injectionResults || !injectionResults[0]) {
        showError('Could not inject script. Ensure you are on a group chat.');
        return;
      }

      const result = injectionResults[0].result;
      if (result.error) {
        showError(result.error);
      } else {
        renderResults(result.data);
      }
    });

  } catch (err) {
    loader.classList.add('hidden');
    btnText.classList.remove('hidden');
    showError(err.message);
  }
});

function showError(msg) {
  const errorMsg = document.getElementById('error-msg');
  errorMsg.textContent = msg;
  errorMsg.classList.remove('hidden');
}

function renderResults(data) {
  document.getElementById('total-messages').textContent = data.totalMessages;
  
  const senderList = document.getElementById('top-senders');
  senderList.innerHTML = '';
  
  const senderCard = document.getElementById('rohan-card');
  const senderMessagesDiv = document.getElementById('rohan-messages');
  const senderMessagesTitle = document.getElementById('sender-messages-title');

  const showMessagesFor = (senderName, texts) => {
      senderMessagesTitle.textContent = `${senderName}'s Messages`;
      senderMessagesDiv.innerHTML = '';
      texts.forEach(text => {
          const div = document.createElement('div');
          div.className = 'message-bubble';
          div.textContent = text;
          senderMessagesDiv.appendChild(div);
      });
      senderCard.classList.remove('hidden');
  };

  data.topSenders.forEach((sender, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${sender.name}</span> <span class="sender-count">${sender.count}</span>`;
    li.addEventListener('click', () => {
        showMessagesFor(sender.name, sender.texts);
    });
    senderList.appendChild(li);

    // Default show top 1 sender
    if (index === 0) {
        showMessagesFor(sender.name, sender.texts);
    }
  });

  document.getElementById('top-topics').textContent = data.topics.join(', ') || 'No significant topics found.';
  
  document.getElementById('results').classList.remove('hidden');
}
