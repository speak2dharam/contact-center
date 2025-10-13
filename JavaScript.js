function handleFiles(files) {
    dropArea.hide();
    filePreview.show();

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        attachments.push(file);
        const fileSize = formatFileSize(file.size);
        const attachmentItem = $('<div class="attachment-item"></div>');

        // Create FileReader for preview
        const reader = new FileReader();
        reader.onload = function (event) {
            let fileType = file.type;
            let previewContent = "";

            // Handle different file previews
            if (fileType.startsWith("image/")) {
                previewContent = `<img src="${event.target.result}" class="preview-img" alt="${file.name}">`;
            } else if (fileType === "application/pdf") {
                previewContent = `<embed src="${event.target.result}" type="application/pdf" class="preview-pdf">`;
            } else if (fileType === "audio/mpeg") {
                previewContent = `
                    <audio controls class="preview-audio">
                        <source src="${event.target.result}" type="audio/mpeg">
                        Your browser does not support audio playback.
                    </audio>`;
            } else {
                previewContent = `<div class="no-preview">📄 No preview available</div>`;
            }

            // Build HTML for each file
            attachmentItem.html(`
                <div class="preview-box">${previewContent}</div>
                <div class="attachment-info">
                    <span class="attachment-name">${file.name}</span>
                    <span class="attachment-size">${fileSize}</span>
                </div>
                <i class="fas fa-times remove-attachment"></i>
            `);

            // Handle remove action
            attachmentItem.find('.remove-attachment').on('click', function () {
                const index = attachments.indexOf(file);
                if (index > -1) {
                    attachments.splice(index, 1);
                }
                attachmentItem.remove();
            });

            attachmentsContainer.append(attachmentItem);
        };

        reader.readAsDataURL(file);
    }
}
