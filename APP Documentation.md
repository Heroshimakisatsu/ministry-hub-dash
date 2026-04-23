# Ministry Hub

A comprehensive church management system that enables administrators to manage members, events, communications, and finances, while providing members with a portal to access announcements, events, sermons, and personal information.

## Features

### Admin Dashboard
- **Overview**: Dashboard statistics, giving charts, and quick actions
- **Member Directory**: Full CRUD operations for member management
- **Departments**: Manage church departments and assignments
- **Events & Calendar**: Create and manage church events
- **Church Records**: Church documentation management
- **Welfare & Counseling**: Manage welfare requests and counseling appointments
- **Finance & Offering**: Track tithes, offerings, and giving history
- **Projects & Fundraising**: Manage fundraising campaigns
- **Online Giving**: Configure payment methods (EcoCash, Paynow, OneMoney, Bank Transfer)
- **Communications**: Send multi-channel broadcasts (SMS, WhatsApp, Email, Member Portal)
- **Asset & Inventory**: Manage church assets
- **Access Control**: User permissions management
- **Reports & Analytics**: Generate reports and insights
- **Multi-Branch**: Multi-location church management
- **Settings**: Application configuration

### Member Portal
- **Overview**: Personal dashboard with upcoming events and giving summary
- **Announcements**: View church announcements (synced from Admin)
- **Events**: View and RSVP to events (synced from Admin)
- **Sermons**: Access sermon recordings (video, audio, devotionals)
- **Prayer**: Submit prayer requests and testimonies
- **Bible**: Daily verses and reading plans
- **Check-in**: QR code check-in for services
- **Directory**: View church leaders and member directory
- **Welfare**: Apply for welfare support
- **Counseling**: Book counseling appointments
- **Giving**: View giving history and make donations
- **Attendance**: View personal attendance record
- **Profile**: Edit personal profile information
- **Resources**: Access church resources

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **Data Persistence**: localStorage
- **Routing**: React Router

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ministry-hub-dash
```

2. Install dependencies
```bash
npm install
# or
bun install
```

3. Run the development server
```bash
npm run dev
# or
bun run dev
```

4. Open your browser
Navigate to `http://localhost:8080`

### Admin Credentials
- **Master Admin Password**: `masteradmin123`

## Data Flow Architecture

The application uses localStorage for data persistence with real-time synchronization between Admin and Member Portal:

### Sync Mechanism
- **localStorage**: Persists data across sessions
- **Storage Events**: Cross-tab synchronization
- **Custom Events**: Same-tab real-time updates

### Admin → Member Data Flow

| Admin Module | Member Module | Sync Trigger |
|-------------|---------------|--------------|
| Communications | Announcements | Message sent with "Member Portal" channel |
| Events & Calendar | Events | Event created/updated |
| Finance & Offering | Giving | Giving record added |
| Member Directory | Directory | Member data changes |
| Welfare & Counseling | Welfare | Welfare request submitted |
| Welfare & Counseling | Counseling | Appointment booked |

## Project Structure

```
src/
├── components/
│   ├── members/
│   │   ├── CommunicationSystem.tsx    # Admin broadcast system
│   │   ├── EventsCalendar.tsx         # Admin event management
│   │   └── MemberManagement.tsx       # Member CRUD operations
│   ├── ui/                            # shadcn/ui components
│   ├── AppSidebar.tsx                 # Admin navigation
│   ├── DashboardHeader.tsx            # Admin header
│   └── ...
├── data/
│   ├── members.ts                     # Member data
│   └── sharedData.ts                  # Shared data functions (localStorage)
├── pages/
│   ├── Dashboard.tsx                  # Admin dashboard
│   ├── MemberPortal.tsx               # Member portal
│   ├── Login.tsx                      # Login page
│   ├── AdminSignup.tsx                # Admin registration
│   └── MemberSignup.tsx               # Member registration
└── index.css                          # Global styles
```

## Key Features

### Multi-Channel Communications
Admin can send broadcasts through:
- SMS
- WhatsApp
- Email
- Member Portal (creates announcements)

When "Member Portal" is selected, the message automatically appears as an announcement in the Member Portal.

### Real-Time Synchronization
- Announcements and events sync immediately when Admin creates/updates them
- Changes reflect across all open tabs in real-time
- Data persists across browser sessions

### Event Management
- Admin creates events with date, time, venue, theme, and capacity
- Members can RSVP to events
- RSVP counts are tracked and displayed
- "RSVP" terminology replaced with "Confirm Attendance" for clarity

### Giving System
- Members can give via multiple payment methods
- Giving history is tracked and displayed
- Admin can view overall giving statistics
- Payment methods: EcoCash, Paynow, OneMoney, Bank Transfer

## Customization

### Dark Mode Colors
The application uses cream/beige colors (hue 38) in dark mode instead of blue. This is configured in `src/index.css`.

### CSS Linter
Tailwind CSS directives are configured in `.vscode/settings.json` to suppress false-positive lint warnings.

## Scripts

- `npm run dev` - Start development server (port 8080)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

[Your License Here]

## Support

For support, please contact [your contact information].
