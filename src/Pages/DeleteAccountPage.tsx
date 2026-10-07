import { ArrowLeft, Clock3, ShieldAlert, Trash2 } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { useContext } from "react";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "@/context/AuthContext";

const DeleteAccountPage = () => {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleDeleteAccountAction = () => {
    if (user) {
      navigate("/profile");
      return;
    }

    window.dispatchEvent(
      new CustomEvent("open-auth-modal", {
        detail: {
          mode: "login",
          returnTo: "/profile",
        },
      }),
    );
  };

  return (
    <div className="min-h-screen bg-[#05091a] text-[#dce4ff]">
      <Header />

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-[#20284a] bg-gradient-to-br from-[#201b55] via-[#121836] to-[#091329]">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#5d5ce2]/10 blur-[100px]" />

        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#8898c4] transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to AV Art Academy
          </a>

          <div className="mt-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-xs font-medium text-red-300">
              <Trash2 size={14} />
              Account deletion
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Delete your AV Art Academy account
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#96a4c8] sm:text-lg">
              Request deletion of your AV Art Academy account and associated
              personal data.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <main className="mx-auto max-w-5xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* STEPS */}

          <section className="rounded-2xl border border-[#20294a] bg-[#090e23] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7183b7]">
              Process
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              How to delete your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#8493ba]">
              Account deletion requires email verification before it is
              scheduled.
            </p>

            <div className="mt-8 space-y-3">
              <Step
                number="01"
                title="Sign in"
                description="Sign in to your AV Art Academy account."
              />

              <Step
                number="02"
                title="Open your profile"
                description="Go to your Profile page and scroll to the Account section."
              />

              <Step
                number="03"
                title="Choose Delete Account"
                description="Select Delete Account to begin the verification process."
              />

              <Step
                number="04"
                title="Verify your email"
                description="Enter the 6-digit OTP sent to your registered email address."
              />

              <Step
                number="05"
                title="Deletion is scheduled"
                description="Your account enters the 30-day recovery period."
              />
            </div>

            <button
              type="button"
              onClick={handleDeleteAccountAction}
              className="
    mt-8 inline-flex w-full
    items-center justify-center
    rounded-xl
    bg-gradient-to-r
    from-[#4354c7]
    to-[#6675e6]
    px-5 py-3
    text-sm font-semibold
    text-white transition
    hover:opacity-90
  "
            >
              {user
                ? "Go to Profile to Delete Account"
                : "Sign in to Delete Account"}
            </button>
          </section>

          {/* SIDE INFO */}

          <div className="space-y-5">
            <section className="rounded-2xl border border-[#2b3152] bg-[#090e23] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                <Clock3 size={19} className="text-amber-400" />
              </div>

              <h3 className="mt-4 font-semibold text-white">
                30-day recovery period
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#8290b5]">
                You can reactivate your account at any time before the scheduled
                deletion date by signing in again.
              </p>
            </section>

            <section className="rounded-2xl border border-[#2b3152] bg-[#090e23] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#5973e6]/20 bg-[#5973e6]/10">
                <ShieldAlert size={19} className="text-[#8095ff]" />
              </div>

              <h3 className="mt-4 font-semibold text-white">
                What happens to your data?
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#8290b5]">
                Personal account data and learning activity associated with your
                account are removed after permanent deletion.
              </p>

              <p className="mt-3 text-sm leading-6 text-[#8290b5]">
                Certain transaction records may be retained where required for
                accounting, security, or legal obligations.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DeleteAccountPage;

interface StepProps {
  number: string;
  title: string;
  description: string;
}

const Step = ({ number, title, description }: StepProps) => {
  return (
    <div className="flex gap-4 rounded-xl border border-[#1e2746] bg-[#070c1e] p-4 transition hover:border-[#33406d]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#344170] bg-[#11183a] text-xs font-semibold text-[#8196ed]">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#e3e8f9]">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-[#7888b0]">{description}</p>
      </div>
    </div>
  );
};
