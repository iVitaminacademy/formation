const SUPPORT_EMAIL = 'supportfrazzlkiddos@frazzlkid.com'
const WEBSITE = 'frazzl.kid.com'

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <div className="text-base leading-7 text-slate-700">{children}</div>
    </div>
  )
}

export default function PrivacyTerms() {
  return (
    <div className="min-h-screen bg-[#F6F1FF] px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white/90 p-10 shadow-[0_30px_80px_rgba(34,25,82,0.12)] backdrop-blur-sm">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-[#8B5CF6]">Privacy &amp; Terms</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">Frazzl.kid Terms of Service</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">Last Updated: 5/30/26</p>
        </div>

        <section className="space-y-7 rounded-3xl border border-[#EDE9FE] bg-[#FAF8FF] p-8 shadow-sm">
          <Section title="1. Acceptance of Terms">
            By accessing or using Frazzl.kid, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.
          </Section>
          <Section title="2. Eligibility">
            Frazzl.kid is intended for use by parents, legal guardians, and children under the supervision of a parent or legal guardian. Parents are responsible for managing their child's account and use of the platform.
          </Section>
          <Section title="3. Account Registration">
            <ul className="list-disc space-y-1 pl-5">
              <li>Accurate information must be provided during registration.</li>
              <li>Parents are responsible for maintaining account security.</li>
              <li>Each child must have their own account and subscription unless otherwise stated in a subscription plan.</li>
              <li>Users are responsible for activities that occur under their account.</li>
            </ul>
          </Section>
          <Section title="4. Subscription Plans and Billing">
            <ul className="list-disc space-y-1 pl-5">
              <li>Subscription fees are billed monthly or annually based on the selected plan.</li>
              <li>A 3-day free trial may be offered to eligible users.</li>
              <li>After the trial period, the selected subscription plan will automatically begin unless canceled before the trial ends.</li>
              <li>Subscription fees are non-refundable except where required by law.</li>
            </ul>
          </Section>
          <Section title="5. Cancellation Policy">
            <ul className="list-disc space-y-1 pl-5">
              <li>Subscriptions may be canceled at any time.</li>
              <li>Cancellation takes effect at the end of the current billing period.</li>
              <li>Users will continue to have access through the remainder of the paid subscription period.</li>
              <li>No future charges will occur after cancellation.</li>
            </ul>
          </Section>
          <Section title="6. Payment Processing">
            <ul className="list-disc space-y-1 pl-5">
              <li>Payments are processed through third-party payment providers.</li>
              <li>Frazzl.kid does not store full payment card information.</li>
              <li>Users agree to provide valid and current payment information.</li>
            </ul>
          </Section>
          <Section title="7. Educational Content">
            <ul className="list-disc space-y-1 pl-5">
              <li>Frazzl.kid provides educational materials for informational and learning purposes.</li>
              <li>We do not guarantee specific educational outcomes, grades, test scores, or academic performance.</li>
              <li>Parents remain responsible for educational decisions regarding their children.</li>
            </ul>
          </Section>
          <Section title="8. Acceptable Use">
            <p className="mb-1">Users agree not to:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Violate applicable laws.</li>
              <li>Attempt unauthorized access to the platform.</li>
              <li>Disrupt platform functionality.</li>
              <li>Upload harmful software or malicious code.</li>
              <li>Use the platform for fraudulent purposes.</li>
            </ul>
          </Section>
          <Section title="9. Intellectual Property">
            All content, lessons, graphics, branding, software, and materials on Frazzl.kid are owned by Frazzl.kid or its licensors and are protected by intellectual property laws.
          </Section>
          <Section title="10. Disclaimer of Warranties">
            Frazzl.kid is provided on an "as is" and "as available" basis. We make no warranties regarding uninterrupted access, accuracy, availability, or educational results.
          </Section>
          <Section title="11. Limitation of Liability">
            To the maximum extent permitted by law, Frazzl.kid, its owners, employees, contractors, and affiliates shall not be liable for indirect, incidental, special, consequential, or punitive damages arising from the use of the platform.
          </Section>
          <Section title="12. Account Suspension or Termination">
            We reserve the right to suspend or terminate accounts that violate these Terms of Service or applicable laws.
          </Section>
          <Section title="13. Changes to Services">
            We may modify, suspend, or discontinue features, content, or services at any time without prior notice.
          </Section>
          <Section title="14. Changes to Terms">
            We may update these Terms of Service from time to time. Continued use of the platform constitutes acceptance of any updated terms.
          </Section>
          <Section title="15. Contact Information">
            <p>Questions regarding these Terms may be directed to:</p>
            <p className="mt-1">Email: <a className="font-semibold text-[#8B5CF6]" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
            <p>Website: {WEBSITE}</p>
          </Section>
        </section>

        <div className="my-10 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Frazzl.kid Privacy Policy</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">Last Updated: 5-30-26</p>
        </div>

        <section className="space-y-7 rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] p-8 shadow-sm">
          <Section title="1. Introduction">
            Frazzl.kid values the privacy of our users and is committed to protecting personal information.
          </Section>
          <Section title="2. Information We Collect">
            <p className="font-semibold text-slate-900">Information Provided by Parents</p>
            <ul className="mb-3 list-disc space-y-1 pl-5">
              <li>Name</li>
              <li>Grade</li>
              <li>Email address</li>
              <li>Account information</li>
              <li>Subscription details</li>
            </ul>
            <p className="font-semibold text-slate-900">Child Learning Information</p>
            <ul className="mb-3 list-disc space-y-1 pl-5">
              <li>Grade level</li>
              <li>Lesson progress</li>
              <li>Quiz results</li>
              <li>Learning achievements</li>
              <li>Usage activity</li>
            </ul>
            <p className="font-semibold text-slate-900">Technical Information</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Device information</li>
              <li>Browser type</li>
              <li>IP address</li>
              <li>Usage analytics</li>
            </ul>
          </Section>
          <Section title="3. How We Use Information">
            <p className="mb-1">We may use information to:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Provide educational services</li>
              <li>Track learning progress</li>
              <li>Process subscriptions and payments</li>
              <li>Improve platform performance</li>
              <li>Communicate account-related information</li>
              <li>Respond to customer support requests</li>
            </ul>
          </Section>
          <Section title="4. Children's Privacy">
            Frazzl.kid is designed for children under parental supervision. Parents control account creation and management and may request access to, correction of, or deletion of information associated with their child, subject to applicable legal requirements.
          </Section>
          <Section title="5. Payment Information">
            Payments are processed through secure third-party payment providers. Frazzl.kid does not store full payment card details.
          </Section>
          <Section title="6. Sharing Information">
            <p className="mb-1">We do not sell personal information. We may share information with:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Payment processors</li>
              <li>Hosting providers</li>
              <li>Analytics providers</li>
              <li>Service providers necessary to operate the platform</li>
            </ul>
            <p className="mt-2">Information may also be disclosed when required by law.</p>
          </Section>
          <Section title="7. Data Security">
            We implement reasonable administrative, technical, and organizational measures designed to protect personal information. However, no method of electronic storage or transmission can be guaranteed to be completely secure.
          </Section>
          <Section title="8. Data Retention">
            We retain information only as long as reasonably necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements.
          </Section>
          <Section title="9. Parent Rights">
            <p className="mb-1">Parents may:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Review account information</li>
              <li>Update account information</li>
              <li>Request deletion of account information</li>
              <li>Cancel subscriptions</li>
            </ul>
            <p className="mt-2">Requests may be submitted through our support channels.</p>
          </Section>
          <Section title="10. Cookies and Analytics">
            Frazzl.kid may use cookies and similar technologies to improve functionality, remember preferences, and analyze platform usage.
          </Section>
          <Section title="11. Third-Party Services">
            The platform may rely on third-party services that have their own privacy policies and practices.
          </Section>
          <Section title="12. Changes to This Policy">
            We may update this Privacy Policy periodically. Continued use of the platform after updates constitutes acceptance of the revised policy.
          </Section>
          <Section title="13. Contact Us">
            <p>For privacy-related questions:</p>
            <p className="mt-1">Email: <a className="font-semibold text-[#8B5CF6]" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
            <p>Website: {WEBSITE}</p>
          </Section>
        </section>

      
      </div>
    </div>
  )
}
