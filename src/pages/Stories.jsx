import { useState } from "react";
import { Play, BookOpen, ExternalLink } from "lucide-react";
import { Image } from "@/components/ui/image";
import { stories } from "@/lib/heritageData";

const cats = ["All", "Crafts", "Spiritual", "Travel", "Folk", "History"];

export default function Stories() {
  const [cat, setCat] = useState("All");
  const [type, setType] = useState("All");

  const filtered = stories.filter(
    (s) =>
      (cat === "All" || s.category === cat) && (type === "All" || s.type === type)
  );

  return (
    <div>
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold">Stories</h1>
          <p className="text-muted-foreground mt-2">
            Video & book gallery — folk tales, crafts, spiritual journeys.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  cat === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {["All", "video", "book"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                  type === t ? "bg-teal text-teal-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => (
            <a
              key={s.id}
              href={s.link}
              target="_blank"
              rel="noreferrer"
              className="group block rounded-2xl overflow-hidden bg-card ring-1 ring-border hover:shadow-lg transition-shadow"
            >
              <div className="relative h-44 overflow-hidden">
                <Image src={s.image} alt={s.title} className="w-full h-full" fittingType="fill" />
                <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-card/90 text-xs font-semibold flex items-center gap-1">
                  {s.type === "video" ? <Play className="w-3 h-3 text-primary" /> : <BookOpen className="w-3 h-3 text-teal" />}
                  {s.type}
                </span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{s.title}</h3>
                  <p className="text-xs text-muted-foreground">{s.category}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}