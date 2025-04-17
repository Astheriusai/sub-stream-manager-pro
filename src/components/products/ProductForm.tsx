
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import type { ProductFormData } from "./types";

interface ProductFormProps {
  onSubmit: (e: React.FormEvent) => void;
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  isLoading: boolean;
  toggleDuration: (duration: number) => void;
}

export function ProductForm({ 
  onSubmit, 
  formData, 
  setFormData, 
  isLoading,
  toggleDuration 
}: ProductFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Netflix Premium"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="base_price">Precio Base</Label>
          <Input
            id="base_price"
            type="number"
            step="0.01"
            value={formData.base_price}
            onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
            placeholder="Ej: 14.99"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="max_profiles">Perfiles Máximos</Label>
          <Input
            id="max_profiles"
            type="number"
            value={formData.max_profiles}
            onChange={(e) => setFormData({ ...formData, max_profiles: e.target.value })}
            placeholder="Ej: 5"
          />
        </div>
        <div className="grid gap-2">
          <Label>Duraciones Permitidas (meses)</Label>
          <div className="flex flex-wrap gap-4">
            {[1, 3, 6, 12].map((duration) => (
              <div key={duration} className="flex items-center space-x-2">
                <Checkbox
                  id={`duration-${duration}`}
                  checked={formData.allowed_durations.includes(duration)}
                  onCheckedChange={() => toggleDuration(duration)}
                />
                <Label htmlFor={`duration-${duration}`} className="text-sm">{duration}</Label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="status"
            checked={formData.status}
            onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
          />
          <Label htmlFor="status">Activo</Label>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar'
          )}
        </Button>
      </div>
    </form>
  );
}
