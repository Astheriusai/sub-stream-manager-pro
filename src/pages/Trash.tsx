
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2, RotateCcw, Trash2, Info } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type TrashItem = {
  id: string;
  original_table: string;
  original_id: string;
  data: Record<string, any>;
  deleted_at: string;
};

export default function Trash() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");

  // Fetch trash items
  const { data: trashItems, isLoading, error } = useQuery({
    queryKey: ["trash", activeTab],
    queryFn: async () => {
      let query = supabase.from("trash").select("*").order("deleted_at", { ascending: false });

      if (activeTab !== "all") {
        query = query.eq("original_table", activeTab);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as TrashItem[];
    },
  });

  // Restore item mutation
  const restoreMutation = useMutation({
    mutationFn: async (item: TrashItem) => {
      // First, insert the data back to the original table
      const { error: insertError } = await supabase
        .from(item.original_table)
        .insert([{ id: item.original_id, ...item.data }]);

      if (insertError) throw insertError;

      // Then, delete the item from trash
      const { error: deleteError } = await supabase
        .from("trash")
        .delete()
        .eq("id", item.id);

      if (deleteError) throw deleteError;

      return item;
    },
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: ["trash"] });
      // Also invalidate the query for the restored item's original table
      queryClient.invalidateQueries({ queryKey: [item.original_table] });
      toast({
        title: "Elemento restaurado",
        description: `El elemento ha sido restaurado exitosamente a ${getTableDisplayName(item.original_table)}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `No se pudo restaurar el elemento: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete permanently mutation
  const deletePermanentlyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("trash")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trash"] });
      toast({
        title: "Elemento eliminado",
        description: "El elemento ha sido eliminado permanentemente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `No se pudo eliminar el elemento: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Empty trash mutation
  const emptyTrashMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("trash")
        .delete()
        .filter(activeTab !== "all" ? "original_table", "eq", activeTab : "");

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trash"] });
      toast({
        title: "Papelera vaciada",
        description: "Todos los elementos han sido eliminados permanentemente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `No se pudo vaciar la papelera: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const getTableDisplayName = (tableName: string) => {
    const displayNames: Record<string, string> = {
      products: "Productos",
      accounts: "Cuentas",
      profiles: "Perfiles",
      customers: "Clientes",
      sales: "Ventas",
      users: "Usuarios",
      subscribers: "Suscriptores",
      price_lists: "Lista de Precios",
    };
    return displayNames[tableName] || tableName;
  };

  const getItemName = (item: TrashItem) => {
    switch (item.original_table) {
      case "products":
        return item.data.name || `Producto #${item.original_id}`;
      case "accounts":
        return item.data.email || `Cuenta #${item.original_id}`;
      case "profiles":
        return item.data.name || `Perfil #${item.original_id}`;
      case "customers":
        return item.data.name || `Cliente #${item.original_id}`;
      case "sales":
        return `Venta #${item.original_id}`;
      case "users":
        return item.data.name || `Usuario #${item.original_id}`;
      case "subscribers":
        return item.data.name || `Suscriptor #${item.original_id}`;
      case "price_lists":
        return `Precio #${item.original_id}`;
      default:
        return `Item #${item.original_id}`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Papelera</h2>
          <p className="text-muted-foreground">
            Elementos eliminados recientemente (se mantienen por 24 horas)
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isLoading || !trashItems?.length}>
              <Trash2 className="mr-2 h-4 w-4" />
              Vaciar Papelera
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente 
                {activeTab !== "all" 
                  ? ` todos los elementos de ${getTableDisplayName(activeTab)}` 
                  : " todos los elementos"
                } de la papelera.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => emptyTrashMutation.mutate()}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {emptyTrashMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Vaciar Papelera"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Elementos Eliminados</CardTitle>
          <CardDescription>
            Restaura elementos o elimínalos permanentemente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="all" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="products">Productos</TabsTrigger>
              <TabsTrigger value="accounts">Cuentas</TabsTrigger>
              <TabsTrigger value="profiles">Perfiles</TabsTrigger>
              <TabsTrigger value="customers">Clientes</TabsTrigger>
              <TabsTrigger value="sales">Ventas</TabsTrigger>
              <TabsTrigger value="users">Usuarios</TabsTrigger>
              <TabsTrigger value="subscribers">Suscriptores</TabsTrigger>
              <TabsTrigger value="price_lists">Lista de Precios</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-destructive">Error al cargar los elementos eliminados</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Elemento</TableHead>
                      <TableHead>Eliminado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trashItems && trashItems.length > 0 ? (
                      trashItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{getTableDisplayName(item.original_table)}</TableCell>
                          <TableCell className="font-medium">{getItemName(item)}</TableCell>
                          <TableCell>
                            {format(new Date(item.deleted_at), "dd/MM/yyyy HH:mm")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => restoreMutation.mutate(item)}
                                disabled={restoreMutation.isPending}
                              >
                                {restoreMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Restaurar
                                  </>
                                )}
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer. Esto eliminará permanentemente 
                                      el elemento seleccionado.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deletePermanentlyMutation.mutate(item.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      {deletePermanentlyMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        "Eliminar Permanentemente"
                                      )}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          <div className="flex flex-col items-center justify-center h-24 gap-2">
                            <Info className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">No hay elementos en la papelera</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
