$(document).ready(function () {
    // Ticket selection
    $('.ticket-item').click(function () {
        $('.ticket-item').removeClass('active');
        $(this).addClass('active');

        const ticketId = $(this).data('ticket');
        console.log('Loading ticket:', ticketId);

        // Reset AI processing when switching tickets
        resetAIProcessing();
    });

    // Follow-up AI Processing
    $('#process-followup').click(function () {
        const agents = [
            { agent: 'context', delay: 1000 },
            { agent: 'diagnosis', delay: 2500 },
            { agent: 'solution', delay: 4000 }
        ];

        // Reset all agents first
        $('.agent-process').removeClass('active completed');
        $('.agent-process .badge').removeClass('bg-success bg-warning').addClass('bg-secondary').text('Pending');

        // Process each agent with delay
        agents.forEach((agentInfo, index) => {
            setTimeout(() => {
                const agentElement = $(`.agent-process[data-agent="${agentInfo.agent}"]`);
                agentElement.removeClass('active').addClass('completed');
                agentElement.find('.badge').removeClass('bg-secondary').addClass('bg-success').text('Completed');

                // Show final response after last agent
                if (index === agents.length - 1) {
                    setTimeout(() => {
                        $('#followup-response').slideDown();
                        // Add new AI response to timeline
                        addToTimeline();
                    }, 500);
                }
            }, agentInfo.delay);

            // Show active state
            setTimeout(() => {
                $(`.agent-process[data-agent="${agentInfo.agent}"]`).addClass('active');
                $(`.agent-process[data-agent="${agentInfo.agent}"] .badge`).removeClass('bg-secondary').addClass('bg-warning').text('Processing');
            }, agentInfo.delay - 500);
        });
    });

    function resetAIProcessing() {
        $('.agent-process').removeClass('active completed');
        $('.agent-process .badge').removeClass('bg-success bg-warning').addClass('bg-secondary').text('Pending');
        $('#followup-response').hide();
    }

    function addToTimeline() {
        const timeline = $('.conversation-timeline');
        const newResponse = `
                        <div class="timeline-item">
                            <div class="message-bubble agent-message">
                                <div class="d-flex align-items-center mb-2">
                                    <img src="https://ui-avatars.com/api/?name=AI+Assistant&background=00A86B&color=fff" class="avatar-sm me-2">
                                    <div>
                                        <strong>AI Assistant</strong>
                                        <div class="ticket-meta">Just now • AI Generated</div>
                                    </div>
                                </div>
                                <div class="ai-response-box mb-2">
                                    <p class="mb-2">I understand the rollback didn't resolve the issue. Let me provide an alternative solution:</p>
                                    <p class="mb-2">1. Please try clearing the application cache from Settings > Storage > Clear Cache</p>
                                    <p class="mb-2">2. If that doesn't work, download the special patch file from this link: [Patch Download]</p>
                                    <p class="mb-0">3. I've also escalated this to our technical team for immediate attention</p>
                                </div>
                                <div class="ticket-meta">
                                    <i class="fas fa-clock text-warning me-1"></i>
                                    Ready to send
                                </div>
                            </div>
                        </div>
                    `;

        // Add before the quick actions section
        timeline.append(newResponse);
    }

    // Send Response
    $('.btn-success').click(function () {
        alert('Response sent successfully!');
        // Update status in timeline
        $('.conversation-timeline .timeline-item:last .fa-clock')
            .removeClass('fa-clock text-warning')
            .addClass('fa-check-circle text-success')
            .next()
            .text('Response sent to customer');
    });
});