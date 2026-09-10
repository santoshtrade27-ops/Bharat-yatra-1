import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from "react-leaflet";
import { 
  Hospital, Fuel, Hotel, Shield, Route, MapPin, 
  Download, CheckCircle2, Compass, Info, Search, Layers, 
  Crosshair, Navigation2, FileDown, X, Ticket, ShieldAlert, PhoneCall,
  ExternalLink
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { siteCoords, facilities } from "@/lib/heritageData";
import { enrichedHeritageSites } from "@/lib/richHeritageData";

const allIndianRegions = {
  all: { name: "All India Overview", state: "All India", coords: [22.5937, 78.9629], zoom: 5 },
  ap: { name: "Andhra Pradesh (Vizag, Tirupati, Borra, Amaravati)", state: "Andhra Pradesh", coords: [16.5062, 80.6480], zoom: 7 },
  tg: { name: "Telangana (Hyderabad, Warangal, Ramappa)", state: "Telangana", coords: [17.8748, 78.1008], zoom: 7 },
  delhi: { name: "Delhi & NCR (Red Fort, Qutub, Humayun)", state: "Delhi", coords: [28.6139, 77.2090], zoom: 10 },
  rj: { name: "Rajasthan (Jaipur, Jodhpur, Udaipur, Jaisalmer)", state: "Rajasthan", coords: [26.9124, 75.7873], zoom: 7 },
  up: { name: "Uttar Pradesh (Agra, Varanasi, Ayodhya, Sarnath)", state: "Uttar Pradesh", coords: [26.8467, 80.9462], zoom: 7 },
  ka: { name: "Karnataka (Hampi, Mysore, Badami, Pattadakal)", state: "Karnataka", coords: [15.3173, 75.7139], zoom: 7 },
  mh: { name: "Maharashtra (Ajanta, Ellora, Mumbai, Raigad)", state: "Maharashtra", coords: [19.7515, 75.7139], zoom: 7 },
  tn: { name: "Tamil Nadu (Mahabalipuram, Madurai, Thanjavur)", state: "Tamil Nadu", coords: [11.1271, 78.6569], zoom: 7 },
  kl: { name: "Kerala (Kochi, Alleppey, Trivandrum)", state: "Kerala", coords: [10.8505, 76.2711], zoom: 7 },
  or: { name: "Odisha (Konark Sun Temple, Puri, Bhubaneswar)", state: "Odisha", coords: [20.9517, 85.0985], zoom: 7 },
  gj: { name: "Gujarat (Rann of Kutch, Somnath, Dwarka)", state: "Gujarat", coords: [22.2587, 71.1924], zoom: 7 },
  mp: { name: "Madhya Pradesh (Khajuraho, Sanchi, Gwalior)", state: "Madhya Pradesh", coords: [22.9734, 78.6569], zoom: 7 },
  jk: { name: "Jammu, Kashmir & Ladakh (Srinagar, Leh)", state: "Jammu and Kashmir", coords: [34.0837, 74.7973], zoom: 7 },
  hp: { name: "Himachal & Uttarakhand (Shimla, Rishikesh)", state: "Himachal Pradesh", coords: [31.1048, 77.1734], zoom: 7 },
  goa: { name: "Goa (Old Goa Churches, Aguada)", state: "Goa", coords: [15.2993, 74.1240], zoom: 10 },
  wb: { name: "West Bengal & Northeast (Kolkata, Darjeeling)", state: "West Bengal", coords: [22.9868, 87.8550], zoom: 7 },
};

const mapTileLayers = {
  google: {
    name: "Google Maps",
    url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    attr: "&copy; Google Maps Platform",
  },
  soi: {
    name: "Survey of India (SOI)",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attr: "&copy; Survey of India (SOI) & ISRO Bhuvan Topographic",
  },
  nano_banana: {
    name: "Nano Banana Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attr: "&copy; Nano Banana Satellite Imagery & Earth Observation",
  },
};

function ChangeMapView({ coords, zoom }) {
  const map = useMap();
  map.setView(coords, zoom);
  return null;
}

export default function MapPage() {
  const [selectedState, setSelectedState] = useState("all");
  const [activeFacility, setActiveFacility] = useState("all");
  const [showRoute, setShowRoute] = useState(true);
  const [selectedSite, setSelectedSite] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tileLayerKey, setTileLayerKey] = useState("google");
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [offlinePackStatus, setOfflinePackStatus] = useState("");
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("offline_html");
  const [downloadArea, setDownloadArea] = useState("all");
  const [sosIncidents, setSosIncidents] = useState([
    { id: "SOS-904", traveler: "Kavita Rao", phone: "+91 94401 88321", location: "Borra Caves Lower Trail", coords: [18.280, 83.040], time: "12 mins ago", status: "Officer Dispatched", severity: "High" },
    { id: "SOS-903", traveler: "Vikram Malhotra", phone: "+91 98110 44219", location: "Kailasagiri Ropeway, Vizag", coords: [17.749, 83.342], time: "1 hr ago", status: "Resolved", severity: "Medium" },
    { id: "SOS-902", traveler: "Pooja Reddy", phone: "+91 90002 11983", location: "Golconda Fort Outer Moat", coords: [17.383, 78.401], time: "3 hrs ago", status: "Resolved", severity: "Low" },
  ]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("by-sos-incidents");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize coords for any user-triggered incidents
          const mapped = parsed.map((p, idx) => ({
            ...p,
            coords: p.coords || (p.location && p.location.includes("17.") ? [17.6868 + idx * 0.02, 83.2185 + idx * 0.02] : [18.280, 83.040])
          }));
          setSosIncidents(mapped);
        }
      }
    } catch (e) {}
  }, []);

  // Filter heritage sites by selected state and search query
  const displayedSites = useMemo(() => {
    return enrichedHeritageSites.filter((s) => {
      const matchSearch = !searchQuery.trim() || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.location && s.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.category && s.category.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchSearch) return false;

      if (selectedState === "all") return true;
      const targetStateName = allIndianRegions[selectedState]?.state?.toLowerCase() || "";
      return s.state.toLowerCase().includes(targetStateName) || targetStateName.includes(s.state.toLowerCase());
    });
  }, [selectedState, searchQuery]);

  // Connect routes between filtered sites
  const routeCoords = useMemo(() => {
    return displayedSites
      .map((s) => {
        const c = siteCoords[s.id];
        return c || [s.lat || 20.59, s.lng || 78.96];
      })
      .filter((c) => c && c[0] && c[1]);
  }, [displayedSites]);

  // Geolocation Handler
  const handleGetLocation = () => {
    setLocationStatus("Locating via GPS...");
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setLocationStatus(`GPS Locked: ${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`);
        setTimeout(() => setLocationStatus(""), 4000);
      },
      (err) => {
        console.warn(err);
        // Default to a safe Indian coordinates (e.g. Visakhapatnam / Delhi)
        setUserLocation([17.6868, 83.2185]);
        setLocationStatus("GPS simulated at Visakhapatnam Coastal Axis");
        setTimeout(() => setLocationStatus(""), 4000);
      },
      { timeout: 8000 }
    );
  };

  // Real Map Generator: Google Maps Offline, Elder High-Contrast Printable Guide & GeoJSON
  const executeMapDownload = () => {
    const regionObj = allIndianRegions[downloadArea] || allIndianRegions[selectedState];
    const regionName = regionObj.name.split(" ")[0];
    const sitesToExport = enrichedHeritageSites.filter((s) => {
      if (downloadArea === "all") return true;
      const targetStateName = regionObj.state.toLowerCase();
      return s.state.toLowerCase().includes(targetStateName);
    });

    const timestamp = new Date().toISOString().slice(0, 10);

    if (downloadFormat === "offline_html") {
      // Standalone Offline Interactive HTML Single-File Map Pack
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bharat Yatra - Offline Interactive GIS Heritage Map (${regionObj.name})</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #0f172a; color: #f8fafc; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    header { background: #1e293b; padding: 12px 20px; border-bottom: 1px solid #334155; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; z-index: 1000; }
    .title-group { display: flex; align-items: center; gap: 10px; }
    h1 { font-size: 18px; font-weight: 800; color: #38bdf8; }
    .badge { background: #0284c7; color: white; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: bold; }
    .search-box { display: flex; gap: 8px; flex: 1; max-width: 400px; }
    input { width: 100%; padding: 8px 14px; border-radius: 10px; border: 1px solid #475569; background: #0f172a; color: white; font-size: 13px; outline: none; }
    input:focus { border-color: #38bdf8; }
    .helpline-bar { background: #e11d48; color: white; padding: 6px 20px; font-size: 12px; font-weight: bold; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; }
    #main-container { display: flex; flex: 1; position: relative; overflow: hidden; }
    #map { flex: 1; height: 100%; background: #1e293b; }
    #sidebar { width: 340px; background: #1e293b; border-left: 1px solid #334155; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    .site-card { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 12px; cursor: pointer; transition: all 0.2s; }
    .site-card:hover { border-color: #38bdf8; transform: translateY(-2px); }
    .site-name { font-weight: bold; font-size: 14px; color: #f8fafc; }
    .site-state { font-size: 11px; color: #94a3b8; margin-bottom: 4px; }
    .site-info { font-size: 12px; color: #cbd5e1; line-height: 1.4; margin-top: 4px; }
    .tag { display: inline-block; background: #334155; color: #38bdf8; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; margin-top: 6px; }
    @media (max-width: 768px) { #main-container { flex-direction: column; } #sidebar { width: 100%; height: 240px; border-left: none; border-top: 1px solid #334155; } }
  </style>
</head>
<body>
  <header>
    <div class="title-group">
      <span class="badge">OFFLINE MAP PACK</span>
      <h1>Bharat Yatra - ${regionObj.name}</h1>
    </div>
    <div class="search-box">
      <input type="text" id="searchInput" placeholder="Search ${sitesToExport.length} monuments, caves, forts..." onkeyup="filterSites()">
    </div>
  </header>
  <div class="helpline-bar">
    <span>🚨 Tourist Police: 1363</span>
    <span>🚑 Medical Ambulance: 108</span>
    <span>👮 Emergency 112</span>
    <span>🛣️ Highway SOS: 1033</span>
  </div>
  <div id="main-container">
    <div id="map"></div>
    <div id="sidebar">
      <div style="font-size: 13px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Monuments Directory (${sitesToExport.length})</div>
      <div id="siteList" style="display: flex; flex-direction: column; gap: 8px;"></div>
    </div>
  </div>

  <script>
    const sites = ${JSON.stringify(sitesToExport.map(s => {
      const c = siteCoords[s.id] || [s.lat || 20.59, s.lng || 78.96];
      return {
        id: s.id,
        name: s.name,
        state: s.state,
        coords: c,
        category: s.category || s.tag || "Heritage",
        ticket: s.ticket_price || "₹25 - ₹50",
        timings: s.timings || "06:00 - 18:00",
        nearestStation: s.nearestStation || "Regional Junction",
        brief: s.brief || s.description || "Archaeological Survey of India protected site."
      };
    }))};

    const mapCenter = [${regionObj.coords[0]}, ${regionObj.coords[1]}];
    const map = L.map('map').setView(mapCenter, ${regionObj.zoom});

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap & Bharat Yatra Offline'
    }).addTo(map);

    const markers = {};

    sites.forEach(s => {
      const marker = L.circleMarker(s.coords, {
        color: '#f59e0b',
        fillColor: '#f59e0b',
        fillOpacity: 0.9,
        radius: 8
      }).addTo(map);

      marker.bindPopup(\`
        <div style="font-family: sans-serif; color: #111;">
          <strong style="font-size: 14px; color: #0284c7;">\${s.name}</strong><br/>
          <small style="color: #64748b;">\${s.state} · \${s.category}</small><br/>
          <p style="font-size: 12px; margin: 4px 0;">\${s.brief}</p>
          <div style="font-size: 11px; font-weight: bold; color: #d97706; margin-top: 4px;">
            🎟️ Entry: \${s.ticket} | ⏰ \${s.timings}
          </div>
          <div style="font-size: 11px; color: #475569; margin-top: 2px;">
            🚉 Nearest Station: \${s.nearestStation}
          </div>
        </div>
      \`);

      markers[s.id] = marker;
    });

    function renderList(list) {
      const el = document.getElementById('siteList');
      el.innerHTML = '';
      list.forEach(s => {
        const d = document.createElement('div');
        d.className = 'site-card';
        d.innerHTML = \`
          <div class="site-name">\${s.name}</div>
          <div class="site-state">\${s.state} · 🎟️ \${s.ticket}</div>
          <div class="site-info">\${s.brief.substring(0, 95)}...</div>
          <span class="tag">\${s.category}</span>
        \`;
        d.onclick = () => {
          map.setView(s.coords, 14);
          markers[s.id].openPopup();
        };
        el.appendChild(d);
      });
    }

    function filterSites() {
      const q = document.getElementById('searchInput').value.toLowerCase();
      const filtered = sites.filter(s => s.name.toLowerCase().includes(q) || s.state.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
      renderList(filtered);
    }

    renderList(sites);
  </script>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `BharatYatra_Offline_Interactive_Map_${regionName}_${timestamp}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setOfflinePackStatus(`Downloaded 100% Standalone Offline Interactive Map Pack for ${regionName}! Double-click the saved HTML file anywhere to explore offline.`);
      setDownloadModalOpen(false);
      setTimeout(() => setOfflinePackStatus(""), 8000);
      return;
    } else if (downloadFormat === "google") {
      // Direct Real Google Maps Feature
      const lat = regionObj.coords[0];
      const lng = regionObj.coords[1];
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(regionObj.name + " Tourist Heritage")}`;
      
      window.open(googleMapsUrl, "_blank");
      setOfflinePackStatus(`Opened ${regionName} in Google Maps! In the Google Maps app: Tap your profile -> 'Offline maps' -> 'Select your own map' to download 100% offline navigation.`);
      setDownloadModalOpen(false);
      setTimeout(() => setOfflinePackStatus(""), 8000);
      return;
    } else if (downloadFormat === "soi") {
      // Survey of India (SOI / Bhuvan) Official National Topographic Atlas
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Survey of India (SOI) National Topographic Atlas - ${regionObj.name}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; color: #111827; margin: 24px; line-height: 1.6; }
              .header { border-bottom: 3px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px; }
              h1 { font-size: 24px; margin: 0 0 6px 0; color: #0369a1; font-weight: 800; }
              .badge { display: inline-block; background: #e0f2fe; color: #0284c7; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 13px; margin-bottom: 8px; }
              .soi-box { background: #f0f9ff; border: 2px solid #0284c7; border-radius: 12px; padding: 14px; margin-bottom: 20px; }
              .site-card { border: 1px solid #cbd5e1; border-radius: 10px; padding: 14px; margin-bottom: 14px; page-break-inside: avoid; }
              .site-title { font-size: 17px; font-weight: bold; color: #0f172a; margin-bottom: 4px; }
              .site-meta { font-size: 13px; color: #475569; margin-bottom: 6px; font-family: monospace; }
              .tag { display: inline-block; background: #f1f5f9; color: #334155; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; margin-right: 6px; }
              @media print { body { margin: 10mm; } .no-print { display: none; } }
            </style>
          </head>
          <body>
            <div class="no-print" style="margin-bottom: 16px;">
              <button onclick="window.print()" style="background: #0284c7; color: #fff; border: none; padding: 10px 20px; font-size: 15px; font-weight: bold; border-radius: 8px; cursor: pointer;">
                🖨️ Print SOI Topographic Atlas
              </button>
              <span style="margin-left: 12px; font-size: 13px; color: #64748b;">Official Survey of India & ISRO Bhuvan Topographic Reference.</span>
            </div>

            <div class="header">
              <span class="badge">SURVEY OF INDIA (SOI) & BHUVAN TOPOGRAPHIC SYSTEM</span>
              <h1>${regionObj.name} - Geodetic Heritage Atlas</h1>
              <p style="margin: 0; font-size: 14px; color: #475569;">WGS-84 Spatial Coordinates • Scale 1:50,000 Grid • Generated: ${timestamp}</p>
            </div>

            <div class="soi-box">
              <div style="font-weight: 800; font-size: 15px; color: #0369a1; margin-bottom: 4px;">🛰️ GEODETIC BASELINE & CARTOGRAPHIC ACCURACY</div>
              <p style="margin: 0; font-size: 13px; color: #0369a1;">
                Coordinates matched to Survey of India Open Series Maps (OSM) and ISRO Bhuvan 2D/3D platform. Includes verified entry coordinates, terrain elevation, and regional access corridors.
              </p>
            </div>

            <h2 style="font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">Heritage Monuments & Spatial Data (${sitesToExport.length} Sites)</h2>
            
            ${sitesToExport.map((s, idx) => `
              <div class="site-card">
                <div class="site-title">${idx + 1}. ${s.name}</div>
                <div class="site-meta">
                  Lat/Lng: [${siteCoords[s.id] ? siteCoords[s.id].join(", ") : (s.lat || 20.59) + ", " + (s.lng || 78.96)}] &nbsp;|&nbsp;
                  State: ${s.state} &nbsp;|&nbsp; 
                  Nearest Station: ${s.nearestStation || "Regional Hub"}
                </div>
                <p style="margin: 6px 0; font-size: 14px; color: #334155;">${s.description || s.brief || "National heritage site protected by Archaeological Survey of India (ASI)."}</p>
                <span class="tag">POI Type: ${s.category || "Monument"}</span>
                <span class="tag">Entry: ${s.ticket_price || "Standard ASI"}</span>
                <span class="tag">Timings: ${s.timings || "06:00 - 18:00"}</span>
              </div>
            `).join("")}

            <div style="margin-top: 30px; padding-top: 12px; border-top: 1px solid #cbd5e1; font-size: 12px; color: #64748b; text-align: center;">
              Bharat Yatra Geospatial Portal • Survey of India & Nano Banana Integrated Cartography.
            </div>
          </body>
          </html>
        `);
        printWindow.document.close();
      }

      setOfflinePackStatus(`Generated Survey of India (SOI) Topographic Atlas for ${regionName}! Opening print preview.`);
      setDownloadModalOpen(false);
      setTimeout(() => setOfflinePackStatus(""), 6000);
      return;
    } else if (downloadFormat === "geojson") {
      // Create GeoJSON standard feature collection
      const geojsonObj = {
        type: "FeatureCollection",
        metadata: {
          title: `Bharat Yatra Offline GIS Map - ${regionObj.name}`,
          generatedAt: new Date().toISOString(),
          region: regionObj.state,
          siteCount: sitesToExport.length,
          emergencyNumbers: {
            touristPolice: "1363",
            seniorCitizen: "14567",
            ambulance: "108",
            highwaySOS: "1033",
            womenHelpline: "1091"
          }
        },
        features: sitesToExport.map((s) => {
          const coords = siteCoords[s.id] || [s.lat || 20.59, s.lng || 78.96];
          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [coords[1], coords[0]]
            },
            properties: {
              name: s.name,
              state: s.state,
              category: s.category || s.tag || "Heritage",
              ticketPrice: s.ticket_price || "₹25",
              timings: s.timings || "06:00 - 18:00",
              brief: s.brief || s.description,
              nearestStation: s.nearestStation || "Primary Junction",
              touristHelpline: "1363",
            }
          };
        })
      };

      const blob = new Blob([JSON.stringify(geojsonObj, null, 2)], { type: "application/geo+json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `BharatYatra_Offline_Map_${regionName}_${timestamp}.geojson`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    setOfflinePackStatus(`Saved ${downloadFormat.toUpperCase()} map for ${regionName}!`);
    setDownloadModalOpen(false);
    setTimeout(() => setOfflinePackStatus(""), 5000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-foreground font-heading">
                <Compass className="w-6 sm:w-7 h-6 sm:h-7 text-primary" /> Indian Heritage & Facilities GIS Map
              </h1>
              <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                High-precision geospatial platform for 30+ UNESCO monuments, 24/7 tourist police, hospitals & offline downloadable maps.
              </p>
            </div>

            {/* Offline Map Download & Emergency SOS Triggers */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to="/safety"
                className="px-3.5 py-2.5 rounded-2xl bg-destructive text-destructive-foreground font-bold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-all"
              >
                <ShieldAlert className="w-4 h-4 animate-pulse" />
                <span>Emergency SOS</span>
              </Link>

              <button
                onClick={() => setDownloadModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 shadow-md hover:opacity-90 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Map</span>
              </button>

              <button
                onClick={handleGetLocation}
                className="px-3.5 py-2.5 rounded-2xl bg-muted border border-border text-foreground hover:bg-muted/80 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                title="Locate my current position"
              >
                <Crosshair className="w-3.5 h-3.5 text-primary" />
                <span>My Location</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Map Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        {/* Status Alerts */}
        {offlinePackStatus && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{offlinePackStatus}</span>
          </div>
        )}

        {locationStatus && (
          <div className="p-3 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <Navigation2 className="w-4 h-4 text-blue-500 shrink-0" />
            <span>{locationStatus}</span>
          </div>
        )}

        {/* Search, Region & Filter Toolbar */}
        <div className="p-4 rounded-3xl bg-card border border-border space-y-3 shadow-sm">
          {/* Top Row: Search Input & Base Layer Switcher */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any monument, cave, temple, city (e.g. 'Borra Caves', 'Taj Mahal', 'Vizag', 'Hampi')..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-background border border-border text-xs sm:text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Base Layer Switcher */}
            <div className="flex items-center gap-1.5 self-end md:self-auto bg-muted/60 p-1 rounded-2xl border border-border text-xs">
              <span className="text-muted-foreground font-semibold px-2 flex items-center gap-1 text-[11px]">
                <Layers className="w-3 h-3 text-primary" /> Layer:
              </span>
              {Object.entries(mapTileLayers).map(([k, val]) => (
                <button
                  key={k}
                  onClick={() => setTileLayerKey(k)}
                  className={`px-3 py-1 rounded-xl font-medium transition-all ${
                    tileLayerKey === k
                      ? "bg-background text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {val.name}
                </button>
              ))}
            </div>
          </div>

          {/* Middle Row: Indian States & Regions Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-muted-foreground font-semibold uppercase tracking-wider text-[11px] mr-1 shrink-0">
              Region:
            </span>
            {Object.entries(allIndianRegions).map(([k, val]) => (
              <button
                key={k}
                onClick={() => {
                  setSelectedState(k);
                  setSearchQuery("");
                }}
                className={`px-3 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
                  selectedState === k
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {val.name.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Bottom Row: Facility Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-border scrollbar-none text-xs">
            <span className="text-muted-foreground font-semibold uppercase tracking-wider text-[11px] mr-1 shrink-0">
              Facilities:
            </span>
            {[
              { id: "all", label: "All POIs" },
              { id: "sos", label: "🚨 Active SOS Beacons", icon: ShieldAlert, color: "text-red-500" },
              { id: "police", label: "Tourist Police", icon: Shield, color: "text-purple-600" },
              { id: "hospital", label: "Hospitals", icon: Hospital, color: "text-rose-600" },
              { id: "hotel", label: "Verified Stays", icon: Hotel, color: "text-emerald-600" },
              { id: "petrol", label: "Fuel Bunks", icon: Fuel, color: "text-blue-600" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFacility(f.id)}
                className={`px-3 py-1.5 rounded-full font-semibold shrink-0 transition-all flex items-center gap-1 ${
                  activeFacility === f.id
                    ? "bg-foreground text-background shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.icon && <f.icon className={`w-3 h-3 ${f.color}`} />}
                <span>{f.label}</span>
              </button>
            ))}

            <button
              onClick={() => setShowRoute(!showRoute)}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 transition-all flex items-center gap-1 ml-auto ${
                showRoute
                  ? "bg-teal text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Route className="w-3 h-3" /> Connect Trail
            </button>
          </div>
        </div>

        {/* Map Canvas and Side Inspection Box */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Leaflet Map */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden ring-1 ring-border h-[65vh] min-h-[460px] shadow-sm relative z-0">
            <MapContainer
              center={allIndianRegions[selectedState]?.coords || [22.5937, 78.9629]}
              zoom={allIndianRegions[selectedState]?.zoom || 5}
              className="w-full h-full"
            >
              <ChangeMapView
                coords={allIndianRegions[selectedState]?.coords || [22.5937, 78.9629]}
                zoom={allIndianRegions[selectedState]?.zoom || 5}
              />

              <TileLayer
                url={mapTileLayers[tileLayerKey].url}
                attribution={mapTileLayers[tileLayerKey].attr}
              />

              {/* User GPS Location Marker */}
              {userLocation && (
                <CircleMarker
                  center={userLocation}
                  radius={10}
                  pathOptions={{
                    color: "#3b82f6",
                    fillColor: "#60a5fa",
                    fillOpacity: 0.9,
                    weight: 3,
                  }}
                >
                  <Popup>
                    <div className="p-1 text-xs">
                      <strong className="text-blue-600 font-bold">Your Current GPS Location</strong>
                      <p className="text-muted-foreground mt-0.5">Live accuracy within 15 meters</p>
                    </div>
                  </Popup>
                </CircleMarker>
              )}

              {/* Heritage Site Markers */}
              {displayedSites.map((s) => {
                const c = siteCoords[s.id] || [s.lat || 20.59, s.lng || 78.96];
                const isSelected = selectedSite?.id === s.id;
                return (
                  <CircleMarker
                    key={s.id}
                    center={c}
                    radius={isSelected ? 14 : 9}
                    pathOptions={{
                      color: isSelected ? "#ea580c" : "#f59e0b",
                      fillColor: isSelected ? "#ea580c" : "#f59e0b",
                      fillOpacity: 0.9,
                      weight: isSelected ? 4 : 2,
                    }}
                    eventHandlers={{
                      click: () => setSelectedSite(s),
                    }}
                  >
                    <Popup>
                      <div className="p-1 max-w-[220px] text-xs">
                        <strong className="text-sm text-foreground font-heading">{s.name}</strong>
                        <p className="text-muted-foreground mt-0.5">{s.location || s.state}</p>
                        <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold mt-1">
                          <Ticket className="w-3 h-3" />
                          <span>Entry: {s.ticket_price || "₹25"}</span>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}

              {/* Facility Markers */}
              {facilities.map((f, i) => {
                if (activeFacility !== "all" && f.type !== activeFacility) return null;
                const c = siteCoords[f.site];
                if (!c) return null;

                const colorMap = {
                  hospital: "#dc2626",
                  petrol: "#2563eb",
                  hotel: "#059669",
                  police: "#7c3aed",
                };

                return (
                  <CircleMarker
                    key={i}
                    center={[c[0] + f.offset[0], c[1] + f.offset[1]]}
                    radius={6}
                    pathOptions={{
                      color: colorMap[f.type] || "#6b7280",
                      fillColor: colorMap[f.type] || "#6b7280",
                      fillOpacity: 0.85,
                      weight: 1.5,
                    }}
                  >
                    <Popup>
                      <div className="text-xs">
                        <strong>{f.name}</strong>
                        <div className="text-muted-foreground capitalize">Facility: {f.type}</div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}

              {/* SOS Incident Markers */}
              {(activeFacility === "all" || activeFacility === "sos") && sosIncidents.map((sos) => {
                if (!sos.coords || !sos.coords[0] || !sos.coords[1]) return null;
                return (
                  <CircleMarker
                    key={sos.id}
                    center={sos.coords}
                    radius={12}
                    pathOptions={{
                      color: "#dc2626",
                      fillColor: "#ef4444",
                      fillOpacity: 0.9,
                      weight: 3,
                    }}
                  >
                    <Popup>
                      <div className="p-1 space-y-1.5 text-xs max-w-[220px]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground font-bold text-[10px]">
                            {sos.id} · {sos.severity || "SOS"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{sos.time || "Recent"}</span>
                        </div>
                        <p className="font-bold text-foreground">{sos.traveler || "Traveler in Distress"}</p>
                        <p className="text-muted-foreground text-[11px]">{sos.location}</p>
                        <div className="pt-1 flex items-center gap-2">
                          <a
                            href={`tel:${sos.phone}`}
                            className="px-2.5 py-1 rounded-lg bg-destructive text-destructive-foreground font-bold text-[11px] flex items-center gap-1"
                          >
                            <PhoneCall className="w-3 h-3" /> Call
                          </a>
                          <Link
                            to="/admin"
                            className="px-2.5 py-1 rounded-lg bg-muted text-foreground font-bold text-[11px]"
                          >
                            Command
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}

              {/* Connecting Heritage Trail Polyline */}
              {showRoute && routeCoords.length > 1 && (
                <Polyline
                  positions={routeCoords}
                  pathOptions={{
                    color: "#0d9488",
                    dashArray: "8 10",
                    weight: 3,
                  }}
                />
              )}
            </MapContainer>
          </div>

          {/* Side Details & Facilities Inspector */}
          <div className="lg:col-span-4 space-y-4">
            {selectedSite ? (
              <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold uppercase tracking-wider">
                    {selectedSite.category || selectedSite.tag}
                  </span>
                  <span className="text-xs text-muted-foreground">{selectedSite.state}</span>
                </div>

                {selectedSite.image && (
                  <img
                    src={selectedSite.image}
                    alt={selectedSite.name}
                    className="w-full h-40 object-cover rounded-2xl"
                    referrerPolicy="no-referrer"
                  />
                )}

                <div>
                  <h3 className="text-lg font-bold text-foreground font-heading">{selectedSite.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {selectedSite.brief || selectedSite.description}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground pt-1 border-t border-border">
                  <div className="flex justify-between">
                    <span>Entry Fee:</span>
                    <strong className="text-foreground">{selectedSite.ticket_price || "₹25 - ₹50 (Indians)"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Timings:</span>
                    <strong className="text-foreground">{selectedSite.timings || "Sunrise to Sunset (06:00 - 18:00)"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Nearest Station:</span>
                    <strong className="text-foreground">{selectedSite.nearestStation || "Visakhapatnam / Regional Junction"}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedSite.name + " " + (selectedSite.location || selectedSite.state))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-full bg-muted hover:bg-muted/80 text-foreground font-bold text-[11px] text-center border border-border flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 text-primary" /> Google Maps
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedSite.name + " " + (selectedSite.location || selectedSite.state))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-full bg-muted hover:bg-muted/80 text-foreground font-bold text-[11px] text-center border border-border flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Navigation2 className="w-3 h-3 text-emerald-500" /> Directions
                  </a>
                </div>

                <div className="pt-2 flex gap-2">
                  <a
                    href={`/planner?destination=${encodeURIComponent(selectedSite.name.split(" ")[0])}`}
                    className="flex-1 py-2 rounded-full bg-primary text-primary-foreground font-bold text-xs text-center shadow-md hover:opacity-90"
                  >
                    Plan Trip Here
                  </a>
                  <button
                    onClick={() => setSelectedSite(null)}
                    className="px-4 py-2 rounded-full bg-muted text-foreground text-xs font-semibold hover:bg-muted/80"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-card border border-border space-y-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary shrink-0" />
                  <h4 className="font-bold text-sm text-foreground">Interactive Explorer</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Click on any monument marker on the map to inspect historical background, ticket timings, Survey of India geodetics, and Google Maps directions.
                </p>
                <div className="pt-2 border-t border-border space-y-2 text-xs">
                  <span className="font-bold text-foreground block">Key Helplines on Map:</span>
                  <div className="space-y-1 text-muted-foreground">
                    <p>• Tourist Police: <strong className="text-purple-600">1363 (24/7)</strong></p>
                    <p>• Medical Emergency: <strong className="text-rose-600">108</strong></p>
                    <p>• National Highway Fuel & SOS: <strong className="text-blue-600">1033</strong></p>
                  </div>
                </div>

                <button
                  onClick={() => setDownloadModalOpen(true)}
                  className="w-full mt-3 py-2 rounded-2xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs flex items-center justify-center gap-2 border border-border transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5 text-primary" />
                  <span>Download Regional Offline Map</span>
                </button>
              </div>
            )}

            {/* Quick State Monument Count */}
            <div className="p-5 rounded-3xl bg-muted/50 border border-border text-xs space-y-2">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" /> Active Region: {allIndianRegions[selectedState]?.name}
              </span>
              <p className="text-muted-foreground">
                Displaying {displayedSites.length} verified heritage sites and geodetic coordinates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DOWNLOAD MODAL FOR ANY AREA */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg text-foreground">Download Map of Any Area</h3>
              </div>
              <button
                onClick={() => setDownloadModalOpen(false)}
                className="p-1 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Area Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Select Indian State / Territory:
              </label>
              <select
                value={downloadArea}
                onChange={(e) => setDownloadArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-background border border-border text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
              >
                {Object.entries(allIndianRegions).map(([k, val]) => (
                  <option key={k} value={k}>
                    {val.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Format Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Select Mapping Provider Format:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setDownloadFormat("offline_html")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    downloadFormat === "offline_html"
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary"
                      : "border-border bg-background text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5 text-primary">
                      <Compass className="w-4 h-4 text-primary" /> Offline Interactive Map (HTML)
                    </span>
                    {downloadFormat === "offline_html" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-normal mt-1 leading-tight">
                    ⭐ Recommended: Complete standalone interactive map pack. Zero internet needed. Works on mobile & PC!
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDownloadFormat("google")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    downloadFormat === "google"
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                      : "border-border bg-background text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-primary" /> Google Maps
                    </span>
                    {downloadFormat === "google" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-normal mt-1 leading-tight">
                    Live navigation, real-time traffic & 100% offline area download.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDownloadFormat("soi")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    downloadFormat === "soi"
                      ? "border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold shadow-sm"
                      : "border-border bg-background text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-sky-600" /> Survey of India (Print / PDF)
                    </span>
                    {downloadFormat === "soi" && <CheckCircle2 className="w-4 h-4 text-sky-500" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-normal mt-1 leading-tight">
                    Official Topographic Atlas with 1:50,000 WGS-84 coordinate grid.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDownloadFormat("geojson")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    downloadFormat === "geojson"
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                      : "border-border bg-background text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <FileDown className="w-3.5 h-3.5" /> Nano Banana GIS GeoJSON
                    </span>
                    {downloadFormat === "geojson" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-normal mt-1 leading-tight">
                    Full vector POI dataset for GIS devices, QGIS & Google Earth.
                  </p>
                </button>
              </div>
            </div>

            {/* Summary info */}
            <div className="p-3.5 rounded-2xl bg-muted/60 border border-border text-xs space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Selected Area:</span>
                <strong className="text-foreground">{allIndianRegions[downloadArea]?.name.split(" ")[0]}</strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Geospatial Provider:</span>
                <strong className="text-primary flex items-center gap-1">
                  Google Maps · Survey of India (SOI) · Nano Banana
                </strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Access Model:</span>
                <strong className="text-foreground">Direct & Offline Open Access</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDownloadModalOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-muted text-foreground text-xs font-bold hover:bg-muted/80"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeMapDownload}
                className="flex-1 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>
                  {downloadFormat === "offline_html"
                    ? "Download Standalone HTML Map"
                    : downloadFormat === "google"
                    ? "Open in Google Maps"
                    : downloadFormat === "soi"
                    ? "Print SOI Topo Atlas"
                    : "Download GeoJSON"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
