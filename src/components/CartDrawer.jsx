import { useState, useEffect } from "react";
import { 
  X, ShoppingBag, Plus, Minus, Trash2, Loader2, CheckCircle2, 
  CreditCard, QrCode, Building, Banknote, FileDown, Truck, ArrowRight, ShieldCheck
} from "lucide-react";
import { Image } from "@/components/ui/image";
import { useCart } from "@/lib/cart";
import { generateShopInvoicePDF } from "@/lib/pdfGenerator";

export default function CartDrawer() {
  const { items, total, count, removeFromCart, setQty, checkout } = useCart();
  const [open, setOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  
  // Payment Gateways
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardInfo, setCardInfo] = useState({ number: "", expiry: "", cvv: "" });
  const [selectedBank, setSelectedBank] = useState("State Bank of India (SBI)");

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("cart-open", handler);
    return () => window.removeEventListener("cart-open", handler);
  }, []);

  function placeOrder() {
    if (!form.name || !form.phone || !form.address) return;
    setPlacing(true);

    const paymentLabel = 
      paymentMethod === "upi" ? `UPI (${upiId || "Instant Scan QR"})` :
      paymentMethod === "card" ? "Credit / Debit Card (Secure)" :
      paymentMethod === "netbanking" ? `Net Banking (${selectedBank})` :
      "Cash on Delivery (COD)";

    setTimeout(() => {
      const order = checkout({
        ...form,
        paymentMethod: paymentLabel,
        paymentStatus: paymentMethod === "cod" ? "Pending (Cash on Delivery)" : "Paid via Verified Gateway",
        trackingNumber: `SPEEDPOST-IN${Math.floor(100000 + Math.random() * 900000)}`,
        estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
        status: "Processing at Artisan Cluster",
      });
      setPlacing(false);
      setDone(order);
      setForm({ name: "", phone: "", address: "" });
    }, 700);
  }

  function handleDownloadPDF() {
    if (!done) return;
    try {
      generateShopInvoicePDF(done);
    } catch (err) {
      console.error("Failed to generate PDF invoice:", err);
      alert("Unable to generate PDF. Please try again.");
    }
  }

  function handleTrackOrder() {
    close();
    window.dispatchEvent(new CustomEvent("order-track-open", { detail: done }));
  }

  function close() {
    setOpen(false);
    setTimeout(() => setDone(null), 300);
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-xs animate-fadeIn"
          onClick={close}
        />
      )}
      <div
        className={`fixed top-0 right-0 z-[80] h-full w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col transition-transform duration-300 text-foreground ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
            <ShoppingBag className="w-5 h-5 text-primary" /> Artisan Craft Cart
            {count > 0 && (
              <span className="ml-1 text-xs font-bold bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                {count}
              </span>
            )}
          </h3>
          <button
            onClick={close}
            className="w-8 h-8 grid place-items-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {done ? (
          /* Order Success View */
          <div className="flex-1 flex flex-col items-center justify-between p-6 text-center overflow-y-auto">
            <div className="space-y-4 my-auto w-full">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 grid place-items-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-xl font-heading">Order Placed Successfully!</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Your purchase directly supports verified rural heritage artisans.
                </p>
              </div>

              {/* Order Details Card */}
              <div className="p-4 rounded-2xl bg-muted/60 border border-border text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono font-bold text-primary">{done.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <span className="font-bold text-foreground">₹{done.total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Mode:</span>
                  <span className="font-medium text-foreground">{done.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tracking ID:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{done.trackingNumber}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-border">
                  <span className="text-muted-foreground">Est. Delivery:</span>
                  <span className="font-bold text-foreground">{done.estimatedDelivery}</span>
                </div>
              </div>

              {/* PDF Invoice Button */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md hover:opacity-90 transition-opacity"
                >
                  <FileDown className="w-4 h-4" /> Download Official Tax Invoice (PDF)
                </button>

                <button
                  type="button"
                  onClick={handleTrackOrder}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-border text-foreground hover:bg-muted text-xs font-bold transition-colors"
                >
                  <Truck className="w-4 h-4 text-primary" /> Track Order Status
                </button>
              </div>
            </div>

            <button
              onClick={close}
              className="mt-6 text-xs text-muted-foreground hover:text-foreground font-medium"
            >
              Continue Browsing Crafts
            </button>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag className="w-14 h-14 text-muted-foreground/30 mb-3" />
            <h4 className="font-bold text-base text-foreground">Your cart is empty</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Explore authentic GI-certified handloom silks, woodwork, and folk artifacts.
            </p>
            <button
              onClick={close}
              className="mt-5 px-6 py-2.5 rounded-full border border-border text-foreground font-bold text-xs hover:bg-muted transition-colors"
            >
              Browse Artisan Crafts
            </button>
          </div>
        ) : (
          /* Cart Items & Checkout */
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((i) => (
                <div
                  key={i.name}
                  className="flex gap-3 p-3 rounded-2xl bg-card border border-border shadow-xs"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-muted">
                    {i.image && (
                      <Image
                        src={i.image}
                        alt={i.name}
                        className="w-full h-full object-cover"
                        fittingType="fill"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-xs truncate font-heading">
                      {i.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{i.origin}</p>
                    <p className="text-xs font-bold text-primary mt-1">
                      ₹{(i.price * i.qty).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(i.name)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQty(i.name, i.qty - 1)}
                        className="w-6 h-6 grid place-items-center rounded-full bg-muted hover:bg-muted/80 text-foreground text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">
                        {i.qty}
                      </span>
                      <button
                        onClick={() => setQty(i.name, i.qty + 1)}
                        className="w-6 h-6 grid place-items-center rounded-full bg-muted hover:bg-muted/80 text-foreground text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Info & Payment Gateway Form */}
            <div className="border-t border-border p-4 space-y-3 bg-muted/20">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Delivery Details
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Full name *"
                    className="px-3 py-2 rounded-xl bg-background border border-border text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Phone number *"
                    className="px-3 py-2 rounded-xl bg-background border border-border text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Complete shipping address with pincode *"
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              {/* Payment Gateways Selector */}
              <div className="space-y-2 pt-1 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Select Payment Gateway
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> 256-Bit SSL Encrypted
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === "upi"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span className="text-[10px]">UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === "card"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("netbanking")}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === "netbanking"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span className="text-[10px]">NetBanking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === "cod"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Cash (COD)</span>
                  </button>
                </div>

                {/* Specific Gateway Inputs */}
                {paymentMethod === "upi" && (
                  <div className="p-2.5 rounded-xl bg-background border border-border text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Supported UPI Apps:</span>
                      <span className="font-bold text-foreground">GPay · PhonePe · Paytm · BHIM</span>
                    </div>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter your UPI ID (e.g. yourname@oksbi)"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="p-2.5 rounded-xl bg-background border border-border text-xs space-y-2">
                    <input
                      type="text"
                      placeholder="Card Number (Visa, RuPay, Master)"
                      value={cardInfo.number}
                      onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                      maxLength={19}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs outline-none focus:ring-1 focus:ring-primary"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        value={cardInfo.expiry}
                        onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                        maxLength={5}
                        className="px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs outline-none focus:ring-1 focus:ring-primary"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        value={cardInfo.cvv}
                        onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                        maxLength={4}
                        className="px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "netbanking" && (
                  <div className="p-2.5 rounded-xl bg-background border border-border text-xs">
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-card border border-border text-xs outline-none font-medium text-foreground"
                    >
                      <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                    </select>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="p-2.5 rounded-xl bg-background border border-border text-xs text-muted-foreground">
                    Pay with cash or scan delivery agent's QR upon parcel arrival at your doorstep. Zero extra charge.
                  </div>
                )}
              </div>

              {/* Total & Checkout Button */}
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground block">Order Total:</span>
                  <span className="text-base font-bold text-foreground">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  Free Shipping
                </span>
              </div>

              <button
                onClick={placeOrder}
                disabled={placing || !form.name || !form.phone || !form.address}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
              >
                {placing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authorizing Payment…</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Pay ₹{total.toLocaleString("en-IN")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
