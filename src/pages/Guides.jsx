import { useState } from "react";
import { Star, Phone, Languages, Award } from "lucide-react";
import { guides } from "@/lib/heritageData";

const stateList = ["All", ...Array.from(new Set(guides.map((g) => g.state)))];

export default function Guides() {
  const [state, setState] = useState("All");
  const filtered = guides.filter((g) => state === "All" || g.state === state);

  return (
    <div>
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <h1 className="text-2xl sm:text-3xl font-bold">Verified Guides</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Local experts — call to book your heritage tour.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap touch-scroll scrollbar-none mb-6">
          {stateList.map((s) => (
            <button
              key={s}
              onClick={() => setState(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0 ${
                state === s ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((g) => (
            <div key={g.phone} className="rounded-2xl bg-card ring-1 ring-border p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/15 text-primary grid place-items-center font-bold text-lg">
                    {g.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold">{g.name}</h3>
                    <p className="text-xs text-muted-foreground">{g.state}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold">
                  <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                  {g.rating}
                </span>
              </div>

              <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" /> {g.specialty}
                </p>
                <p className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-teal" /> {g.languages}
                </p>
              </div>

              <a
                href={`tel:${g.phone}`}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
              >
                <Phone className="w-4 h-4" /> Call to book
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}