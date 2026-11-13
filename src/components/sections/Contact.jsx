import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowUpRight, Check, Copy, Download, Loader2, Mail, MapPin, Send } from "lucide-react";
import { personal, socials } from "../../data/personal";
import { ease } from "../../animations/variants";
import Heading from "../ui/Heading";
import Magnetic from "../ui/Magnetic";
import SocialIcon from "../ui/SocialIcon";

const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT?.trim() || (import.meta.env.PROD ? "/api/contact" : "");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const initial = { name: "", email: "", subject: "", message: "", company: "" };

function validate(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = "Please tell me your name.";
  else if (v.name.trim().length > 100) errors.name = "That name is a bit long.";
  if (!v.email.trim()) errors.email = "An email address is required.";
  else if (!EMAIL_RE.test(v.email.trim())) errors.email = "This email address doesn't look valid.";
  if (v.subject.length > 140) errors.subject = "Keep the subject under 140 characters.";
  if (v.message.trim().length < 10) errors.message = "Your message should be at least 10 characters.";
  else if (v.message.length > 5000) errors.message = "Your message is too long (5000 characters max).";
  return errors;
}

function Field({ id, label, error, optional, children }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor={id} className="text-[13px] text-bone/80">
          {label}
        </label>
        {optional && <span className="text-[12px] text-dim">Optional</span>}
      </div>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 flex items-center gap-1.5 text-[13px] text-rose-300"
          >
            <AlertCircle size={13} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [copied, setCopied] = useState(false);

  const update = (e) => {
    const next = { ...values, [e.target.name]: e.target.value };
    setValues(next);
    if (touched[e.target.name]) setErrors(validate(next));
  };
  const blur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    setErrors(validate(values));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard not available — the mailto link still works */
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(errs).length) {
      setStatus({ state: "error", message: "Please fix the highlighted fields." });
      const first = Object.keys(errs)[0];
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    // Honeypot: bots fill hidden fields.
    if (values.company) {
      setStatus({ state: "success", message: "Thanks! Your message has been sent." });
      return;
    }

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim() || `Portfolio contact from ${values.name.trim()}`,
      message: values.message.trim(),
      company: values.company,
    };

    if (!ENDPOINT) {
      // No backend configured: hand the message to the visitor's email client.
      const body = `${payload.message}\n\n— ${payload.name} (${payload.email})`;
      window.location.href = `mailto:${personal.email}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(body)}`;
      setStatus({
        state: "success",
        message: "Your email app should now open with the message ready to send. If nothing happened, write to me directly at " + personal.email + ".",
      });
      return;
    }

    setStatus({ state: "loading", message: "" });
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      setValues(initial);
      setTouched({});
      setStatus({ state: "success", message: "Thank you! Your message has been sent — I'll get back to you soon." });
    } catch {
      setStatus({
        state: "error",
        message: `Something went wrong while sending. Please try again or email me at ${personal.email}.`,
      });
    }
  };

  const fieldProps = (name) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    onChange: update,
    onBlur: blur,
    "aria-invalid": Boolean(errors[name] && touched[name]),
    "aria-describedby": errors[name] && touched[name] ? `contact-${name}-error` : undefined,
    className: `field ${errors[name] && touched[name] ? "!border-rose-400/60" : ""}`,
  });

  return (
    <section id="contact" data-block="contact" aria-labelledby="contact-title" className="relative overflow-hidden py-28 sm:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/2 h-[34rem] w-[70rem] -translate-x-1/2 rounded-full bg-accent/[0.12] blur-[150px]" />
      <div className="container-x relative grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Heading id="contact-title" index="05" kicker="Your next project" lines={["Let's work", "together."]} />
          <p className="pretty mt-7 max-w-lg text-[16px] leading-relaxed text-mute">
            <span data-b="type">{personal.contact.text}</span>
          </p>

          <ul data-b="dup" className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-white/[0.08] sm:grid-cols-2">
            <li data-dup className="flex items-center justify-between gap-3 bg-ink-950 px-5 py-4">
              <a href={`mailto:${personal.email}`} className="flex min-w-0 items-center gap-3 text-[14.5px] text-bone hover:text-accent">
                <Mail size={16} className="shrink-0 text-accent" />
                <span className="truncate">{personal.email}</span>
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address"
                className="flex h-8 shrink-0 items-center gap-1.5 rounded-sm border border-line px-2.5 font-mono text-[10.5px] uppercase text-mute transition-colors hover:border-white/30 hover:text-bone"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
              </button>
            </li>
            {socials.map((s) => (
              <li data-dup key={s.label} className="bg-ink-950">
                <a href={s.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between px-5 py-4 text-[14.5px] text-bone">
                  <span className="flex items-center gap-3">
                    <SocialIcon name={s.icon} className="text-accent" /> {s.label}
                    <span className="hidden text-[12.5px] text-dim sm:inline">{s.handle}</span>
                  </span>
                  <ArrowUpRight size={16} className="text-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </a>
              </li>
            ))}
            <li data-dup className="flex items-center gap-3 bg-ink-950 px-5 py-4 text-[14.5px] text-bone">
              <MapPin size={16} className="text-accent" /> {personal.location}
            </li>
          </ul>

          <form
            data-b="box"
            data-tag="form / contact"
            noValidate
            onSubmit={onSubmit}
            className="relative mt-8 rounded-lg border border-line bg-ink-900/70 p-6 sm:p-8"
            aria-describedby="form-status"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="contact-name" label="Your name" error={touched.name && errors.name}>
                <input type="text" autoComplete="name" placeholder="Jane Doe" required {...fieldProps("name")} />
              </Field>
              <Field id="contact-email" label="Email address" error={touched.email && errors.email}>
                <input type="email" autoComplete="email" inputMode="email" placeholder="jane@company.com" required {...fieldProps("email")} />
              </Field>
            </div>
            <div className="mt-5">
              <Field id="contact-subject" label="Subject" optional error={touched.subject && errors.subject}>
                <input type="text" placeholder="Internship opportunity, project, collaboration…" {...fieldProps("subject")} />
              </Field>
            </div>
            <div className="mt-5">
              <Field id="contact-message" label="Message" error={touched.message && errors.message}>
                <textarea
                  rows={5}
                  placeholder="Tell me a little about your project or opportunity…"
                  required
                  {...fieldProps("message")}
                  className={`${fieldProps("message").className} resize-y`}
                />
              </Field>
            </div>

            <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
              <label htmlFor="contact-company">Company</label>
              <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={update} />
            </div>

            <div className="mt-7 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[12.5px] text-dim">
                {ENDPOINT ? "Your message is sent securely." : "Opens your email app with the message pre-filled."}
              </p>
              <Magnetic strength={0.2}>
                <button
                  type="submit"
                  disabled={status.state === "loading"}
                  className="btn-sweep inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-md bg-accent px-7 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-accent-soft disabled:opacity-60 sm:w-auto"
                >
                  {status.state === "loading" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Send message <Send size={15} />
                    </>
                  )}
                </button>
              </Magnetic>
            </div>

            <div id="form-status" role="status" aria-live="polite">
              <AnimatePresence mode="wait">
                {(status.state === "success" || status.state === "error") && (
                  <motion.div
                    key={status.state + status.message}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease }}
                    className={`mt-6 flex items-start gap-3 rounded-md border px-4 py-3.5 text-[14px] ${
                      status.state === "success"
                        ? "border-emerald-400/25 bg-emerald-400/[0.07] text-emerald-200"
                        : "border-rose-400/25 bg-rose-400/[0.07] text-rose-200"
                    }`}
                  >
                    {status.state === "success" ? (
                      <Check size={16} className="mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    )}
                    <span>{status.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>

        {/* Closing card — the whole swarm gathers here at the end of the tour */}
        <aside data-block="contact-card" className="lg:col-span-5">
          <div
            data-b="box"
            data-tag="final.card"
            className="group noise relative flex min-h-[480px] flex-col justify-between overflow-hidden rounded-lg border border-accent/30 bg-gradient-to-br from-ink-850 via-ink-900 to-accent-deep/70 p-8 "
          >
            <img
              src="/images/portrait-cutout.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="pointer-events-none absolute -bottom-6 -right-16 h-[92%] w-auto opacity-40 grayscale transition-all duration-700 [mask-image:linear-gradient(to_left,#000_30%,transparent)] group-hover:-translate-x-3 group-hover:opacity-70 group-hover:grayscale-0"
            />
            <p className="kicker relative text-mute">Ready when you are</p>
            <div className="relative">
              <p className="heading text-[clamp(3rem,5.4vw,5rem)] leading-[0.9]">
                <span className="block text-bone">Make it work.</span>
                <span className="block text-accent">Make it clean.</span>
              </p>
              <p className="mt-5 max-w-xs text-[14.5px] leading-relaxed text-bone/70">{personal.availabilityDetail}</p>
            </div>
            {personal.cvUrl && (
              <a href={personal.cvUrl} download data-cursor="Download" className="group relative inline-flex items-center gap-4 self-start">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_0_0_8px_rgba(229,37,42,0.15)] transition-transform group-hover:scale-110">
                  <Download size={20} />
                </span>
                <span className="kicker text-bone">Download my CV</span>
              </a>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
