// content.js
// Injected into Telegram Web to extract today's messages

(function() {
  try {
    const messageContainers = document.querySelectorAll('.message, [class*="Message"], .msg');
    
    let messages = [];
    let lastSender = 'Unknown';
    
    const allContainers = Array.from(messageContainers);
    
    // First, check if there is a 'Today' header anywhere in the loaded DOM
    const hasTodayHeader = allContainers.some(container => {
        const text = container.innerText.trim().toLowerCase();
        return container.classList.contains('service-msg') && text === 'today' || text === 'today';
    });

    // If a 'Today' header is present, we start off NOT collecting, because earlier elements belong to yesterday.
    // If not present, we assume whatever is loaded is today (or we just accept it as the current active chunk).
    let isToday = !hasTodayHeader;

    allContainers.forEach(container => {
      // Check if this container is a date divider
      const containerText = container.innerText.trim().toLowerCase();
      
      // If it's a small service message, it might be a date bubble
      if (container.classList.contains('service-msg') || container.querySelector('.message-date') || containerText === 'today' || containerText === 'yesterday') {
          if (containerText === 'today') {
             isToday = true;
          } else if (containerText === 'yesterday' || containerText.match(/^[a-z]+ \d+$/i)) {
             isToday = false;
          }
          // Note: "Neha joined the group" is also a service-msg. We ignore those unless it exactly matches a date format.
      }

      // If we are currently in an older date chunk, skip
      if (!isToday) {
          return;
      }

      // Skip if it's explicitly a service message (like joined group) and we are collecting
      if (container.classList.contains('service-msg')) {
          return;
      }

      const textEl = container.querySelector('.text-content, .message-text, [dir="auto"], .message');
      let text = textEl ? textEl.innerText.trim() : '';
      
      const senderEl = container.querySelector('.peer-title, .message-title, .user-title, [class*="Avatar"] + div');
      
      if (senderEl) {
        lastSender = senderEl.innerText.trim();
      }

      if (text && text.includes(lastSender)) {
          text = text.replace(lastSender, '').trim();
      }

      if (text && text.length > 1) { 
        messages.push({
          sender: lastSender,
          text: text
        });
      }
    });

    if (messages.length === 0) {
      return { error: 'Could not extract text from messages.' };
    }

    const totalMessages = messages.length;
    
    // Group messages by sender
    const messagesBySender = {};
    messages.forEach(m => {
      if (!messagesBySender[m.sender]) {
          messagesBySender[m.sender] = [];
      }
      messagesBySender[m.sender].push(m.text);
    });
    
    // Get Top 5 senders
    const topSenders = Object.entries(messagesBySender)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 5)
      .map(([name, msgs]) => ({ name, count: msgs.length, texts: msgs }));

    // Isolate Top Sender's messages (fallback)
    const rohanMessages = topSenders.length > 0 ? topSenders[0].texts : [];

    // Frequent words and basic topics for overall chat
    const stopWords = new Set(['the','and','to','a','of','in','is','it','you','that','for','on','are','with','as','this','was','be','have','but','not','we','what','how','can','will','if','do','from','here','some','your','about','all','out','they','their','there','which','who','when','where','why','how','an','just','like','would','could']);
    
    const wordCounts = {};
    const wordsArr = [];
    
    messages.forEach(m => {
      const words = m.text.toLowerCase().split(/[\s,.\?!:;()"\n'-]+/);
      words.forEach(w => {
        if (w.length > 3 && !stopWords.has(w) && !w.startsWith('@')) {
          wordCounts[w] = (wordCounts[w] || 0) + 1;
          wordsArr.push(w);
        }
      });
    });

    // Simple bigram topic extraction
    const bigrams = {};
    for (let i = 0; i < wordsArr.length - 1; i++) {
        const bg = wordsArr[i] + ' ' + wordsArr[i+1];
        bigrams[bg] = (bigrams[bg] || 0) + 1;
    }

    let topics = Object.entries(bigrams)
      .sort((a, b) => b[1] - a[1])
      .filter(t => t[1] > 1) // must appear more than once
      .slice(0, 3)
      .map(([topic]) => topic);
      
    if (topics.length === 0) {
        // Fallback to top words if no bigrams repeated
        topics = Object.entries(wordCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([word]) => word);
    }

    return { 
      data: {
        totalMessages,
        topSenders,
        topics,
        rohanMessages
      }
    };
  } catch (error) {
    return { error: error.message };
  }
})();
