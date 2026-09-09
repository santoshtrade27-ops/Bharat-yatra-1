import { jsPDF } from "jspdf";

/**
 * Universal, clean, robust PDF document generator for Bharat Yatra.
 * Handles page splitting, margins, high-contrast readable typography,
 * and elegant Indian Heritage headers.
 */

function setupDoc() {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });
  return doc;
}

function addHeader(doc, title, subtitle) {
  // Brand Header Bar
  doc.setFillColor(180, 83, 9); // Amber 700
  doc.rect(0, 0, 210, 24, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("BHARAT YATRA", 14, 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Incredible India · Official Living Heritage & Cultural Travel Portal", 14, 18);

  // Document Title Banner
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(title, 14, 34);

  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(subtitle, 14, 40);
  }

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 44, 196, 44);

  return 52; // initial Y position
}

function addFooter(doc, pageNum, totalPages) {
  const pageHeight = 297;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, pageHeight - 14, 196, pageHeight - 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Ministry of Tourism & Culture Guidelines · 24/7 National Tourist Helpline: 1363 · Emergency Police: 112",
    14,
    pageHeight - 9
  );
  doc.text(`Page ${pageNum}`, 196, pageHeight - 9, { align: "right" });
}

function checkPageBreak(doc, currentY, requiredSpace = 25) {
  if (currentY + requiredSpace > 275) {
    doc.addPage();
    return 24;
  }
  return currentY;
}

/**
 * 1. Trip & Hotel Reservation Voucher PDF
 */
export function generateTripVoucherPDF(booking) {
  const doc = setupDoc();
  let y = addHeader(
    doc,
    `OFFICIAL TRAVEL VOUCHER — ${booking.destination?.toUpperCase() || "HERITAGE TRIP"}`,
    `Confirmation ID: ${booking.id || "BY-" + Date.now()} · Issue Date: ${new Date().toLocaleDateString("en-IN")}`
  );

  const printSectionTitle = (title) => {
    y = checkPageBreak(doc, y, 16);
    doc.setFillColor(248, 250, 252);
    doc.rect(14, y - 4, 182, 9, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(180, 83, 9);
    doc.text(title, 17, y + 2);
    y += 9;
    doc.setTextColor(51, 65, 85);
    doc.setFont("helvetica", "normal");
  };

  const printRow = (label, val) => {
    y = checkPageBreak(doc, y, 8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(label + ":", 17, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    const split = doc.splitTextToSize(String(val || "N/A"), 120);
    doc.text(split, 65, y);
    y += Math.max(6, split.length * 5);
  };

  // Section: Booking Summary
  printSectionTitle("1. JOURNEY & RESERVATION OVERVIEW");
  printRow("Primary Destination", booking.destination);
  printRow("Departure Point", booking.from_city || "Selected Gateway Hub / User City");
  printRow("Trip Duration", `${booking.days || 3} Days / ${(booking.days || 3) - 1} Nights`);
  printRow("Travel Date / Month", booking.travel_date || "Confirmed Travel Schedule");
  printRow("Traveler Group", booking.group_type || "Family Travel");
  printRow("Booking Status", "CONFIRMED & VERIFIED");
  printRow("Payment Status", `${booking.payment_method || "Paid via Verified Gateway"} · Total ₹${(booking.total_cost || 0).toLocaleString("en-IN")}`);
  if (booking.conditions) {
    printRow("Special Conditions", booking.conditions);
  }

  // Section: Transport Details
  printSectionTitle("2. CONFIRMED TRANSPORTATION FACILITY");
  printRow("Mode of Transport", booking.transport || "Vande Bharat Express / Train");
  if (booking.transport_code || booking.transport_facility) {
    printRow("Facility / Service No.", `${booking.transport_facility || ""} (${booking.transport_code || ""})`);
  }
  if (booking.transport_timing) {
    printRow("Boarding Timing", booking.transport_timing);
  }
  printRow("Reporting Guideline", "Please arrive at railway station/airport 45 minutes prior to scheduled departure with Gov ID.");

  // Section: Hotel Accommodation
  printSectionTitle("3. HOTEL ACCOMMODATION & CHECK-IN");
  const hotel = booking.hotel || {};
  printRow("Hotel Property", hotel.name || "Government-Recognized Heritage Property");
  printRow("Location & City", `${hotel.location || ""}, ${hotel.city || booking.destination}`);
  printRow("Room Category", hotel.category || "Standard AC Heritage Room");
  printRow("Complimentary Inclusions", hotel.amenities || "Daily breakfast, WiFi, hot water, heritage tour orientation");
  printRow("Front Desk Support", hotel.contact || "+91 1800-200-2026 (Toll-Free)");

  // Section: Day-by-Day Itinerary
  if (Array.isArray(booking.itinerary) && booking.itinerary.length > 0) {
    printSectionTitle("4. DAY-BY-DAY CULTURAL ITINERARY");
    booking.itinerary.forEach((item, idx) => {
      y = checkPageBreak(doc, y, 18);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(180, 83, 9);
      doc.text(`Day ${item.day || idx + 1}: ${item.title || "Sightseeing"}`, 17, y);
      y += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const descLines = doc.splitTextToSize(item.desc || "", 175);
      doc.text(descLines, 17, y);
      y += descLines.length * 4.5 + 4;
    });
  }

  // Section: Important Travel Tips & Helpline
  printSectionTitle("5. OFFICIAL VISITOR SAFETY ADVISORY");
  y = checkPageBreak(doc, y, 20);
  const notices = [
    "• Carry original government-issued photo identity proof (Aadhaar / Voter ID / Passport) for monument entry.",
    "• Strictly purchase monument entry tickets through authorized counters or online ASI portals.",
    "• Beware of unauthorized touts offering expedited darshan queues or unverified gemstone souvenirs.",
    "• 24x7 Multi-lingual Tourist Helpline: Dial 1363 from any Indian mobile number.",
  ];
  notices.forEach((n) => {
    y = checkPageBreak(doc, y, 6);
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(n, 17, y);
    y += 5;
  });

  // Footer for all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }

  doc.save(`BharatYatra_Voucher_${(booking.destination || "Trip").replace(/\s+/g, "_")}_${booking.id || "Confirmed"}.pdf`);
}

/**
 * 2. Shopping Tax Invoice & Order Bill PDF
 */
export function generateShopInvoicePDF(order) {
  const doc = setupDoc();
  let y = addHeader(
    doc,
    `TAX INVOICE / CRAFT PURCHASE BILL`,
    `Invoice No: INV-${order.id || Date.now()} · Date: ${new Date().toLocaleDateString("en-IN")}`
  );

  const printSectionTitle = (title) => {
    y = checkPageBreak(doc, y, 14);
    doc.setFillColor(248, 250, 252);
    doc.rect(14, y - 4, 182, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(180, 83, 9);
    doc.text(title, 17, y + 2);
    y += 8;
  };

  printSectionTitle("CUSTOMER & DISPATCH DETAILS");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Customer Name: ${order.customerName || order.name || "Valued Patron"}`, 17, y);
  y += 5;
  doc.text(`Contact Number: ${order.phone || "+91 98490 XXXXX"}`, 17, y);
  y += 5;
  const addrLines = doc.splitTextToSize(`Delivery Address: ${order.address || "Standard Domestic Delivery"}`, 175);
  doc.text(addrLines, 17, y);
  y += addrLines.length * 5 + 4;

  printSectionTitle("ARTISAN ITEMS ORDERED");
  // Table Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y - 3, 182, 7, "F");
  doc.setTextColor(30, 41, 59);
  doc.text("Item & Craft Description", 17, y + 2);
  doc.text("Origin / Cluster", 100, y + 2);
  doc.text("Qty", 145, y + 2);
  doc.text("Amount (Rs)", 170, y + 2);
  y += 8;

  doc.setFont("helvetica", "normal");
  const items = Array.isArray(order.items) ? order.items : [];
  items.forEach((item) => {
    y = checkPageBreak(doc, y, 9);
    doc.text(String(item.name || "Artisan Craft").slice(0, 38), 17, y);
    doc.text(String(item.origin || "India GI Hub").slice(0, 22), 100, y);
    doc.text(String(item.qty || item.quantity || 1), 147, y);
    const lineTotal = (item.price || 0) * (item.qty || item.quantity || 1);
    doc.text(`Rs. ${lineTotal.toLocaleString("en-IN")}`, 170, y);
    y += 6;
  });

  // Totals
  y = checkPageBreak(doc, y, 22);
  doc.setDrawColor(226, 232, 240);
  doc.line(14, y, 196, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.text("Subtotal:", 135, y);
  doc.text(`Rs. ${(order.total || 0).toLocaleString("en-IN")}`, 170, y);
  y += 5;
  doc.text("Shipping & GST (GI Support):", 115, y);
  doc.text("FREE (Included)", 170, y);
  y += 6;

  doc.setFontSize(11);
  doc.setTextColor(180, 83, 9);
  doc.text("TOTAL AMOUNT PAID:", 105, y);
  doc.text(`Rs. ${(order.total || 0).toLocaleString("en-IN")}`, 170, y);
  y += 12;

  printSectionTitle("DISPATCH & RETURN POLICY");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text("• Dispatched via India Post Speed Post or Bluedart Heritage Express with tamper-proof packaging.", 17, y);
  y += 5;
  doc.text("• Every handicraft contains a GI (Geographical Indication) QR certificate directly supporting rural artisans.", 17, y);
  y += 5;
  doc.text("• 7-day hassle-free damage replacement guarantee through Bharat Yatra Craft Grievance Cell.", 17, y);

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }

  doc.save(`BharatYatra_Invoice_${order.id || "Order"}.pdf`);
}

/**
 * 3. Emergency Medical & Safety Registration Card PDF
 */
export function generateEmergencyCardPDF(data) {
  const doc = setupDoc();
  let y = addHeader(
    doc,
    "EMERGENCY TOURIST MEDICAL & SOS PROFILE",
    `Reg ID: SOS-${Date.now()} · Priority Responder Protocol`
  );

  const printSectionTitle = (title) => {
    y = checkPageBreak(doc, y, 14);
    doc.setFillColor(254, 242, 242); // Red tint
    doc.rect(14, y - 4, 182, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(220, 38, 38);
    doc.text(title, 17, y + 2);
    y += 8;
  };

  const printField = (lbl, val) => {
    y = checkPageBreak(doc, y, 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(lbl + ":", 17, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(String(val || "Not specified"), 75, y);
    y += 6;
  };

  printSectionTitle("1. TRAVELER MEDICAL PROFILE");
  printField("Full Name", data.name);
  printField("Age", data.age ? `${data.age} Years` : "N/A");
  printField("Blood Group", data.bloodGroup || "O+");
  printField("Pre-Existing Conditions / Allergies", data.diseases || "None reported");
  printField("Current Location / Hotel Base", data.currentLocation || "En route in cultural circuit");

  printSectionTitle("2. EMERGENCY NEXT-OF-KIN & CAREGIVER");
  printField("Primary Contact Name & Relation", data.relationDetails || "Family Member");
  printField("Emergency Contact Number", data.contactPhone || "+91 94401 XXXXX");

  printSectionTitle("3. NATIONAL EMERGENCY RESPONSE QUICK-DIAL");
  const lines = [
    "• 112 — Unified National Emergency Responder (Police, Ambulance, Fire)",
    "• 1363 — 24/7 Ministry of Tourism Tourist Police & Multilingual Support",
    "• 108 — Free Emergency Medical Services & Advanced Trauma Care",
    "• 1091 — Women Helpline & Safety Patrols",
    "• 1033 — National Highway Toll-Free Accident Emergency & Towing",
  ];
  lines.forEach((l) => {
    y = checkPageBreak(doc, y, 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(l, 17, y);
    y += 5.5;
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }

  doc.save(`BharatYatra_Emergency_Card_${(data.name || "Traveler").replace(/\s+/g, "_")}.pdf`);
}

/**
 * 4. Offline Travel Phrasebook PDF (Hindi, Telugu, English)
 */
export function generatePhrasebookPDF(langName, categories) {
  const doc = setupDoc();
  let y = addHeader(
    doc,
    `OFFLINE TRAVEL PHRASEBOOK — ${langName.toUpperCase()}`,
    `Emergency, Food & Directions Quick Reference Guide (Works 100% Offline)`
  );

  categories.forEach((cat) => {
    y = checkPageBreak(doc, y, 16);
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y - 4, 182, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(180, 83, 9);
    doc.text(cat.title.toUpperCase(), 17, y + 2);
    y += 9;

    cat.items.forEach((item) => {
      y = checkPageBreak(doc, y, 14);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`EN: ${item.en}`, 17, y);
      y += 4.5;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(`${langName}: ${item.local}  (${item.pron})`, 17, y);
      y += 6;
    });
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }

  doc.save(`BharatYatra_Phrasebook_${langName}.pdf`);
}
