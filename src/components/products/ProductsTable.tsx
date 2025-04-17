
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Database, Trash2, Info, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { Product } from "./types";

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onManageAccounts: (product: Product) => void;
  isDeletingProduct: boolean;
}

export function ProductsTable({
  products,
  isLoading,
  onEdit,
  onDelete,
  onManageAccounts,
  isDeletingProduct,
}: ProductsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!products?.length) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center">
          <div className="flex flex-col items-center justify-center h-24 gap-2">
            <Info className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">No hay productos registrados</p>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Precio Base</TableHead>
          <TableHead>Perfiles Máximos</TableHead>
          <TableHead>Duraciones Permitidas</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{formatCurrency(product.base_price)}</TableCell>
            <TableCell>{product.max_profiles}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {product.allowed_durations.map((duration) => (
                  <Badge key={duration} variant="outline">
                    {duration} mes{duration !== 1 ? 'es' : ''}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                {product.status === 'active' ? 'Activo' : 'Inactivo'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(product)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onManageAccounts(product)}
                >
                  <Database className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(product.id)}
                  disabled={isDeletingProduct}
                >
                  {isDeletingProduct ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
