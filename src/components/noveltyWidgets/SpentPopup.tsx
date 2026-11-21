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
  const date = String(
    value == null || value === ""
      ? new Date(Date.now()).toISOString().slice(0, 10)
      : value
  ).trim();

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

const formatCurrencyAmount = (value: string) => {
  if (!value) return "";

  const amount = Number(value);
  if (!Number.isFinite(amount)) return "";

  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

//TODO TEMPORALIDAD DE LOS PAGOS, SI ES UN PAGO UNICO O VARIOS PAGOS, SI ES VARIOS PAGOS, CUAL ES EL NUMERO DE PAGOS, SI ES VARIOS PAGOS, CUAL ES LA FECHA DE INICIO Y CUAL ES LA FECHA DE FIN
//TODO VERIFICAR CAMPO LINK NO ESTA GUARDANDO
//TODO BOTON PARA HABILITAR NOTIFICACIONES Y VERIFICAR PAGOS CONSTANTES


const SpentPopup = ({ open, onClose, title, size, noveltyType, userId }: SpentPopupProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [top, setTop] = useState(0);
  const [topInput, setTopInput] = useState("0");
  const [isTopFocused, setIsTopFocused] = useState(false);
  const [amount, setAmount] = useState("");
  const [isAmountFocused, setIsAmountFocused] = useState(false);
  const { toast } = useToast();
  const handleSaveChanges = () => {
    formRef.current?.requestSubmit();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const numericAmount = Number(formData.get("value"));
    if (!Number.isFinite(numericAmount) || numericAmount < 0) {
      toast({
        title: "Invalid value",
        description: "Enter a valid non-negative amount.",
        color: "destructive",
      });
      return;
    }

    const spentData: SpentFormData = {
      name: String(formData.get("name") ?? ""),
      value: numericAmount,
      description: String(formData.get("description") ?? ""),
      startDate: formatUtcDate(formData.get("startdate")),
      endDate: formatUtcDate(formData.get("enddate")),
      paymentMethod: Number(formData.get("paymentmethod") ?? ""),
      paymentInstallments: Number(formData.get("paymentinstallments")) || 0,
      top: Number(top) || 0,
      link: normalizeLink(formData.get("link")) ?? "",
      noveltyType: noveltyType,
      userID: userId
    };
    console.log("Spent form submitted:", spentData);

    try {
      await CreateNovelty(spentData, localStorage.getItem("token") ?? undefined);
      toast({
        title: "Saved",
        description: "Your changes have been saved.",
        color: "green",
      });      
    } catch (error) {
      console.error("Error saving spent data:", error);
      toast({
        title: "Error",
        description: "Failed to save spent data.",
        color: "red",
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
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
              $
            </span>
            <Input
              id="spent-value"
              type="text"
              inputMode="decimal"
              value={isAmountFocused ? amount : formatCurrencyAmount(amount)}
              onFocus={() => setIsAmountFocused(true)}
              onBlur={() => setIsAmountFocused(false)}
              onChange={(event) => {
                const normalized = event.target.value.replace(",", ".");
                if (/^\d*\.?\d{0,2}$/.test(normalized)) setAmount(normalized);
              }}
              className="pl-7"
              required
            />
            <input type="hidden" name="value" value={amount} />
          </div>
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
              onChange={(event) => {
                const value = Number(event.target.value);
                setTop(value);
                setTopInput(String(value));
              }}
              className="h-2 w-full cursor-pointer accent-primary"
            />
            <div className="relative w-36">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                $
              </span>
              <Input
                aria-label="Top manual"
                type="text"
                inputMode="decimal"
                value={isTopFocused ? topInput : formatCurrencyAmount(String(top))}
                onFocus={() => {
                  setTopInput(String(top));
                  setIsTopFocused(true);
                }}
                onBlur={() => {
                  setIsTopFocused(false);
                  if (!topInput) {
                    setTop(0);
                    setTopInput("0");
                  }
                }}
                onChange={(event) => {
                  const normalized = event.target.value.replace(",", ".");
                  if (!/^\d*\.?\d{0,2}$/.test(normalized)) return;

                  setTopInput(normalized);
                  if (normalized) {
                    const value = Number(normalized);
                    setTop(Math.min(10000000, Math.max(0, value)));
                  }
                }}
                className="pl-7"
              />
            </div>
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
