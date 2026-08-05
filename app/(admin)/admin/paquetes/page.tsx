"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PackageFormDialog, Plan } from "@/components/admin/PackageFormDialog";

// Fila cruda de `products` (productType='package') tal como la devuelve /api/admin/packages.
interface PackageRow {
  id: string; name: string; price: string; subcategory: string | null
  features: string[]; isFeatured: boolean; category: string
  metadata: { folios?: number | null; cta?: string | null } | null
}

function rowToPlan(row: PackageRow): Plan {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    ...(row.subcategory ? { billingPeriod: row.subcategory } : {}),
    features: row.features ?? [],
    ...(row.metadata?.folios !== null && row.metadata?.folios !== undefined
      ? { folios: row.metadata.folios }
      : {}),
    isPopular: row.isFeatured,
    cta: row.metadata?.cta ?? "Contactar",
    packageType: row.category as "pos" | "hardware" | "iot",
  };
}
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Package,
  Star,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function PaquetesAdminPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Estados
  const [packages, setPackages] = useState<Plan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [packageTypeFilter, setPackageTypeFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Plan | null>(null);
  const [packageToDelete, setPackageToDelete] = useState<Plan | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  // Cargar paquetes reales desde la base de datos vía la API admin.
  const loadPackages = async () => {
    try {
      const res = await fetch("/api/admin/packages");
      if (!res.ok) {throw new Error("fetch failed");}
      const data = await res.json();
      setPackages((data.packages as PackageRow[]).map(rowToPlan));
    } catch (error) {
      console.error("Error al cargar paquetes:", error);
      toast.error("Error al cargar paquetes");
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  // Filtrado y búsqueda
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesSearch =
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.cta.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        packageTypeFilter === "all" || pkg.packageType === packageTypeFilter;

      return matchesSearch && matchesType;
    });
  }, [packages, searchTerm, packageTypeFilter]);

  // Estadísticas
  const stats = useMemo(() => {
    const totalPackages = packages.length;
    const popularPackages = packages.filter((p) => p.isPopular).length;
    const avgPrice = packages.length > 0
      ? Math.round(packages.reduce((acc, p) => acc + p.price, 0) / packages.length)
      : 0;
    const posPkgs = packages.filter((p) => p.packageType === "pos").length;
    const hardwarePkgs = packages.filter((p) => p.packageType === "hardware").length;
    const iotPkgs = packages.filter((p) => p.packageType === "iot").length;

    return { totalPackages, popularPackages, avgPrice, posPkgs, hardwarePkgs, iotPkgs };
  }, [packages]);

  // CRUD Functions — llaman a /api/admin/packages (Drizzle), no a localStorage.
  const handleCreate = async (pkg: Plan) => {
    try {
      const res = await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pkg),
      });
      if (!res.ok) {throw new Error("create failed");}
      toast.success(`Paquete "${pkg.name}" creado exitosamente`);
      await loadPackages();
    } catch {
      toast.error("Error al crear el paquete");
    }
  };

  const handleUpdate = async (updatedPackage: Plan) => {
    try {
      const res = await fetch(`/api/admin/packages/${updatedPackage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPackage),
      });
      if (!res.ok) {throw new Error("update failed");}
      toast.success(`Paquete "${updatedPackage.name}" actualizado exitosamente`);
      await loadPackages();
    } catch {
      toast.error("Error al actualizar el paquete");
    }
  };

  const handleDelete = async (id: string) => {
    const pkg = packages.find((p) => p.id === id);
    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
      if (!res.ok) {throw new Error("delete failed");}
      toast.success(`Paquete "${pkg?.name ?? ""}" eliminado exitosamente`);
      await loadPackages();
    } catch {
      toast.error("Error al eliminar el paquete");
    }
  };

  // Dialog handlers
  const openCreateDialog = () => {
    setSelectedPackage(null);
    setDialogMode("create");
    setIsDialogOpen(true);
  };

  const openEditDialog = (pkg: Plan) => {
    setSelectedPackage(pkg);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (pkg: Plan) => {
    setPackageToDelete(pkg);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (packageToDelete) {
      handleDelete(packageToDelete.id);
      setPackageToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleFormSubmit = (pkg: Plan) => {
    if (dialogMode === "create") {
      handleCreate(pkg);
    } else {
      handleUpdate(pkg);
    }
  };

  const getPackageTypeBadgeColor = (type: string | undefined) => {
    switch (type) {
      case "pos":
        return "border-blue-500 text-blue-500";
      case "hardware":
        return "border-purple-500 text-purple-500";
      case "iot":
        return "border-green-500 text-green-500";
      default:
        return "border-gray-500 text-gray-500";
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-[#02505931]" : "bg-[#e6f7f6]"
      } p-4 sm:p-6 lg:p-8`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1
              className={`text-3xl font-bold ${
                isDark ? "text-[#26FFDF]" : "text-[#04423c]"
              }`}
            >
              Gestión de Paquetes
            </h1>
            <p className={`${isDark ? "text-[#b2fff6]" : "text-[#085c54]"} mt-1`}>
              Administra los paquetes de POS, Hardware e IoT
            </p>
          </div>

          <Button
            onClick={openCreateDialog}
            className="bg-[#08A696]/20 backdrop-blur-sm border border-[#08A696]/50 text-[#26FFDF] hover:bg-[#08A696]/30 hover:border-[#26FFDF] hover:shadow-lg hover:shadow-[#26FFDF]/20 transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar Paquete
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className={`rounded-xl ${
              isDark
                ? "bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20"
                : "bg-[#e6f7f6] backdrop-blur-sm border border-[#08A696]/60"
            } p-6 transition-all duration-300 hover:border-[#08A696] hover:shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm ${
                    isDark ? "text-[#b2fff6]" : "text-[#085c54]"
                  }`}
                >
                  Total Paquetes
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isDark ? "text-[#26FFDF]" : "text-[#04423c]"
                  } mt-1`}
                >
                  {stats.totalPackages}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl ${
                  isDark
                    ? "bg-[#02505950] border border-[#08A696]/20"
                    : "bg-[#c5ebe7] border border-[#08A696]/40"
                }`}
              >
                <Package
                  className={`w-6 h-6 ${
                    isDark ? "text-[#26FFDF]" : "text-[#085c54]"
                  }`}
                />
              </div>
            </div>
          </div>

          <div
            className={`rounded-xl ${
              isDark
                ? "bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20"
                : "bg-[#e6f7f6] backdrop-blur-sm border border-[#08A696]/60"
            } p-6 transition-all duration-300 hover:border-[#08A696] hover:shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm ${
                    isDark ? "text-[#b2fff6]" : "text-[#085c54]"
                  }`}
                >
                  Paquetes Populares
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isDark ? "text-[#26FFDF]" : "text-[#04423c]"
                  } mt-1`}
                >
                  {stats.popularPackages}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl ${
                  isDark
                    ? "bg-[#02505950] border border-[#08A696]/20"
                    : "bg-[#c5ebe7] border border-[#08A696]/40"
                }`}
              >
                <Star
                  className={`w-6 h-6 ${
                    isDark ? "text-[#26FFDF]" : "text-[#085c54]"
                  }`}
                />
              </div>
            </div>
          </div>

          <div
            className={`rounded-xl ${
              isDark
                ? "bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20"
                : "bg-[#e6f7f6] backdrop-blur-sm border border-[#08A696]/60"
            } p-6 transition-all duration-300 hover:border-[#08A696] hover:shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm ${
                    isDark ? "text-[#b2fff6]" : "text-[#085c54]"
                  }`}
                >
                  Precio Promedio
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isDark ? "text-[#26FFDF]" : "text-[#04423c]"
                  } mt-1`}
                >
                  ${stats.avgPrice.toLocaleString()}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl ${
                  isDark
                    ? "bg-[#02505950] border border-[#08A696]/20"
                    : "bg-[#c5ebe7] border border-[#08A696]/40"
                }`}
              >
                <DollarSign
                  className={`w-6 h-6 ${
                    isDark ? "text-[#26FFDF]" : "text-[#085c54]"
                  }`}
                />
              </div>
            </div>
          </div>

          <div
            className={`rounded-xl ${
              isDark
                ? "bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20"
                : "bg-[#e6f7f6] backdrop-blur-sm border border-[#08A696]/60"
            } p-6 transition-all duration-300 hover:border-[#08A696] hover:shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm ${
                    isDark ? "text-[#b2fff6]" : "text-[#085c54]"
                  }`}
                >
                  Por Tipo
                </p>
                <div className="flex gap-2 mt-1">
                  <span className={`text-sm font-semibold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                    POS: {stats.posPkgs}
                  </span>
                  <span className={`text-sm font-semibold ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                    HW: {stats.hardwarePkgs}
                  </span>
                  <span className={`text-sm font-semibold ${isDark ? "text-green-400" : "text-green-600"}`}>
                    IoT: {stats.iotPkgs}
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-xl ${
                  isDark
                    ? "bg-[#02505950] border border-[#08A696]/20"
                    : "bg-[#c5ebe7] border border-[#08A696]/40"
                }`}
              >
                <TrendingUp
                  className={`w-6 h-6 ${
                    isDark ? "text-[#26FFDF]" : "text-[#085c54]"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div
          className={`rounded-xl ${
            isDark
              ? "bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20"
              : "bg-[#e6f7f6] backdrop-blur-sm border border-[#08A696]/60"
          } p-6`}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? "text-[#b2fff6]" : "text-[#085c54]"
                }`}
              />
              <Input
                placeholder="Buscar por nombre, ID o CTA..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${
                  isDark
                    ? "bg-[#02505950] border-[#08A696]/20 text-white placeholder:text-[#b2fff6]/50"
                    : "bg-white border-[#08A696]/60 text-[#04423c] placeholder:text-[#085c54]/50"
                } focus:border-[#26FFDF]`}
              />
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4">
            <p className={`text-sm ${isDark ? "text-[#b2fff6]" : "text-[#085c54]"}`}>
              Mostrando {filteredPackages.length} de {packages.length} paquetes
            </p>
          </div>
        </div>

        {/* Tabs for Package Types */}
        <Tabs
          defaultValue="all"
          value={packageTypeFilter}
          onValueChange={setPackageTypeFilter}
          className="w-full"
        >
          <TabsList
            className={`grid w-full grid-cols-4 ${
              isDark
                ? "bg-[#02505931] border border-[#08A696]/20"
                : "bg-[#e6f7f6] border border-[#08A696]/60"
            }`}
          >
            <TabsTrigger
              value="all"
              className={`${
                isDark
                  ? "data-[state=active]:bg-[#08A696]/30 data-[state=active]:text-[#26FFDF]"
                  : "data-[state=active]:bg-[#08A696]/20 data-[state=active]:text-[#04423c]"
              }`}
            >
              Todos
            </TabsTrigger>
            <TabsTrigger
              value="pos"
              className={`${
                isDark
                  ? "data-[state=active]:bg-[#08A696]/30 data-[state=active]:text-[#26FFDF]"
                  : "data-[state=active]:bg-[#08A696]/20 data-[state=active]:text-[#04423c]"
              }`}
            >
              POS
            </TabsTrigger>
            <TabsTrigger
              value="hardware"
              className={`${
                isDark
                  ? "data-[state=active]:bg-[#08A696]/30 data-[state=active]:text-[#26FFDF]"
                  : "data-[state=active]:bg-[#08A696]/20 data-[state=active]:text-[#04423c]"
              }`}
            >
              Hardware
            </TabsTrigger>
            <TabsTrigger
              value="iot"
              className={`${
                isDark
                  ? "data-[state=active]:bg-[#08A696]/30 data-[state=active]:text-[#26FFDF]"
                  : "data-[state=active]:bg-[#08A696]/20 data-[state=active]:text-[#04423c]"
              }`}
            >
              IoT
            </TabsTrigger>
          </TabsList>

          <TabsContent value={packageTypeFilter} className="mt-6">
            {/* Packages Table */}
            <div
              className={`rounded-xl ${
                isDark
                  ? "bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20"
                  : "bg-[#e6f7f6] backdrop-blur-sm border border-[#08A696]/60"
              } overflow-hidden`}
            >
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow
                      className={`${
                        isDark
                          ? "border-[#08A696]/20 hover:bg-[#02505950]"
                          : "border-[#08A696]/60 hover:bg-[#c5ebe7]"
                      }`}
                    >
                      <TableHead
                        className={`${isDark ? "text-[#26FFDF]" : "text-[#04423c]"}`}
                      >
                        Paquete
                      </TableHead>
                      <TableHead
                        className={`${isDark ? "text-[#26FFDF]" : "text-[#04423c]"}`}
                      >
                        Tipo
                      </TableHead>
                      <TableHead
                        className={`${isDark ? "text-[#26FFDF]" : "text-[#04423c]"}`}
                      >
                        Precio
                      </TableHead>
                      <TableHead
                        className={`${isDark ? "text-[#26FFDF]" : "text-[#04423c]"}`}
                      >
                        Características
                      </TableHead>
                      <TableHead
                        className={`${isDark ? "text-[#26FFDF]" : "text-[#04423c]"}`}
                      >
                        Estado
                      </TableHead>
                      <TableHead
                        className={`text-right ${
                          isDark ? "text-[#26FFDF]" : "text-[#04423c]"
                        }`}
                      >
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPackages.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className={`text-center py-12 ${
                            isDark ? "text-[#b2fff6]" : "text-[#085c54]"
                          }`}
                        >
                          No se encontraron paquetes
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPackages.map((pkg) => (
                        <TableRow
                          key={pkg.id}
                          className={`${
                            isDark
                              ? "border-[#08A696]/20 hover:bg-[#02505950]"
                              : "border-[#08A696]/60 hover:bg-[#c5ebe7]"
                          } transition-colors`}
                        >
                          <TableCell>
                            <div>
                              <p
                                className={`font-semibold ${
                                  isDark ? "text-white" : "text-[#04423c]"
                                }`}
                              >
                                {pkg.name}
                              </p>
                              <p
                                className={`text-xs ${
                                  isDark ? "text-[#b2fff6]/70" : "text-[#085c54]/70"
                                }`}
                              >
                                ID: {pkg.id}
                              </p>
                              <p
                                className={`text-xs ${
                                  isDark ? "text-[#b2fff6]" : "text-[#085c54]"
                                }`}
                              >
                                CTA: {pkg.cta}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getPackageTypeBadgeColor(pkg.packageType)}
                            >
                              {pkg.packageType?.toUpperCase() || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p
                                className={`font-bold ${
                                  isDark ? "text-[#26FFDF]" : "text-[#04423c]"
                                }`}
                              >
                                ${pkg.price.toLocaleString()}
                              </p>
                              {pkg.billingPeriod && (
                                <p
                                  className={`text-sm ${
                                    isDark ? "text-[#b2fff6]/70" : "text-[#085c54]/70"
                                  }`}
                                >
                                  / {pkg.billingPeriod}
                                </p>
                              )}
                              {pkg.folios && pkg.folios > 0 && (
                                <p
                                  className={`text-xs ${
                                    isDark ? "text-[#b2fff6]" : "text-[#085c54]"
                                  }`}
                                >
                                  {pkg.folios} folios
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p
                              className={`text-sm ${
                                isDark ? "text-[#b2fff6]" : "text-[#085c54]"
                              }`}
                            >
                              {pkg.features.length} características
                            </p>
                          </TableCell>
                          <TableCell>
                            {pkg.isPopular && (
                              <Badge className="bg-[#26FFDF]/20 text-[#26FFDF] border-[#26FFDF]">
                                <Star className="w-3 h-3 mr-1" />
                                Popular
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(pkg)}
                                className={`${
                                  isDark
                                    ? "text-[#26FFDF] hover:bg-[#08A696]/20"
                                    : "text-[#085c54] hover:bg-[#08A696]/10"
                                }`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(pkg)}
                                className="text-red-400 hover:bg-red-500/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Package Form Dialog */}
      <PackageFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        packagePlan={selectedPackage}
        onSubmit={handleFormSubmit}
        mode={dialogMode}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#26FFDF] text-xl">
              ¿Estás seguro?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#b2fff6]">
              Esta acción no se puede deshacer. Se eliminará permanentemente el paquete{" "}
              <span className="font-bold text-white">&quot;{packageToDelete?.name}&quot;</span>{" "}
              del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#08A696]/20 text-[#b2fff6] hover:bg-[#08A696]/10 hover:text-[#26FFDF] hover:border-[#26FFDF]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/20"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
