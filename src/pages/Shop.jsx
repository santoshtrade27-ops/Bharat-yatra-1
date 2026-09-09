import { useState, useEffect } from "react";
import { 
  BookOpen, ExternalLink, ShoppingBag, Truck, Star, MapPin, 
  Check, X, FileDown, ShieldCheck, Search, ArrowRight, 
  Package, Sparkles, Award
} from "lucide-react";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import { products as staticProducts, books } from "@/lib/heritageData";
import { useCart, addToCart, getOrders } from "@/lib/cart";
import { generateShopInvoicePDF } from "@/lib/pdfGenerator";
import ProductCard from "@/components/ProductCard";

const demandFilters = ["All", "High", "Medium", "Premium"];

export default function Shop() {
  const [filter, setFilter] = useState("All");
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("by-artisan-products");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return staticProducts;
  });

  const { count } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [searchTrackingId, setSearchTrackingId] = useState("");
  const [addedToCartToast, setAddedToCartToast] = useState(false);

  useEffect(() => {
    const loadProducts = () => {
      try {
        const saved = localStorage.getItem("by-artisan-products");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
            return;
          }
        }
      } catch {}
      base44.entities.Product.list("-created_date", 100).then((list) => {
        if (list && list.length) setProducts(list);
      }).catch(() => {});
    };

    loadProducts();
    window.addEventListener("by-products-updated", loadProducts);
    return () => window.removeEventListener("by-products-updated", loadProducts);
  }, []);

  useEffect(() => {
    setOrders(getOrders());

    const handleOrderTrack = (e) => {
      setOrders(getOrders());
      setTrackingOpen(true);
      if (e.detail?.id) {
        setSearchTrackingId(e.detail.id);
      }
    };

    window.addEventListener("order-track-open", handleOrderTrack);
    return () => window.removeEventListener("order-track-open", handleOrderTrack);
  }, []);

  const filtered = products.filter((p) => {
    if (filter === "All") return true;
    if (filter === "Premium") return p.price >= 5000;
    if (filter === "High") return p.price >= 1500 && p.price < 5000;
    if (filter === "Medium") return p.price < 1500;
    return true;
  });

  function handleSidebarAddToCart(product) {
    addToCart(product);
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 1500);
  }

  function handleSidebarInstantCheckout(product) {
    addToCart(product);
    setSelectedProduct(null);
    window.dispatchEvent(new CustomEvent("cart-open"));
  }

  function handleDownloadInvoice(order) {
    try {
      generateShopInvoicePDF(order);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Unable to generate PDF invoice. Please check order details.");
    }
  }

  // Filtered orders for tracking
  const displayedOrders = orders.filter((o) => {
    if (!searchTrackingId.trim()) return true;
    const q = searchTrackingId.toLowerCase();
    return (
      (o.id && o.id.toLowerCase().includes(q)) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q)) ||
      (o.customerName && o.customerName.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      {/* Header Banner */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                <Award className="w-4 h-4" />
                <span>Geographical Indication (GI) Certified Hub</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-foreground font-heading">
                Artisan Bazaar & Heritage Crafts
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
                Handloom silks, temple woodwork, terracotta pottery & brass artifacts directly from verified master weavers and state craft guilds.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Order Tracking Button */}
              <button
                type="button"
                onClick={() => {
                  setOrders(getOrders());
                  setTrackingOpen(true);
                }}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs sm:text-sm font-semibold transition-all shadow-xs"
              >
                <Truck className="w-4 h-4 text-primary" /> Track Orders
                {orders.length > 0 && (
                  <span className="w-5 h-5 grid place-items-center text-[10px] font-bold bg-primary text-primary-foreground rounded-full">
                    {orders.length}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("cart-open"))}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-semibold shadow-md hover:opacity-90 transition-opacity"
              >
                <ShoppingBag className="w-4 h-4" /> Cart
                {count > 0 && (
                  <span className="w-5 h-5 grid place-items-center text-[10px] font-bold bg-primary-foreground text-primary rounded-full shadow-xs">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
            {demandFilters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  filter === f
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{filtered.length}</strong> handcrafted artifacts
          </div>
        </div>

        {/* Product Cards Grid with onSelect sidebar handler */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, idx) => (
            <ProductCard 
              key={p.id || p.name || p.title || idx} 
              product={p} 
              onSelect={(item) => setSelectedProduct(item)}
            />
          ))}
        </div>
      </section>

      {/* Product Details Sidebar (Slide-Over Drawer) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[75] flex justify-end">
          <div 
            className="fixed inset-0 bg-background/70 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedProduct(null)}
          />

          <div className="relative z-10 w-full max-w-lg bg-card border-l border-border h-full shadow-2xl flex flex-col overflow-hidden text-foreground animate-slideInRight">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> GI Certified
                </span>
                <span className="text-xs text-muted-foreground">
                  ID: #{selectedProduct.id || "ARTISAN-CRAFT"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 rounded-full hover:bg-muted grid place-items-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sidebar Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Product Image */}
              <div className="relative h-64 rounded-2xl overflow-hidden bg-muted border border-border">
                <Image 
                  src={selectedProduct.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80"}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  fittingType="fill"
                />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-background/90 text-foreground text-xs font-bold backdrop-blur-xs shadow-xs flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> {selectedProduct.origin}
                </span>
              </div>

              {/* Title & Pricing */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
                  {selectedProduct.name}
                </h2>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-2xl font-bold text-foreground">
                    ₹{Number(selectedProduct.price).toLocaleString("en-IN")}
                  </span>
                  {selectedProduct.mrp && Number(selectedProduct.mrp) > Number(selectedProduct.price) && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{Number(selectedProduct.mrp).toLocaleString("en-IN")}
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    Direct Artisan Rate
                  </span>
                </div>
              </div>

              {/* Verified Ratings & Breakdown */}
              <div className="p-4 rounded-2xl bg-muted/50 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xl font-bold text-foreground">
                        {Number(selectedProduct.rating || 4.8).toFixed(1)}
                      </span>
                      <div className="flex items-center text-primary">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-4 h-4 fill-primary" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Based on 148 verified cultural patron reviews
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    100% Authentic
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Handloom & Material Quality</span>
                    <span className="font-bold text-foreground">5.0 / 5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GI Authenticity Verification</span>
                    <span className="font-bold text-foreground">4.9 / 5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transit Care & Packaging</span>
                    <span className="font-bold text-foreground">4.8 / 5.0</span>
                  </div>
                </div>
              </div>

              {/* Craft Story & Artisan Narrative */}
              <div>
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" /> Craft Story & Provenance
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedProduct.description || "Authentic GI-recognized handloom craft directly sourced from verified master artisans."}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                    <span className="text-muted-foreground block text-[10px]">Artisan Cluster:</span>
                    <span className="font-semibold text-foreground">{selectedProduct.origin} Guild</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                    <span className="text-muted-foreground block text-[10px]">Dispatch Guarantee:</span>
                    <span className="font-semibold text-foreground">24-48 Hours Express</span>
                  </div>
                </div>
              </div>

              {/* Customer Reviews */}
              <div>
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                  Patron Reviews
                </h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-background border border-border text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">Ananya Raghavan</span>
                      <span className="text-[10px] text-muted-foreground">2 weeks ago</span>
                    </div>
                    <div className="flex items-center text-primary">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3 h-3 fill-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      "The fabric texture and the genuine seal are unmistakable. Proud to directly support the Varanasi weaver family."
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-background border border-border text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">Rajiv Mehta</span>
                      <span className="text-[10px] text-muted-foreground">1 month ago</span>
                    </div>
                    <div className="flex items-center text-primary">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3 h-3 fill-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      "Beautiful packaging with artisan certificate included. Arrived safely via Speed Post in pristine condition."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Bottom Actions */}
            <div className="p-4 border-t border-border bg-card flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSidebarAddToCart(selectedProduct)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-border bg-muted hover:bg-muted/80 text-foreground font-bold text-xs transition-colors shadow-xs"
              >
                {addedToCartToast ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSidebarInstantCheckout(selectedProduct)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md hover:opacity-90 transition-opacity"
              >
                <span>Instant Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Tracking Modal / Drawer */}
      {trackingOpen && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
            onClick={() => setTrackingOpen(false)}
          />

          <div className="relative z-10 w-full max-w-2xl bg-card rounded-3xl border border-border shadow-2xl max-h-[90vh] flex flex-col overflow-hidden text-foreground">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary grid place-items-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground font-heading">
                    Artisan Parcel Live Tracking
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Track orders dispatched directly from rural artisan clusters
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTrackingOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-muted grid place-items-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-border bg-card">
              <div className="relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTrackingId}
                  onChange={(e) => setSearchTrackingId(e.target.value)}
                  placeholder="Enter Order ID (ORD...) or Tracking Number (SPEEDPOST...)"
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-background border border-border text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Orders List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {displayedOrders.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="font-bold text-sm text-foreground">No orders found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Once you purchase handcrafted artifacts, your live shipment updates and downloadable tax invoices will appear here.
                  </p>
                </div>
              ) : (
                displayedOrders.map((order) => {
                  const trackingNo = order.trackingNumber || `SPEEDPOST-IN${order.id.slice(-6)}`;
                  const estDelivery = order.estimatedDelivery || "3–5 Business Days";

                  return (
                    <div 
                      key={order.id} 
                      className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border space-y-4"
                    >
                      {/* Order Title Row */}
                      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-primary">
                              {order.id}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                              {order.paymentStatus || "Confirmed"}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Placed on {new Date(order.date || Date.now()).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })} · Customer: <strong className="text-foreground">{order.name || order.customerName || "Patron"}</strong>
                          </p>
                        </div>

                        {/* PDF Download Button */}
                        <button
                          type="button"
                          onClick={() => handleDownloadInvoice(order)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity shadow-xs"
                          title="Download Official PDF Invoice"
                        >
                          <FileDown className="w-3.5 h-3.5" /> Download Tax Invoice (PDF)
                        </button>
                      </div>

                      {/* 4-Step Visual Tracking Stepper */}
                      <div className="py-2">
                        <div className="grid grid-cols-4 text-center relative">
                          <div className="absolute top-3 left-[12%] right-[12%] h-0.5 bg-border -z-0" />
                          <div className="absolute top-3 left-[12%] w-[66%] h-0.5 bg-emerald-500 -z-0" />

                          <div className="flex flex-col items-center relative z-10">
                            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white grid place-items-center text-xs font-bold shadow-xs">
                              ✓
                            </div>
                            <span className="text-[10px] font-bold text-foreground mt-1">Confirmed</span>
                            <span className="text-[9px] text-muted-foreground">Order Placed</span>
                          </div>

                          <div className="flex flex-col items-center relative z-10">
                            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white grid place-items-center text-xs font-bold shadow-xs">
                              ✓
                            </div>
                            <span className="text-[10px] font-bold text-foreground mt-1">Hand-Packed</span>
                            <span className="text-[9px] text-muted-foreground">Artisan Guild</span>
                          </div>

                          <div className="flex flex-col items-center relative z-10">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold shadow-xs ring-2 ring-primary/30 animate-pulse">
                              🚚
                            </div>
                            <span className="text-[10px] font-bold text-primary mt-1">Dispatched</span>
                            <span className="text-[9px] text-muted-foreground">India Post</span>
                          </div>

                          <div className="flex flex-col items-center relative z-10">
                            <div className="w-6 h-6 rounded-full bg-muted border border-border text-muted-foreground grid place-items-center text-xs">
                              ○
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground mt-1">Delivery</span>
                            <span className="text-[9px] text-muted-foreground">{estDelivery}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tracking Numbers & Logistics Info */}
                      <div className="p-3 rounded-xl bg-card border border-border text-xs grid sm:grid-cols-2 gap-2">
                        <div>
                          <span className="text-[11px] text-muted-foreground block">Carrier & Tracking AWB:</span>
                          <span className="font-mono font-bold text-foreground flex items-center gap-1 mt-0.5">
                            <Truck className="w-3.5 h-3.5 text-primary" /> {trackingNo}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-muted-foreground block">Expected Doorstep Arrival:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                            {estDelivery} (Standard Courier)
                          </span>
                        </div>
                      </div>

                      {/* Items Summary */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Package Contents ({order.items?.length || 1} items)
                        </span>
                        <div className="space-y-1.5">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-border/50 last:border-0">
                              <span className="text-foreground font-medium truncate max-w-[280px]">
                                {item.name} × {item.qty}
                              </span>
                              <span className="font-bold text-foreground">
                                ₹{(item.price * item.qty).toLocaleString("en-IN")}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 flex justify-between text-xs font-bold">
                          <span>Total Paid:</span>
                          <span className="text-primary text-sm">
                            ₹{(order.total || 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-card flex justify-end">
              <button
                type="button"
                onClick={() => setTrackingOpen(false)}
                className="px-6 py-2 rounded-full bg-muted hover:bg-muted/80 text-foreground text-xs font-bold transition-colors"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Heritage Books & Folk Literature (Free) */}
      <section className="bg-muted/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="mb-8">
            <p className="text-primary text-xs font-semibold uppercase tracking-wider">
              Free Cultural Literature & Folklore
            </p>
            <h2 className="text-xl sm:text-3xl font-bold text-foreground mt-1.5 font-heading">
              Heritage Stories & Regional Folk Tales
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1 max-w-2xl">
              Digitized archives and authentic cultural references for travelers, students & researchers.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {books.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl overflow-hidden bg-card ring-1 ring-border hover:shadow-lg transition-shadow"
              >
                <div className="h-44 overflow-hidden bg-muted">
                  <Image src={b.image} alt={b.title} className="w-full h-full" fittingType="fill" />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm font-heading">{b.title}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <BookOpen className="w-3.5 h-3.5 text-primary" /> {b.category}
                    </p>
                  </div>
                  <a
                    href={b.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    Read free <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
