import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Calendar, Church, Users, LogOut, Bell, Settings, Heart, BookOpen, Camera, MapPin, Phone as PhoneIcon, Mail, UserCircle, CheckCircle, Receipt, Building2, Globe, HandCoins, Megaphone, Calendar as CalendarIcon, Clock, MapPin as MapPinIcon, Play, Download, Video, Music, FileText, MessageCircle, QrCode, Users as UsersIcon, UserPlus, Phone, CalendarDays, FileCheck, CalendarCheck, Bookmark, HandHeart, Award, AlertTriangle, ShoppingBag, Building, MessageSquare, Send, Info, Lock, X, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ThemeToggle";
import { initialMembers, Member } from "@/data/members";
import { addGivingRecord, addEventRSVP, updateMemberProfile, getGivingHistory, getEventRSVPs, getAnnouncements, getEvents, getCommunications } from "@/data/sharedData";

export default function MemberPortal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  // Giving form state
  const [givingType, setGivingType] = useState<"tithe" | "offering" | "fund" | "custom">("tithe");
  const [fundType, setFundType] = useState("");
  const [customFundType, setCustomFundType] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // Announcements state
  const [announcementFilter, setAnnouncementFilter] = useState<"all" | "branch" | "department">("all");

  // Events state
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Sermons state
  const [selectedSermon, setSelectedSermon] = useState<any>(null);
  const [showSermonDialog, setShowSermonDialog] = useState(false);

  // Prayer state
  const [showPrayerDialog, setShowPrayerDialog] = useState(false);
  const [prayerType, setPrayerType] = useState<"request" | "testimony">("request");
  const [prayerContent, setPrayerContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Check-in state
  const [checkInCode, setCheckInCode] = useState("");

  // Departments state
  const [showDepartmentDialog, setShowDepartmentDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);

  // Directory state
  const [directoryFilter, setDirectoryFilter] = useState<"leaders" | "members">("leaders");

  // Welfare state
  const [showWelfareDialog, setShowWelfareDialog] = useState(false);
  const [welfareType, setWelfareType] = useState("");
  const [welfareAmount, setWelfareAmount] = useState("");
  const [welfareDescription, setWelfareDescription] = useState("");

  // Counseling state
  const [showCounselingDialog, setShowCounselingDialog] = useState(false);
  const [counselingType, setCounselingType] = useState<"pastor" | "counseling">("pastor");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [counselingNotes, setCounselingNotes] = useState("");

  // Bible state
  const [dailyVerse] = useState({
    verse: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.",
    reference: "Jeremiah 29:11",
  });
  const [savedVerses, setSavedVerses] = useState<string[]>([]);

  // Volunteer state
  const [showVolunteerDialog, setShowVolunteerDialog] = useState(false);
  const [selectedVolunteerRole, setSelectedVolunteerRole] = useState("");

  // Departments state
  const [joinedDepartments, setJoinedDepartments] = useState<string[]>(["D001", "D003"]);
  const [showLeaveDepartmentDialog, setShowLeaveDepartmentDialog] = useState(false);
  const [departmentToLeave, setDepartmentToLeave] = useState<any>(null);
  const [showJoinDepartmentDialog, setShowJoinDepartmentDialog] = useState(false);
  const [departmentToJoin, setDepartmentToJoin] = useState<any>(null);

  // Projects state
  const [showDonateDialog, setShowDonateDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [donationAmount, setDonationAmount] = useState("");

  // Certificates state
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [certificateType, setCertificateType] = useState("");

  // Feedback state
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackType, setFeedbackType] = useState("");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [isAnonymousFeedback, setIsAnonymousFeedback] = useState(false);

  // Chat state
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<{ [chatId: string]: { id: string; text: string; sender: 'incoming' | 'sent'; timestamp: string }[] }>({
    "CH001": [
      { id: "1", text: "God bless you!", sender: "incoming", timestamp: "10:30 AM" },
      { id: "2", text: "Thank you, Pastor! How can I help with the service this Sunday?", sender: "sent", timestamp: "10:32 AM" },
      { id: "3", text: "We need volunteers for the usher team. Would you be available?", sender: "incoming", timestamp: "10:33 AM" },
    ],
    "CH002": [
      { id: "1", text: "Practice at 6 PM", sender: "incoming", timestamp: "2:00 PM" },
      { id: "2", text: "I'll be there!", sender: "sent", timestamp: "2:05 PM" },
    ],
    "CH003": [
      { id: "1", text: "Your request is approved", sender: "incoming", timestamp: "9:00 AM" },
    ],
  });
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [groupChats, setGroupChats] = useState<any[]>([]);
  const [showChatProfile, setShowChatProfile] = useState(false);
  const [groupSettings, setGroupSettings] = useState({ name: "", admin: "", avatar: "" });

  // Education state
  const [educationLevels] = useState([
    { id: "L1", name: "Level 1: Foundations", description: "Basic biblical foundations and introduction to evangelism", progress: 100, completed: true, totalLessons: 10, completedLessons: 10 },
    { id: "L2", name: "Level 2: Discipleship", description: "Deepening your faith and learning to disciple others", progress: 75, completed: false, totalLessons: 12, completedLessons: 9 },
    { id: "L3", name: "Level 3: Ministry", description: "Practical ministry skills and outreach techniques", progress: 30, completed: false, totalLessons: 15, completedLessons: 4 },
    { id: "L4", name: "Level 4: Leadership", description: "Leading teams and developing evangelistic strategies", progress: 0, completed: false, totalLessons: 20, completedLessons: 0 },
    { id: "L5", name: "Level 5: Advanced Evangelism", description: "Master-level evangelism and mentoring others", progress: 0, completed: false, totalLessons: 25, completedLessons: 0 },
  ]);

  // Library state
  const [libraryBooks] = useState([
    { id: "B001", title: "The Purpose Driven Life", author: "Rick Warren", category: "Spiritual Growth", type: "book", cover: "📖", description: "Discover your purpose in life through 40 days of spiritual reflection." },
    { id: "B002", title: "Mere Christianity", author: "C.S. Lewis", category: "Theology", type: "book", cover: "📚", description: "A classic exploration of Christian faith and its relevance to modern life." },
    { id: "B003", title: "The Case for Christ", author: "Lee Strobel", category: "Apologetics", type: "book", cover: "📕", description: "A journalist's investigation of the evidence for Jesus." },
    { id: "B004", title: "Prayer: Finding the Heart's True Home", author: "Richard Foster", category: "Prayer", type: "book", cover: "📗", description: "A guide to deepening your prayer life and spiritual intimacy." },
    { id: "B005", title: "The Cost of Discipleship", author: "Dietrich Bonhoeffer", category: "Discipleship", type: "book", cover: "📘", description: "A profound exploration of what it means to follow Christ." },
    { id: "R001", title: "Bible Study Guide: Romans", author: "Church Resources", category: "Study Materials", type: "resource", cover: "📋", description: "Comprehensive study guide for the book of Romans." },
    { id: "R002", title: "Evangelism Training Manual", author: "Church Resources", category: "Ministry", type: "resource", cover: "📄", description: "Practical guide for sharing your faith effectively." },
    { id: "R003", title: "Worship Leading Handbook", author: "Church Resources", category: "Worship", type: "resource", cover: "🎵", description: "Complete guide for worship leaders and teams." },
  ]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Attendance state
  const [attendanceHistory] = useState([
    { id: "A001", date: "2026-04-20", service: "Sunday Service", status: "present", checkInTime: "09:15 AM", checkOutTime: "11:30 AM" },
    { id: "A002", date: "2026-04-17", service: "Wednesday Bible Study", status: "present", checkInTime: "06:45 PM", checkOutTime: "08:00 PM" },
    { id: "A003", date: "2026-04-13", service: "Sunday Service", status: "present", checkInTime: "09:10 AM", checkOutTime: "11:30 AM" },
    { id: "A004", date: "2026-04-10", service: "Wednesday Bible Study", status: "absent", checkInTime: null, checkOutTime: null },
    { id: "A005", date: "2026-04-06", service: "Sunday Service", status: "present", checkInTime: "09:20 AM", checkOutTime: "11:30 AM" },
    { id: "A006", date: "2026-04-03", service: "Wednesday Bible Study", status: "present", checkInTime: "06:50 PM", checkOutTime: "08:00 PM" },
    { id: "A007", date: "2026-03-30", service: "Sunday Service", status: "present", checkInTime: "09:00 AM", checkOutTime: "11:30 AM" },
    { id: "A008", date: "2026-03-27", service: "Wednesday Bible Study", status: "present", checkInTime: "06:55 PM", checkOutTime: "08:00 PM" },
    { id: "A009", date: "2026-03-23", service: "Sunday Service", status: "absent", checkInTime: null, checkOutTime: null },
    { id: "A010", date: "2026-03-20", service: "Wednesday Bible Study", status: "present", checkInTime: "06:40 PM", checkOutTime: "08:00 PM" },
  ]);
  const attendanceRate = Math.round((attendanceHistory.filter(a => a.status === "present").length / attendanceHistory.length) * 100);

  // Branch state
  const [selectedBranch, setSelectedBranch] = useState("Main Branch");
  const [previousBranch, setPreviousBranch] = useState("Main Branch");
  const [targetBranch, setTargetBranch] = useState("");
  const [showBranchChangeDialog, setShowBranchChangeDialog] = useState(false);
  const [suggestedDepartments, setSuggestedDepartments] = useState<any[]>([]);
  const [faithNumber, setFaithNumber] = useState("");
  const [branchPassword, setBranchPassword] = useState("");
  const [branchChangeError, setBranchChangeError] = useState("");

  // Restore state from navigation if coming back from payment pages
  useEffect(() => {
    if (location.state?.tab === "giving") {
      setActiveTab("giving");
      if (location.state.givingType) setGivingType(location.state.givingType);
      if (location.state.amount) setAmount(location.state.amount);
      if (location.state.fundType) setFundType(location.state.fundType);
      if (location.state.customFundType) setCustomFundType(location.state.customFundType);
    }
  }, [location.state]);

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  // Use currentUser if available, otherwise use mock data
  const currentMember = currentUser || initialMembers[1]; // David Kim as example member

  // Giving history from shared store
  const givingHistory = getGivingHistory().length > 0 ? getGivingHistory() : [
    { id: "G001", type: "Tithe", amount: 900, date: "Apr 6, 2026", method: "EcoCash", status: "Completed", memberId: currentMember.id },
    { id: "G002", type: "Offering", amount: 500, date: "Mar 30, 2026", method: "Paynow", status: "Completed", memberId: currentMember.id },
    { id: "G003", type: "Building Fund", amount: 2000, date: "Mar 15, 2026", method: "Bank Transfer", status: "Completed", memberId: currentMember.id },
  ];

  // Announcements from shared store
  const [announcements, setAnnouncements] = useState(
    getAnnouncements().length > 0 ? getAnnouncements() : [
      { id: "A001", title: "Special Sunday Service", content: "Join us for a special worship service with guest speaker Pastor John. All members are encouraged to attend.", type: "branch", date: "Apr 20, 2026", priority: "high" },
      { id: "A002", title: "Youth Fellowship Meeting", content: "Youth ministry meeting this Friday at 5 PM. Topic: Building Faith in Modern Times.", type: "department", department: "Youth", date: "Apr 22, 2026", priority: "medium" },
      { id: "A003", title: "Choir Practice Schedule Change", content: "Choir practice will now be held on Wednesdays at 6 PM instead of Thursdays. Effective immediately.", type: "department", department: "Choir", date: "Apr 21, 2026", priority: "medium" },
      { id: "A004", title: "Building Fund Progress", content: "Thank you for your generous contributions! We've reached 65% of our building fund target.", type: "branch", date: "Apr 19, 2026", priority: "low" },
      { id: "A005", title: "Men's Breakfast", content: "Monthly men's breakfast this Saturday at 8 AM in the church hall.", type: "department", department: "Men", date: "Apr 23, 2026", priority: "medium" },
    ]
  );

  // Sync announcements with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const updated = getAnnouncements();
      if (updated.length > 0) {
        setAnnouncements(updated);
      }
    };

    const handleCustomEvent = () => {
      const updated = getAnnouncements();
      if (updated.length > 0) {
        setAnnouncements(updated);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("announcementsUpdated", handleCustomEvent);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("announcementsUpdated", handleCustomEvent);
    };
  }, []);

  // Events from shared store
  const [events, setEvents] = useState(
    getEvents().length > 0 ? getEvents() : [
      { id: "E001", title: "Sunday Service", date: "Apr 27, 2026", time: "9:00 AM", venue: "Main Sanctuary", theme: "The Power of Prayer", rsvp: 45, max: 200 },
      { id: "E002", title: "Youth Concert", date: "May 3, 2026", time: "5:00 PM", venue: "Church Hall", theme: "Worship & Praise", rsvp: 30, max: 100 },
      { id: "E003", title: "Women's Conference", date: "May 10, 2026", time: "9:00 AM", venue: "Main Sanctuary", theme: "Women of Faith", rsvp: 60, max: 150 },
      { id: "E004", title: "Bible Study", date: "May 7, 2026", time: "6:00 PM", venue: "Room 3", theme: "Book of Romans", rsvp: 20, max: 50 },
      { id: "E005", title: "Men's Retreat", date: "May 17-18, 2026", time: "6:00 PM", venue: "Camp David", theme: "Stepping Up", rsvp: 25, max: 40 },
    ]
  );

  // Sync events with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const updated = getEvents();
      if (updated.length > 0) {
        setEvents(updated);
      }
    };

    const handleCustomEvent = () => {
      const updated = getEvents();
      if (updated.length > 0) {
        setEvents(updated);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("eventsUpdated", handleCustomEvent);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("eventsUpdated", handleCustomEvent);
    };
  }, []);

  // Mock sermons
  const sermons = [
    { id: "S001", title: "Walking in Faith", speaker: "Pastor John", date: "Apr 14, 2026", type: "video", duration: "45:00", thumbnail: "" },
    { id: "S002", title: "The Power of Prayer", speaker: "Pastor Sarah", date: "Apr 7, 2026", type: "audio", duration: "38:00", thumbnail: "" },
    { id: "S003", title: "Understanding Grace", speaker: "Pastor John", date: "Mar 31, 2026", type: "video", duration: "52:00", thumbnail: "" },
    { id: "S004", title: "Daily Devotional: Psalm 23", speaker: "Pastor Sarah", date: "Apr 15, 2026", type: "devotional", duration: "5:00", thumbnail: "" },
  ];

  // Mock prayer requests
  const prayerRequests = [
    { id: "P001", content: "Please pray for my mother's health - she's undergoing surgery tomorrow.", type: "request", status: "received", date: "Apr 20, 2026", isAnonymous: false, author: "David Kim" },
    { id: "P002", content: "Thank you for the prayers - my mother's surgery was successful!", type: "testimony", status: "approved", date: "Apr 21, 2026", isAnonymous: false, author: "David Kim" },
    { id: "P003", content: "Pray for job opportunities.", type: "request", status: "prayed", date: "Apr 19, 2026", isAnonymous: true, author: "Anonymous" },
  ];

  // Mock departments
  const departments = [
    { id: "D001", name: "Choir", description: "Lead worship through music", leader: "Mary Johnson", contact: "choir@church.org", members: 25, schedule: "Wednesdays 6 PM" },
    { id: "D002", name: "Ushers", description: "Assist with service logistics", leader: "John Smith", contact: "ushers@church.org", members: 18, schedule: "Sundays 8 AM" },
    { id: "D003", name: "Youth Ministry", description: "Mentor and guide young people", leader: "Pastor Sarah", contact: "youth@church.org", members: 40, schedule: "Fridays 5 PM" },
    { id: "D004", name: "Women's Fellowship", description: "Support and empower women", leader: "Grace Dube", contact: "women@church.org", members: 35, schedule: "Saturdays 10 AM" },
    { id: "D005", name: "Men's Ministry", description: "Build strong men of faith", leader: "Robert Wilson", contact: "men@church.org", members: 30, schedule: "Saturdays 8 AM" },
  ];

  // Mock church leaders
  const churchLeaders = [
    { id: "L001", name: "Pastor John", role: "Senior Pastor", phone: "+263 123 456 789", email: "pastor@church.org", department: "Leadership" },
    { id: "L002", name: "Pastor Sarah", role: "Associate Pastor", phone: "+263 123 456 790", email: "sarah@church.org", department: "Leadership" },
    { id: "L003", name: "Elder James", role: "Elder", phone: "+263 123 456 791", email: "james@church.org", department: "Leadership" },
    { id: "L004", name: "Deacon Peter", role: "Deacon", phone: "+263 123 456 792", email: "peter@church.org", department: "Leadership" },
  ];

  // Mock welfare requests
  const welfareRequests = [
    { id: "W001", type: "School Fees", amount: 500, status: "pending", date: "Apr 20, 2026", description: "Support for school fees for 2 children" },
    { id: "W002", type: "Food Support", amount: 200, status: "approved", date: "Apr 15, 2026", description: "Monthly food support" },
    { id: "W003", type: "Rent Assistance", amount: 300, status: "rejected", date: "Apr 10, 2026", description: "Help with rent payment" },
  ];

  // Mock appointments
  const appointments = [
    { id: "A001", type: "Pastor Meeting", date: "Apr 25, 2026", time: "10:00 AM", status: "confirmed", pastor: "Pastor John" },
    { id: "A002", type: "Counseling", date: "May 2, 2026", time: "2:00 PM", status: "pending", pastor: "Pastor Sarah" },
  ];

  // Mock reading plan
  const readingPlan = [
    { day: 1, passage: "Genesis 1-3", title: "Creation", completed: true },
    { day: 2, passage: "Genesis 4-7", title: "Fall & Flood", completed: true },
    { day: 3, passage: "Genesis 8-11", title: "New Beginning", completed: false },
    { day: 4, passage: "Genesis 12-15", title: "Abraham's Call", completed: false },
    { day: 5, passage: "Genesis 16-18", title: "Promise & Covenant", completed: false },
  ];

  // Mock volunteer roles
  const volunteerRoles = [
    { id: "V001", name: "Ushers", description: "Help with seating and service logistics", time: "Sundays 8 AM - 12 PM", volunteers: 18, needed: 25 },
    { id: "V002", name: "Choir", description: "Lead worship through music", time: "Wednesdays 6 PM", volunteers: 25, needed: 30 },
    { id: "V003", name: "Media Team", description: "Handle sound, lighting, and livestream", time: "Sundays 7 AM - 1 PM", volunteers: 8, needed: 12 },
    { id: "V004", name: "Children's Ministry", description: "Teach and care for children", time: "Sundays 9 AM - 12 PM", volunteers: 12, needed: 20 },
  ];

  // Mock volunteer schedule
  const volunteerSchedule = [
    { id: "S001", role: "Ushers", date: "Apr 28, 2026", time: "8 AM - 12 PM", status: "assigned" },
    { id: "S002", role: "Choir", date: "May 1, 2026", time: "6 PM", status: "pending" },
  ];

  // Mock projects
  const projects = [
    { id: "P001", name: "Building Fund", target: 50000, raised: 35000, description: "New church building construction", deadline: "Dec 2026" },
    { id: "P002", name: "Borehole Project", target: 8000, raised: 6500, description: "Water borehole for community", deadline: "Jun 2026" },
    { id: "P003", name: "Church Bus", target: 25000, raised: 12000, description: "Transport for elderly and children", deadline: "Sep 2026" },
  ];

  // Mock certificates
  const certificates = [
    { id: "C001", type: "Baptism Certificate", status: "approved", date: "Apr 15, 2026" },
    { id: "C002", type: "Membership Letter", status: "pending", date: "Apr 20, 2026" },
  ];

  // Mock alerts
  const alerts = [
    { id: "A001", type: "Funeral", title: "Funeral Service for Brother John", date: "Apr 25, 2026", time: "10 AM", location: "Main Sanctuary" },
    { id: "A002", type: "Emergency Prayer", title: "Emergency Prayer Meeting", date: "Apr 23, 2026", time: "6 PM", location: "Main Sanctuary" },
    { id: "A003", type: "Hospital Support", title: "Hospital Visit Request", date: "Apr 24, 2026", time: "2 PM", location: "City Hospital" },
  ];

  // Mock shop items
  const shopItems = [
    { id: "SH001", name: "Church T-Shirt", price: 25, image: "👕", description: "Official church t-shirt" },
    { id: "SH002", name: "Daily Devotional Book", price: 15, image: "📖", description: "30-day devotional guide" },
    { id: "SH003", name: "Worship CD", price: 10, image: "💿", description: "Live worship recording" },
    { id: "SH004", name: "Church Mug", price: 12, image: "☕", description: "Ceramic church mug" },
  ];

  // Mock branches
  const branches = ["Main Branch", "North Branch", "South Branch", "East Branch"];

  // Mock chats
  const chats = [
    { id: "CH001", name: "Pastor John", role: "Senior Pastor", lastMessage: "God bless you!", unread: 2, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
    { id: "CH002", name: "Choir Leader", role: "Department", lastMessage: "Practice at 6 PM", unread: 0, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
    { id: "CH003", name: "Church Admin", role: "Admin", lastMessage: "Your request is approved", unread: 1, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border/30 sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Church className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">FAITHFLOW</span>
            <span className="text-2xl font-thin text-muted-foreground">/</span>
            <span className="text-sm font-bold tracking-widest text-muted-foreground uppercase ml-1">PORTAL</span>
          </div>

          <div className="flex-1 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("chat")}
              className="rounded-full font-medium"
            >
              <Send className="h-4 w-4 mr-2" /> Chat
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle className="rounded-full" />
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full border-2">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex gap-6 h-[calc(100vh-80px)]">
        {/* Sidebar Navigation */}
        <aside className="w-64 h-[calc(100vh-80px)] flex flex-col bg-card border-r shrink-0 sticky top-0">
          {/* Nav */}
          <nav className="flex-1 px-3 space-y-4 mt-2 overflow-y-auto overflow-x-hidden">
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground/60 px-4 mb-3 uppercase">
                  MAIN
                </p>
                <div className="space-y-0.5">
                  {[
                    { id: "profile", label: "Profile", icon: UserCircle },
                    { id: "overview", label: "Overview", icon: User },
                    { id: "announcements", label: "Announcements", icon: Megaphone },
                    { id: "events", label: "Events", icon: CalendarIcon },
                    { id: "sermons", label: "Sermons", icon: Video },
                    { id: "prayer", label: "Prayer", icon: MessageCircle },
                    { id: "branch", label: "Branch", icon: Building },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${isActive ? "sidebar-nav-item-active" : "sidebar-nav-item"} w-full`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground/60 px-4 mb-3 uppercase">
                  MINISTRY
                </p>
                <div className="space-y-0.5">
                  {[
                    { id: "directory", label: "Directory", icon: Phone },
                    { id: "volunteer", label: "Volunteer", icon: HandHeart },
                    { id: "projects", label: "Projects", icon: Building2 },
                    { id: "welfare", label: "Welfare", icon: FileCheck },
                    { id: "counseling", label: "Counseling", icon: CalendarDays },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${isActive ? "sidebar-nav-item-active" : "sidebar-nav-item"} w-full`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground/60 px-4 mb-3 uppercase">
                  SPIRITUAL
                </p>
                <div className="space-y-0.5">
                  {[
                    { id: "bible", label: "Bible", icon: Bookmark },
                    { id: "education", label: "Education", icon: BookOpen },
                    { id: "library", label: "Library", icon: FileText },
                    { id: "certificates", label: "Certificates", icon: Award },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${isActive ? "sidebar-nav-item-active" : "sidebar-nav-item"} w-full`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground/60 px-4 mb-3 uppercase">
                  COMMUNITY
                </p>
                <div className="space-y-0.5">
                  {[
                    { id: "alerts", label: "Alerts", icon: AlertTriangle },
                    { id: "shop", label: "Shop", icon: ShoppingBag },
                    { id: "feedback", label: "Feedback", icon: MessageSquare },
                    { id: "chat", label: "Chat", icon: Send },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${isActive ? "sidebar-nav-item-active" : "sidebar-nav-item"} w-full`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground/60 px-4 mb-3 uppercase">
                  PERSONAL
                </p>
                <div className="space-y-0.5">
                  {[
                    { id: "attendance", label: "My Attendance", icon: Calendar },
                    { id: "groups", label: "My Groups", icon: Users },
                    { id: "giving", label: "My Giving", icon: Heart },
                    { id: "resources", label: "Resources", icon: BookOpen },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${isActive ? "sidebar-nav-item-active" : "sidebar-nav-item"} w-full`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* User */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                  {currentMember.name.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{currentMember.name}</p>
                  <p className="text-xs text-muted-foreground">{currentMember.id}</p>
                  <p className="text-xs text-muted-foreground">{currentMember.department}</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 card-surface p-6 min-h-[500px] flex flex-col overflow-y-auto">
            {/* Content */}
        {activeTab === "announcements" && (
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-bold tracking-tight mb-2">Latest releases</h2>
              
              {/* Filter */}
              <div className="flex gap-4 border-b border-border/50 pb-4">
                <button
                  onClick={() => setAnnouncementFilter("all")}
                  className={`text-sm font-medium transition-colors relative ${
                    announcementFilter === "all"
                      ? "text-foreground after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setAnnouncementFilter("branch")}
                  className={`text-sm font-medium transition-colors relative ${
                    announcementFilter === "branch"
                      ? "text-foreground after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Branch
                </button>
                <button
                  onClick={() => setAnnouncementFilter("department")}
                  className={`text-sm font-medium transition-colors relative ${
                    announcementFilter === "department"
                      ? "text-foreground after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Department
                </button>
              </div>
            </div>

            {/* Announcements Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements
                .filter((a) => {
                  if (announcementFilter === "all") return true;
                  if (announcementFilter === "branch") return a.type === "branch";
                  if (announcementFilter === "department") return a.type === "department" && a.department === currentMember.department;
                  return true;
                })
                .map((announcement) => (
                  <div key={announcement.id} className="card-surface p-8 rounded-[2.5rem] bg-secondary/30 border-none flex flex-col h-full hover:bg-secondary/40 transition-colors group">
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold mb-4 tracking-tight leading-tight">
                        {announcement.title}
                      </h3>
                      <p className="text-lg text-muted-foreground/80 leading-relaxed line-clamp-4 mb-8">
                        {announcement.content}
                      </p>
                    </div>
                    
                    <div className="mt-auto pt-8 border-t border-border/50">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">DATE</span>
                        <span className="text-sm font-medium">{announcement.date}</span>
                      </div>
                      <div className="flex justify-between items-center mb-8">
                        <span className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">CATEGORY</span>
                        <span className="text-sm font-medium">{announcement.type === 'branch' ? 'General' : announcement.department}</span>
                      </div>
                      
                      <button 
                        onClick={() => setSelectedAnnouncement(announcement)}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
                      >
                        Read announcement <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {events.map((event) => (
                <div key={event.id} className="card-surface p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{event.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{event.theme}</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{event.rsvp}/{event.max} Confirmed</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventDialog(true);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "sermons" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {sermons.map((sermon) => (
                <div key={sermon.id} className="card-surface p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{sermon.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{sermon.speaker} • {sermon.date}</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      {sermon.type === "video" ? <Video className="h-5 w-5 text-primary" /> : sermon.type === "audio" ? <Music className="h-5 w-5 text-primary" /> : <FileText className="h-5 w-5 text-primary" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4" />
                    <span>{sermon.duration}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedSermon(sermon);
                        setShowSermonDialog(true);
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {sermon.type === "devotional" ? "Read" : "Watch"}
                    </Button>
                    {sermon.type !== "devotional" && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "prayer" && (
          <div className="space-y-6">
            <div className="flex gap-2">
              <Button
                variant={prayerType === "request" ? "default" : "outline"}
                onClick={() => setPrayerType("request")}
              >
                Prayer Requests
              </Button>
              <Button
                variant={prayerType === "testimony" ? "default" : "outline"}
                onClick={() => setPrayerType("testimony")}
              >
                Testimonies
              </Button>
            </div>

            <Button onClick={() => setShowPrayerDialog(true)}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Submit {prayerType === "request" ? "Prayer Request" : "Testimony"}
            </Button>

            <div className="space-y-4">
              {prayerRequests
                .filter((p) => p.type === prayerType)
                .map((prayer) => (
                  <div key={prayer.id} className="card-surface p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-sm mb-2">{prayer.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {prayer.author} • {prayer.date}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        prayer.status === "received" ? "bg-blue-500/20 text-blue-400" :
                        prayer.status === "prayed" ? "bg-emerald-500/20 text-emerald-400" :
                        "bg-amber-500/20 text-amber-400"
                      }`}>
                        {prayer.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "checkin" && (
          <div className="space-y-6">
            <div className="card-surface p-6 text-center">
              <QrCode className="h-32 w-32 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Scan to Check In</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Scan the QR code displayed at the church entrance to check in for today's service.
              </p>
              <div className="max-w-xs mx-auto">
                <Label>Or enter check-in code</Label>
                <Input
                  placeholder="Enter 6-digit code"
                  value={checkInCode}
                  onChange={(e) => setCheckInCode(e.target.value)}
                  className="mt-2"
                  maxLength={6}
                />
                <Button className="w-full mt-3">Check In</Button>
              </div>
            </div>

            <div className="card-surface p-5">
              <h3 className="font-semibold mb-3">Recent Check-Ins</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Sunday Service - Apr 20, 2026</span>
                  <span className="text-emerald-400">Checked in</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Sunday Service - Apr 13, 2026</span>
                  <span className="text-emerald-400">Checked in</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Sunday Service - Apr 6, 2026</span>
                  <span className="text-emerald-400">Checked in</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "directory" && (
          <div className="space-y-6">
            <div className="flex gap-2">
              <Button
                variant={directoryFilter === "leaders" ? "default" : "outline"}
                onClick={() => setDirectoryFilter("leaders")}
              >
                Church Leaders
              </Button>
              <Button
                variant={directoryFilter === "members" ? "default" : "outline"}
                onClick={() => setDirectoryFilter("members")}
              >
                Member Directory
              </Button>
            </div>

            {directoryFilter === "leaders" ? (
              <div className="grid md:grid-cols-2 gap-4">
                {churchLeaders.map((leader) => (
                  <div key={leader.id} className="card-surface p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{leader.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{leader.role}</p>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <UserCircle className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{leader.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{leader.email}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Mail className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {initialMembers.slice(0, 6).map((member) => (
                  <div key={member.id} className="card-surface p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{member.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{member.department}</p>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <UserCircle className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{member.email}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Mail className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "welfare" && (
          <div className="space-y-6">
            <Button onClick={() => setShowWelfareDialog(true)}>
              <FileCheck className="h-4 w-4 mr-2" />
              Apply for Welfare Support
            </Button>

            <div className="space-y-4">
              {welfareRequests.map((request) => (
                <div key={request.id} className="card-surface p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{request.type}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{request.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      request.status === "pending" ? "bg-amber-500/20 text-amber-400" :
                      request.status === "approved" ? "bg-emerald-500/20 text-emerald-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{request.date}</span>
                    <span className="font-medium">${request.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "counseling" && (
          <div className="space-y-6">
            <Button onClick={() => setShowCounselingDialog(true)}>
              <CalendarCheck className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>

            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="card-surface p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{appointment.type}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{appointment.pastor}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      appointment.status === "confirmed" ? "bg-emerald-500/20 text-emerald-400" :
                      "bg-amber-500/20 text-amber-400"
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{appointment.date} • {appointment.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "bible" && (
          <div className="space-y-6">
            {/* Daily Verse */}
            <div className="card-surface p-6">
              <h3 className="font-semibold mb-3">Daily Verse</h3>
              <p className="text-lg mb-2 italic">"{dailyVerse.verse}"</p>
              <p className="text-sm text-muted-foreground mb-4">- {dailyVerse.reference}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (!savedVerses.includes(dailyVerse.verse)) {
                    setSavedVerses([...savedVerses, dailyVerse.verse]);
                  }
                }}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                Save Verse
              </Button>
            </div>

            {/* Reading Plan */}
            <div className="card-surface p-6">
              <h3 className="font-semibold mb-4">Reading Plan</h3>
              <div className="space-y-3">
                {readingPlan.map((day) => (
                  <div
                    key={day.day}
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      day.completed ? "bg-emerald-500/10" : "bg-muted/50"
                    }`}
                  >
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                      day.completed ? "bg-emerald-500 text-white" : "bg-muted"
                    }`}>
                      {day.completed ? "✓" : day.day}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{day.title}</p>
                      <p className="text-xs text-muted-foreground">{day.passage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Verses */}
            {savedVerses.length > 0 && (
              <div className="card-surface p-6">
                <h3 className="font-semibold mb-4">Saved Verses</h3>
                <div className="space-y-3">
                  {savedVerses.map((verse, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm italic">"{verse}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "education" && (
          <div className="space-y-6">
            <div className="card-surface p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Evangelist Training Program</h3>
                  <p className="text-sm text-muted-foreground">Progress through the levels to become a certified evangelist</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>

              {/* Overall Progress */}
              <div className="mb-6 p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-primary font-semibold">41%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: "41%" }}></div>
                </div>
              </div>

              {/* Levels */}
              <div className="space-y-4">
                {educationLevels.map((level, index) => (
                  <div
                    key={level.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      level.completed
                        ? "border-emerald-500 bg-emerald-500/10"
                        : level.progress > 0
                        ? "border-primary/50 bg-primary/5"
                        : "border-border bg-muted/30"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{level.name}</h4>
                          {level.completed && (
                            <span className="px-2 py-0.5 text-xs bg-emerald-500 text-white rounded-full">Completed</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{level.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {level.completedLessons} of {level.totalLessons} lessons completed
                        </p>
                      </div>
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        level.completed
                          ? "bg-emerald-500 text-white"
                          : level.progress > 0
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {level.completed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-semibold">{index + 1}</span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Progress</span>
                        <span className="text-xs font-medium">{level.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            level.completed
                              ? "bg-emerald-500"
                              : level.progress > 0
                              ? "bg-primary"
                              : "bg-muted"
                          }`}
                          style={{ width: `${level.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {level.completed ? (
                      <Button size="sm" variant="outline" className="w-full" disabled>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </Button>
                    ) : level.progress > 0 ? (
                      <Button size="sm" className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Continue Learning
                      </Button>
                    ) : index === 0 || educationLevels[index - 1].completed ? (
                      <Button size="sm" className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Start Level
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="w-full" disabled>
                        <Lock className="h-4 w-4 mr-2" />
                        Locked - Complete previous level
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "library" && (
          <div className="space-y-6">
            <div className="card-surface p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Digital Library</h3>
                  <p className="text-sm text-muted-foreground">Access church-related books and resources for your spiritual growth</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {["All", "Spiritual Growth", "Theology", "Apologetics", "Prayer", "Discipleship", "Study Materials", "Ministry", "Worship"].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Books and Resources Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {libraryBooks
                  .filter((item) => selectedCategory === "All" || item.category === selectedCategory)
                  .map((item) => (
                    <div key={item.id} className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-all cursor-pointer">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="h-16 w-12 rounded bg-primary/10 flex items-center justify-center text-2xl">
                          {item.cover}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1 line-clamp-2">{item.title}</h4>
                          <p className="text-xs text-muted-foreground mb-1">{item.author}</p>
                          <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                            item.type === "book" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                          }`}>
                            {item.type === "book" ? "Book" : "Resource"}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{item.category}</span>
                        <Button size="sm" variant="ghost" className="h-8 text-xs">
                          {item.type === "book" ? "Read" : "View"}
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>

              {libraryBooks.filter((item) => selectedCategory === "All" || item.category === selectedCategory).length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No items found in this category</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "volunteer" && (
          <div className="space-y-6">
            <Button onClick={() => setShowVolunteerDialog(true)}>
              <HandHeart className="h-4 w-4 mr-2" />
              Sign Up to Volunteer
            </Button>

            <div className="card-surface p-6">
              <h3 className="font-semibold mb-4">My Service Schedule</h3>
              <div className="space-y-3">
                {volunteerSchedule.map((schedule) => (
                  <div key={schedule.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{schedule.role}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        schedule.status === "assigned" ? "bg-emerald-500/20 text-emerald-400" :
                        "bg-amber-500/20 text-amber-400"
                      }`}>
                        {schedule.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{schedule.date} • {schedule.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-surface p-6">
              <h3 className="font-semibold mb-4">Available Volunteer Roles</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {volunteerRoles.map((role) => (
                  <div key={role.id} className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-1">{role.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{role.description}</p>
                    <p className="text-xs text-muted-foreground mb-2">{role.time}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>{role.volunteers} volunteers</span>
                      <span className="text-muted-foreground">Need {role.needed}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-1 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="card-surface p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{project.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                      <p className="text-xs text-muted-foreground">Deadline: {project.deadline}</p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">${project.raised.toLocaleString()} / ${project.target.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${(project.raised / project.target) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{Math.round((project.raised / project.target) * 100)}% complete</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedProject(project);
                      setShowDonateDialog(true);
                    }}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Contribute
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "certificates" && (
          <div className="space-y-6">
            <Button onClick={() => setShowCertificateDialog(true)}>
              <Award className="h-4 w-4 mr-2" />
              Request Certificate
            </Button>

            <div className="space-y-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="card-surface p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{cert.type}</h3>
                      <p className="text-xs text-muted-foreground mb-2">Requested: {cert.date}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      cert.status === "approved" ? "bg-emerald-500/20 text-emerald-400" :
                      "bg-amber-500/20 text-amber-400"
                    }`}>
                      {cert.status}
                    </span>
                  </div>
                  {cert.status === "approved" && (
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className={`card-surface p-5 border-l-4 ${
                alert.type === "Funeral" ? "border-l-gray-500" :
                alert.type === "Emergency Prayer" ? "border-l-amber-500" :
                "border-l-blue-500"
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    alert.type === "Funeral" ? "bg-gray-500/20" :
                    alert.type === "Emergency Prayer" ? "bg-amber-500/20" :
                    "bg-blue-500/20"
                  }`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted">
                        {alert.type}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">{alert.title}</h3>
                    <p className="text-sm text-muted-foreground">{alert.date} • {alert.time}</p>
                    <p className="text-sm text-muted-foreground">{alert.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "shop" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {shopItems.map((item) => (
                <div key={item.id} className="card-surface p-4">
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-3 text-4xl">
                    {item.image}
                  </div>
                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">${item.price}</span>
                    <Button size="sm">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "feedback" && (
          <div className="space-y-6">
            <Button onClick={() => setShowFeedbackDialog(true)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Submit Feedback
            </Button>

            <div className="card-surface p-6">
              <h3 className="font-semibold mb-4">Recent Feedback</h3>
              <p className="text-sm text-muted-foreground">No feedback submitted yet.</p>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="flex gap-4 flex-1 min-h-0">
            {/* Chat List */}
            <div className="w-80 space-y-2 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Messages</h3>
                <Button size="sm" onClick={() => setShowCreateGroup(true)}>
                  <Users className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>
              
              {/* Individual Chats */}
              <div className="mb-4">
                <div className="px-2 mb-2">
                  <Input
                    placeholder="Search members..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <p className="text-xs text-muted-foreground mb-2 px-2">Direct Messages</p>
                {initialMembers
                  .filter(m => m.id !== currentMember.id)
                  .filter(m => 
                    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
                    m.id.toLowerCase().includes(memberSearch.toLowerCase()) ||
                    m.department.toLowerCase().includes(memberSearch.toLowerCase())
                  )
                  .map((member) => (
                  <div
                    key={member.id}
                    className={`p-5 rounded-[2rem] cursor-pointer transition-all duration-300 ${
                      selectedChat?.id === member.id 
                        ? "bg-primary text-primary-foreground shadow-xl scale-[1.02]" 
                        : "hover:bg-secondary/40"
                    }`}
                    onClick={() => setSelectedChat({
                      id: member.id,
                      name: member.name,
                      role: member.role,
                      lastMessage: "Start a conversation",
                      unread: 0,
                      avatar: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face`
                    })}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-semibold border-2 ${
                          selectedChat?.id === member.id ? "border-primary-foreground/20 bg-primary-foreground/20" : "border-transparent bg-primary/20"
                        }`}
                      >
                        {member.name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h3 className="font-bold truncate">{member.name}</h3>
                        </div>
                        <p className={`text-[11px] font-bold uppercase tracking-widest opacity-60`}>{member.role}</p>
                        <p className={`text-sm mt-1 truncate ${selectedChat?.id === member.id ? "opacity-90" : "text-muted-foreground"}`}>{member.department}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Group Chats */}
              {groupChats.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 px-2">Groups</p>
                  {groupChats.map((group) => (
                    <div
                      key={group.id}
                      className={`card-surface p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedChat?.id === group.id ? "bg-primary/10" : ""
                      }`}
                      onClick={() => setSelectedChat(group)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium truncate">{group.name}</h3>
                            {group.unread > 0 && (
                              <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">
                                {group.unread}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{group.memberCount} members</p>
                          <p className="text-sm mt-1 truncate">{group.lastMessage}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Conversation */}
            {selectedChat ? (
              <div className="flex-1 card-surface p-4 flex flex-col relative overflow-hidden h-full">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundColor: '#1a1a2e',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '60px 60px'
                }}></div>

                <div 
                  className="flex items-center gap-2 mb-4 pb-4 border-b relative z-10 cursor-pointer hover:bg-muted/50 rounded p-2 -mx-2 transition-colors flex-shrink-0"
                  onClick={() => {
                    if (selectedChat?.isGroup) {
                      setGroupSettings({
                        name: selectedChat.name,
                        admin: currentMember.id,
                        avatar: ""
                      });
                    }
                    setShowChatProfile(true);
                  }}
                >
                  <img
                    src={selectedChat?.avatar}
                    alt={selectedChat?.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{selectedChat?.name}</h3>
                    <p className="text-xs text-muted-foreground">{selectedChat?.role || (selectedChat?.isGroup ? `${selectedChat?.memberCount} members` : "")}</p>
                  </div>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto relative z-10 min-h-0">
                  {chatMessages[selectedChat?.id]?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'sent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`p-3 rounded-lg max-w-[70%] border border-border shadow-sm ${
                        msg.sender === 'sent'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/50'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 relative z-10 flex-shrink-0 mt-4">
                  <Textarea
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (chatMessage.trim() && selectedChat) {
                          const newMessage = {
                            id: Date.now().toString(),
                            text: chatMessage,
                            sender: 'sent' as const,
                            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                          };
                          setChatMessages({
                            ...chatMessages,
                            [selectedChat.id]: [...(chatMessages[selectedChat.id] || []), newMessage]
                          });
                          setChatMessage("");
                        }
                      }
                    }}
                    className="flex-1 min-h-[40px] max-h-32 resize-none"
                    rows={1}
                  />
                  <Button onClick={() => {
                    if (chatMessage.trim() && selectedChat) {
                      const newMessage = {
                        id: Date.now().toString(),
                        text: chatMessage,
                        sender: 'sent' as const,
                        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                      };
                      setChatMessages({
                        ...chatMessages,
                        [selectedChat.id]: [...(chatMessages[selectedChat.id] || []), newMessage]
                      });
                      setChatMessage("");
                    }
                  }}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <style>{`
                  @keyframes moveBackground {
                    0% { background-position: 0 0; }
                    100% { background-position: 40px 40px; }
                  }
                `}</style>
              </div>
            ) : (
              <div className="flex-1 rounded-[2.5rem] bg-secondary/20 border-2 border-dashed border-border/50 flex flex-col items-center justify-center p-12 text-center gap-6">
                <div className="h-24 w-24 rounded-[2rem] bg-background flex items-center justify-center shadow-inner">
                  <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight mb-2">Your messages</h3>
                  <p className="text-muted-foreground max-w-[280px]">Select a conversation from the left to start messaging your ministry leaders.</p>
                </div>
                <Button className="rounded-full px-8 font-black uppercase text-xs tracking-widest mt-4">
                  New Message
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "overview" && (
          <div className="space-y-8">
            <h2 className="text-4xl font-bold tracking-tight">Overview</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card-surface p-8 rounded-[2.5rem] bg-secondary/30 border-none flex flex-col gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-1">ATTENDANCE RATE</p>
                  <p className="text-4xl font-bold">85%</p>
                </div>
                <p className="text-sm text-muted-foreground mt-auto">Last 12 months</p>
              </div>

              <div className="card-surface p-8 rounded-[2.5rem] bg-secondary/30 border-none flex flex-col gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-1">TOTAL GIVING</p>
                  <p className="text-4xl font-bold">$1,250</p>
                </div>
                <p className="text-sm text-muted-foreground mt-auto">This year</p>
              </div>

              <div className="card-surface p-8 rounded-[2.5rem] bg-secondary/30 border-none flex flex-col gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-1">GROUPS</p>
                  <p className="text-4xl font-bold">2</p>
                </div>
                <p className="text-sm text-muted-foreground mt-auto">Active memberships</p>
              </div>
            </div>

            <div className="card-surface p-8 rounded-[2.5rem] bg-secondary/30 border-none">
              <h3 className="text-2xl font-bold mb-6 tracking-tight">Upcoming Events</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-background/50 rounded-3xl border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-xl font-bold">
                      27
                    </div>
                    <div>
                      <p className="font-bold text-lg">Sunday Service</p>
                      <p className="text-sm text-muted-foreground">This Sunday at 9:00 AM • Main Sanctuary</p>
                    </div>
                  </div>
                  <Button className="rounded-2xl font-bold px-6">Confirm Attendance</Button>
                </div>
                <div className="flex items-center justify-between p-6 bg-background/50 rounded-3xl border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-xl font-bold">
                      03
                    </div>
                    <div>
                      <p className="font-bold text-lg">Youth Fellowship</p>
                      <p className="text-sm text-muted-foreground">Friday at 5:00 PM • Youth Hall</p>
                    </div>
                  </div>
                  <Button className="rounded-2xl font-bold px-6">Confirm Attendance</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="space-y-6">
            <div className="card-surface p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                  <p className="text-2xl font-bold">{attendanceRate}%</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Last 10 services</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="card-surface p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="text-sm text-muted-foreground">Total Present</p>
                </div>
                <p className="text-2xl font-bold">{attendanceHistory.filter(a => a.status === "present").length}</p>
                <p className="text-xs text-muted-foreground">out of {attendanceHistory.length} services</p>
              </div>
              <div className="card-surface p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <X className="h-4 w-4 text-red-500" />
                  </div>
                  <p className="text-sm text-muted-foreground">Total Absent</p>
                </div>
                <p className="text-2xl font-bold">{attendanceHistory.filter(a => a.status === "absent").length}</p>
                <p className="text-xs text-muted-foreground">missed services</p>
              </div>
              <div className="card-surface p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                </div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">consecutive services</p>
              </div>
            </div>

            {/* Monthly Attendance Graph */}
            <div className="card-surface p-6">
              <h3 className="font-semibold mb-4">Monthly Attendance Trend</h3>
              <div className="space-y-3">
                {[
                  { month: "April", present: 4, total: 4 },
                  { month: "March", present: 4, total: 6 },
                ].map((data) => (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{data.month}</span>
                      <span className="text-muted-foreground">{data.present}/{data.total} present</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${(data.present / data.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Type Breakdown */}
            <div className="card-surface p-6">
              <h3 className="font-semibold mb-4">Service Type Breakdown</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Sunday Service</span>
                    <span className="text-sm text-muted-foreground">5 attended</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "83%" }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">83% attendance rate</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Wednesday Bible Study</span>
                    <span className="text-sm text-muted-foreground">3 attended</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "75%" }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">75% attendance rate</p>
                </div>
              </div>
            </div>

            <div className="card-surface p-6">
              <h3 className="font-semibold mb-4">Attendance History</h3>
              <div className="space-y-3">
                {attendanceHistory.map((record) => (
                  <div
                    key={record.id}
                    className={`p-4 rounded-lg border-2 ${
                      record.status === "present"
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : "border-red-500/30 bg-red-500/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          record.status === "present"
                            ? "bg-emerald-500 text-white"
                            : "bg-red-500 text-white"
                        }`}>
                          {record.status === "present" ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{record.service}</p>
                          <p className="text-xs text-muted-foreground">{record.date}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        record.status === "present"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {record.status === "present" ? "Present" : "Absent"}
                      </span>
                    </div>
                    {record.status === "present" && (
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
                        <span>Check-in: {record.checkInTime}</span>
                        <span>Check-out: {record.checkOutTime}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "groups" && (
          <div className="space-y-6">
            <div className="card-surface p-6">
              <h3 className="font-semibold mb-4">My Groups / Departments</h3>
              {joinedDepartments.length === 0 ? (
                <p className="text-sm text-muted-foreground">You haven't joined any departments yet.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {departments.filter(dept => joinedDepartments.includes(dept.id)).map((dept) => (
                    <div key={dept.id} className="card-surface p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{dept.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{dept.description}</p>
                        </div>
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <UsersIcon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Leader:</span>
                          <span>{dept.leader}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Schedule:</span>
                          <span>{dept.schedule}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Members:</span>
                          <span>{dept.members}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setDepartmentToLeave(dept);
                          setShowLeaveDepartmentDialog(true);
                        }}
                      >
                        Leave Department
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card-surface p-6">
              <h3 className="font-semibold mb-4">Available Departments</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {departments.filter(dept => !joinedDepartments.includes(dept.id)).map((dept) => (
                  <div key={dept.id} className="card-surface p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{dept.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{dept.description}</p>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <UsersIcon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Leader:</span>
                        <span>{dept.leader}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Schedule:</span>
                        <span>{dept.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Members:</span>
                        <span>{dept.members}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setDepartmentToJoin(dept);
                        setShowJoinDepartmentDialog(true);
                      }}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join Department
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "giving" && (
          <div className="space-y-6">
            {/* Giving Form */}
            <div className="card-surface p-6">
              <h3 className="font-semibold mb-4">Give Online</h3>
              <div className="space-y-4">
                <div>
                  <Label>Giving Type</Label>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setGivingType("tithe")}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        givingType === "tithe"
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Heart className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm">Tithe</span>
                    </button>
                    <button
                      onClick={() => setGivingType("offering")}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        givingType === "offering"
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <HandCoins className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm">Offering</span>
                    </button>
                    <button
                      onClick={() => setGivingType("fund")}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        givingType === "fund"
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Building2 className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm">Fund</span>
                    </button>
                    <button
                      onClick={() => setGivingType("custom")}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        givingType === "custom"
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Globe className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm">Custom</span>
                    </button>
                  </div>
                </div>

                {givingType === "fund" && (
                  <div>
                    <Label>Choose Fund</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        { id: "building", label: "Building Fund", icon: Building2 },
                        { id: "missions", label: "Missions Fund", icon: Globe },
                        { id: "welfare", label: "Welfare Fund", icon: Users },
                        { id: "youth", label: "Youth Programs", icon: Heart },
                      ].map((fund) => {
                        const Icon = fund.icon;
                        return (
                          <button
                            key={fund.id}
                            onClick={() => setFundType(fund.id)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              fundType === fund.id
                                ? "border-primary bg-primary/10 text-primary font-medium"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <Icon className="h-5 w-5 mx-auto mb-1" />
                            <span className="text-xs block">{fund.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {givingType === "custom" && (
                  <div>
                    <Label>Custom Fund Name</Label>
                    <Input
                      placeholder="Enter custom fund name"
                      value={customFundType}
                      onChange={(e) => setCustomFundType(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}

                <div>
                  <Label>Amount ($)</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      { id: "ecocash", label: "EcoCash", icon: PhoneIcon, route: "/payment-ecocash" },
                      { id: "paynow", label: "Paynow", icon: Globe, route: "/payment-paynow" },
                      { id: "bank", label: "Bank Transfer", icon: Building2, route: "/payment-bank" },
                      { id: "onemoney", label: "OneMoney", icon: PhoneIcon, route: "/payment-onemoney" },
                    ].map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.id}
                          onClick={() => {
                            if (amount && (givingType === "tithe" || givingType === "offering" || (givingType === "fund" && fundType) || (givingType === "custom" && customFundType))) {
                              navigate(method.route, {
                                state: {
                                  givingType,
                                  amount,
                                  fundType: givingType === "fund" ? fundType : undefined,
                                  customFundType: givingType === "custom" ? customFundType : undefined,
                                },
                              });
                            }
                          }}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            paymentMethod === method.id
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Icon className="h-5 w-5 mx-auto mb-1" />
                          <span className="text-xs block">{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => {
                    if (amount && paymentMethod && 
                        (givingType === "tithe" || givingType === "offering" || 
                         (givingType === "fund" && fundType) || 
                         (givingType === "custom" && customFundType))) {
                      setShowPaymentSuccess(true);
                    }
                  }}
                >
                  <HandCoins className="h-4 w-4 mr-2" />
                  Give Now
                </Button>
              </div>
            </div>

            {/* Giving History */}
            <div className="card-surface p-6">
              <h3 className="font-semibold mb-4">Giving History</h3>
              <div className="space-y-3">
                {givingHistory.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        {record.type === "Tithe" && <Heart className="h-5 w-5 text-primary" />}
                        {record.type === "Offering" && <HandCoins className="h-5 w-5 text-primary" />}
                        {record.type === "Building Fund" && <Building2 className="h-5 w-5 text-primary" />}
                        {record.type === "Missions Fund" && <Globe className="h-5 w-5 text-primary" />}
                        {record.type === "Welfare Fund" && <Users className="h-5 w-5 text-primary" />}
                      </div>
                      <div>
                        <p className="font-medium">{record.type}</p>
                        <p className="text-xs text-muted-foreground">{record.date} • {record.method}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-400">${record.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {record.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "resources" && (
          <div className="card-surface p-6">
            <h3 className="font-semibold mb-4">Church Resources</h3>
            <p className="text-muted-foreground">Resources coming soon...</p>
          </div>
        )}

        {activeTab === "branch" && (
          <div className="space-y-6">
            <div className="card-surface p-6">
              <h3 className="font-semibold mb-4">Select Your Branch</h3>
              <p className="text-sm text-muted-foreground mb-6">Choose your church branch to view branch-specific announcements, events, and information.</p>
              <div className="grid md:grid-cols-2 gap-4">
                {branches.map((branch) => (
                  <div
                    key={branch}
                    className={`card-surface p-5 cursor-pointer transition-all border-2 ${
                      selectedBranch === branch
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => {
                      if (branch !== selectedBranch && joinedDepartments.length > 0) {
                        setPreviousBranch(selectedBranch);
                        setTargetBranch(branch);
                        setSuggestedDepartments(departments.filter(dept => joinedDepartments.includes(dept.id)));
                        setShowBranchChangeDialog(true);
                      } else {
                        setSelectedBranch(branch);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{branch}</h3>
                        <p className="text-xs text-muted-foreground">
                          {branch === "Main Branch" ? "Headquarters location" : branch === "North Branch" ? "North district" : branch === "South Branch" ? "South district" : "East district"}
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    {selectedBranch === branch && (
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <CheckCircle className="h-4 w-4" />
                        <span>Current Branch</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="card-surface p-6">
              <h3 className="font-semibold mb-4">Branch Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Current Branch:</span>
                  <span className="font-medium">{selectedBranch}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Address:</span>
                  <span>
                    {selectedBranch === "Main Branch" ? "123 Church Street, Downtown" :
                     selectedBranch === "North Branch" ? "456 North Avenue, North District" :
                     selectedBranch === "South Branch" ? "789 South Road, South District" :
                     "321 East Boulevard, East District"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Service Times:</span>
                  <span>Sundays 9:00 AM & 11:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="card-surface p-6">
              <div className="flex items-start justify-between mb-6">
                <h3 className="font-semibold">Profile Information</h3>
                <Button size="sm" onClick={() => setShowEditProfile(true)}>Edit Profile</Button>
              </div>
              
              <div className="flex items-start gap-6">
                {/* Profile Photo */}
                <div className="relative">
                  <div
                    className="h-32 w-32 rounded-full bg-accent flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => profilePhoto && setShowImagePreview(true)}
                  >
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <UserCircle className="h-20 w-20 text-muted-foreground" />
                    )}
                  </div>
                  <label htmlFor="photo-upload" className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4 text-primary-foreground" />
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                {/* Profile Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{currentUser?.name || currentMember.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Faith Number</p>
                    <p className="font-medium flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      {currentUser?.id || currentMember.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {currentUser?.dateOfBirth || currentMember.dateOfBirth 
                        ? new Date(currentUser?.dateOfBirth || currentMember.dateOfBirth).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {currentUser?.email || currentMember.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                      {currentUser?.phone || currentMember.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {currentUser?.address || currentMember.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{currentUser?.department || currentMember.department || "Not assigned"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">{currentUser?.joined || currentMember.joined}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">{currentUser?.status || currentMember.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Dialog */}
        <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>Update your personal information</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input id="edit-phone" defaultValue={currentUser?.phone || currentMember.phone} />
              </div>
              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Input id="edit-address" defaultValue={currentUser?.address || currentMember.address} />
              </div>
              <div>
                <Label htmlFor="edit-nextofkin">Next of Kin</Label>
                <Input id="edit-nextofkin" placeholder="Name and contact" />
              </div>
              <div>
                <Label htmlFor="edit-nextofkin-phone">Next of Kin Phone</Label>
                <Input id="edit-nextofkin-phone" placeholder="+263 ..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditProfile(false)}>Cancel</Button>
              <Button onClick={() => {
                const phoneInput = document.getElementById("edit-phone") as HTMLInputElement;
                const addressInput = document.getElementById("edit-address") as HTMLInputElement;
                const nextOfKinInput = document.getElementById("edit-nextofkin") as HTMLInputElement;
                const nextOfKinPhoneInput = document.getElementById("edit-nextofkin-phone") as HTMLInputElement;

                updateMemberProfile(currentMember.id, {
                  phone: phoneInput?.value,
                  address: addressInput?.value,
                  nextOfKin: nextOfKinInput?.value,
                  nextOfKinPhone: nextOfKinPhoneInput?.value,
                });
                setShowEditProfile(false);
              }}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Group Dialog */}
        <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
          <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Group Chat</DialogTitle>
              <DialogDescription>Create a new group and add members</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="member-search">Search Members</Label>
                <Input
                  id="member-search"
                  placeholder="Search by name or faith number..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                />
              </div>
              <div>
                <Label>Selected Members ({selectedMembers.length})</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedMembers.map((memberId) => {
                    const member = initialMembers.find(m => m.id === memberId);
                    return member ? (
                      <div key={memberId} className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full text-sm">
                        <span>{member.name}</span>
                        <button
                          onClick={() => setSelectedMembers(prev => prev.filter(id => id !== memberId))}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto border rounded-lg p-2">
                <Label className="text-xs text-muted-foreground mb-2">Available Members</Label>
                {initialMembers
                  .filter(m => m.id !== currentMember.id)
                  .filter(m => 
                    !selectedMembers.includes(m.id) &&
                    (m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
                     m.id.toLowerCase().includes(memberSearch.toLowerCase()))
                  )
                  .map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded cursor-pointer"
                      onClick={() => setSelectedMembers(prev => [...prev, member.id])}
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                        {member.name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.id} • {member.department}</p>
                      </div>
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowCreateGroup(false);
                setGroupName("");
                setSelectedMembers([]);
                setMemberSearch("");
              }}>Cancel</Button>
              <Button 
                disabled={!groupName || selectedMembers.length === 0}
                onClick={() => {
                  if (groupName && selectedMembers.length > 0) {
                    const newGroup = {
                      id: `G${Date.now()}`,
                      name: groupName,
                      memberCount: selectedMembers.length + 1,
                      lastMessage: "Group created",
                      unread: 0,
                      isGroup: true,
                      members: [...selectedMembers, currentMember.id]
                    };
                    setGroupChats(prev => [...prev, newGroup]);
                    setChatMessages({
                      ...chatMessages,
                      [newGroup.id]: []
                    });
                    setShowCreateGroup(false);
                    setGroupName("");
                    setSelectedMembers([]);
                    setMemberSearch("");
                  }
                }}
              >
                Create Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Chat Profile/Settings Dialog */}
        <Dialog open={showChatProfile} onOpenChange={setShowChatProfile}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedChat?.isGroup ? "Group Settings" : "Profile"}
              </DialogTitle>
              <DialogDescription>
                {selectedChat?.isGroup ? "Manage group settings" : "View contact information"}
              </DialogDescription>
            </DialogHeader>
            {selectedChat && (
              <div className="grid gap-4 py-4">
                {selectedChat?.isGroup ? (
                  <div>
                    {/* Group Settings */}
                    <div className="flex flex-col items-center gap-4 pb-4 border-b">
                      <div className="relative">
                        <div
                          className="h-24 w-24 rounded-full bg-accent flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          {groupSettings.avatar ? (
                            <img src={groupSettings.avatar} alt="Group" className="h-full w-full object-cover" />
                          ) : (
                            <Users className="h-12 w-12 text-muted-foreground" />
                          )}
                        </div>
                        <label htmlFor="group-avatar-upload" className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                          <Camera className="h-4 w-4 text-primary-foreground" />
                        </label>
                        <input
                          id="group-avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit-group-name">Group Name</Label>
                      <Input
                        id="edit-group-name"
                        value={groupSettings.name}
                        onChange={(e) => setGroupSettings({ ...groupSettings, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="group-admin">Group Admin</Label>
                      <Select
                        value={groupSettings.admin}
                        onValueChange={(v) => setGroupSettings({ ...groupSettings, admin: v })}
                      >
                        <SelectTrigger id="group-admin">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedChat.members?.map((memberId: string) => {
                            const member = initialMembers.find(m => m.id === memberId);
                            return member ? (
                              <SelectItem key={memberId} value={memberId}>
                                {member.name} ({member.id})
                              </SelectItem>
                            ) : null;
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Members ({selectedChat?.memberCount || 0})</Label>
                      <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                        {selectedChat?.members?.map((memberId: string) => {
                          const member = initialMembers.find(m => m.id === memberId);
                          return member ? (
                            <div key={memberId} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                                {member.name.split(" ").map((n: string) => n[0]).join("")}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.id}</p>
                              </div>
                              {memberId === groupSettings.admin && (
                                <span className="text-xs bg-primary/10 px-2 py-1 rounded text-primary">Admin</span>
                              )}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Individual Profile */}
                    <div className="flex flex-col items-center gap-4 pb-4 border-b">
                      <div className="h-24 w-24 rounded-full bg-accent flex items-center justify-center overflow-hidden">
                        {selectedChat.avatar ? (
                          <img src={selectedChat.avatar} alt={selectedChat.name} className="h-full w-full object-cover" />
                        ) : (
                          <UserCircle className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold text-lg">{selectedChat.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedChat.role}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-medium flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          Online
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Faith Number</p>
                        <p className="font-medium">{selectedChat.id || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p className="font-medium">{initialMembers.find(m => m.id === selectedChat.id)?.department || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowChatProfile(false)}>Close</Button>
              {selectedChat?.isGroup && (
                <Button onClick={() => {
                  setGroupChats(prev => prev.map(g => 
                    g.id === selectedChat.id 
                      ? { ...g, name: groupSettings.name } 
                      : g
                  ));
                  setShowChatProfile(false);
                }}>Save Changes</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Image Preview Dialog */}
        <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
          <DialogContent className="sm:max-w-2xl">
            <div className="flex items-center justify-center">
              {profilePhoto && (
                <img src={profilePhoto} alt="Profile Preview" className="max-w-full max-h-[70vh] object-contain rounded-lg" />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Event Details Dialog */}
        <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
          <DialogContent className="sm:max-w-md">
            {selectedEvent && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedEvent.title}</DialogTitle>
                  <DialogDescription>{selectedEvent.theme}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{selectedEvent.date}</p>
                      <p className="text-sm text-muted-foreground">{selectedEvent.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                    <p className="font-medium">{selectedEvent.venue}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{selectedEvent.rsvp} people confirmed</p>
                      <p className="text-sm text-muted-foreground">{selectedEvent.max - selectedEvent.rsvp} spots remaining</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowEventDialog(false)}>Close</Button>
                  <Button onClick={() => {
                    addEventRSVP({
                      eventId: selectedEvent.id,
                      memberId: currentMember.id,
                      memberName: currentMember.name,
                      eventTitle: selectedEvent.title,
                      date: selectedEvent.date,
                      status: "confirmed",
                    });
                    setShowEventDialog(false);
                  }}>Confirm Now</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Sermon Dialog */}
        <Dialog open={showSermonDialog} onOpenChange={setShowSermonDialog}>
          <DialogContent className="sm:max-w-md">
            {selectedSermon && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedSermon.title}</DialogTitle>
                  <DialogDescription>{selectedSermon.speaker} • {selectedSermon.date}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <p className="font-medium">{selectedSermon.duration}</p>
                  </div>
                  {selectedSermon.type === "devotional" ? (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm">The LORD is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.</p>
                      <p className="text-sm mt-2 text-muted-foreground">- Psalm 23:1-3</p>
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <Play className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowSermonDialog(false)}>Close</Button>
                  {selectedSermon.type !== "devotional" && (
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Prayer Dialog */}
        <Dialog open={showPrayerDialog} onOpenChange={setShowPrayerDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Submit {prayerType === "request" ? "Prayer Request" : "Testimony"}</DialogTitle>
              <DialogDescription>
                {prayerType === "request" ? "Share your prayer request with the prayer team" : "Share how God has worked in your life"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="prayer-content">{prayerType === "request" ? "Prayer Request" : "Your Testimony"}</Label>
                <textarea
                  id="prayer-content"
                  className="w-full mt-2 p-3 border rounded-lg min-h-[120px] resize-none"
                  placeholder={prayerType === "request" ? "How can we pray for you?" : "Share your testimony..."}
                  value={prayerContent}
                  onChange={(e) => setPrayerContent(e.target.value)}
                />
              </div>
              {prayerType === "request" && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  <Label htmlFor="anonymous">Submit anonymously</Label>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPrayerDialog(false)}>Cancel</Button>
              <Button onClick={() => {
                // Save prayer request/testimony
                setShowPrayerDialog(false);
                setPrayerContent("");
                setIsAnonymous(false);
              }}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Department Dialog */}
        <Dialog open={showDepartmentDialog} onOpenChange={setShowDepartmentDialog}>
          <DialogContent className="sm:max-w-md">
            {selectedDepartment && (
              <>
                <DialogHeader>
                  <DialogTitle>Join {selectedDepartment.name}</DialogTitle>
                  <DialogDescription>{selectedDepartment.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Leader:</span>
                      <span>{selectedDepartment.leader}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Contact:</span>
                      <span>{selectedDepartment.contact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Schedule:</span>
                      <span>{selectedDepartment.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Current Members:</span>
                      <span>{selectedDepartment.members}</span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDepartmentDialog(false)}>Cancel</Button>
                  <Button onClick={() => {
                    // Send join request
                    setShowDepartmentDialog(false);
                  }}>Send Request</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Welfare Dialog */}
        <Dialog open={showWelfareDialog} onOpenChange={setShowWelfareDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Apply for Welfare Support</DialogTitle>
              <DialogDescription>Submit your welfare support request</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="welfare-type">Support Type</Label>
                <Select value={welfareType} onValueChange={setWelfareType}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select support type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school-fees">School Fees</SelectItem>
                    <SelectItem value="food">Food Support</SelectItem>
                    <SelectItem value="rent">Rent Assistance</SelectItem>
                    <SelectItem value="medical">Medical Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="welfare-amount">Amount Requested ($)</Label>
                <Input
                  id="welfare-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={welfareAmount}
                  onChange={(e) => setWelfareAmount(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="welfare-description">Description</Label>
                <textarea
                  id="welfare-description"
                  className="w-full mt-2 p-3 border rounded-lg min-h-[100px] resize-none"
                  placeholder="Describe your situation and need..."
                  value={welfareDescription}
                  onChange={(e) => setWelfareDescription(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="welfare-documents">Upload Documents (Proof)</Label>
                <Input id="welfare-documents" type="file" className="mt-2" multiple />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowWelfareDialog(false)}>Cancel</Button>
              <Button onClick={() => {
                // Submit welfare request
                setShowWelfareDialog(false);
                setWelfareType("");
                setWelfareAmount("");
                setWelfareDescription("");
              }}>Submit Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Counseling Dialog */}
        <Dialog open={showCounselingDialog} onOpenChange={setShowCounselingDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Book Appointment</DialogTitle>
              <DialogDescription>Schedule a meeting with a pastor or counselor</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="counseling-type">Appointment Type</Label>
                <Select value={counselingType} onValueChange={(value: any) => setCounselingType(value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pastor">Pastor Meeting</SelectItem>
                    <SelectItem value="counseling">Counseling Session</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="appointment-date">Date</Label>
                <Input
                  id="appointment-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="appointment-time">Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="counseling-notes">Notes (Private)</Label>
                <textarea
                  id="counseling-notes"
                  className="w-full mt-2 p-3 border rounded-lg min-h-[80px] resize-none"
                  placeholder="Add any notes or topics you'd like to discuss..."
                  value={counselingNotes}
                  onChange={(e) => setCounselingNotes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCounselingDialog(false)}>Cancel</Button>
              <Button onClick={() => {
                // Book appointment
                setShowCounselingDialog(false);
                setSelectedDate("");
                setSelectedTime("");
                setCounselingNotes("");
              }}>Book Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Volunteer Dialog */}
        <Dialog open={showVolunteerDialog} onOpenChange={setShowVolunteerDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Sign Up to Volunteer</DialogTitle>
              <DialogDescription>Choose a volunteer role to serve</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="volunteer-role">Select Role</Label>
                <Select value={selectedVolunteerRole} onValueChange={setSelectedVolunteerRole}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select volunteer role" />
                  </SelectTrigger>
                  <SelectContent>
                    {volunteerRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowVolunteerDialog(false)}>Cancel</Button>
              <Button onClick={() => {
                // Sign up for volunteer role
                setShowVolunteerDialog(false);
                setSelectedVolunteerRole("");
              }}>Sign Up</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Donate Dialog */}
        <Dialog open={showDonateDialog} onOpenChange={setShowDonateDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Contribute to {selectedProject?.name}</DialogTitle>
              <DialogDescription>Your contribution helps advance this project</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="donation-amount">Amount ($)</Label>
                <Input
                  id="donation-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDonateDialog(false)}>Cancel</Button>
              <Button onClick={() => {
                // Process donation
                setShowDonateDialog(false);
                setDonationAmount("");
              }}>Donate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Certificate Dialog */}
        <Dialog open={showCertificateDialog} onOpenChange={setShowCertificateDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Request Certificate</DialogTitle>
              <DialogDescription>Select the type of certificate you need</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="certificate-type">Certificate Type</Label>
                <Select value={certificateType} onValueChange={setCertificateType}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select certificate type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baptism">Baptism Certificate</SelectItem>
                    <SelectItem value="membership">Membership Letter</SelectItem>
                    <SelectItem value="marriage">Marriage Confirmation Letter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCertificateDialog(false)}>Cancel</Button>
              <Button onClick={() => {
                // Submit certificate request
                setShowCertificateDialog(false);
                setCertificateType("");
              }}>Submit Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Feedback Dialog */}
        <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Submit Feedback</DialogTitle>
              <DialogDescription>Share your thoughts with church leadership</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="feedback-type">Feedback Type</Label>
                <Select value={feedbackType} onValueChange={setFeedbackType}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select feedback type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="compliment">Compliment</SelectItem>
                    <SelectItem value="issue">Report Issue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="feedback-content">Your Feedback</Label>
                <textarea
                  id="feedback-content"
                  className="w-full mt-2 p-3 border rounded-lg min-h-[120px] resize-none"
                  placeholder="Share your feedback..."
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous-feedback"
                  checked={isAnonymousFeedback}
                  onChange={(e) => setIsAnonymousFeedback(e.target.checked)}
                />
                <Label htmlFor="anonymous-feedback">Submit anonymously</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>Cancel</Button>
              <Button onClick={() => {
                // Submit feedback
                setShowFeedbackDialog(false);
                setFeedbackType("");
                setFeedbackContent("");
                setIsAnonymousFeedback(false);
              }}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Branch Change Dialog */}
        <Dialog open={showBranchChangeDialog} onOpenChange={setShowBranchChangeDialog}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Change Branch</DialogTitle>
              <DialogDescription>
                You are transferring from {previousBranch} to {targetBranch}. This action requires verification.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Warning */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Branch Transfer Warning</p>
                    <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                      You are about to transfer to a different branch. Please verify your identity to confirm this change.
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Fields */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="faith-number">Faith Number (Registration Number)</Label>
                  <Input
                    id="faith-number"
                    type="text"
                    placeholder="Enter your faith number"
                    value={faithNumber}
                    onChange={(e) => setFaithNumber(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="branch-password">Account Password</Label>
                  <Input
                    id="branch-password"
                    type="password"
                    placeholder="Enter your password"
                    value={branchPassword}
                    onChange={(e) => setBranchPassword(e.target.value)}
                    className="mt-2"
                  />
                </div>
                {branchChangeError && (
                  <p className="text-sm text-destructive">{branchChangeError}</p>
                )}
              </div>

              {/* Department Suggestions */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Departments you were in at {previousBranch}:</Label>
                <div className="space-y-2">
                  {suggestedDepartments.map((dept) => (
                    <div key={dept.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <UsersIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{dept.name}</p>
                          <p className="text-xs text-muted-foreground">{dept.schedule}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (!joinedDepartments.includes(dept.id)) {
                            setDepartmentToJoin(dept);
                            setShowJoinDepartmentDialog(true);
                          }
                        }}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowBranchChangeDialog(false);
                setFaithNumber("");
                setBranchPassword("");
                setBranchChangeError("");
                setSuggestedDepartments([]);
                setTargetBranch("");
              }}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Verify credentials
                const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
                if (!faithNumber || !branchPassword) {
                  setBranchChangeError("Please enter both faith number and password.");
                  return;
                }
                if (currentUser?.faithNumber !== faithNumber || currentUser?.password !== branchPassword) {
                  setBranchChangeError("Invalid faith number or password.");
                  return;
                }
                // Confirm branch change
                setSelectedBranch(targetBranch);
                setShowBranchChangeDialog(false);
                setSuggestedDepartments([]);
                setTargetBranch("");
                setFaithNumber("");
                setBranchPassword("");
                setBranchChangeError("");
              }}>
                Confirm Change
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Leave Department Dialog */}
        <Dialog open={showLeaveDepartmentDialog} onOpenChange={setShowLeaveDepartmentDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Leave Department</DialogTitle>
              <DialogDescription>
                Are you sure you want to leave {departmentToLeave?.name}?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Warning */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Warning</p>
                    <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                      You will no longer receive notifications or updates from this department. You can rejoin at any time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <UsersIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{departmentToLeave?.name}</p>
                    <p className="text-xs text-muted-foreground">{departmentToLeave?.schedule}</p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowLeaveDepartmentDialog(false);
                setDepartmentToLeave(null);
              }}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setJoinedDepartments(joinedDepartments.filter(id => id !== departmentToLeave?.id));
                  setShowLeaveDepartmentDialog(false);
                  setDepartmentToLeave(null);
                }}
              >
                Leave Department
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Join Department Dialog */}
        <Dialog open={showJoinDepartmentDialog} onOpenChange={setShowJoinDepartmentDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Join Department</DialogTitle>
              <DialogDescription>
                Are you sure you want to join {departmentToJoin?.name}?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <UsersIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{departmentToJoin?.name}</p>
                    <p className="text-xs text-muted-foreground">{departmentToJoin?.schedule}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-primary">What to expect</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      You will receive notifications about meetings, events, and updates from this department.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowJoinDepartmentDialog(false);
                setDepartmentToJoin(null);
              }}>
                Cancel
              </Button>
              <Button onClick={() => {
                setJoinedDepartments([...joinedDepartments, departmentToJoin?.id]);
                setShowJoinDepartmentDialog(false);
                setDepartmentToJoin(null);
              }}>
                Join Department
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Announcement Detail Dialog */}
        <Dialog open={!!selectedAnnouncement} onOpenChange={() => setSelectedAnnouncement(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedAnnouncement?.title}</DialogTitle>
              <DialogDescription className="text-sm">
                {selectedAnnouncement?.date} • {selectedAnnouncement?.type === 'branch' ? 'General' : selectedAnnouncement?.department}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-base leading-relaxed">{selectedAnnouncement?.content}</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedAnnouncement(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payment Success Dialog */}
        <Dialog open={showPaymentSuccess} onOpenChange={setShowPaymentSuccess}>
          <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
              <DialogTitle className="text-center mb-2">Payment Successful!</DialogTitle>
              <DialogDescription className="text-center mb-4">
                Thank you for your {givingType === "tithe" ? "tithe" : givingType === "offering" ? "offering" : givingType === "custom" ? `donation to ${customFundType}` : "donation"} of ${amount}.
              </DialogDescription>
              <div className="text-sm text-muted-foreground text-center mb-4">
                <p>A confirmation has been sent to your email.</p>
                <p className="mt-1">Receipt ID: #{Date.now()}</p>
              </div>
              <Button onClick={() => {
                // Save giving record to shared store
                const givingTypeLabel = givingType === "tithe" ? "Tithe" : givingType === "offering" ? "Offering" : givingType === "custom" ? customFundType : fundType;
                addGivingRecord({
                  id: `G${Date.now()}`,
                  type: givingTypeLabel,
                  amount: parseFloat(amount),
                  date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                  method: paymentMethod,
                  status: "Completed",
                  memberId: currentMember.id,
                });
                setShowPaymentSuccess(false);
                setAmount("");
                setPaymentMethod("");
                setFundType("");
                setCustomFundType("");
              }}>
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </div>
  );
}
