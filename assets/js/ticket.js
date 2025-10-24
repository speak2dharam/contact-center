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
        $('.agent-process').removeClass('active completed failed');
        $('.agent-process .badge').removeClass('bg-success bg-warning').addClass('bg-secondary').text('Pending');

        // Process each agent with delay
        agents.forEach((agentInfo, index) => {
            setTimeout(() => {
                const agentElement = $(`.agent-process[data-agent="${agentInfo.agent}"]`);
                agentElement.removeClass('active').addClass('completed');
                agentElement.find('.badge').removeClass('bg-secondary bg-warning').addClass('bg-success').text('Completed');

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
    $('#process-followup2').click(function () {
        const agents = [
            { agent: 'context', delay: 1000 },
            { agent: 'diagnosis', delay: 2500 },
            { agent: 'solution', delay: 4000 }
        ];

        // Reset all agents first
        $('.agent-process').removeClass('active completed failed');
        $('.agent-process .badge').removeClass('bg-success bg-warning').addClass('bg-secondary').text('Pending');

        // Process each agent with delay
        agents.forEach((agentInfo, index) => {
            setTimeout(() => {
                const agentElement = $(`.agent-process[data-agent="${agentInfo.agent}"]`);
                agentElement.removeClass('active').addClass('failed');
                agentElement.find('.badge').removeClass('bg-secondary bg-warning').addClass('bg-danger').text('Failed');

                // Show final response after last agent
                if (index === agents.length - 1) {
                    setTimeout(() => {
                        $('#followup-response').slideDown();
                        // Add new AI response to timeline
                        addToTimeline2();
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
                        <div class="alert alert-secondary mb-4" role="alert">
    <i class="bi bi-envelope"></i> Ticket resolved status has been sent successfully!
  </div>

  <div class="ticket-card">
    <div class="ticket-header">
      <span class="fs-5 fw-semibold">UnifyCloud</span>
      <span class="small">Ticket Notification</span>
    </div>
    <div class="ticket-body">
      <h4>Your ticket cancellation is confirmed</h4>
      <p>Dear <strong>Mr. Rajesh Mehta</strong>,</p>
      <p>We’ve processed your request to cancel your flight booking 
        <strong>(Ref: SJ45892)</strong>. Below are the details of the cancellation for your records.
      </p>

      <div class="summary-box">
        <h6 class="fw-bold mb-3">Cancellation Summary</h6>

        <div class="row">
          <div class="col-6 text-muted">Booking Reference</div>
          <div class="col-6 fw-medium">SJ45892</div>
        </div>
        <div class="row">
          <div class="col-6 text-muted">Original Route</div>
          <div class="col-6 fw-medium">Delhi → Dubai</div>
        </div>
        <div class="row">
          <div class="col-6 text-muted">Scheduled Departure</div>
          <div class="col-6 fw-medium">October 20, 2025</div>
        </div>
        <div class="row">
          <div class="col-6 text-muted">Ticket Type</div>
          <div class="col-6 fw-medium">Economy Saver</div>
        </div>
        <div class="row">
          <div class="col-6 text-muted">Cancellation Fee</div>
          <div class="col-6 fw-medium">₹3,500</div>
        </div>
        <div class="row">
          <div class="col-6 text-muted">Refund Amount</div>
          <div class="col-6 fw-medium text-success">₹8,250</div>
        </div>
        <div class="row">
          <div class="col-6 text-muted">Refund Timeline</div>
          <div class="col-6 fw-medium">5–7 business days</div>
        </div>
      </div>
    </div>
  </div>
                    `;

        // Add before the quick actions section
        timeline.append(newResponse);
    }
    function addToTimeline2() {
        const timeline = $('.conversation-timeline');
        const newResponse = `
                        <div class="status-container">
    <!-- Left side message -->
    <div class="agent-transfer">
      <i class="bi bi-headset"></i>
      <h5>Ticket is being transferred<br>to Human Agent</h5>
    </div>

    <!-- Right side card -->
    <div class="ticket-card">
      <div class="ticket-header">
        <span class="fs-5 fw-semibold">UnifyCloud</span>
        <span class="small">Action Required</span>
      </div>
      <div class="ticket-body">
        <h4>We couldn't complete your request automatically</h4>
        <p>Dear <strong>Mr. Rajesh Mehta</strong>,</p>
        <p>Our automated assistant attempted to process your request 
          <strong>(Ref: SJ45892)</strong> but could not complete it due to the reason below. 
          We've escalated your case to a specialist for a quick resolution.
        </p>

        <div class="summary-box">
          <div class="header">What happened</div>

          <div class="row">
            <div class="col-6 text-muted">Request Reference</div>
            <div class="col-6 fw-medium">SJ45892</div>
          </div>
          <div class="row">
            <div class="col-6 text-muted">Requested Action</div>
            <div class="col-6 fw-medium">Cancel flight (Delhi → Dubai)</div>
          </div>
          <div class="row">
            <div class="col-6 text-muted">Reason</div>
            <div class="col-6 fw-medium">Payment gateway timed out while initiating refund.</div>
          </div>
          <div class="row">
            <div class="col-6 text-muted">Next Step</div>
            <div class="col-6 fw-medium">Human-in-the-Loop specialist will validate refund and complete cancellation.</div>
          </div>
        </div>
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