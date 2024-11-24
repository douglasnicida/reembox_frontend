import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import api from "@/api/axios";
import { toast } from "@/hooks/use-toast";
import { errorHandler } from "@/utils/errorHandler";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";

// Definição do schema Zod para validação
const approvalRagSchema = z.object({
  remarks: z.string().optional(),
  llmModel: z
    .string(),
  embeddingModel: z
    .string()
});

// Tipagem derivada do schema Zod
type ApprovalRagFormValues = z.infer<typeof approvalRagSchema>;

interface ApprovalRAGDialogProps {
  customerId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const llmModels = [
  "llama3.1:8b",
  "llama3.1:70b",
  "gpt-4"
]

const embeddingModels = [
  "ollama::nomic-embed-text",
  "openai::text-embedding-ada-002"
]

function ApprovalRAGDialog({ customerId, open, onOpenChange }: ApprovalRAGDialogProps) {
  const form = useForm<ApprovalRagFormValues>({
    resolver: zodResolver(approvalRagSchema),
    defaultValues: {
      remarks: "",
      llmModel: "",
      embeddingModel: "",
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
              name="llmModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo de Treinamento<span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-700 border-zinc-600 text-zinc-300">
                        <SelectValue placeholder="Selecione um modelo de treinamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-700 border-zinc-600">
                      {llmModels.map((llm, idx) => (
                        <SelectItem 
                          key={idx} 
                          value={llm}
                          className="text-white hover:bg-zinc-600"
                        >
                          {llm}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="embeddingModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo de Embedding<span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-700 border-zinc-600 text-zinc-300">
                        <SelectValue placeholder="Selecione um modelo de embedding" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-700 border-zinc-600">
                      {embeddingModels.map((embedding, idx) => (
                        <SelectItem 
                          key={idx} 
                          value={embedding}
                          className="text-white hover:bg-zinc-600"
                        >
                          {embedding}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    </Select>
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
