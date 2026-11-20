import { useRef, useState, type FormEvent } from "react";
import NoveltyPopup from './NoveltyPopup'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NoveltyType, PaymentMethod, type SpentFormData } from "@/models/spentForm.model";
import { CreateNovelty } from "@/services/novelty.service";
import { useToast } from "../ui/use-toast";

interface SpentPopupProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: "max-w-md" | "max-w-xl" | "max-w-2xl" | "max-w-3xl" | "max-w-4xl" | "max-w-5xl" | "max-w-6xl";
  noveltyType: NoveltyType;
  userId: number;
}

const formatUtcDate = (value: FormDataEntryValue | null) => {
  const date = String(value ?? "");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "";

  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) return "";

  return `${date}T00:00:00.0Z`;
};

const normalizeLink = (value: FormDataEntryValue | null) => {
  const link = String(value ?? "").trim();
  if (!link) return undefined;

  return /^https?:\/\//i.test(link) ? link : `https://${link}`;
};

const SpentPopup = ({ open, onClose, title, size, noveltyType, userId }: SpentPopupProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [top, setTop] = useState(0);
  const { toast } = useToast();
  const handleSaveChanges = () => {
    formRef.current?.requestSubmit();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const spentData: SpentFormData = {
      name: String(formData.get("name") ?? ""),
      value: Number(formData.get("value")),
      description: String(formData.get("description") ?? ""),
      startDate: formatUtcDate(formData.get("startdate")),
      endDate: formatUtcDate(formData.get("enddate")),
      paymentMethod: String(formData.get("paymentmethod") ?? ""),
      paymentInstallments: Number(formData.get("paymentinstallments")),
      top: top || undefined,
      link: normalizeLink(formData.get("link")),
      noveltyType: noveltyType,
      userId: userId
    };
    console.log("Spent form submitted:", spentData);

    try {
      await CreateNovelty(spentData, localStorage.getItem("token") ?? undefined);
      toast({
        title: "Saved",
        description: "Your changes have been saved.",
      });      
    } catch (error) {
      console.error("Error saving spent data:", error);
      toast({
        title: "Error",
        description: "Failed to save spent data.",
      });
    }

    onClose();
  };

  return (
    <NoveltyPopup
      open={open}
      onClose={onClose}
      primaryButtonText="Save Changes"
      secondaryButtonText="Cancel"
      title={title}
      size={size}
      OnPrimary={handleSaveChanges}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <div className="space-y-2">
          <Label htmlFor="spent-name">Name *</Label>
          <Input id="spent-name" name="name" required maxLength={100} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="spent-value">Value *</Label>
          <Input id="spent-value" name="value" type="number" min="0" step="0.01" required />
        </div>
        { noveltyType !== NoveltyType.INCOME ? (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="spent-top">Top</Label>
          <div className="flex items-center gap-3">
            <input
              id="spent-top"
              name="top"
              type="range"
              min="0"
              max="10000000"
              step="10000"
              value={top}
              onChange={(event) => setTop(Number(event.target.value))}
              className="h-2 w-full cursor-pointer accent-primary"
            />
            <Input
              aria-label="Top manual"
              type="number"
              min="0"
              max="10000000"
              step="10000"
              value={top}
              onChange={(event) => {
                const value = Number(event.target.value);
                setTop(Number.isNaN(value) ? 0 : Math.min(10000000, Math.max(0, value)));
              }}
              className="w-32"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span className="font-medium text-foreground">
              {top.toLocaleString()}
            </span>
            <span>10,000,000</span>
          </div>
        </div> ) : null} 

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="spent-description">Description</Label>
          <Textarea id="spent-description" name="description" rows={3} maxLength={500} />
        </div>
        { noveltyType !== NoveltyType.INCOME ? (<>
        <div className="space-y-2">
          <Label htmlFor="spent-startdate">Start date</Label>
          <Input id="spent-startdate" name="startdate" type="date" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="spent-enddate">End date</Label>
          <Input id="spent-enddate" name="enddate" type="date" />
        </div> 
        
        <div className="space-y-2">
          <Label htmlFor="spent-paymentmethod">Payment method</Label>
          <select
            id="spent-paymentmethod"
            name="paymentmethod"
            defaultValue=""
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="" disabled>Select a payment method</option>
            <option value={PaymentMethod.CASH}>Cash</option>
            <option value={PaymentMethod.CREDIT_CARD}>Credit card</option>
            <option value={PaymentMethod.CREDIT_CARD}>Debit card</option>
            <option value={PaymentMethod.BANK_TRANSFER}>Bank transfer</option>
            <option value={PaymentMethod.OTHER}>Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="spent-paymentinstallments">Payment installments</Label>
          <select
            id="spent-paymentinstallments"
            name="paymentinstallments"
            defaultValue="1"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {Array.from({ length: 12 }, (_, index) => index + 1).map((installments) => (
              <option key={installments} value={installments}>
                {installments} {installments === 1 ? "installment" : "installments"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="spent-link">Link</Label>
          <Input id="spent-link" name="link" type="text" inputMode="url" placeholder="www.example.com" />
        </div>
        </>) : null}
      </form>
    </NoveltyPopup>
  );
}

export default SpentPopup
