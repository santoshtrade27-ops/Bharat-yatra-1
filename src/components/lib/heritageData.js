// Centralized content for the Bharat Yatra heritage app.

const IMG_BASE = "https://media.base44.com/images/public/6a9ae27c746fec94dc69b172";

export const heroImage = `${IMG_BASE}/fc65e0714_generated_image.png`;

export const heritageSites = [
  {
    id: "khajuraho",
    name: "Khajuraho Temples",
    state: "Madhya Pradesh",
    tag: "temple",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Beauty_of_khajuraho_temple.jpg?width=800",
    description:
      "A group of Hindu and Jain temples famous for Nagara-style architecture and intricate sculptures.",
    wiki: "https://en.wikipedia.org/wiki/Khajuraho_Group_of_Monuments",
    youtube: "https://www.youtube.com/results?search_query=khajuraho+temples",
  },
  {
    id: "taj-mahal",
    name: "Taj Mahal",
    state: "Uttar Pradesh",
    tag: "monument",
    image: `${IMG_BASE}/3e8ecbc38_generated_4454f774.jpg`,
    description:
      "A white marble mausoleum built by Shah Jahan in memory of his wife Mumtaz — one of the Seven Wonders.",
    wiki: "https://en.wikipedia.org/wiki/Taj_Mahal",
    youtube: "https://www.youtube.com/results?search_query=taj+mahal+documentary",
  },
  {
    id: "kerala-backwaters",
    name: "Kerala Backwaters",
    state: "Kerala",
    tag: "nature",
    image: `${IMG_BASE}/fbff01920_generated_11ed5bd7.jpg`,
    description:
      "A serene network of palm-fringed canals navigated by traditional houseboats called kettuvallam.",
    wiki: "https://en.wikipedia.org/wiki/Kerala_backwaters",
    youtube: "https://www.youtube.com/results?search_query=kerala+backwaters+houseboat",
  },
  {
    id: "hawa-mahal",
    name: "Hawa Mahal",
    state: "Rajasthan",
    tag: "palace",
    image: `${IMG_BASE}/2cbbb167a_generated_d79b6de1.jpg`,
    description:
      'The "Palace of Winds" — a pink sandstone facade with 953 tiny windows for royal ladies to watch street life.',
    wiki: "https://en.wikipedia.org/wiki/Hawa_Mahal",
    youtube: "https://www.youtube.com/results?search_query=hawa+mahal+jaipur",
  },
  {
    id: "varanasi-ghats",
    name: "Varanasi Ghats",
    state: "Uttar Pradesh",
    tag: "spiritual",
    image: `${IMG_BASE}/feb383a40_generated_96c388ce.jpg`,
    description:
      "One of the world's oldest living cities — sacred steps on the Ganges where pilgrims gather at dawn.",
    wiki: "https://en.wikipedia.org/wiki/Varanasi",
    youtube: "https://www.youtube.com/results?search_query=varanasi+ghats+dawn",
  },
  {
    id: "hampi",
    name: "Hampi",
    state: "Karnataka",
    tag: "ruins",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Hampi_virupaksha_temple.jpg?width=800",
    description:
      "Ruins of the Vijayanagara Empire — a UNESCO site spread across a surreal boulder-strewn landscape.",
    wiki: "https://en.wikipedia.org/wiki/Hampi",
    youtube: "https://www.youtube.com/results?search_query=hampi+ruins",
  },
];

export const states = [
  {
    name: "Uttar Pradesh",
    image: `${IMG_BASE}/3e8ecbc38_generated_4454f774.jpg`,
    description:
      "Heart of the Mughal empire and the Ganges plains — home to the Taj Mahal, Varanasi ghats and Ayodhya. A cradle of Hindu and Indo-Islamic culture.",
    wiki: "https://en.wikipedia.org/wiki/Uttar_Pradesh",
  },
  {
    name: "Rajasthan",
    image: `${IMG_BASE}/2cbbb167a_generated_d79b6de1.jpg`,
    description:
      "Land of Rajput kingdoms — desert forts, marble palaces and the Thar. Jaipur, Jodhpur and Udaipur hold centuries of chivalry and trade.",
    wiki: "https://en.wikipedia.org/wiki/Rajasthan",
  },
  {
    name: "Kerala",
    image: `${IMG_BASE}/fbff01920_generated_11ed5bd7.jpg`,
    description:
      "Tropical Malabar coast — palm backwaters, ancient spice trade and Kathakali. The most literate state, shaped by trade with the world.",
    wiki: "https://en.wikipedia.org/wiki/Kerala",
  },
  {
    name: "Karnataka",
    image: `${IMG_BASE}/feb383a40_generated_96c388ce.jpg`,
    description:
      "Seat of the Vijayanagara and Hoysala empires — Hampi's boulder ruins, Mysore palace and South India's silicon capital Bengaluru.",
    wiki: "https://en.wikipedia.org/wiki/Karnataka",
  },
  {
    name: "Madhya Pradesh",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Khajuraho1.jpg?width=800",
    description:
      "The geographic heart — Khajuraho temples, Sanchi Stupa, and Kanha tiger reserve. A crossroads of dynasties and forests.",
    wiki: "https://en.wikipedia.org/wiki/Madhya_Pradesh",
  },
  {
    name: "Telangana",
    image: `${IMG_BASE}/3f126d409_generated_image.png`,
    description:
      "Former Nizam realm — Charminar, Golconda fort and the Hyderabadi biryani. A Deccan plateau of pearls, palaces and Qutb Shahi tombs.",
    wiki: "https://en.wikipedia.org/wiki/Telangana",
  },
  {
    name: "West Bengal",
    image: `${IMG_BASE}/efdd148b4_generated_image.png`,
    description:
      "The Ganges delta — Kolkata, the Bengali renaissance, Durga Puja and the Sundarbans tiger mangroves.",
    wiki: "https://en.wikipedia.org/wiki/West_Bengal",
  },
  {
    name: "Tamil Nadu",
    image: `${IMG_BASE}/c2c691723_generated_image.png`,
    description:
      "Dravidian temple land — Madurai Meenakshi, Thanjavur bronzes and Marina beach. A continuous Tamil culture spanning two millennia.",
    wiki: "https://en.wikipedia.org/wiki/Tamil_Nadu",
  },
];

export const foods = [
  {
    name: "Masala Dosa",
    state: "Karnataka",
    rating: 4.7,
    image: `${IMG_BASE}/c2c691723_generated_image.png`,
    description:
      "Crispy fermented rice & lentil crepe stuffed with spiced potato — a South Indian breakfast icon.",
  },
  {
    name: "Hyderabadi Biryani",
    state: "Telangana",
    rating: 4.8,
    image: `${IMG_BASE}/3f126d409_generated_image.png`,
    description:
      "Slow-cooked basmati with marinated meat, saffron and aromatic spices in a sealed pot (dum).",
  },
  {
    name: "Chole Bhature",
    state: "Delhi",
    rating: 4.6,
    image: `${IMG_BASE}/03098bbaf_generated_image.png`,
    description:
      "Fluffy golden fried bread with spiced chickpea curry — a Punjabi-Delhi classic.",
  },
  {
    name: "Rosogolla",
    state: "West Bengal",
    rating: 4.9,
    image: `${IMG_BASE}/efdd148b4_generated_image.png`,
    description:
      "Spongy cottage-cheese balls soaked in light sugar syrup — Bengal's beloved sweet.",
  },
  {
    name: "Rajasthani Thali",
    state: "Rajasthan",
    rating: 4.7,
    image: `${IMG_BASE}/f00bbb3cb_generated_image.png`,
    description:
      "A platter of dal-baati-churma, gatte, ker-sangri and sweets on a brass plate.",
  },
  {
    name: "Macher Jhol",
    state: "West Bengal",
    rating: 4.5,
    image: `${IMG_BASE}/399fd2664_generated_image.png`,
    description:
      "Light Bengali fish curry with potatoes and aromatic spices, served with rice.",
  },
];

export const products = [
  {
    name: "Blue Pottery Vase",
    origin: "Jaipur, Rajasthan",
    rating: 4.6,
    image: `${IMG_BASE}/55fca79b0_generated_image.png`,
    description:
      "Hand-painted Persian-style turquoise pottery vase. Each piece is unique, crafted by Jaipur artisans using the traditional blue pottery technique with natural mineral oxides.",
    price: 1299,
    mrp: 1899,
  },
  {
    name: "Banarasi Silk Saree",
    origin: "Varanasi, UP",
    rating: 4.9,
    image: `${IMG_BASE}/d02362a98_generated_image.png`,
    description:
      "Pure silk saree with intricate gold zari brocade weaving. A timeless heirloom woven on handlooms by master Banarasi weavers over weeks.",
    price: 8499,
    mrp: 11999,
  },
  {
    name: "Channapatna Wooden Toys",
    origin: "Karnataka",
    rating: 4.5,
    image: `${IMG_BASE}/4cdee7936_generated_image.png`,
    description:
      "Lacquer-finished wooden toys made with non-toxic natural dyes. GI-tagged craft, safe for children, traditionally turned on lathe.",
    price: 699,
    mrp: 999,
  },
  {
    name: "Dhokra Brass Figurine",
    origin: "Chhattisgarh",
    rating: 4.7,
    image: `${IMG_BASE}/8c6f44e47_generated_image.png`,
    description:
      "Lost-wax tribal brass casting — an ancient 4000-year-old technique. Each figurine is one-of-a-kind, depicting tribal motifs and folklore.",
    price: 1899,
    mrp: 2599,
  },
  {
    name: "Kantha Embroidered Stole",
    origin: "West Bengal",
    rating: 4.4,
    image: `${IMG_BASE}/8469aad95_generated_image.png`,
    description:
      "Running-stitch embroidery on layered soft cotton. Lightweight, breathable and hand-stitched by rural women artisans.",
    price: 1499,
    mrp: 2199,
  },
  {
    name: "Pashmina Shawl",
    origin: "Kashmir",
    rating: 5.0,
    image: `${IMG_BASE}/1955da697_generated_image.png`,
    description:
      "Hand-spun, hand-woven pure cashmere — featherlight yet warm. Sourced from the underbelly of the Changthangi goat at high altitude.",
    price: 12999,
    mrp: 18999,
  },
];

export const books = [
  {
    title: "Tales of the Rajputs",
    category: "Folk Collection",
    image: `${IMG_BASE}/896630540_generated_image.png`,
    link: "https://www.google.com/search?q=tales+of+the+rajputs+book",
  },
  {
    title: "Ganga: The Eternal River",
    category: "Spiritual Journeys",
    image: `${IMG_BASE}/89c695b3b_generated_image.png`,
    link: "https://www.google.com/search?q=ganga+the+eternal+river+book",
  },
  {
    title: "Forts of the Deccan",
    category: "History Tales",
    image: `${IMG_BASE}/896630540_generated_image.png`,
    link: "https://www.google.com/search?q=forts+of+the+deccan+book",
  },
];

export const hotels = [
  { name: "Heritage Inn Agra", city: "Agra", amenities: "Wifi, Breakfast, AC", price: 2500, rating: 4.5 },
  { name: "Pink City Haveli", city: "Jaipur", amenities: "Wifi, Breakfast, Pool, AC", price: 3200, rating: 4.7 },
  { name: "Backwater Resort", city: "Alappuzha", amenities: "Wifi, Breakfast, Houseboat, AC", price: 4500, rating: 4.8 },
  { name: "Ganga View Guesthouse", city: "Varanasi", amenities: "Wifi, Breakfast", price: 1800, rating: 4.3 },
  { name: "Nizam Heritage Stay", city: "Hyderabad", amenities: "Wifi, Breakfast, AC, Restaurant", price: 2800, rating: 4.6 },
  { name: "Temple Town Lodge", city: "Khajuraho", amenities: "Wifi, Breakfast, AC", price: 2200, rating: 4.4 },
];

// Approximate coordinates for heritage sites (for the interactive map)
export const siteCoords = {
  khajuraho: [24.83, 79.92],
  "taj-mahal": [27.17, 78.04],
  "kerala-backwaters": [9.52, 76.26],
  "hawa-mahal": [26.92, 75.83],
  "varanasi-ghats": [25.31, 83.01],
  hampi: [15.33, 76.46],
};

// Facility markers generated near each site
export const facilities = [
  { type: "hospital", name: "District Hospital", site: "taj-mahal", offset: [0.02, 0.03] },
  { type: "petrol", name: "Indian Oil Pump", site: "taj-mahal", offset: [-0.015, 0.025] },
  { type: "hotel", name: "Heritage Inn", site: "taj-mahal", offset: [0.01, -0.02] },
  { type: "police", name: "Tourist Police Post", site: "taj-mahal", offset: [0.025, 0.01] },
  { type: "hospital", name: "City Hospital", site: "varanasi-ghats", offset: [0.02, -0.03] },
  { type: "petrol", name: "HP Petrol", site: "varanasi-ghats", offset: [0.015, 0.02] },
  { type: "hotel", name: "Ganga View Guesthouse", site: "varanasi-ghats", offset: [-0.01, 0.015] },
  { type: "police", name: "Ghats Police", site: "varanasi-ghats", offset: [0.03, 0.02] },
  { type: "hospital", name: "Jaipur Hospital", site: "hawa-mahal", offset: [0.02, 0.03] },
  { type: "petrol", name: "Bharat Petroleum", site: "hawa-mahal", offset: [-0.02, 0.02] },
  { type: "hotel", name: "Pink City Haveli", site: "hawa-mahal", offset: [0.01, 0.025] },
  { type: "police", name: "Jaipur Police", site: "hawa-mahal", offset: [0.025, -0.01] },
  { type: "hospital", name: "Alappuzha General", site: "kerala-backwaters", offset: [0.02, 0.03] },
  { type: "hotel", name: "Backwater Resort", site: "kerala-backwaters", offset: [-0.01, 0.02] },
  { type: "police", name: "Alappuzha Police", site: "kerala-backwaters", offset: [0.015, -0.02] },
  { type: "hospital", name: "Hampi PHC", site: "hampi", offset: [0.02, 0.02] },
  { type: "hotel", name: "Temple Town Lodge", site: "hampi", offset: [-0.01, 0.015] },
];

export const events = [
  {
    id: "kumbh",
    name: "Kumbh Mela",
    state: "Uttar Pradesh",
    month: "Jan–Feb",
    image: `${IMG_BASE}/feb383a40_generated_96c388ce.jpg`,
    timing: "Dawn to dusk, holy dips at sunrise",
    dress: "Modest traditional wear; saffron for sadhus",
    rules: "No footwear on ghats; carry ID; stay in camps",
    history:
      "The largest peaceful gathering on Earth — a millennia-old pilgrimage where Hindus bathe at sacred river confluences to cleanse karma.",
  },
  {
    id: "pushkar",
    name: "Pushkar Camel Fair",
    state: "Rajasthan",
    month: "November",
    image: `${IMG_BASE}/2cbbb167a_generated_d79b6de1.jpg`,
    timing: "All day; mela grounds active 6am–9pm",
    dress: "Rajasthani turbans & bandhani; desert-friendly cotton",
    rules: "Bargain respectfully; stay hydrated; book tents early",
    history:
      "A 400-year-old livestock fair where traders, pilgrims and folk artists converge by the holy Pushkar Lake.",
  },
  {
    id: "onam",
    name: "Onam",
    state: "Kerala",
    month: "Aug–Sep",
    image: `${IMG_BASE}/fbff01920_generated_11ed5bd7.jpg`,
    timing: "10 days; feast (Onasadya) on final day",
    dress: "Mundu & kasavu sarees; floral yellow garlands",
    rules: "Join community feasts; remove shoes at homes",
    history:
      "Harvest festival welcoming the legendary King Mahabali, marked by snake-boat races and elaborate flower carpets.",
  },
  {
    id: "durga-puja",
    name: "Durga Puja",
    state: "West Bengal",
    month: "Sep–Oct",
    image: `${IMG_BASE}/efdd148b4_generated_image.png`,
    timing: "Pandal hopping evenings 4pm–midnight",
    dress: "Sarees & kurta; red-and-white traditional",
    rules: "Queue at pandals; no photography inside sanctum",
    history:
      "UNESCO-recognized festival celebrating Goddess Durga's victory over Mahishasura, with themed art pandals across Kolkata.",
  },
  {
    id: "hornbill",
    name: "Hornbill Festival",
    state: "Nagaland",
    month: "December",
    image: `${IMG_BASE}/8c6f44e47_generated_image.png`,
    timing: "Day-long performances 9am–6pm",
    dress: "Tribal shawls; Naga warrior headgear",
    rules: "Permit required; respect tribal customs",
    history:
      "The 'Festival of Festivals' — a showcase of Naga tribes' dance, music, cuisine and crafts at Kisama heritage village.",
  },
];

export const guides = [
  { name: "Ravi Sharma", state: "Rajasthan", languages: "English, Hindi, French", rating: 4.9, phone: "+91-98290-11111", specialty: "Forts & palaces" },
  { name: "Meena Iyer", state: "Kerala", languages: "English, Malayalam, German", rating: 4.8, phone: "+91-98470-22222", specialty: "Backwaters & Ayurveda" },
  { name: "Arjun Reddy", state: "Telangana", languages: "English, Telugu, Hindi", rating: 4.7, phone: "+91-99850-33333", specialty: "Nizam heritage & cuisine" },
  { name: "Suresh Yadav", state: "Uttar Pradesh", languages: "English, Hindi, Spanish", rating: 4.9, phone: "+91-94120-44444", specialty: "Mughal monuments" },
  { name: "Lakshmi Nair", state: "Karnataka", languages: "English, Kannada, Italian", rating: 4.6, phone: "+91-98440-55555", specialty: "Hampi ruins & temples" },
  { name: "Imran Khan", state: "Madhya Pradesh", languages: "English, Hindi, Arabic", rating: 4.8, phone: "+91-99770-66666", specialty: "Khajuraho & wildlife" },
];

export const stories = [
  { id: "s1", title: "The Last Weaver of Banaras", type: "video", category: "Crafts", image: `${IMG_BASE}/d02362a98_generated_image.png`, link: "https://www.youtube.com/results?search_query=banarasi+weaver+documentary" },
  { id: "s2", title: "Sunrise at Varanasi Ghats", type: "video", category: "Spiritual", image: `${IMG_BASE}/feb383a40_generated_96c388ce.jpg`, link: "https://www.youtube.com/results?search_query=varanasi+sunrise" },
  { id: "s3", title: "Tales of the Rajputs", type: "book", category: "Folk", image: `${IMG_BASE}/896630540_generated_image.png`, link: "https://www.google.com/search?q=tales+of+the+rajputs+book" },
  { id: "s4", title: "Kerala Houseboat Diaries", type: "video", category: "Travel", image: `${IMG_BASE}/fbff01920_generated_11ed5bd7.jpg`, link: "https://www.youtube.com/results?search_query=kerala+houseboat" },
  { id: "s5", title: "Ganga: The Eternal River", type: "book", category: "Spiritual", image: `${IMG_BASE}/89c695b3b_generated_image.png`, link: "https://www.google.com/search?q=ganga+the+eternal+river+book" },
  { id: "s6", title: "Forts of the Deccan", type: "book", category: "History", image: `${IMG_BASE}/896630540_generated_image.png`, link: "https://www.google.com/search?q=forts+of+the+deccan+book" },
];

export const travelGuides = [
  {
    state: "Andhra Pradesh",
    title: "APTDC Brochure Portal",
    description: "Official brochures for Tirupati, Vizag, Araku & Buddhist sites",
    url: "https://tourism.ap.gov.in/brochures",
    type: "Tourism Guide",
  },
  {
    state: "Telangana",
    title: "Telangana Tourism Brochures",
    description: "Official tour itineraries, sightseeing guides & package details",
    url: "https://www.tstelanganatourism.com/brochures",
    type: "Tourism Guide",
  },
  {
    state: "Telangana",
    title: "Wikivoyage Telangana (PDF)",
    description: "Offline guide for Charminar, Golconda Fort & Warangal — download as PDF",
    url: "https://en.wikivoyage.org/wiki/Telangana",
    type: "Offline Guide",
  },
  {
    state: "Andhra Pradesh",
    title: "APSRTC Bus Schedules",
    description: "Timetables, route charts & live-tracking for intercity/local buses",
    url: "https://www.apsrtc.ap.gov.in/",
    type: "Transport",
  },
  {
    state: "Telangana",
    title: "TGSRTC Schedules & Services",
    description: "City bus routes, airport express & intercity schedules",
    url: "https://www.tgsrtc.telangana.gov.in/",
    type: "Transport",
  },
  {
    state: "Telangana",
    title: "L&T Hyderabad Metro",
    description: "Route maps, fare charts & station details for Hyderabad Metro",
    url: "https://www.ltmetro.com/",
    type: "Transport",
  },
];

export const phrases = {
  hi: [
    { en: "Hello", local: "नमस्ते", pron: "Namaste" },
    { en: "Thank you", local: "धन्यवाद", pron: "Dhanyavaad" },
    { en: "How much?", local: "कितना?", pron: "Kitna?" },
    { en: "Where is...?", local: "कहाँ है?", pron: "Kahan hai?" },
    { en: "Food", local: "खाना", pron: "Khaana" },
    { en: "Water", local: "पानी", pron: "Paani" },
    { en: "Help", local: "मदद", pron: "Madad" },
    { en: "Beautiful", local: "सुंदर", pron: "Sundar" },
  ],
  te: [
    { en: "Hello", local: "నమస్తే", pron: "Namaste" },
    { en: "Thank you", local: "ధన్యవాదాలు", pron: "Dhanyavaadalu" },
    { en: "How much?", local: "ఎంత?", pron: "Enta?" },
    { en: "Where is...?", local: "ఎక్కడ ఉంది?", pron: "Ekkada undi?" },
    { en: "Food", local: "ఆహారం", pron: "Aahaaram" },
    { en: "Water", local: "నీళ్లు", pron: "Neellu" },
    { en: "Help", local: "సహాయం", pron: "Sahaayam" },
    { en: "Beautiful", local: "అందమైన", pron: "Andamaina" },
  ],
};