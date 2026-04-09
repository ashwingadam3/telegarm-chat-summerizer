# Telegram Web Chat Summerizer

A sophisticated Manifest V3 Chrome Extension that securely extracts and analyzes the messages from any active group chat on Telegram Web.

## Features

- **Top 5 Senders Spotlight:** Calculates and displays the 5 most active users for the day. Each sender is fully interactive—clicking their name instantly pulls up an isolated, scrollable view of all their specific messages for immediate context.
- **Contextual Topic Extraction:** Moves beyond simple isolated word counts by extracting frequent bigrams (word pairs) to give you a highly accurate pulse on what subjects are actually being actively discussed.
- **Premium UI/UX:** Built with a beautiful, dark-mode first design featuring glassmorphism elements, CSS gradients, smooth responsive layout, and subtle micro-animations that feel native and premium.
- **Smart Grouping:** Resolves Telegram's "Unknown Sender" behavior by tracking sequential grouped messages from the same user.

## Installation

As this is a locally unpacked extension, it needs to be installed via Chrome's Developer Mode.

1. Open Google Chrome.
2. Navigate to `chrome://extensions/` in your URL bar.
3. Toggle on **Developer mode** in the top right corner.
4. Click the **Load unpacked** button in the top left.
5. Select the main folder containing the `manifest.json` file.
6. (Optional) Pin the extension to your Chrome toolbar for easy access!

## Usage

1. Go to [Telegram Web (web.telegram.org)](https://web.telegram.org/).
2. Click on the group chat you want to analyze.
3. Make sure the chat has loaded messages that were sent "Today".
4. Click the **Telegram Chat Analyzer** icon in your browser toolbar.
5. Click **Analyze Today's Chat**. The popup will briefly load out the contents and instantly return your analysis!

## Technology Stack

- **Vanilla JavaScript:** Fast, dependency-free content and background scripts.
- **Manifest V3:** Adheres to the latest Chrome extension security and performance protocols.
- **HTML/CSS:** Premium, modern interface design.
