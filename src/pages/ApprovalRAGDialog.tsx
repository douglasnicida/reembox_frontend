import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import api from "@/api/axios";
import { toast } from "@/hooks/use-toast";
import { errorHandler } from "@/utils/errorHandler";

// Definição do schema Zod para validação
const approvalRagSchema = z.object({
  remarks: z.string().optional(),
  modelInfo: z
    .string()
    .min(3, "O campo deve conter pelo menos 3 caracteres")
    .max(255, "O campo não pode ter mais que 255 caracteres")
});

// Tipagem derivada do schema Zod
type ApprovalRagFormValues = z.infer<typeof approvalRagSchema>;

interface ApprovalRAGDialogProps {
  customerId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ApprovalRAGDialog({ customerId, open, onOpenChange }: ApprovalRAGDialogProps) {
  const form = useForm<ApprovalRagFormValues>({
    resolver: zodResolver(approvalRagSchema),
    defaultValues: {
      remarks: "",
      modelInfo: "",
    },
  });

  async function onSubmit(rag: ApprovalRagFormValues) {
    try {
      await api.post(`/rag/${customerId}`, rag);

      toast({
        title: 'Sucesso!',
        description: 'Aprovação de RAG feita com sucesso!',
      });

      onOpenChange(false);
    } catch (err: any) {
      errorHandler(err)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Aprovação de RAG</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para aprovar o modelo RAG.
        </DialogDescription>

        <p className="text-sm text-zinc-400 mt-3">Campos marcados com <span className="text-red-500">*</span> são obrigatórios</p>  

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="modelInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Informe o modelo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Input placeholder="Informe as observações" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Aprovar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ApprovalRAGDialog;
