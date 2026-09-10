import {
  MapPin, Bus, Car, Bike, UtensilsCrossed, BedDouble,
  Download, CheckCircle2, Navigation, Route as RouteIcon, Award,
} from "lucide-react";
import { generateTripVoucherPDF } from "@/components/lib/pdfGenerator";

function mapsLink(q) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
function dirLink(a, b) {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(a)}&destination=${encodeURIComponent(b)}`;
}

export default function TripPlanDetail({ 
  plan, from, to, days, food, group, transport, localTransit, guide, withGuide, payment, conditions, travelDate 
}) {
  const origin = from || "Your starting city";
  const dest = to;
  const hotel = plan?.hotel;
  const seed = (dest + origin).length;
  const rnd = (n) => Math.floor(Math.abs(Math.sin(seed * (n + 1)) * 9000)) + 1000;

  const reach = (() => {
    if (transport === "Public Transport") {
      return {
        icon: Bus,
        mode: "Bus + Train",
        lines: [
          `Bus ${dest.slice(0, 3).toUpperCase()}-${rnd(1)}: ${origin} Bus Stand → ${dest} Central Bus Stand · 6:30 AM & 12:30 PM`,
          `Train ${rnd(2)}${String.fromCharCode(65 + (seed % 3))}: ${origin} Junction → ${dest} Junction · dep 8:15 AM`,
          `Local auto/cab from ${dest} bus stand to hotel · approx ₹${rnd(3)}`,
        ],
        link: dirLink(`${origin} central bus stand`, `${dest} central bus stand`),
      };
    }
    if (transport === "Vehicle Rentals") {
      return {
        icon: Car,
        mode: "Self-drive rental",
        lines: [
          `Pick up rental car at ${origin} — drive to ${dest} (approx ${rnd(4)} km)`,
          `Follow NH route via Google Maps — toll approx ₹${rnd(5)}`,
          `Parking available at hotel & all heritage sites`,
        ],
        link: dirLink(origin, dest),
      };
    }
    return {
      icon: Bike,
      mode: "Bharat Yatra Transport",
      lines: [
        `Private cab: ${origin} → ${dest} · pickup 7:00 AM`,
        `Return transfer on Day ${days} · ${dest} → ${origin}`,
        `Driver-cum-guide ${withGuide ? "included" : "optional add-on"}`,
      ],
      link: dirLink(origin, dest),
    };
  })();

  const eating = [
    `${food} thali at a popular restaurant near ${dest} main market`,
    `Evening street-food walk: regional snacks & sweets`,
    `Heritage café lunch near the main site`,
  ];

  const itinerary = plan.itinerary.map((d) => ({
    ...d,
    site: `${dest} heritage area · Day ${d.day}`,
    link: mapsLink(`${dest} heritage site day ${d.day}`),
  }));

  function downloadPDF() {
    generateTripVoucherPDF({
      id: "BY-" + Math.floor(100000 + Math.random() * 900000),
      destination: dest,
      from_city: origin,
      days,
      travel_date: travelDate || new Date().toISOString().slice(0, 10),
      group_type: group,
      food_preference: food,
      transport,
      transport_facility: reach.mode,
      local_transit: localTransit || "Dedicated Sightseeing Vehicle",
      selected_guide: guide,
      hotel,
      payment_method: payment,
      total_cost: plan.breakdown?.total || (hotel?.price || 3500) * days,
      itinerary: plan.itinerary,
      trip_summary: plan.summary || `${days}-day cultural visit to ${dest} staying at ${hotel?.name || dest}`,
    });
  }

  return (
    <div className="rounded-2xl bg-card ring-1 ring-border p-5 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-semibold">Booking confirmed · {payment}</span>
        </div>
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" /> Download PDF Voucher
        </button>
      </div>

      {/* Overview */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
        <RouteIcon className="w-5 h-5 text-primary shrink-0" />
        <p className="text-sm text-foreground">
          <span className="font-semibold">{origin}</span> → <span className="font-semibold">{dest}</span>
          <span className="text-muted-foreground"> · {days} days · {group} · {food}</span>
        </p>
      </div>

      {/* How to reach & Local Sightseeing Mode */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Block icon={reach.icon} title="Intercity Travel">
          <p className="text-sm font-semibold text-foreground">{transport || reach.mode}</p>
          <ul className="mt-1.5 space-y-1">
            {reach.lines.map((l, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                {l}
              </li>
            ))}
          </ul>
          <a href={reach.link} target="_blank" rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
            <Navigation className="w-3.5 h-3.5" /> Open route in Google Maps
          </a>
        </Block>

        <Block icon={Car} title="Sightseeing Transit">
          <p className="text-sm font-semibold text-foreground">{localTransit || "Dedicated Sightseeing Cab"}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Active daily transit for temple routes, monuments, artisan clusters & local markets.
          </p>
          <span className="inline-block mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            All Fuel & Driver Allowance Included
          </span>
        </Block>
      </div>

      {/* Heritage Guide Assigned */}
      {withGuide && guide && (
        <Block icon={Award} title="ASI Licensed Heritage Guide Assigned">
          <div className="flex items-center gap-3">
            <img src={guide.avatar} alt={guide.name} className="w-12 h-12 rounded-full object-cover border border-primary/40" />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-foreground">{guide.name}</p>
                <span className="text-[10px] font-mono font-bold bg-muted px-2 py-0.5 rounded text-primary">Badge #{guide.badge}</span>
              </div>
              <p className="text-xs text-muted-foreground">{guide.specialty}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Spoken: {guide.languages?.join(", ")} · {guide.experience}</p>
            </div>
          </div>
        </Block>
      )}

      {/* Stay */}
      {hotel && (
        <Block icon={BedDouble} title="Where to stay">
          <p className="text-sm font-semibold text-foreground">{hotel.name}</p>
          <p className="text-xs text-muted-foreground">{hotel.city || hotel.location} · {hotel.amenities || hotel.facilities} · ₹{hotel.price}/night</p>
          <a href={mapsLink(`${hotel.name} ${hotel.city || hotel.location}`)} target="_blank" rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
            <MapPin className="w-3.5 h-3.5" /> View on Google Maps
          </a>
        </Block>
      )}

      {/* Eat */}
      <Block icon={UtensilsCrossed} title="What to eat">
        <ul className="space-y-1">
          {eating.map((e, i) => (
            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
              <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
              {e}
            </li>
          ))}
        </ul>
      </Block>

      {/* Itinerary */}
      <Block icon={MapPin} title="Day-by-day plan">
        <ol className="space-y-3">
          {itinerary.map((d) => (
            <li key={d.day} className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold shrink-0">
                {d.day}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{d.title}</p>
                <p className="text-xs text-muted-foreground">{d.desc}</p>
                <a href={d.link} target="_blank" rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                  <Navigation className="w-3 h-3" /> Maps
                </a>
              </div>
            </li>
          ))}
        </ol>
      </Block>

      {/* Cost */}
      <div className="pt-4 border-t border-border space-y-1.5 text-sm">
        <Row label="Hotel Accommodation" v={plan.breakdown.hotelCost} />
        <Row label="Intercity Travel" v={plan.breakdown.tCost} />
        {plan.breakdown.localTransitCost > 0 && <Row label="Sightseeing Transit" v={plan.breakdown.localTransitCost} />}
        <Row label="Food & Dining" v={plan.breakdown.foodCost} />
        {plan.breakdown.guideCost > 0 && <Row label="Licensed Heritage Guide" v={plan.breakdown.guideCost} />}
        <div className="flex justify-between pt-2 border-t border-border font-bold text-foreground">
          <span>Total Package</span>
          <span>₹{plan.breakdown.total.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}

function Block({ icon: Icon, title, children }) {
  return (
    <div className="p-4 rounded-xl ring-1 ring-border">
      <h4 className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
        <Icon className="w-4 h-4 text-primary" /> {title}
      </h4>
      {children}
    </div>
  );
}

function Row({ label, v }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span>₹{v.toLocaleString("en-IN")}</span>
    </div>
  );
}