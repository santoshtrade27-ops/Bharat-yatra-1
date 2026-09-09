import { useState, useEffect } from "react";
import { 
  Calendar, Users, Gift, Sparkles, CheckCircle2, Phone, 
  MapPin, Clock, Star, MessageSquare, Send, Search, 
  ShieldCheck, FileText
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

const defaultSampleEvents = [
  {
    id: "EVT-8421",
    name: "Suryanarayana & Lakshmi Shashtipoorthi",
    phone: "+91 98490 12345",
    destination: "Tirupati & Tirumala",
    date: "2026-10-18",
    people: 8,
    budget: 65000,
    category: "60th Shashtipoorthi & Vedic Blessing",
    notes: "Wheelchair assistance for 2 seniors, seated archana at Tirumala, pure satvik bhojanam, shehnai welcome.",
    status: "Planned",
    coordinator: "Srinivas Rao (Senior Event Coordinator)",
    createdAt: "2026-09-02T10:30:00.000Z",
    feedback: {
      rating: 5,
      comment: "Unforgettable experience! The Vedic priests and the shehnai welcome brought tears of joy to our parents.",
      date: "2026-09-08",
    },
  },
  {
    id: "EVT-9104",
    name: "Arjun Verma Silver Wedding Anniversary",
    phone: "+91 99881 77665",
    destination: "Varanasi (Kashi)",
    date: "2026-11-05",
    people: 4,
    budget: 45000,
    category: "Anniversary & Heritage Candlelight",
    notes: "Private decorated sunset bajra boat on Ganga, flower aarti, classical sitar instrumentalist.",
    status: "Upcoming",
    coordinator: "Pooja Trivedi (Cultural Specialist)",
    createdAt: "2026-09-05T14:15:00.000Z",
  },
  {
    id: "EVT-7302",
    name: "Meenakshi Sundaram Temple Pilgrimage",
    phone: "+91 94432 11009",
    destination: "Madurai & Rameswaram",
    date: "2026-08-20",
    people: 6,
    budget: 50000,
    category: "Spiritual Pilgrimage & Temple Seva",
    notes: "Senior friendly pace, AC transport, early morning spatika linga darshan.",
    status: "Completed",
    coordinator: "K. Ramanathan (Temple Desk)",
    createdAt: "2026-08-10T09:00:00.000Z",
    feedback: {
      rating: 5,
      comment: "Very smooth darshan arrangements without any rushing. The coordinator stayed with us throughout.",
      date: "2026-08-22",
    },
  },
];

const eventCategories = [
  "60th Shashtipoorthi & Vedic Blessing",
  "Anniversary & Heritage Candlelight",
  "Spiritual Pilgrimage & Temple Seva",
  "Milestone Birthday Celebration",
  "Family Heritage Gathering / Reunion",
  "Classical Arts & Folk Music Evening",
];

const destinationsList = [
  "Tirupati & Tirumala (Andhra Pradesh)",
  "Visakhapatnam Beach & Araku (Andhra Pradesh)",
  "Hyderabad Nizami & Falaknuma (Telangana)",
  "Warangal UNESCO Kakatiya (Telangana)",
  "Varanasi & Sarnath (Uttar Pradesh)",
  "Jaipur & Amber Palaces (Rajasthan)",
  "Madurai & Rameswaram (Tamil Nadu)",
  "Delhi NCR Heritage Triangle",
];

export default function EventPlanner() {
  const { lang } = useI18n();
  const [activeTab, setActiveTab] = useState("form"); // 'form' | 'tracking' | 'feedback'

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    destination: destinationsList[0],
    date: "",
    people: 4,
    budget: 35000,
    category: eventCategories[0],
    notes: "",
  });
  const [submittedId, setSubmittedId] = useState(null);

  // Stored Events State
  const [eventsList, setEventsList] = useState([]);
  const [searchTrackId, setSearchTrackId] = useState("");

  // Feedback Submission State
  const [feedbackEventId, setFeedbackEventId] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmittedNotice, setFeedbackSubmittedNotice] = useState("");

  // Load from localStorage or defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem("by-event-requests");
      if (stored) {
        setEventsList(JSON.parse(stored));
      } else {
        localStorage.setItem("by-event-requests", JSON.stringify(defaultSampleEvents));
        setEventsList(defaultSampleEvents);
      }
    } catch {
      setEventsList(defaultSampleEvents);
    }
  }, []);

  const saveEvents = (updated) => {
    setEventsList(updated);
    try {
      localStorage.setItem("by-event-requests", JSON.stringify(updated));
    } catch {}
  };

  // Submit Event Form
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) {
      alert("Please enter your name, phone number, and preferred date or month.");
      return;
    }

    const newId = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEvent = {
      id: newId,
      ...formData,
      status: "Upcoming",
      coordinator: "Assigned by Event Coordinator Desk",
      createdAt: new Date().toISOString(),
    };

    const updated = [newEvent, ...eventsList];
    saveEvents(updated);
    setSubmittedId(newId);
    setSearchTrackId(newId);

    // Reset form
    setFormData({
      name: "",
      phone: "",
      destination: destinationsList[0],
      date: "",
      people: 4,
      budget: 35000,
      category: eventCategories[0],
      notes: "",
    });
  };

  // Submit Feedback
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackEventId || !feedbackComment) {
      alert("Please select your event and write a short feedback review.");
      return;
    }

    const updated = eventsList.map((ev) => {
      if (ev.id === feedbackEventId) {
        return {
          ...ev,
          feedback: {
            rating: feedbackRating,
            comment: feedbackComment,
            date: new Date().toISOString().slice(0, 10),
          },
        };
      }
      return ev;
    });

    saveEvents(updated);
    setFeedbackSubmittedNotice(`Thank you! Your feedback for event ${feedbackEventId} has been recorded.`);
    setFeedbackComment("");
    setTimeout(() => setFeedbackSubmittedNotice(""), 5000);
  };

  // Filter for tracked events
  const trackedEvents = searchTrackId
    ? eventsList.filter((ev) => ev.id.toLowerCase().includes(searchTrackId.toLowerCase()) || ev.phone.includes(searchTrackId))
    : eventsList;

  // Events with feedback
  const eventsWithFeedback = eventsList.filter((ev) => ev.feedback);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">
                Bespoke Cultural Occasions & Pilgrimages
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold text-foreground mt-3 font-heading">
                Event Planner & Concierge
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
                Plan memorable life milestones — from 60th Shashtipoorthi blessings and silver wedding anniversaries to sacred family temple pilgrimages with live tracking and feedback.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 bg-muted/60 p-3 rounded-2xl border border-border shrink-0 text-xs">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              <div>
                <p className="font-bold text-foreground">Official Government Coordination</p>
                <p className="text-muted-foreground">Certified ASI Guides, Priests & Heritage Stays</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 border-b border-border pb-0 text-xs font-bold">
            <button
              onClick={() => setActiveTab("form")}
              className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "form"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="w-4 h-4" /> Book New Event
            </button>
            <button
              onClick={() => setActiveTab("tracking")}
              className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "tracking"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="w-4 h-4" /> Track Event Status ({eventsList.length})
            </button>
            <button
              onClick={() => setActiveTab("feedback")}
              className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "feedback"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Star className="w-4 h-4 text-amber-500" /> Traveler Feedback & Reviews
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* TAB 1: BOOK NEW EVENT FORM */}
        {activeTab === "form" && (
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {submittedId && (
                <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-4">
                  <span className="p-2.5 rounded-2xl bg-emerald-500 text-white shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </span>
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase">
                      Request Registered
                    </span>
                    <h3 className="text-lg font-bold text-foreground">
                      Event Proposal Submitted! Tracking ID: {submittedId}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Our Event Coordinator desk has received your requirements. You can track progress under the "Track Event Status" tab.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("tracking")}
                      className="mt-2 text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      View in Tracker →
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitForm} className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground font-heading">
                    Plan Your Cultural Milestone Event
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fill in your event details below. Our event coordination desk assigns specialized concierges for rituals, stays, and authentic ceremonies.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Your Full Name / Celebrant Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh & Sundari Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium focus:ring-2 focus:ring-primary outline-none text-foreground"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Mobile / WhatsApp Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98490 XXXXX"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium focus:ring-2 focus:ring-primary outline-none text-foreground"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Destination */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Event Destination / Heritage City *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-primary absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border border-border text-sm font-medium focus:ring-2 focus:ring-primary outline-none text-foreground cursor-pointer"
                      >
                        {destinationsList.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date or Month */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Which Month or Date are You Coming? *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        placeholder="e.g. 2026-10-25 or 'Mid November 2026'"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium focus:ring-2 focus:ring-primary outline-none text-foreground"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* How Many People */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Number of People *
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min={1}
                        max={100}
                        required
                        value={formData.people}
                        onChange={(e) => setFormData({ ...formData, people: Math.max(1, +e.target.value) })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border border-border text-sm font-medium focus:ring-2 focus:ring-primary outline-none text-foreground"
                      />
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Estimated Budget (₹)
                    </label>
                    <input
                      type="number"
                      step={5000}
                      min={10000}
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: +e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium focus:ring-2 focus:ring-primary outline-none text-foreground"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Event Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm font-medium focus:ring-2 focus:ring-primary outline-none text-foreground cursor-pointer"
                    >
                      {eventCategories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Notes & Special Requests */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Special Inclusions & Notes (Wheelchair, Temple Darshan, Shehnai, Satvik Food)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Wheelchair assistance required for grandmother, preference for seated Vedic temple archana, fresh jasmine garlands on arrival, pure satvik South Indian thali."
                    className="w-full p-3 rounded-xl bg-background border border-border text-xs text-foreground focus:ring-2 focus:ring-primary outline-none resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Submit Event Details to Coordinator Desk
                </button>
              </form>
            </div>

            {/* Right Column: Cultural Inclusions Guide */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2 font-heading">
                  <Gift className="w-4 h-4 text-primary" /> Curated Event Inclusions
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
                    <p className="font-bold text-foreground">Shehnai / Nadaswaram Welcome</p>
                    <p className="text-muted-foreground">Live traditional instrument players greeting the family at arrival.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
                    <p className="font-bold text-foreground">Dedicated Senior Escort</p>
                    <p className="text-muted-foreground">Certified helper and wheelchair assistance across monument precincts.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
                    <p className="font-bold text-foreground">Vedic Seated Temple Archana</p>
                    <p className="text-muted-foreground">Official temple dewasthanam coordination with prasadam blessing.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
                    <p className="font-bold text-foreground">GI Artisan Gift Hampers</p>
                    <p className="text-muted-foreground">Pure handloom silk shawls and wooden craft souvenirs direct from weavers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRACKING SECTION (Upcoming / Planned / Completed) */}
        {activeTab === "tracking" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground font-heading">
                  Track Event Coordination Progress
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Live status updates from your assigned Bharat Yatra Event Coordinator
                </p>
              </div>

              {/* Search by ID or Phone */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTrackId}
                  onChange={(e) => setSearchTrackId(e.target.value)}
                  placeholder="Search by ID (e.g. EVT-8421)..."
                  className="w-full pl-9 pr-3 py-2 rounded-full bg-card border border-border text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            {/* Status Legend */}
            <div className="flex items-center gap-3 flex-wrap text-xs bg-muted/40 p-3 rounded-2xl border border-border">
              <span className="font-bold text-foreground">Status Progression:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">
                1. Upcoming (Under Review)
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold">
                2. Planned (Concierge Assigned)
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                3. Completed (Successfully Executed)
              </span>
            </div>

            {trackedEvents.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-3xl border border-border p-6 space-y-3">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto" />
                <h4 className="text-base font-bold text-foreground">No events found matching "{searchTrackId}"</h4>
                <p className="text-xs text-muted-foreground">
                  Check your tracking ID or create a new event proposal.
                </p>
                <button
                  onClick={() => setActiveTab("form")}
                  className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm"
                >
                  Create New Event
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {trackedEvents.map((ev) => {
                  const isUpcoming = ev.status === "Upcoming";
                  const isPlanned = ev.status === "Planned";
                  const isCompleted = ev.status === "Completed";

                  return (
                    <div
                      key={ev.id}
                      className="p-6 rounded-3xl bg-card border border-border shadow-xs hover:border-primary/50 transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-sm text-foreground">{ev.id}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs font-medium text-foreground">{ev.category}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">Destination: <strong>{ev.destination}</strong></span>
                        </div>

                        {/* Status Badge */}
                        <div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              isCompleted
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                : isPlanned
                                ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                                : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            Status: {ev.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-muted-foreground block">Celebrant / Contact:</span>
                          <span className="font-bold text-foreground">{ev.name}</span>
                          <span className="text-muted-foreground block text-[11px]">{ev.phone}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Event Date / Window:</span>
                          <span className="font-bold text-foreground">{ev.date}</span>
                          <span className="text-muted-foreground block text-[11px]">{ev.people} Guests</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Estimated Budget:</span>
                          <span className="font-bold text-primary">₹{(ev.budget || 35000).toLocaleString("en-IN")}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Assigned Coordinator:</span>
                          <span className="font-bold text-foreground">{ev.coordinator || "Event Desk Lead"}</span>
                        </div>
                      </div>

                      {ev.notes && (
                        <div className="p-3 rounded-2xl bg-muted/40 border border-border text-xs text-muted-foreground">
                          <strong className="text-foreground">Coordinator Inclusions Note:</strong> "{ev.notes}"
                        </div>
                      )}

                      {/* Feedback Display if completed */}
                      {ev.feedback && (
                        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs">
                          <Star className="w-4 h-4 text-amber-500 fill-current shrink-0 mt-0.5" />
                          <div>
                            <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                              <span>Traveler Review ({ev.feedback.rating}/5 Stars)</span>
                              <span className="text-muted-foreground text-[10px]">· {ev.feedback.date}</span>
                            </div>
                            <p className="text-foreground italic mt-0.5">"{ev.feedback.comment}"</p>
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center justify-end gap-3 pt-2">
                        {!ev.feedback && (isPlanned || isCompleted) && (
                          <button
                            type="button"
                            onClick={() => {
                              setFeedbackEventId(ev.id);
                              setActiveTab("feedback");
                            }}
                            className="px-4 py-2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-xs hover:bg-amber-500/25 transition-colors flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> Leave Feedback
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TRAVELER FEEDBACK & REVIEWS */}
        {activeTab === "feedback" && (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Submit Feedback Column */}
            <div className="lg:col-span-5 space-y-6">
              <form onSubmit={handleFeedbackSubmit} className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-foreground font-heading">
                    Share Your Event Experience
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Help other families and pilgrims choose the right cultural occasion coordinator.
                  </p>
                </div>

                {feedbackSubmittedNotice && (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                    ✓ {feedbackSubmittedNotice}
                  </div>
                )}

                {/* Event Selector */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Select Event / Tracking ID *
                  </label>
                  <select
                    value={feedbackEventId}
                    onChange={(e) => setFeedbackEventId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs font-medium focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                  >
                    <option value="">-- Choose your event --</option>
                    {eventsList.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.id} · {ev.name} ({ev.destination})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className="p-1 text-2xl focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= feedbackRating
                              ? "text-amber-500 fill-amber-500"
                              : "text-muted-foreground/40"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-foreground ml-2">
                      {feedbackRating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Your Detailed Review & Memories *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Describe how the coordinators handled your elder care, shehnai welcome, temple darshan, or anniversary feast..."
                    className="w-full p-3 rounded-xl bg-background border border-border text-xs text-foreground focus:ring-2 focus:ring-primary outline-none resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Submit Feedback to Bharat Yatra
                </button>
              </form>
            </div>

            {/* List of Verified Reviews Column */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-foreground font-heading">
                  Verified Family & Pilgrim Reviews
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real experiences organized by Bharat Yatra event coordinators
                </p>
              </div>

              {eventsWithFeedback.length === 0 ? (
                <div className="p-8 text-center bg-card rounded-3xl border border-border text-xs text-muted-foreground">
                  No feedback reviews yet. Be the first to share your experience!
                </div>
              ) : (
                eventsWithFeedback.map((ev) => (
                  <div key={ev.id} className="p-6 rounded-3xl bg-card border border-border space-y-3 shadow-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-foreground">{ev.name}</h4>
                        <p className="text-xs text-muted-foreground">{ev.category} · {ev.destination}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: ev.feedback.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-foreground/90 leading-relaxed italic bg-muted/40 p-3.5 rounded-2xl border border-border">
                      "{ev.feedback.comment}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span>Event Ref: {ev.id}</span>
                      <span>Review Date: {ev.feedback.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
