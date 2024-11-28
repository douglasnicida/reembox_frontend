import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import api from "@/api/axios";
import { toast } from "@/hooks/use-toast";
import { useActiveItem } from "@/context/ActiveItemContext";

export type UpdateInputFormat = {
  label: string;
  type: string;
  apiReqKey: string;
};

export type DtoFormat = {
  description: string;
  fields: UpdateInputFormat[];
  req: string;
};

interface UpdateDialogProps {
  dtoList: { [key: string]: DtoFormat };
  currentLabel: string;
  editId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const valueToDtoMap: Record<string, string> = {
  "Clientes": "update-customer",
  "Centros de Custo": "update-cost-center",
  "Tipos de Despesa": "update-expense-category",
  "Cargos": "update-job-title",
  "Projetos":"update-project",
};

const RenderFields = ({
                        fields,
                        formData,
                        handleChange,
                      }: {
  fields: UpdateInputFormat[];
  formData: Record<string, any>;
  handleChange: (label: string, value: any) => void;
}) => {
  return fields.map((field, index) => {
    if (field.label === "Ativo") {
      return (
          <div key={index} className="flex items-center gap-14 mt-1">
            <div className="flex items-center gap-2">
              <Checkbox
                  id="active"
                  checked={formData["active"] === true}
                  onClick={() => handleChange("active", true)}
              />
              <Label htmlFor="active" className="text-sm font-medium leading-none">
                Ativo
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                  id="inactive"
                  checked={formData["active"] === false}
                  onClick={() => handleChange("active", false)}
              />
              <Label
                  htmlFor="inactive"
                  className="text-sm font-medium leading-none"
              >
                Inativo
              </Label>
            </div>
          </div>
      );
    }

    return (
        <div key={index} className="flex flex-col gap-2">
          <Label htmlFor={field.label} className="text-left">
            {field.label}
          </Label>
          {field.type === "textarea" ? (
              <Textarea
                  id={field.label}
                  className="resize-none"
                  rows={4}
                  placeholder={`Digite ${field.label.toLowerCase()}`}
                  value={formData[field.apiReqKey] || ""}
                  onChange={(e) => handleChange(field.apiReqKey, e.target.value)}
              />
          ) : (
              <Input
                  id={field.label}
                  type={field.type}
                  placeholder={formData[field.apiReqKey] || `Digite ${field.label.toLowerCase()}`}
                  value={formData[field.apiReqKey] || ""}
                  onChange={(e) => handleChange(field.apiReqKey, e.target.value)}
              />
          )}
        </div>
    );
  });
};

const UpdateDialog = ({
                        dtoList,
                        currentLabel,
                        editId,
                        isOpen,
                        onClose,
                      }: UpdateDialogProps) => {
  const { reload, setReload } = useActiveItem();

  const [currentDTO, setCurrentDTO] = useState<DtoFormat | undefined>();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (dtoList[valueToDtoMap[currentLabel]] && editId) {
      setCurrentDTO(dtoList[valueToDtoMap[currentLabel]]);
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await api.get(
              `${dtoList[valueToDtoMap[currentLabel]].req}${editId}`
          );
          setFormData(response.data.payload);
        } catch (err: any) {
          console.error("Erro ao buscar dados para edição:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [dtoList, currentLabel, editId,reload]);

  async function handleUpdateFormSubmit(e: any) {
    e.preventDefault();

    const endpoint = currentDTO?.req;

    try {
      if (endpoint != null) {
        await api.patch(`${endpoint}${editId}`, formData);
      }
      setReload(!reload);
      onClose(); // Fecha o modal após a atualização
      toast({ title: "Registro atualizado com sucesso!" });
    } catch (err: any) {
      console.error("Erro ao atualizar:", err);
      toast({ title: err.response.data.message });
    }
  }

  const handleChange = (label: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  if (loading) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Carregando...</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
    );
  }

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleUpdateFormSubmit}>
            <DialogHeader>
              <DialogTitle>{currentLabel}</DialogTitle>
              <DialogDescription>{currentDTO?.description}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              {currentDTO && (
                  <RenderFields
                      fields={currentDTO.fields}
                      formData={formData}
                      handleChange={handleChange}
                  />
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Atualizar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
};

export default UpdateDialog;
