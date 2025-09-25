const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    // Configure your email service provider here
    // Example for Gmail - update with your preferred provider
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // or your preferred email service
      auth: {
        user: process.env.ADMIN_EMAIL || 'your-admin-email@gmail.com',
        pass: process.env.ADMIN_EMAIL_PASSWORD || 'your-app-password'
      }
    });

    this.adminEmail = process.env.ADMIN_EMAIL || 'your-admin-email@gmail.com';
    this.baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  }

  async sendLoginApprovalRequest(loginRequest) {
    const { id, user_name, user_email, request_ip, user_agent, approval_token, requested_at } = loginRequest;
    
    const approveUrl = `${this.baseUrl}/api/auth/approve-login/${approval_token}?action=approve`;
    const rejectUrl = `${this.baseUrl}/api/auth/approve-login/${approval_token}?action=reject`;
    const adminDashboardUrl = `${this.baseUrl}/admin/login-requests`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .user-info { background: white; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0; }
          .action-buttons { text-align: center; margin: 30px 0; }
          .btn { display: inline-block; padding: 12px 30px; margin: 0 10px; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .btn-approve { background: #4CAF50; color: white; }
          .btn-reject { background: #f44336; color: white; }
          .btn-dashboard { background: #2196F3; color: white; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Login Approval Request</h1>
            <p>EduConnect - Login Authentication Required</p>
          </div>
          
          <div class="content">
            <h2>New Login Request Pending Your Approval</h2>
            <p>A user is requesting access to the EduConnect website. Please review the details below and approve or reject this login attempt.</p>
            
            <div class="user-info">
              <h3>👤 User Details:</h3>
              <p><strong>Name:</strong> ${user_name}</p>
              <p><strong>Email:</strong> ${user_email}</p>
              <p><strong>IP Address:</strong> ${request_ip || 'Unknown'}</p>
              <p><strong>Browser:</strong> ${user_agent ? user_agent.substring(0, 100) : 'Unknown'}</p>
              <p><strong>Request Time:</strong> ${new Date(requested_at).toLocaleString()}</p>
            </div>

            <div class="action-buttons">
              <a href="${approveUrl}" class="btn btn-approve">✅ APPROVE LOGIN</a>
              <a href="${rejectUrl}" class="btn btn-reject">❌ REJECT LOGIN</a>
            </div>

            <div class="action-buttons">
              <a href="${adminDashboardUrl}" class="btn btn-dashboard">📊 View Admin Dashboard</a>
            </div>

            <p><strong>⚠️ Security Note:</strong> This request will automatically expire in 24 hours if no action is taken.</p>
          </div>
          
          <div class="footer">
            <p>This is an automated message from EduConnect Login Approval System</p>
            <p>Request ID: ${id}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"EduConnect Security" <${this.adminEmail}>`,
      to: this.adminEmail,
      subject: `🔐 Login Approval Required - ${user_name} (${user_email})`,
      html: htmlContent,
      text: `
        LOGIN APPROVAL REQUEST
        ======================
        
        User: ${user_name} (${user_email})
        IP: ${request_ip || 'Unknown'}
        Time: ${new Date(requested_at).toLocaleString()}
        
        To approve: ${approveUrl}
        To reject: ${rejectUrl}
        
        Admin Dashboard: ${adminDashboardUrl}
        
        This request expires in 24 hours.
        Request ID: ${id}
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Login approval email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send login approval email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendLoginDecisionNotification(loginRequest, decision, adminNotes = '') {
    const { user_email, user_name } = loginRequest;
    const isApproved = decision === 'approved';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { padding: 20px; text-align: center; color: white; }
          .approved { background: #4CAF50; }
          .rejected { background: #f44336; }
          .content { padding: 20px; background: #f9f9f9; }
          .login-btn { display: inline-block; padding: 12px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header ${isApproved ? 'approved' : 'rejected'}">
            <h1>${isApproved ? '✅ Login Approved' : '❌ Login Rejected'}</h1>
            <p>EduConnect - Login Status Update</p>
          </div>
          
          <div class="content">
            <h2>Hello ${user_name},</h2>
            
            ${isApproved ? `
              <p>Great news! Your login request has been <strong>approved</strong> by the administrator.</p>
              <p>You can now access the EduConnect website using your credentials.</p>
              <div style="text-align: center;">
                <a href="${this.baseUrl}" class="login-btn">🔗 Login to EduConnect</a>
              </div>
            ` : `
              <p>We regret to inform you that your login request has been <strong>rejected</strong> by the administrator.</p>
              <p>If you believe this is an error, please contact the administrator for further assistance.</p>
            `}
            
            ${adminNotes ? `
              <div style="background: white; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0;">
                <h3>📝 Administrator Notes:</h3>
                <p>${adminNotes}</p>
              </div>
            ` : ''}
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"EduConnect" <${this.adminEmail}>`,
      to: user_email,
      subject: `EduConnect - Login ${isApproved ? 'Approved' : 'Rejected'}`,
      html: htmlContent,
      text: `
        LOGIN ${isApproved ? 'APPROVED' : 'REJECTED'}
        ==============================
        
        Hello ${user_name},
        
        Your login request has been ${decision} by the administrator.
        
        ${isApproved ? `You can now login at: ${this.baseUrl}` : 'Please contact the administrator if you need assistance.'}
        
        ${adminNotes ? `Administrator Notes: ${adminNotes}` : ''}
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Login ${decision} notification sent to ${user_email}:`, info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ Failed to send login ${decision} notification:`, error);
      return { success: false, error: error.message };
    }
  }

  async testEmailConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connection successful');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();