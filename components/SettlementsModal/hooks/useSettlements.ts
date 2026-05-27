import { useState, useTransition } from "react";
import { settleUpAction } from "@/actions/settlements";
import type { PaymentType, SettleStep, SimplifiedDebt } from "@/types";
import { SettleUpModalProps } from "../SettlementsModal.types";

const useSettlements = (props: SettleUpModalProps) => {
  const { group, debts, members } = props;

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<SettleStep>("select");
  const [paymentType, setPaymentType] = useState<PaymentType>("card");
  const [selectedDebt, setSelectedDebt] = useState<SimplifiedDebt | null>(
    debts[0] ?? null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function getMember(id: string) {
    return members.find((m) => m.id === id);
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setStep("select");
      setErrorMsg(null);
      setSelectedDebt(debts[0] ?? null);
      setPaymentType("card");
    }, 300);
  }

  async function handlePay() {
    if (!selectedDebt) return;
    setErrorMsg(null);

    const formData = new FormData();
    formData.set("groupId", group.id);
    formData.set("payeeId", selectedDebt.toUserId);
    formData.set("amount", (selectedDebt.amountPence / 100).toFixed(2));
    formData.set("paymentType", paymentType);

    setStep("paying");

    startTransition(async () => {
      const result = await settleUpAction(formData);
      if (result?.error) {
        setErrorMsg(result.error);
        setStep("failed");
      } else {
        setStep("success");
      }
    });
  }

  const payee = selectedDebt ? getMember(selectedDebt.toUserId) : null;
  return {
    payee,
    handleClose,
    handlePay,
    setOpen,
    getMember,
    errorMsg,
    selectedDebt,
    step,
    open,
    setSelectedDebt,
    setPaymentType,
    paymentType,
    setStep,
    isPending
  };
};

export default useSettlements;
