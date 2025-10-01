$(document).ready(function () {
    const chatInput = $('#chat-input');
    const sendBtn = $('#send-btn');
    const attachmentBtn = $('#attachment-btn');
    const attachmentsContainer = $('#attachments');
    const chatMessages = $('#chat-messages');
    const dropOverlay = $('#drop-overlay');

    let attachments = [];

    // Initialize with a file input (hidden)
    const fileInput = $('<input type="file" id="file-input" multiple style="display: none;">');
    $('body').append(fileInput);

    // Auto-resize textarea
    chatInput.on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Send message on button click
    sendBtn.on('click', sendMessage);

    // Send message on Enter key (but allow Shift+Enter for new line)
    chatInput.on('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Handle attachment button click
    attachmentBtn.on('click', function () {
        fileInput.click();
    });

    // Handle file selection from button click
    fileInput.on('change', function (e) {
        handleFiles(e.target.files);
        // Reset the file input to allow selecting the same file again
        $(this).val('');
    });

    // Drag and drop functionality for chat area
    chatMessages.on('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        chatMessages.addClass('drop-active');
        dropOverlay.addClass('active');
    });

    chatMessages.on('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();
        // Only remove if we're leaving the chat area, not entering a child element
        if (!$(e.relatedTarget).closest('.chat-messages').length) {
            chatMessages.removeClass('drop-active');
            dropOverlay.removeClass('active');
        }
    });

    chatMessages.on('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        chatMessages.removeClass('drop-active');
        dropOverlay.removeClass('active');
        handleFiles(e.originalEvent.dataTransfer.files);
    });

    // Handle file processing
    function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            attachments.push(file);

            const attachmentItem = $('<div class="attachment-item"></div>');
            const fileSize = formatFileSize(file.size);

            attachmentItem.html(`
                            <i class="fas fa-file"></i>
                            <div class="attachment-info">
                                <span class="attachment-name">${file.name}</span>
                                <span class="attachment-size">${fileSize}</span>
                            </div>
                            <i class="fas fa-times remove-attachment"></i>
                        `);

            attachmentItem.find('.remove-attachment').on('click', function () {
                const index = attachments.indexOf(file);
                if (index > -1) {
                    attachments.splice(index, 1);
                }
                attachmentItem.remove();
            });

            attachmentsContainer.append(attachmentItem);
        }
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Send message function
    function sendMessage() {
        const message = chatInput.val().trim();
        if (message === '' && attachments.length === 0) return;

        // Add user message to chat
        addMessage(message, 'user', attachments);

        // Clear input and attachments
        chatInput.val('');
        chatInput.css('height', 'auto');
        attachments = [];
        attachmentsContainer.empty();

        // Show typing indicator
        showTypingIndicator();

        // Simulate AI response after a delay
        setTimeout(() => {
            // Remove typing indicator
            $('.typing-indicator').remove();

            // Generate and display AI response
            const aiResponse = generateAIResponse(message);
            addMessageWithTypingEffect(aiResponse, 'ai');

            // Scroll to bottom
            chatMessages.scrollTop(chatMessages[0].scrollHeight);
        }, 1500);
    }

    // Add message to chat
    function addMessage(content, sender, files = []) {
        const messageElement = $('<div class="message"></div>');
        messageElement.addClass(sender + '-message');

        if (sender === 'user') {
            messageElement.html(`
                            <div class="message-bubble user-bubble">
                                <div>${content}</div>
                                ${files.length > 0 ? `<div class="attachments">${generateAttachmentsHTML(files)}</div>` : ''}
                                <div class="timestamp">${getCurrentTime()}</div>
                            </div>
                            <div class="user-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                        `);
        } else {
            messageElement.html(`
                            <div class="ai-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="message-bubble ai-bubble">
                                <div class="ai-response">${content}</div>
                                <div class="timestamp">${getCurrentTime()}</div>
                            </div>
                        `);
        }

        chatMessages.append(messageElement);

        // Scroll to bottom
        chatMessages.scrollTop(chatMessages[0].scrollHeight);
    }

    // Generate attachments HTML
    function generateAttachmentsHTML(files) {
        let html = '';
        for (const file of files) {
            const fileSize = formatFileSize(file.size);
            html += `
                            <div class="attachment-item">
                                <i class="fas fa-file"></i>
                                <div class="attachment-info">
                                    <span class="attachment-name">${file.name}</span>
                                    <span class="attachment-size">${fileSize}</span>
                                </div>
                            </div>
                        `;
        }
        return html;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingIndicator = $('<div class="message ai-message typing-indicator"></div>');
        typingIndicator.html(`
                        <div class="ai-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    `);

        chatMessages.append(typingIndicator);
        chatMessages.scrollTop(chatMessages[0].scrollHeight);
    }

    // Generate AI response with typing effect
    function addMessageWithTypingEffect(content, sender) {
        const messageElement = $('<div class="message"></div>');
        messageElement.addClass(sender + '-message');

        if (sender === 'ai') {
            messageElement.html(`
                            <div class="ai-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="message-bubble ai-bubble">
                                <div class="ai-response"></div>
                                <div class="timestamp">${getCurrentTime()}</div>
                            </div>
                        `);

            chatMessages.append(messageElement);

            // Apply typing effect
            const responseElement = messageElement.find('.ai-response');
            const formattedContent = marked.parse(content);

            let i = 0;
            const typingEffect = setInterval(() => {
                if (i < formattedContent.length) {
                    responseElement.html(formattedContent.substring(0, i + 1));
                    i++;
                    chatMessages.scrollTop(chatMessages[0].scrollHeight);
                } else {
                    clearInterval(typingEffect);
                }
            }, 10);
        }

        chatMessages.scrollTop(chatMessages[0].scrollHeight);
    }

    // Generate sample AI response
    function generateAIResponse(userMessage) {
        const responses = [
            `I understand you're asking about "${userMessage}". Here's what I can tell you:\n\nThis is a sample response from your AI assistant. In a real implementation, this would be connected to an AI service like OpenAI's GPT or a similar model.\n\n**Key points to consider:**\n- Make sure your question is clear and specific\n- I can help with a wide variety of topics\n- Feel free to ask follow-up questions\n\nLet me know if you need more details!`,

            `Thanks for your question: "${userMessage}".\n\nI've analyzed your query and here's my response:\n\n> This is a demonstration of how the chatbot would work with formatted responses using Markdown.\n\nYou can include:\n- **Bold text** for emphasis\n- *Italic text* for subtle emphasis\n- \`Code snippets\` for technical content\n- Lists for organized information\n\nWould you like me to elaborate on any specific aspect?`,

            `Regarding "${userMessage}", here's what I found:\n\n# Main Topic\nThis would be the main heading in a real response.\n\n## Subheading\nThis would be a subheading with more specific information.\n\n### Details\n- First important point\n- Second important point\n- Third important point\n\n\`\`\`javascript\n// Example code block\nfunction example() {\n  console.log("This is a code sample");\n}\n\`\`\`\n\nI hope this helps! Let me know if you have more questions.`
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Get current time in HH:MM format
    function getCurrentTime() {
        const now = new Date();
        return now.getHours().toString().padStart(2, '0') + ':' +
            now.getMinutes().toString().padStart(2, '0');
    }
});