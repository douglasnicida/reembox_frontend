import { useState } from "react";
import { Input } from "../ui/input";
import { FormDescription } from "../ui/form";
import { Trash2Icon } from "lucide-react";

interface UploadInputProps {
  onChange: (files: FileList | null) => void;
}

function UploadInput({ onChange }: UploadInputProps) {
  const [previewImages, setPreviewImages] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);

      setPreviewImages((prev) => [...prev, ...fileArray])
      onChange(files);
    }
  };

  const handleDeleteFile = (fileIndex: number) => {
    setPreviewImages((prev) => prev.filter((file) => file !== previewImages[fileIndex]))
  }

  return (
    <>
      <Input
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        multiple
        onChange={handleFileChange}
        className="bg-zinc-700 border-zinc-600 text-zinc-400"
      />

      <FormDescription className="text-zinc-400">
        Selecione um ou mais comprovantes de pagamento (jpeg, jpg ou png)
      </FormDescription>

      <div className="flex flex-wrap gap-4 mt-4">
      {previewImages.map((file, index) => (
        <div key={index} className="relative flex flex-col items-center">
          <Trash2Icon className="absolute top-1 right-1 cursor-pointer h-6 w-6 hover:scale-110 text-red-500 z-20" onClick={() => {handleDeleteFile(index)}}/>
          <img
            src={URL.createObjectURL(file)}
            alt={`Preview ${index}`}
            className="w-32 h-32 object-cover rounded-md relative z-10"
          />

          <p
            className="text-xs text-zinc-400 mt-1 text-center truncate w-32"
            title={file.name}
          >
            {file.name.length > 50 ? `${file.name.slice(0, 50)}...${file.type}` : file.name}
          </p>
        </div>
      ))}
    </div>
    </>
  );
};

export default UploadInput
