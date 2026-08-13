import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

const faqs = [
  { q: "How long does delivery take?", a: "Standard delivery takes 3–7 business days. Express delivery (1–2 business days) is available at checkout for an additional fee." },
  { q: "What is your return policy?", a: "We offer hassle-free returns within 30 days of delivery. Items must be unused, unworn, and in original packaging with tags attached." },
  { q: "How do I track my order?", a: "Once your order ships, you'll receive a tracking number via email. You can also visit our Order Tracking page and enter your order ID." },
  { q: "Do you ship internationally?", a: "Yes! We ship to 25+ countries. International shipping takes 7–14 business days and rates are calculated at checkout." },
  { q: "What payment methods do you accept?", a: "We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery for orders within India. International orders via credit/debit cards." },
  { q: "How do I find my correct size?", a: "Visit our Size Guide page for detailed measurements across all product categories. If in doubt, our support team is happy to assist." },
];

export default function Contact() {
  const { showToast } = useApp();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Message sent! We'll reply within 24 hours.", "success");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="pt-28 min-h-screen">
      {/* Hero */}
      <div className="bg-charcoal text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gold text-xs tracking-[0.3em] uppercase font-semibold mb-3">Get in Touch</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">We're Here to Help</h1>
          <p className="text-white/60 text-base">Our customer support team is available Monday to Saturday, 9am–6pm IST</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Contact methods */}
        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {[
            { icon: "📧", label: "Email Us", value: "support@chandclothing.com", sub: "Response within 24 hours" },
            { icon: "📞", label: "Call Us", value: "+91 98765 43210", sub: "Mon–Sat, 9am–6pm IST" },
            { icon: "💬", label: "Live Chat", value: "Chat with an agent", sub: "Avg. wait time 3 minutes" },
          ].map((c) => (
            <div key={c.label} className="bg-white border border-charcoal-100 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl mb-3">{c.icon}</div>
              <p className="text-xs text-charcoal-400 uppercase tracking-wider mb-1">{c.label}</p>
              <p className="font-semibold text-charcoal">{c.value}</p>
              <p className="text-xs text-charcoal-400 mt-1">{c.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact form */}
          <div>
            <h2 className="font-display text-3xl font-bold text-charcoal mb-2">Send a Message</h2>
            <p className="text-charcoal-400 text-sm mb-8">Fill out the form and we'll get back to you within one business day.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">Your Name</label>
                  <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full border border-charcoal-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-charcoal transition-colors" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full border border-charcoal-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-charcoal transition-colors" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">Subject</label>
                <select value={form.subject} onChange={(e) => update("subject", e.target.value)} className="w-full border border-charcoal-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-charcoal transition-colors bg-white" required>
                  <option value="">Select a topic...</option>
                  {["Order Issue", "Return / Exchange", "Product Query", "Shipping Query", "Payment Issue", "Account Help", "General Inquiry"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  rows={5}
                  placeholder="Describe your query in detail..."
                  className="w-full border border-charcoal-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-charcoal transition-colors resize-none"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-charcoal text-white py-4 font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-charcoal-800 transition-colors">
                Send Message
              </button>
            </form>
          </div>

          {/* Map placeholder + info */}
          <div>
            {/* Map */}
            <div className="rounded-2xl overflow-hidden bg-charcoal-100 mb-8 h-52 flex items-center justify-center border border-charcoal-100">
              <div className="text-center text-charcoal-400">
                <div className="text-4xl mb-2">📍</div>
                <p className="text-sm font-medium">Chandu Clothing HQ</p>
                <p className="text-xs">MG Road, Bengaluru, Karnataka 560001</p>
              </div>
            </div>

            {/* Business hours */}
            <div className="bg-white border border-charcoal-100 rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-charcoal mb-4">Business Hours</h3>
              <div className="space-y-2">
                {[
                  { day: "Monday – Friday", hours: "9:00 AM – 7:00 PM" },
                  { day: "Saturday", hours: "10:00 AM – 6:00 PM" },
                  { day: "Sunday", hours: "Closed" },
                ].map((row) => (
                  <div key={row.day} className="flex justify-between text-sm">
                    <span className="text-charcoal-500">{row.day}</span>
                    <span className={`font-medium ${row.hours === "Closed" ? "text-red-500" : "text-charcoal"}`}>{row.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="bg-charcoal rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-3">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { name: "Instagram", handle: "@chandclothing" },
                  { name: "Facebook", handle: "/chandclothing" },
                  { name: "Twitter", handle: "@chandclothing" },
                ].map((s) => (
                  <a key={s.name} href="#" className="bg-white/10 hover:bg-gold hover:text-charcoal transition-all rounded-xl px-4 py-2 text-center">
                    <p className="text-xs font-bold">{s.name}</p>
                    <p className="text-[10px] text-white/50">{s.handle}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-semibold mb-3">FAQ</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-2xl mx-auto divide-y divide-charcoal-100">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between w-full py-5 text-left gap-4"
                >
                  <span className="text-sm font-semibold text-charcoal">{faq.q}</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={`shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}>
                    <path d="M4 7l6 6 6-6" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                {openFaq === i && (
                  <p className="text-sm text-charcoal-500 leading-relaxed pb-5">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


