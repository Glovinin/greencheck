import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CheckoutButtonProps {
  onCheckout: () => Promise<void>;
  isProcessing: boolean;
  label: string;
  processingLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function CheckoutButton({
  onCheckout,
  isProcessing,
  label,
  processingLabel = "Processando...",
  disabled = false,
  className = "",
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = async () => {
    try {
      setIsLoading(true);
      await onCheckout();
    } catch (error: any) {
      console.error("Erro ao iniciar checkout:", error);
      toast.error(`Erro ao iniciar pagamento: ${error.message || "Tente novamente."}`);
    } finally {
      // Resetar apenas se o onCheckout não redirecionar
      setTimeout(() => setIsLoading(false), 2000);
    }
  };
  
  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isProcessing || isLoading}
      className={`w-full ${className}`}
    >
      {(isProcessing || isLoading) ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {processingLabel}
        </>
      ) : (
        label
      )}
    </Button>
  );
} 