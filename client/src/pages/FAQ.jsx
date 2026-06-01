export default function FAQ() {
  return (
    <div className="min-h-screen bg-[#F6F1FF] px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white/90 p-10 shadow-[0_30px_80px_rgba(34,25,82,0.12)] backdrop-blur-sm">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-[#8B5CF6]">
            Frequently Asked Questions
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            Everything you need to know about Frazzl.kid
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Clear answers for students, parents, and families who want a smarter, kinder way to learn math.
          </p>
        </div>

        <section className="space-y-8">
          <div className="space-y-3 rounded-3xl border border-[#EDE9FE] bg-[#FAF8FF] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">What is Frazzl.kid?</h2>
            <p className="text-base leading-7 text-slate-700">
              Frazzl.kid is an interactive math learning platform designed for children in 4th and 5th grade. The lessons, quizzes, and progress tracker help children build confidence while making learning fun and engaging.
            </p>
          </div>

          <div className="space-y-3 rounded-3xl border border-[#EFF6FF] bg-[#F8FAFF] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Who is Frazzl.kid for?</h2>
            <div className="space-y-3 text-base leading-7 text-slate-700">
              <p>Frazzl.kid is designed for:</p>
              <ul className="ml-5 list-disc space-y-2">
                <li>Students in 4th and 5th grade who need math educational assistance.</li>
                <li>Parents who are frustrated with their kid’s homework and lessons, and need support to help their child learn.</li>
                <li>Families who are looking for a structured and easy-to-use math learning platform.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 rounded-3xl border border-[#FEF3C7] bg-[#FFFBEB] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">How does Frazzl.kid work?</h2>
            <p className="text-base leading-7 text-slate-700">
              Students complete lessons in the subjects they need help with or review topics for extra practice. The platform provides helpful hints when needed and quizzes to demonstrate mastery. Parents can monitor progress through Parent Mode.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3 rounded-3xl border border-[#ECFDF5] bg-[#F6FEF9] p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950">What is Kid Mode?</h2>
              <p className="text-base leading-7 text-slate-700">
                Kid Mode allows children to learn independently through interactive lessons, guided practice, quizzes, rewards, and progress tracking.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-[#E9D5FF] bg-[#FBF7FF] p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950">What is Parent Mode?</h2>
              <p className="text-base leading-7 text-slate-700">
                Parent Mode provides frustrated parents with simple lesson explanations, homework support, progress reports, and insights into their child's learning journey.
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-3xl border border-[#FEE2E2] bg-[#FFFBFB] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Is there a free trial?</h2>
            <p className="text-base leading-7 text-slate-700">
              Yes! New users receive a 3-day free trial with full access to the platform.
            </p>
          </div>

          <div className="space-y-3 rounded-3xl border border-[#E0F2FE] bg-[#F8FAFF] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Will I be reminded before my trial ends?</h2>
            <p className="text-base leading-7 text-slate-700">
              Yes. We will send a reminder after your trial expires so you can decide whether to continue with the subscription.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3 rounded-3xl border border-[#EFF6FF] bg-[#F8FAFF] p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950">Can I cancel my subscription anytime?</h2>
              <p className="text-base leading-7 text-slate-700">
                Yes. You can cancel your subscription at any time.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-[#FEF2F2] bg-[#FFF1F2] p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950">What happens if I cancel?</h2>
              <p className="text-base leading-7 text-slate-700">
                Your subscription will remain active until the end of your current billing period. You will not be charged again after cancellation.
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-3xl border border-[#FEE2E2] bg-[#FFFBFB] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Are subscriptions refundable?</h2>
            <p className="text-base leading-7 text-slate-700">
              No. Subscription payments are non-refundable. However, you will continue to have access for the remainder of your current billing cycle.
            </p>
          </div>

          <div className="space-y-3 rounded-3xl border border-[#EFF6EE] bg-[#F7FEF6] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">What subjects does Frazzl.kid offer?</h2>
            <p className="text-base leading-7 text-slate-700">
              Frazzl.kid currently focuses on mathematics for 4th and 5th grade, with lessons aligned to grade-level learning objectives.
            </p>
          </div>

          <div className="space-y-3 rounded-3xl border border-[#E0F2FE] bg-[#F8FAFF] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">What if my child gets stuck on a question?</h2>
            <p className="text-base leading-7 text-slate-700">
              Students can access hints, explanations, and guided support through the lessons to help them understand the problem before trying again.
            </p>
          </div>

          <div className="space-y-3 rounded-3xl border border-[#EEF2FF] bg-[#F8FAFF] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Does Frazzl.kid track my child's progress?</h2>
            <p className="text-base leading-7 text-slate-700">
              Yes. The platform tracks lesson completion, quiz scores, skill mastery, and learning progress so both parents and students can monitor growth.
            </p>
          </div>

          <div className="space-y-3 rounded-3xl border border-[#F0F9FF] bg-[#F8FAFF] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Can multiple children use one account?</h2>
            <p className="text-base leading-7 text-slate-700">
              Each child requires their own account under your subscription plan. This ensures personalized learning, accurate progress tracking, and tailored support for each child’s unique learning journey.
            </p>
          </div>

          <div className="space-y-3 rounded-3xl border border-[#F3F4F6] bg-[#FAFAFB] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Is Kid Mode safe for my child while learning independently?</h2>
            <p className="text-base leading-7 text-slate-700">
              Kid Mode is designed to provide a child-friendly learning experience with age-appropriate educational content and guided learning activities. While we strive to create a positive and supportive environment, we recommend that parents or guardians supervise their child's online activities and regularly review their learning progress through Parent Mode. Parents remain responsible for determining whether the platform is appropriate for their child's individual needs and level of independence.
            </p>
          </div>

          <div className="space-y-3 rounded-3xl border border-[#EEF2FF] bg-[#F8FAFF] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Is Frazzl.kid safe for children?</h2>
            <p className="text-base leading-7 text-slate-700">
              Yes. Frazzl.kid is designed with child-friendly educational content and learning-focused features. While we implement measures to support a safe experience, we recommend parental supervision and the use of Parent Mode to monitor learning activity.
            </p>
          </div>

          <div className="space-y-3 rounded-3xl border border-[#E0F2FE] bg-[#F8FAFF] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">What devices can I use?</h2>
            <p className="text-base leading-7 text-slate-700">
              Frazzl.kid can be accessed from most modern computers and tablets with an internet connection.
            </p>
          </div>

          <div className="space-y-3 rounded-3xl border border-[#F8FAE4] bg-[#FFFBF0] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">How can I contact support?</h2>
            <p className="text-base leading-7 text-slate-700">
              You can reach our support team at <a className="font-semibold text-[#7C3AED]" href="mailto:supportfrazzlkiddos@frazzlkid.com">supportfrazzlkiddos@frazzlkid.com</a> for billing, technical issues, or general questions.
            </p>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950 mb-4">Billing & Payment FAQs</h2>
          <div className="space-y-6 text-base leading-7 text-slate-700">
            <div>
              <h3 className="font-semibold text-slate-900">What happens if my payment is declined?</h3>
              <p>
                If your payment is declined, we will notify you and ask you to update your payment information. Your subscription may be paused or canceled if payment cannot be processed.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">I entered the wrong credit/debit card information. What should I do?</h3>
              <p>
                You can update your payment method in your account settings. If a payment was unsuccessful, simply enter the correct card information and try again.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Can I change my payment method after subscribing?</h3>
              <p>
                Yes. You can update your credit or debit card information at any time through your account settings.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">My card expired. How do I update it?</h3>
              <p>
                Log in to your account and update your payment method with your new card details before your next billing date.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Why was my payment not processed?</h3>
              <p>
                Payments may fail for many reasons, including insufficient funds, expired cards, incorrect payment information, bank restrictions, or security verification issues. Review your account details, billing information, payment method, and any notifications from your bank. If the issue persists, contact support for assistance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Will I lose access if my payment fails?</h3>
              <p>
                If we are unable to process your payment, access to Frazzl.kid subscription features may be limited, suspended, or canceled until a valid payment method is provided and any outstanding balance is resolved. We will attempt to notify you and give you an opportunity to update your information before access is affected.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">I was charged unexpectedly. What should I do?</h3>
              <p>
                Review your account and subscription details to check your active plan and billing date. If you believe there is an issue or an unauthorized charge, contact our support team right away so we can review your account and help resolve it.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Can I receive a refund if I entered the wrong payment information?</h3>
              <p>
                No. Subscription payments are non-refundable.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Is my payment information secure?</h3>
              <p>
                Yes. All payments are securely processed through Stripe, a PCI-compliant payment provider. Frazzl.kid does not store or have access to your full credit or debit card details. Your payment information is handled directly by Stripe using industry-standard encryption and security protocols.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">How can I contact support about a billing issue?</h3>
              <p>
                You can contact our support team at <a className="font-semibold text-[#7C3AED]" href="mailto:supportfrazzlkiddos@frazzlkid.com">supportfrazzlkiddos@frazzlkid.com</a>, and we will assist you within 2-3 business days.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
