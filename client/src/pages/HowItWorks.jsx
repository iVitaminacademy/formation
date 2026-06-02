export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#F6F1FF] px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white/90 p-10 shadow-[0_30px_80px_rgba(34,25,82,0.12)] backdrop-blur-sm">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-[#8B5CF6]">How it works</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">How Frazzl.kid helps children learn math</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">Choose the subscription and mode that best fits your family's learning style. Below you'll find step-by-step guidance for Parent and Kid modes.</p>
        </div>

        <section className="space-y-8">
          <div className="space-y-3 rounded-3xl border border-[#EDE9FE] bg-[#FAF8FF] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Choosing the Right Subscription</h2>
            <p className="text-base leading-7 text-slate-700">We recommend selecting the subscription that best fits your child's learning needs. Kid Mode is ideal for independent learners who prefer self-guided lessons, while Parent Mode provides guidance, teaching tips, and progress monitoring to help parents support their child's learning.</p>
          </div>

          <div className="space-y-3 rounded-3xl border border-[#ECFDF5] bg-[#F6FEF9] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Parent Mode — Track Progress. Support Success.</h2>
            <p className="text-base leading-7 text-slate-700">Sign Up → Log In → Add Child → Teach Your Child → Track & Monitor Child’s Progress</p>
            <ul className="ml-5 list-disc mt-3 text-base leading-7 text-slate-700">
              <li>Monitor strengths and weaknesses.</li>
              <li>Set goals and learning schedules.</li>
              <li>Access simple teaching guides and step-by-step explanations.</li>
              <li>Celebrate achievements and track progress.</li>
            </ul>
            <p className="mt-3 text-base leading-7 text-slate-700">Each child should have an individual account to ensure accurate tracking and personalized learning.</p>
          </div>

          <div className="space-y-3 rounded-3xl border border-[#E9D5FF] bg-[#FBF7FF] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Kid Mode — Learn Math Through Fun and Practice</h2>
            <p className="text-base leading-7 text-slate-700">Sign Up → Log In → Complete Lessons → Earn Rewards → Level Up on Math!</p>
            <ul className="ml-5 list-disc mt-3 text-base leading-7 text-slate-700">
              <li>Interactive lessons and quizzes.</li>
              <li>Personalized learning paths.</li>
              <li>Badges, rewards, and instant feedback to build confidence.</li>
            </ul>
          </div>

          <div className="space-y-3 rounded-3xl border border-[#FEF3C7] bg-[#FFFBEB] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Quick Steps</h2>
            <p className="text-base leading-7 text-slate-700">Parent Mode: Sign Up → Log In → Add Child → Teach → Track progress.<br/>Kid Mode: Sign Up → Log In → Complete lessons → Earn rewards.</p>
          </div>
        </section>
      </div>
    </div>
  )
}
