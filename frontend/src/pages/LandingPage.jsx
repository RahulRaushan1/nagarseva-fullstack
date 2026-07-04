import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import Hero from '../components/Hero/Hero'
import Features from '../components/Features/Features'
import styles from './LandingPage.module.css'

const LandingPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleAction = () => {
    navigate("/login");
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  const faqData = [
    {
      question: "How do I raise a complaint?",
      answer: "Simply log in to your Citizen dashboard, click on 'Raise Complaint', fill out the issue details with category and images, and submit."
    },
    {
      question: "Can I track complaint status?",
      answer: "Yes, you can view the live progress, active stage, and comments of all your submitted complaints right from your dashboard in real-time."
    },
    {
      question: "Will I receive notifications?",
      answer: "Absolutely. NagarSeva sends instant status updates to keep you informed of any activity or comments on your complaints."
    },
    {
      question: "How are complaints assigned?",
      answer: "Complaints are automatically routed to the responsible ward and designated nodal department officer based on category and location."
    }
  ];

  return (
    <div>
      <Navbar />
      
      {/* Hero Section */}
      <div id="home">
        <Hero />
      </div>

      {/* Features Section */}
      <Features />

      {/* SECTION 1: How NagarSeva Works */}
      <section id="how-it-works" className={styles.section_container}>
        <div className={styles.section_header}>
          <p className={styles.section_tag}>Workflow</p>
          <h2 className={styles.section_title}>How NagarSeva Works</h2>
          <p className={styles.section_description}>
            Track the complete complaint journey from submission to resolution.
          </p>
        </div>

        <div className={styles.workflow_grid}>
          <div className={styles.workflow_step}>
            <div className={styles.workflow_icon}>
              <i className="ph ph-note-pencil"></i>
            </div>
            <h3>Raise Complaint</h3>
            <p>Submit civic issues with descriptions and supporting images.</p>
          </div>

          <div className={styles.workflow_connector}>
            <i className="ph ph-arrow-right"></i>
          </div>

          <div className={styles.workflow_step}>
            <div className={styles.workflow_icon}>
              <i className="ph ph-map-pin-line"></i>
            </div>
            <h3>Auto Ward Mapping</h3>
            <p>Complaints are routed to the responsible ward.</p>
          </div>

          <div className={styles.workflow_connector}>
            <i className="ph ph-arrow-right"></i>
          </div>

          <div className={styles.workflow_step}>
            <div className={styles.workflow_icon}>
              <i className="ph ph-user-gear"></i>
            </div>
            <h3>Officer Assignment</h3>
            <p>Assigned officers handle reported issues.</p>
          </div>

          <div className={styles.workflow_connector}>
            <i className="ph ph-arrow-right"></i>
          </div>

          <div className={styles.workflow_step}>
            <div className={styles.workflow_icon}>
              <i className="ph ph-eye"></i>
            </div>
            <h3>Live Status Tracking</h3>
            <p>Citizens can monitor complaint progress.</p>
          </div>

          <div className={styles.workflow_connector}>
            <i className="ph ph-arrow-right"></i>
          </div>

          <div className={styles.workflow_step}>
            <div className={styles.workflow_icon}>
              <i className="ph ph-check-circle"></i>
            </div>
            <h3>Resolution</h3>
            <p>Complaint closes after successful completion.</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Role Based Access */}
      <section id="role-access" className={styles.section_container}>
        <div className={styles.section_header}>
          <p className={styles.section_tag}>Permissions</p>
          <h2 className={styles.section_title}>Role Based Access</h2>
          <p className={styles.section_description}>
            Dedicated dashboards and workflows for every user role.
          </p>
        </div>

        <div className={styles.role_access_grid}>
          {/* Card 1: Citizen */}
          <div className={styles.role_card}>
            <div className={styles.role_icon}>
              <i className="ph ph-user"></i>
            </div>
            <h3>Citizen</h3>
            <ul className={styles.role_features_list}>
              <li>
                <i className="ph ph-check-circle"></i>
                <span>Raise complaints</span>
              </li>
              <li>
                <i className="ph ph-check-circle"></i>
                <span>Track complaint status</span>
              </li>
              <li>
                <i className="ph ph-check-circle"></i>
                <span>Receive notifications</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Officer */}
          <div className={styles.role_card}>
            <div className={styles.role_icon}>
              <i className="ph ph-briefcase"></i>
            </div>
            <h3>Officer</h3>
            <ul className={styles.role_features_list}>
              <li>
                <i className="ph ph-check-circle"></i>
                <span>Manage assigned complaints</span>
              </li>
              <li>
                <i className="ph ph-check-circle"></i>
                <span>Update progress</span>
              </li>
              <li>
                <i className="ph ph-check-circle"></i>
                <span>Resolve issues</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Councillor */}
          <div className={styles.role_card}>
            <div className={styles.role_icon}>
              <i className="ph ph-users-three"></i>
            </div>
            <h3>Councillor</h3>
            <ul className={styles.role_features_list}>
              <li>
                <i className="ph ph-check-circle"></i>
                <span>Monitor ward complaints</span>
              </li>
              <li>
                <i className="ph ph-check-circle"></i>
                <span>View ward insights</span>
              </li>
              <li>
                <i className="ph ph-check-circle"></i>
                <span>Track unresolved issues</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 3: FAQ */}
      <section id="faq" className={styles.section_container}>
        <div className={styles.section_header}>
          <p className={styles.section_tag}>FAQ</p>
          <h2 className={styles.section_title}>Frequently Asked Questions</h2>
          <p className={styles.section_description}>
            Find answers to commonly asked questions about using the NagarSeva platform.
          </p>
        </div>

        <div className={styles.faq_container}>
          {faqData.map((faq, idx) => (
            <div
              key={idx}
              className={`${styles.faq_item} ${openFaq === idx ? styles.active : ""}`}
            >
              <div className={styles.faq_header} onClick={() => toggleFaq(idx)}>
                <span>{faq.question}</span>
                <i className={`ph ph-caret-down ${styles.faq_icon}`}></i>
              </div>
              <div className={`${styles.faq_answer_wrapper} ${openFaq === idx ? styles.open : ""}`}>
                <div className={styles.faq_answer}>
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Final CTA */}
      <section id="final-cta" className={styles.section_container}>
        <div className={styles.cta_card}>
          <h2 className={styles.cta_title}>Ready to improve your city?</h2>
          <p className={styles.cta_subtext}>
            Join NagarSeva and help build a cleaner, smarter community.
          </p>
          <div className={styles.cta_buttons}>
            <button className={styles.cta_primary_btn} onClick={handleAction}>
              Raise Complaint
            </button>
            <button className={styles.cta_secondary_btn} onClick={handleAction}>
              Track Complaint
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: Footer */}
      <footer id="contact" className={styles.footer_section}>
        <div className={styles.footer_grid}>
          <div className={styles.footer_brand}>
            <h2>
              <img
                src="https://res.cloudinary.com/dzexb7f3p/image/upload/v1778174553/Gemini_Generated_Image_dk0cs1dk0cs1dk0c_4_copy_ibfkmg.png"
                alt="NagarSeva Logo"
                className={styles.footer_logo}
              />
              <span>NagarSeva</span>
            </h2>
            <p>
              Empowering citizens to report, track, and resolve civic issues collectively for smarter, cleaner municipalities.
            </p>
          </div>

          <div className={styles.footer_col}>
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a onClick={() => scrollToSection("home")}>Home</a>
              </li>
              <li>
                <a onClick={() => scrollToSection("how-it-works")}>Track Complaint</a>
              </li>
              <li>
                <a onClick={() => scrollToSection("role-access")}>About</a>
              </li>
              <li>
                <a onClick={() => scrollToSection("contact")}>Contact</a>
              </li>
            </ul>
          </div>

          <div className={styles.footer_col}>
            <h3>Support</h3>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:nagarseva.support@gmail.com" className={styles.footer_email_link}>
                nagarseva.support@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div className={styles.footer_bottom}>
          <p>© 2026 NagarSeva. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
