import React from 'react';
import { Grid2x2Plus, Grid2x2X } from "lucide-react";

function EmptyTable() {
  const [showFirstIcon, setShowFirstIcon] = React.useState(true);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setShowFirstIcon(prev => !prev);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);


  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-24">
      <div className="bg-red-400 p-1 rounded-lg">
        {showFirstIcon ? <Grid2x2Plus size={120} /> : <Grid2x2X size={120} />}
      </div>
      <h3 className="text-lg font-medium text-sidebar-foreground/80">Não há dados para serem exibidos.</h3>
    </div>
  );
};

export default EmptyTable;