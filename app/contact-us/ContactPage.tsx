"use client";

import { FormEvent, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import toast from "react-hot-toast";
import "./ContactPage.css";
import Link from "next/link";

export default function ContactPage() {
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const captchaRef = useRef<ReCAPTCHA>(null);

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Check reCAPTCHA
  if (!captchaValue) {
    toast.error("Please complete the reCAPTCHA verification.");
    return;
  }

  setIsSubmitting(true);

  try {
    const form = e.currentTarget;

    const formData = new FormData(form);

    // ==========================================
    // STEP 1: SEND TO FORMSPREE
    // ==========================================
    const formspreeResponse = await fetch(
      "https://formspree.io/f/xljepkbz",
      {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      }
    );

    // ==========================================
    // FORMSPREE FAILED
    // ==========================================
    if (!formspreeResponse.ok) {
      let errorMessage =
        "There was a problem submitting your message. Please try again.";

      try {
        const data = await formspreeResponse.json();

        if (data?.errors?.length) {
          errorMessage = data.errors
            .map((error: { message: string }) => error.message)
            .join(", ");
        }
      } catch {
        // Ignore JSON parsing error
      }

      toast.error(errorMessage);
      return;
    }

    // ==========================================
    // STEP 2: SAVE QUERY TO MONGODB
    // ==========================================
    try {
      const backendResponse = await fetch("/api/queries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
        }),
      });

      if (!backendResponse.ok) {
        console.error(
          "Query was sent to Formspree but could not be saved to MongoDB."
        );
      }
    } catch (backendError) {
      // IMPORTANT:
      // Do NOT show an error to the user.
      // Formspree already succeeded.
      console.error(
        "MongoDB query saving failed:",
        backendError
      );
    }

    // ==========================================
    // SUCCESS
    // ==========================================
    toast.success(
      "Thank you! Your message has been submitted successfully."
    );

    // Reset form
    form.reset();

    // Reset reCAPTCHA
    captchaRef.current?.reset();
    setCaptchaValue(null);
  } catch (error) {
    // This is mainly a Formspree/network failure
    console.error("Form submission error:", error);

    toast.error(
      "Unable to submit your message. Please check your internet connection."
    );
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <main className="contactpg-page">
      {/* ================= BANNER ================= */}
      <section className="contactpg-banner">
        <div className="contactpg-banner-inner">
          <h1>Contact Us</h1>

          <div className="contactpg-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Contact Us</span>
          </div>
        </div>
      </section>

      {/* ================= CONTACT CONTENT ================= */}
      <section className="contactpg-section">
        <div className="contactpg-container">

          {/* ================= LEFT - FORM ================= */}
          <div className="contactpg-form-wrapper">
            <div className="contactpg-section-heading">
              <span className="contactpg-small-title">
                GET IN TOUCH
              </span>

              <h2>Send Us a Message</h2>

              <p>
                Have a question or need more information? Get in touch with
                us and our team will get back to you.
              </p>
            </div>

            <form
              className="contactpg-form"
              onSubmit={handleSubmit}
            >
              <div className="contactpg-form-row">

                {/* NAME */}
                <div className="contactpg-form-group">
                  <label htmlFor="name">Name</label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                {/* EMAIL */}
                <div className="contactpg-form-group">
                  <label htmlFor="email">Email</label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>

              </div>

              {/* PHONE */}
              <div className="contactpg-form-group">
                <label htmlFor="phone">Phone</label>

                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* MESSAGE */}
              <div className="contactpg-form-group">
                <label htmlFor="message">Message</label>

                <textarea
                  id="message"
                  name="message"
                  rows={7}
                  placeholder="Write your message..."
                  required
                />
              </div>

              {/* ================= RECAPTCHA ================= */}
              <div className="contactpg-recaptcha">
                <ReCAPTCHA
                  ref={captchaRef}
                  sitekey="6LctHqktAAAAAOTL__b9K3LeKDZ3zVsa_rnewmkC"
                  onChange={(value) => {
                    setCaptchaValue(value);
                  }}
                  onExpired={() => {
                    setCaptchaValue(null);
                  }}
                  onErrored={() => {
                    setCaptchaValue(null);
                  }}
                />
              </div>

              {/* ================= SUBMIT ================= */}
<button
  type="submit"
  className="contactpg-submit-btn"
  disabled={isSubmitting}
>
  <FaPaperPlane />

  <span>
    {isSubmitting ? "Submitting..." : "Submit"}
  </span>
</button>

            </form>
          </div>

          {/* ================= RIGHT - CONTACT INFO ================= */}
          <div className="contactpg-info-wrapper">

            <div className="contactpg-section-heading">
              <span className="contactpg-small-title">
                CONTACT DETAILS
              </span>

              <h2>Get In Touch With Us</h2>

              <p>
                Visit us or get in touch with our team using the details
                below.
              </p>
            </div>

            <div className="contactpg-details">

              {/* PHONE */}
              <a
                href="tel:+917973851375"
                className="contactpg-detail"
              >
                <div className="contactpg-icon">
                  <FaPhoneAlt />
                </div>

                <div>
                  <span>Phone</span>
                  <strong>+91 79738-51375</strong>
                </div>
              </a>

              {/* EMAIL */}
              <a
                href="mailto:singhweldingwork@gmail.com"
                className="contactpg-detail"
              >
                <div className="contactpg-icon">
                  <FaEnvelope />
                </div>

                <div>
                  <span>Email</span>

                  <strong>
                    singhweldingwork@gmail.com
                  </strong>
                </div>
              </a>

              {/* ADDRESS */}
              <div className="contactpg-detail contactpg-address">
                <div className="contactpg-icon">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <span>Address</span>

                  <strong>
                    Hoshiarpur Road, Near Chadha Senetry Store,
                    Phagwara, Punjab 144401
                  </strong>
                </div>
              </div>

            </div>

            {/* ================= GOOGLE MAP ================= */}
            <div className="contactpg-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3411.764750491284!2d75.76651667468336!3d31.227246361567254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391af4e51d33db69%3A0x6ffd98841f6959b3!2sSingh%20Welding%20And%20Skills%20Development%20Centre!5e0!3m2!1sen!2sin!4v1788345701989!5m2!1sen!2sin"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Singh Welding And Skills Development Centre Location"
              />
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
