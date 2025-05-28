# TrustTrack 🚌

A comprehensive public transport rating and review platform designed specifically for Bangladesh. TrustTrack empowers commuters to share their experiences, rate transport services, and access emergency support while traveling.

## 🌟 Features

### 🏠 Homepage
- **Hero Section**: Welcoming interface with clear call-to-action
- **Trending Reviews**: Interactive slider showcasing recent user reviews
- **Feature Highlights**: Key platform capabilities overview
- **Statistics Dashboard**: Real-time platform metrics

### ⭐ Review System
- **Multi-Parameter Rating**: Rate transport services on:
  - Safety (Security measures, driver behavior)
  - Hygiene (Cleanliness, sanitization)
  - Punctuality (On-time performance)
  - Overcrowding (Passenger capacity management)
- **Photo Upload**: Visual evidence support
- **Route Information**: Detailed journey documentation
- **Local Storage**: Persistent data storage

### 🆘 Emergency Support
- **Interactive Map**: Real-time location services using Leaflet/OpenStreetMap
- **Emergency Contacts**: Quick access to essential services
- **One-tap Calling**: Direct dial functionality
- **Location Sharing**: GPS-based assistance

### 👥 Team Information
- **Founder Profiles**: Meet the TrustTrack team
- **Company Timeline**: Platform development journey
- **Mission & Vision**: Our commitment to better transport

### 💬 Feedback System
- **Comprehensive Forms**: Detailed feedback collection
- **FAQ Section**: Common questions and answers
- **Rating System**: Service quality assessment
- **Real-time Validation**: Instant form feedback

### 🔧 Admin Dashboard
- **Comprehensive Monitoring**: View and manage all reviews, feedback, and contact messages
- **Analytics Dashboard**: Track rating distributions, popular routes, and common issues
- **Data Export**: Export data in JSON format for analysis
- **User Management**: Monitor user submissions and moderate content
- **Statistics Overview**: Real-time metrics and performance indicators

### 📧 Contact & Communication
- **Direct Contact Form**: Contact the team directly with messages sent to raiyansarwar022@gmail.com
- **Multiple Feedback Channels**: Various ways for users to reach out and provide feedback
- **Emergency Contact Integration**: Quick access to emergency services
- **Real-time Form Validation**: Instant feedback on form submissions

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with Flexbox/Grid
- **Icons**: Font Awesome 6
- **Maps**: Leaflet.js with OpenStreetMap
- **Storage**: Local Storage API
- **Responsive**: Mobile-first design approach

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for map services and icons

### Installation

1. **Clone or Download** the project:
   ```bash
   git clone https://github.com/yourusername/trusttrack.git
   # OR download and extract ZIP file
   ```

2. **Navigate** to the project directory:
   ```bash
   cd trusttrack
   ```

3. **Open** `index.html` in your web browser:
   - Double-click the file, or
   - Right-click → "Open with" → Browser, or
   - Use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (if you have live-server installed)
     npx live-server
     ```

4. **Access** the application:
   - Local file: `file:///path/to/trusttrack/index.html`
   - Local server: `http://localhost:8000`

## 📁 Project Structure

```
TrustTrack/
├── index.html              # Main homepage
├── pages/
│   ├── reviews.html         # Review submission page
│   ├── emergency.html       # Emergency support page
│   ├── team.html           # Team information page
│   └── feedback.html       # Feedback form page
├── styles/
│   ├── main.css            # Core styles and homepage
│   ├── reviews.css         # Review page styles
│   ├── emergency.css       # Emergency page styles
│   ├── team.css           # Team page styles
│   └── feedback.css       # Feedback page styles
├── scripts/
│   ├── main.js            # Core functionality and homepage
│   ├── reviews.js         # Review system logic
│   ├── emergency.js       # Emergency features and maps
│   ├── team.js           # Team page interactions
│   └── feedback.js       # Feedback form handling
└── README.md             # Project documentation
```

## 🎨 Design System

### Color Palette
- **Primary**: #2c5aa0 (Deep Blue)
- **Secondary**: #f59e0b (Amber)
- **Background**: Linear gradients (#667eea to #764ba2)
- **Text**: #333333 (Dark Gray)
- **Light Text**: #6b7280 (Medium Gray)

### Typography
- **Font Family**: Inter, system fonts
- **Headings**: 700 weight
- **Body**: 400-500 weight
- **Interactive**: 600 weight

### Components
- **Border Radius**: 10-20px for modern look
- **Shadows**: Layered shadows for depth
- **Transitions**: 0.3s ease for smooth interactions
- **Hover Effects**: Transform and color changes

## 📱 Responsive Design

- **Mobile First**: Optimized for smartphones
- **Tablet**: Enhanced layout for medium screens
- **Desktop**: Full-featured experience
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

## 🔧 Features in Detail

### Review System
- Star rating interface (1-5 stars)
- Photo upload with preview
- Route and vehicle information
- Automatic timestamp
- Local storage persistence

### Emergency Support
- Real-time map integration
- Emergency service locations
- Quick dial buttons
- Location sharing capabilities
- Offline contact list

### Data Management
- Client-side storage using localStorage
- JSON data structure
- Data validation and sanitization
- Export/import capabilities

## 🌐 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

We welcome contributions to improve TrustTrack! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style
- Test across multiple browsers
- Ensure mobile responsiveness
- Add comments for complex functionality
- Update documentation as needed

## 📧 Team

### Founders
- **Raiyan Sarwar** - CEO & Lead Developer
- **Faizah Mehnaz** - CTO & UI/UX Designer  
- **Nowshin Saiyara** - CMO & Product Manager

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

### Phase 2
- User authentication system
- Real-time notifications
- Social sharing features
- Advanced analytics dashboard

### Phase 3
- Mobile app development
- API integration with transport services
- Government collaboration portal
- Multi-language support

### Phase 4
- AI-powered route optimization
- Predictive analysis
- Integration with payment systems
- Smart city partnerships

## 📊 Analytics & Metrics

Track platform performance through:
- User engagement metrics
- Review submission rates
- Emergency feature usage
- Page load performance
- Mobile vs desktop usage

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [FAQ section](pages/feedback.html#faq)
2. Search existing [issues](https://github.com/yourusername/trusttrack/issues)
3. Create a [new issue](https://github.com/yourusername/trusttrack/issues/new)
4. Contact us through the [feedback form](pages/feedback.html)

## 🙏 Acknowledgments

- **OpenStreetMap** for map data
- **Leaflet.js** for map functionality
- **Font Awesome** for icons
- **Inter Font** for typography
- **Bangladesh transport community** for inspiration

---

**Made with ❤️ for the people of Bangladesh**

*Empowering safer, better public transport through community-driven reviews and ratings.*
