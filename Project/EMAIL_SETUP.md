# TrustTrack Email Integration Guide

## Setting up Real Email Functionality

To enable real email sending for contact forms, you can integrate with EmailJS, which allows sending emails directly from client-side JavaScript.

### Steps to Setup EmailJS:

1. **Create EmailJS Account:**
   - Go to https://www.emailjs.com/
   - Sign up for a free account

2. **Create Email Service:**
   - Add a new email service (Gmail, Outlook, etc.)
   - Connect your email account (raiyansarwar022@gmail.com)

3. **Create Email Template:**
   - Create a template with variables for:
     - {{from_name}} - Contact person's name
     - {{from_email}} - Contact person's email
     - {{subject}} - Message subject
     - {{message}} - Message content

4. **Get Credentials:**
   - Copy your Service ID
   - Copy your Template ID
   - Copy your Public Key

5. **Update JavaScript Code:**

Replace the simulated email function in `scripts/team.js` with:

```javascript
// Add EmailJS script to HTML head:
// <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

// Initialize EmailJS (add to team.js)
emailjs.init("YOUR_PUBLIC_KEY");

async function sendContactEmail(contactData) {
    try {
        const response = await emailjs.send(
            "YOUR_SERVICE_ID",
            "YOUR_TEMPLATE_ID",
            {
                to_email: "raiyansarwar022@gmail.com",
                from_name: contactData.name,
                from_email: contactData.email,
                subject: contactData.subject,
                message: contactData.message,
                reply_to: contactData.email
            }
        );
        
        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
}
```

### Alternative: FormSpree Integration

You can also use FormSpree for form handling:

1. Go to https://formspree.io/
2. Create a form endpoint
3. Replace the form action with FormSpree endpoint
4. No JavaScript needed for basic functionality

### Security Notes:

- Never expose private keys in client-side code
- Use environment variables for sensitive data in production
- Consider rate limiting for form submissions
- Add CAPTCHA for spam protection

### Current Implementation:

The current code simulates email sending and saves all contact messages to localStorage. The admin dashboard can view and manage these messages. For production, replace the simulation with actual email service integration.

### Testing:

1. Submit a contact form
2. Check browser console for success message
3. Check localStorage for saved contact data
4. View messages in admin dashboard (login: admin/trusttrack2025)

All contact messages are automatically sent to the specified email address (raiyansarwar022@gmail.com) when real email integration is implemented.
