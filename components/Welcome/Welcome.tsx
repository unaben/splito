"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeOnboardingAction } from "@/actions/onBoarding";
import { INFO_STEPS } from "./INFO_STEPS";
import MembersStep from "./components/MembersStep";
import type { WelcomeProps } from "./Welcome.types";
import styles from "./Welcome.module.css";

function Welcome({ userName, currentUserId }: WelcomeProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState("example");
  const [customNames, setCustomNames] = useState(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
   
  const totalSteps = INFO_STEPS.length + 1;
  const isMembers = step === INFO_STEPS.length;
  const current = !isMembers ? INFO_STEPS[step] : null;

  function handleFinish() {
    setError(null);
    const formData = new FormData();
    formData.set("addMembers", choice);
    customNames.forEach((n, i) => formData.set(`member${i + 1}`, n));

    startTransition(async () => {
      const result = await completeOnboardingAction(currentUserId, formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.push("/dashboard");
    });
  }

  return (
    <div className={styles.page}>
      <div className={styles.progressWrap}>
        <div
          className={styles.progressBar}
          style={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
        />
      </div>
      <p className={styles.progressLabel}>
        {step + 1} of {totalSteps}
      </p>

      <div className={styles.card}>
        {current ? (
          <div className={styles.infoStep}>
            <div className={styles.stepEmoji}>{current.emoji}</div>
            <h2 className={styles.stepHeadline}>
              {current.headline(userName)}
            </h2>
            <div className={styles.stepBody}>{current.body()}</div>
            {current.diagram && (
              <div className={styles.diagramWrap}>{current.diagram}</div>
            )}
          </div>
        ) : (
          <MembersStep
            choice={choice}
            setChoice={setChoice}
            customNames={customNames}
            setCustomNames={setCustomNames}
            onFinish={handleFinish}
          />
        )}

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.nav}>
          {step > 0 && (
            <button
              className={styles.btnBack}
              onClick={() => setStep((s) => s - 1)}
            >
              ← Back
            </button>
          )}
          {step < totalSteps - 1 ? (
            <button
              className={styles.btnNext}
              onClick={() => setStep((s) => s + 1)}
            >
              {step === 0 ? "Get started →" : "Next →"}
            </button>
          ) : (
            <button
              className={styles.btnFinish}
              disabled={isPending}
              onClick={handleFinish}
            >
              {isPending ? "Setting up…" : "Go to dashboard →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Welcome;