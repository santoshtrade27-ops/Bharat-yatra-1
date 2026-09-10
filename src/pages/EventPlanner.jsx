import { useState, useEffect } from "react";
import { 
  Calendar, Users, Gift, Sparkles, CheckCircle2, Phone, 
  MapPin, Star, MessageSquare, Send, Search, 
  ShieldCheck, Image, Heart, Award, Lock, Eye
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

// Sample verified community reviews and real celebration gallery
const defaultSampleEvents = [
  {
    id: "EVT-8421",
    name: "Suryanarayana & Lakshmi Family",
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
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "EVT-9104",
    name: "Arjun & Sneha Verma",
    phone: "+91 99881 77665",
    destination: "Varanasi (Kashi)",
    date: "2026-11-05",
    people: 4,
    budget: 45000,
    category: "Silver Wedding Anniversary on Sacred Ganga",
    notes: "Private decorated sunset bajra boat on Ganga, flower aarti, classical sitar instrumentalist.",
    status: "Upcoming",
    coordinator: "Pooja Trivedi (Cultural Specialist)",
    createdAt: "2026-09-05T14:15:00.000Z",
    feedback: {
      rating: 5,
      comment: "The decorated wooden bajra boat with marigold garlands and live sitar melody at sunset was pure magic.",
      date: "2026-09-06",
      image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "EVT-7302",
    name: "Meenakshi Sundaram & Clan",
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
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "EVT-6540",
    name: "Vikram & Ananya Sharma",
    phone: "+91 98110 55442",
    destination: "Visakhapatnam Beach & Araku",
    date: "2026-09-01",
    people: 2,
    budget: 35000,
    category: "Candlelight Sunset Proposal by Rishikonda Beach",
    notes: "Private beachfront gazebo setup, live violin instrumentalist, fresh jasmine bouquet.",
    status: "Completed",
    coordinator: "Harika Devi (Vizag Desk)",
    createdAt: "2026-08-28T11:00:00.000Z",
    feedback: {
      rating: 5,
      comment: "She said YES! The beach gazebo setup with sea breeze and live violin was straight out of a fairy tale.",
      date: "2026-09-02",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "EVT-5820",
    name: "Rajeshwar Rao 75th Amrutha Mahotsavam",
    phone: "+91 90001 44332",
    destination: "Hyderabad Falaknuma & Golconda",
    date: "2026-07-15",
    people: 14,
    budget: 95000,
    category: "Grandfather 75th Birthday Heritage Gathering",
    notes: "Nizami banquet setup, traditional ghazal ensemble, wheelchair accessible private coach.",
    status: "Completed",
    coordinator: "Mohammed Aslam (Hyderabad Royal Desk)",
    createdAt: "2026-07-01T15:00:00.000Z",
    feedback: {
      rating: 5,
      comment: "Grandfather was so touched by the royal Nizami banquet and ghazal recital. Unrivaled hospitality.",
      date: "2026-07-18",
      image: "https://images.unsplash.com/photo-1572455044327-7348c1be7267?w=800&auto=format&fit=crop&q=80",
    },
  }
];

// Quick category suggestions that the user can click or freely type over
const categorySuggestions = [
  "60th Shashtipoorthi Vedic Blessing",
  "Silver Wedding Anniversary on Sacred Ghats",
  "Candlelight Sunset Beach Proposal",
  "Spiritual Pilgrimage & VIP Temple Darshan",
  "Milestone Birthday in Araku Hills",
  "Family Heritage Reunion & Royal Feast",
  "Classical Arts & Sitar Evening Celebration",
];

const destinationsList = [
  "Visakhapatnam Beach & Araku (Andhra Pradesh)",
  "Tirupati & Tirumala (Andhra Pradesh)",
  "Hyderabad Nizami & Falaknuma (Telangana)",
  "Warangal & Ramappa UNESCO (Telangana)",
  "Varanasi & Sarnath Ghats (Uttar Pradesh)",
  "Jaipur & Amber Palaces (Rajasthan)",
  "Madurai & Rameswaram (Tamil Nadu)",
  "Kerala Backwaters (Alappuzha & Munnar)",
  "Delhi NCR Heritage Triangle",
];

// Event gallery photos
const eventMemoriesGallery = [
  {
    title: "60th Shashtipoorthi Vedic Blessing",
    location: "Tirupati Seshachalam Foothills",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
    tag: "Spiritual Milestone",
    desc: "Sacred Vedic chanting, traditional shehnai welcome, and flower canopy archana for elderly parents.",
    rating: 5.0
  },
  {
    title: "Candlelit Bajra Boat on Sacred Ganges",
    location: "Dashashwamedh Ghat, Varanasi",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80",
    tag: "Anniversary Celebration",
    desc: "Private decorated royal boat, thousands of floating diyas on the river, and live sitar melodist during evening Ganga Aarti.",
    rating: 5.0
  },
  {
    title: "Sunset Beach Proposal Gazebo",
    location: "Rishikonda Beach, Visakhapatnam",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    tag: "Romantic Milestone",
    desc: "Custom floral pergola on white sands, fairy lights canopy, chilled tender coconut welcome, and acoustic violin accompaniment.",
    rating: 5.0
  },
  {
    title: "Nizami Royal Courtyard Gathering",
    location: "Heritage Haveli, Hyderabad",
    image: "https://images.unsplash.com/photo-1572455044327-7348c1be7267?w=800&auto=format&fit=crop&q=80",
    tag: "Family Gathering",
    desc: "Traditional Dastarkhwan feast, live ghazal recital, fragrant rose water fountains, and custom heritage photography.",
    rating: 4.9
  },
  {
    title: "Araku Valley Misty Hill Station Birthday",
    location: "Coffee Plantations, Araku Valley",
    image: "https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop&q=80",
    tag: "Birthday Surprise",
    desc: "Open-air campfire under starry skies, tribal Dhimsa dance performance, organic Araku coffee brew bar, and local bamboo feast.",
    rating: 5.0
  },
  {
    title: "Kettuvallam Lantern Cruise Dinner",
    location: "Alappuzha Backwaters, Kerala",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop&q=80",
    tag: "Serene Occasion",
    desc: "Private 2-bedroom luxury houseboat decked in marigold garlands, traditional Kerala feast served on banana leaf, and gentle flute music.",
    rating: 5.0
  }
];

export default function EventPlanner() {
  const { lang } = useI18n();
  const [activeTab, setActiveTab] = useState("reviews"); // 'reviews' | 'form' | 'track'

  // Form State with user-entered custom category
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    destination: destinationsList[0],
    date: "",
    people: 4,
    budget: 35000,
    category: "", // User enters freely or picks suggestion
    notes: "",
  });
  const [submittedId, setSubmittedId] = useState(null);

  // Stored Events State
  const [eventsList, setEventsList] = useState([]);
  
  // Private Tracking State (Traveler looks up ONLY their own booking)
  const [trackQuery, setTrackQuery] = useState("");
  const [trackedResult, setTrackedResult] = useState(null);
  const [trackSearched, setTrackSearched] = useState(false);

  // Review Submission Modal / Form State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    category: "",
    destination: destinationsList[0],
    rating: 5,
    comment: "",
  });
  const [reviewSubmittedNotice, setReviewSubmittedNotice] = useState("");

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
    if (!formData.name || !formData.phone || !formData.date || !formData.category) {
      alert("Please enter your name, phone number, preferred date, and event category.");
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
    setTrackQuery(newId);
    setTrackedResult(newEvent);

    // Reset form
    setFormData({
      name: "",
      phone: "",
      destination: destinationsList[0],
      date: "",
      people: 4,
      budget: 35000,
      category: "",
      notes: "",
    });
  };

  // Private Lookup Handler (Privacy Protection: Only view own booking)
  const handleSearchTracking = (e) => {
    e?.preventDefault();
    setTrackSearched(true);
    if (!trackQuery.trim()) {
      setTrackedResult(null);
      return;
    }
    const cleanQuery = trackQuery.trim().toLowerCase();
    const found = eventsList.find(
      (ev) =>
        ev.id.toLowerCase() === cleanQuery ||
        ev.phone.replace(/[^0-9]/g, "").includes(cleanQuery.replace(/[^0-9]/g, ""))
    );
    setTrackedResult(found || null);
  };

  // Submit Community Review
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) {
      alert("Please enter your name and review feedback.");
      return;
    }

    const newReviewEvent = {
      id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: reviewForm.name,
      phone: "Verified Guest",
      destination: reviewForm.destination,
      date: new Date().toISOString().slice(0, 10),
      people: 2,
      budget: 30000,
      category: reviewForm.category || "Celebration Experience",
      notes: "Community traveler review",
      status: "Completed",
      coordinator: "Bharat Yatra Concierge Desk",
      createdAt: new Date().toISOString(),
      feedback: {
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        date: new Date().toISOString().slice(0, 10),
      },
    };

    const updated = [newReviewEvent, ...eventsList];
    saveEvents(updated);
    setReviewSubmittedNotice("Thank you! Your event review has been added to our community gallery.");
    setReviewForm({
      name: "",
      category: "",
      destination: destinationsList[0],
      rating: 5,
      comment: "",
    });
    setReviewModalOpen(false);
    setTimeout(() => setReviewSubmittedNotice(""), 6000);
  };

  // Verified reviews list with feedback
  const verifiedReviews = eventsList.filter((ev) => ev.feedback);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Bespoke Cultural Milestones & Celebrations
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Privacy-Protected Booking Desk
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-foreground font-heading">
                Surprise & Cultural Occasions Concierge
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
                Plan unforgettable life moments with dedicated local concierges — from 60th Shashtipoorthi blessings and romantic beach proposals to sacred Ganga aarti anniversaries.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-4 bg-muted/60 p-4 rounded-2xl border border-border shrink-0">
              <div className="text-center border-r border-border pr-4">
                <p className="text-xl font-extrabold text-amber-500 flex items-center justify-center gap-1">
                  ★ 4.98
                </p>
                <p className="text-[11px] text-muted-foreground font-medium">350+ Celebrations</p>
              </div>
              <div>
                <p className="font-bold text-xs text-foreground flex items-center gap-1">
                  <Award className="w-4 h-4 text-primary" /> 100% Verified Desk
                </p>
                <p className="text-[11px] text-muted-foreground">ASI Guides, Priests & Stays</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 border-b border-border pb-0 text-xs font-bold flex-wrap">
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "reviews"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 
              All Reviews & Event Gallery ({verifiedReviews.length})
            </button>
            <button
              onClick={() => setActiveTab("form")}
              className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "form"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Gift className="w-4 h-4 text-primary" /> Plan & Book Surprise Event
            </button>
            <button
              onClick={() => setActiveTab("track")}
              className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "track"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Lock className="w-4 h-4 text-sky-500" /> Track My Private Booking
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {reviewSubmittedNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            {reviewSubmittedNotice}
          </div>
        )}

        {/* TAB 1: ALL REVIEWS & EVENT MEMORIES GALLERY */}
        {activeTab === "reviews" && (
          <div className="space-y-10">
            {/* Top Review CTA & Ratings Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 sm:p-8 rounded-3xl bg-card border border-border">
              <div className="md:col-span-8 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Authentic Experiences</span>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading">
                  Traveler Reviews & Event Memories
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Every surprise celebration is coordinated with absolute confidentiality and care. Read authentic stories from pilgrims, couples, and families who celebrated sacred and romantic milestones across India.
                </p>
              </div>

              <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-end items-stretch">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(true)}
                  className="px-5 py-3 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Share Your Event Review
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("form")}
                  className="px-5 py-3 rounded-full bg-muted border border-border text-foreground font-bold text-xs hover:bg-muted/80 transition-all flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4 text-amber-500" /> Book a New Surprise
                </button>
              </div>
            </div>

            {/* Visual Celebration Gallery */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground font-heading flex items-center gap-2">
                    <Image className="w-5 h-5 text-primary" /> Curated Event Moments & Ceremonies
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Real settings curated by our concierges across temple ghats, beaches, and palaces
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventMemoriesGallery.map((galleryItem, idx) => (
                  <div
                    key={idx}
                    className="group rounded-3xl bg-card border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col shadow-xs"
                  >
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <img
                        src={galleryItem.image}
                        alt={galleryItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" /> {galleryItem.tag}
                      </div>
                      <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                        ★ {galleryItem.rating}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-1">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span>{galleryItem.location}</span>
                        </div>
                        <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                          {galleryItem.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                          {galleryItem.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          ✓ Dedicated Concierge
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              category: galleryItem.title,
                            }));
                            setActiveTab("form");
                          }}
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          Plan Similar →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Traveler Reviews List */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground font-heading flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500" /> Verified Traveler Testimonials ({verifiedReviews.length})
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Authentic feedback from families who celebrated life milestones
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {verifiedReviews.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4 hover:border-amber-500/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                          {ev.name}
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold uppercase">
                            Verified Guest
                          </span>
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" /> {ev.destination}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full">
                        {Array.from({ length: ev.feedback.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                    </div>

                    <div className="text-xs font-medium text-primary bg-primary/5 px-3 py-1 rounded-xl w-fit">
                      Event: {ev.category}
                    </div>

                    <p className="text-xs text-foreground/90 leading-relaxed italic bg-muted/40 p-4 rounded-2xl border border-border">
                      "{ev.feedback.comment}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                      <span>Coordinator: {ev.coordinator || "Bharat Yatra Desk"}</span>
                      <span>{ev.feedback.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOK A SURPRISE EVENT (User enters custom category) */}
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
                      Request Confirmed
                    </span>
                    <h3 className="text-lg font-bold text-foreground">
                      Surprise Proposal Submitted! Booking ID: {submittedId}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Our Event Coordinator desk has received your request. To protect your confidentiality, your trip details are kept private and accessible only via your booking ID.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setTrackQuery(submittedId);
                        setActiveTab("track");
                      }}
                      className="mt-2 text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      Track My Booking Status →
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitForm} className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground font-heading flex items-center gap-2">
                    <Gift className="w-5 h-5 text-primary" /> Plan Your Custom Occasion or Surprise
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your celebration details below. You can enter any custom event category or choose from popular suggestions.
                  </p>
                </div>

                {/* USER-ENTERED CUSTOM CATEGORY */}
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                    Event / Occasion Category (Type Custom or Select) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. 60th Shashtipoorthi with Vedic Chanting, Beachside Sunset Proposal, Silver Anniversary..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium focus:ring-2 focus:ring-primary outline-none text-foreground"
                  />

                  {/* Suggestion Chips */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-muted-foreground block font-medium">
                      Quick Suggestions (Click to fill):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {categorySuggestions.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: sug })}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                            formData.category === sug
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          + {sug}
                        </button>
                      ))}
                    </div>
                  </div>
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
                  {/* Destination / Location (Manual input + Suggestions) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Destination / Location / Heritage Spot *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-primary absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        placeholder="e.g. Visakhapatnam Beach, Araku Valley, Udaipur Lake Pichola..."
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium focus:ring-2 focus:ring-primary outline-none text-foreground"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {destinationsList.slice(0, 4).map((d, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFormData({ ...formData, destination: d })}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                        >
                          + {d.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date or Month */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Preferred Date or Month of Travel *
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* How Many People */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Number of Guests / Participants *
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
                  className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Submit Confidential Proposal
                </button>
              </form>
            </div>

            {/* Sidebar Perks */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  What Makes Bharat Yatra Occasions Special?
                </h3>
                <ul className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span><strong>100% Privacy</strong>: Details are only visible to your assigned coordinator.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span><strong>Senior-Friendly Seva</strong>: Wheelchairs, battery cars, and certified Vedic archakas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span><strong>Authentic Cultural Artistes</strong>: Shehnai, sitar, nadaswaram, and veena maestros.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span><strong>Pure Satvik Feasts</strong>: Traditional multi-course regional banquets prepared per custom.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-primary/10 to-transparent border border-amber-500/30 space-y-3">
                <h4 className="font-bold text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Need Urgent Coordination?
                </h4>
                <p className="text-xs text-muted-foreground">
                  Our cultural occasion desk operates daily from 06:00 AM to 10:00 PM IST across Andhra, Telangana, UP, and Rajasthan.
                </p>
                <div className="pt-2 text-xs font-bold text-foreground">
                  📞 Helpline: +91 80088 12345
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TRACK MY PRIVATE BOOKING (Privacy Protected) */}
        {activeTab === "track" && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                  <Lock className="w-4 h-4" /> Confidential Traveler Tracker
                </div>
                <h2 className="text-xl font-bold text-foreground font-heading">
                  Track Your Event Booking Status
                </h2>
                <p className="text-xs text-muted-foreground">
                  To protect personal information, please enter your unique Booking ID (e.g. <span className="font-mono font-bold text-foreground">EVT-8421</span>) or registered phone number.
                </p>
              </div>

              <form onSubmit={handleSearchTracking} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    placeholder="Enter Booking ID (EVT-XXXX) or Mobile Number..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-background border border-border text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" /> View My Status
                </button>
              </form>
            </div>

            {/* Tracking Result View */}
            {trackSearched && !trackedResult && (
              <div className="p-8 text-center bg-card rounded-3xl border border-border space-y-3">
                <Lock className="w-10 h-10 text-muted-foreground mx-auto" />
                <h4 className="font-bold text-base text-foreground">No Private Booking Found</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  We could not find an active reservation for "{trackQuery}". Please double check your booking reference or contact the coordinator desk.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("form")}
                  className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold"
                >
                  Submit a New Proposal
                </button>
              </div>
            )}

            {trackedResult && (
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-primary/30 shadow-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                  <div>
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {trackedResult.id}
                    </span>
                    <h3 className="text-lg font-bold text-foreground mt-2">
                      {trackedResult.category}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> {trackedResult.destination}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        trackedResult.status === "Completed"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : trackedResult.status === "Planned"
                          ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      Status: {trackedResult.status}
                    </span>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                  <div className="text-[11px] font-bold text-muted-foreground uppercase mb-3">Coordination Stage</div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className={`p-2 rounded-xl border ${
                      trackedResult.status === "Upcoming" || trackedResult.status === "Planned" || trackedResult.status === "Completed"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold"
                        : "bg-card border-border text-muted-foreground"
                    }`}>
                      1. Proposal Received
                    </div>
                    <div className={`p-2 rounded-xl border ${
                      trackedResult.status === "Planned" || trackedResult.status === "Completed"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold"
                        : "bg-card border-border text-muted-foreground"
                    }`}>
                      2. Concierge Assigned
                    </div>
                    <div className={`p-2 rounded-xl border ${
                      trackedResult.status === "Completed"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold"
                        : "bg-card border-border text-muted-foreground"
                    }`}>
                      3. Milestone Executed
                    </div>
                  </div>
                </div>

                {/* Detailed Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-card border border-border">
                    <span className="text-muted-foreground block text-[11px]">Primary Contact</span>
                    <span className="font-bold text-foreground text-sm">{trackedResult.name}</span>
                    <span className="text-muted-foreground block mt-0.5">{trackedResult.phone}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-card border border-border">
                    <span className="text-muted-foreground block text-[11px]">Date & Guests</span>
                    <span className="font-bold text-foreground text-sm">{trackedResult.date}</span>
                    <span className="text-muted-foreground block mt-0.5">{trackedResult.people} Attendees</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-card border border-border">
                    <span className="text-muted-foreground block text-[11px]">Assigned Concierge</span>
                    <span className="font-bold text-primary text-sm">{trackedResult.coordinator || "Lead Concierge Desk"}</span>
                    <span className="text-muted-foreground block mt-0.5">Budget: ₹{(trackedResult.budget || 35000).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {trackedResult.notes && (
                  <div className="p-4 rounded-2xl bg-background border border-border text-xs">
                    <span className="font-bold text-foreground block mb-1">Your Special Notes & Inclusions:</span>
                    <p className="text-muted-foreground leading-relaxed italic">"{trackedResult.notes}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* SHARE YOUR REVIEW MODAL */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-lg font-bold text-foreground font-heading">
                  Share Your Event Experience
                </h3>
                <p className="text-xs text-muted-foreground">
                  Post your verified review to the Bharat Yatra community gallery
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-muted-foreground uppercase mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  placeholder="e.g. Sunita & Rajesh V."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-muted-foreground uppercase mb-1">Occasion / Category *</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.category}
                    onChange={(e) => setReviewForm({ ...reviewForm, category: e.target.value })}
                    placeholder="e.g. 60th Shashtipoorthi, Beach Proposal..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-muted-foreground uppercase mb-1">Destination *</label>
                  <select
                    value={reviewForm.destination}
                    onChange={(e) => setReviewForm({ ...reviewForm, destination: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                  >
                    {destinationsList.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-muted-foreground uppercase mb-1">Star Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="p-1 text-xl focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewForm.rating
                            ? "text-amber-500 fill-amber-500"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-foreground ml-2">
                    {reviewForm.rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-muted-foreground uppercase mb-1">Your Detailed Feedback *</label>
                <textarea
                  rows={4}
                  required
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Describe your celebration experience, coordinator support, musical performance, or temple darshan..."
                  className="w-full p-3 rounded-xl bg-background border border-border text-xs text-foreground focus:ring-2 focus:ring-primary outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-muted-foreground hover:bg-muted font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold shadow-md hover:opacity-90"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
