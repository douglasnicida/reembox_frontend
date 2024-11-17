import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import api from "@/api/axios";
import { toast } from "@/hooks/use-toast";
import { useActiveItem } from "@/context/ActiveItemContext";

export type CreationInputFormat = {
  label: string;
  type: string;
  apiReqKey: string;
};

export type DtoFormat = {
  description: string;
  fields: CreationInputFormat[];
  req: string;
};

interface CreationDialogProps {
  dtoList: {
    [key: string]: DtoFormat;
  };
  currentLabel: string;
}

const valueToDtoMap: Record<string, string> = {
  "Início": "create-company",
  "Relatórios": "create-report",
  "Despesas": "create-expense",
  "Colaboradores": "create-user",
  "Cargos": "create-job-title",
  "Centros de Custo": "create-cost-center",
  "Tipos de Despesa": "create-expense-category",
  "Projetos": "create-project",
  "Clientes": "create-customer"
};

const RenderFields = ({ fields, formData, handleChange }: { fields: CreationInputFormat[], formData: Record<string, any>, handleChange: (label: string, value: any) => void }) => {
  
  return fields.map((field, index) => {
    if (field.label === "Ativo") {
      return (
        <div key={index} className="flex items-center gap-14 mt-1">
          <div className="flex items-center gap-2">
            <Checkbox
              id="active"
              checked={formData["active"] === true}
              onClick={() => {
                handleChange("active", true);
              }}
            />
            <Label htmlFor="active" className="text-sm font-medium leading-none">Ativo</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="inactive"
              checked={formData["active"] === false}
              onClick={() => {
                handleChange("active", false);
              }}
            />
            <Label htmlFor="inactive" className="text-sm font-medium leading-none">Inativo</Label>
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="flex flex-col gap-2">
        <Label htmlFor={field.label} className="text-left">{field.label}</Label>
        {field.type === 'textarea' ? (
          <Textarea
            id={field.label}
            className="resize-none"
            rows={4}
            placeholder={`Digite ${field.label.toLowerCase()}`}
            value={formData[field.apiReqKey] || ''}
            onChange={(e) => handleChange(field.apiReqKey, e.target.value)}
          />
        ) : (
          <Input
            id={field.label}
            type={field.type}
            placeholder={`Digite ${field.label.toLowerCase()}`}
            value={formData[field.apiReqKey] || ''}
            onChange={(e) => handleChange(field.apiReqKey, e.target.value)}
          />
        )}
      </div>
    );
  });
};

const CreationDialog = ({ dtoList, currentLabel }: CreationDialogProps) => {
  const { reload, setReload } = useActiveItem();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentDTO, setCurrentDTO] = useState<DtoFormat | undefined>();
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (dtoList[valueToDtoMap[currentLabel]]) {

      const initialFormData = dtoList[valueToDtoMap[currentLabel]].fields.reduce((acc: Record<string, any>, field: CreationInputFormat) => {
        acc[field.apiReqKey] = field.type === 'checkbox' ? true : "";
        return acc;
      }, {});

      setCurrentDTO(dtoList[valueToDtoMap[currentLabel]])
      setFormData(initialFormData);
    }
  }, [currentDTO, dtoList, currentLabel]);

  async function handleCreationFormSubmit(e: any) {
    e.preventDefault();

    const endpoint = currentDTO?.req;

    try {
      await api.post(endpoint || '', formData);

      setIsOpen(false);
      toast({title: "Operação de criação realizada com sucesso"})
      
      setReload(!reload)
    } catch (err: any) {
      console.error("Erro ao criar:", err);
      toast({title: err.response.data.message})
    }
  }

  const handleChange = (label: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [label]: value,
    }));
    console.log(formData)
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="text-sm font-bold">Criar +</Button>
      </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={(e) => handleCreationFormSubmit(e)}>
            <DialogHeader>
              <DialogTitle>{currentLabel}</DialogTitle>
              <DialogDescription>{currentDTO?.description}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              {currentDTO && (
                <RenderFields fields={currentDTO.fields} formData={formData} handleChange={handleChange} />
              )}
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button type="submit">Criar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
  );
};

export default CreationDialog;