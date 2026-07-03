"use client";

import React, { useState, useEffect, useMemo } from "react";
import { mockProducts } from "@/lib/data/mockProducts";
import type { Product } from "@/components/shop/products/ProductCard";
import { ProductFormDialog } from "@/components/admin/ProductFormDialog";
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Package,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function ProductosAdminPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Estados
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  // Cargar productos desde localStorage al iniciar
  useEffect(() => {
    const savedProducts = localStorage.getItem("v1tr0-products");
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        setProducts(parsed);
        toast.success("Productos cargados desde localStorage");
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setProducts(mockProducts);
        toast.error("Error al cargar productos, usando datos de ejemplo");
      }
    } else {
      setProducts(mockProducts);
      toast.info("Usando productos de ejemplo");
    }
  }, []);

  // Guardar en localStorage cuando cambian los productos
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("v1tr0-products", JSON.stringify(products));
    }
  }, [products]);

  // Filtrado y búsqueda
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  // Estadísticas
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const featured = products.filter((p) => p.featured).length;

    return { totalProducts, totalValue, outOfStock, featured };
  }, [products]);

  // CRUD Functions
  const handleCreate = (product: Product) => {
    setProducts((prev) => [...prev, product]);
    toast.success(`Producto "${product.name}" creado exitosamente`, {
      description: `ID: ${product.id}`,
    });
  };

  const handleUpdate = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    toast.success(`Producto "${updatedProduct.name}" actualizado exitosamente`);
  };

  const handleDelete = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success(`Producto "${product.name}" eliminado exitosamente`);
    }
  };

  // Dialog handlers
  const openCreateDialog = () => {
    setSelectedProduct(null);
    setDialogMode("create");
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      handleDelete(productToDelete.id);
      setProductToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleFormSubmit = (product: Product) => {
    if (dialogMode === "create") {
      handleCreate(product);
    } else {
      handleUpdate(product);
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
              Gestión de Productos
            </h1>
            <p className={`${isDark ? "text-[#b2fff6]" : "text-[#085c54]"} mt-1`}>
              Administra el catálogo completo de productos V1TR0
            </p>
          </div>

          <Button
            onClick={openCreateDialog}
            className="bg-[#08A696]/20 backdrop-blur-sm border border-[#08A696]/50 text-[#26FFDF] hover:bg-[#08A696]/30 hover:border-[#26FFDF] hover:shadow-lg hover:shadow-[#26FFDF]/20 transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar Producto
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
                  Total Productos
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isDark ? "text-[#26FFDF]" : "text-[#04423c]"
                  } mt-1`}
                >
                  {stats.totalProducts}
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
                  Valor Total
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isDark ? "text-[#26FFDF]" : "text-[#04423c]"
                  } mt-1`}
                >
                  ${stats.totalValue.toLocaleString()}
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
                  Sin Stock
                </p>
                <p
                  className={`text-2xl font-bold ${
                    stats.outOfStock > 0 ? "text-red-400" : isDark ? "text-[#26FFDF]" : "text-[#04423c]"
                  } mt-1`}
                >
                  {stats.outOfStock}
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
                    stats.outOfStock > 0 ? "text-red-400" : isDark ? "text-[#26FFDF]" : "text-[#085c54]"
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
                  Destacados
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isDark ? "text-[#26FFDF]" : "text-[#04423c]"
                  } mt-1`}
                >
                  {stats.featured}
                </p>
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

        {/* Filters */}
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
                placeholder="Buscar por nombre, descripción o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${
                  isDark
                    ? "bg-[#02505950] border-[#08A696]/20 text-white placeholder:text-[#b2fff6]/50"
                    : "bg-white border-[#08A696]/60 text-[#04423c] placeholder:text-[#085c54]/50"
                } focus:border-[#26FFDF]`}
              />
            </div>

            {/* Category Filter */}
            <div className="w-full sm:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger
                  className={`${
                    isDark
                      ? "bg-[#02505950] border-[#08A696]/20 text-white"
                      : "bg-white border-[#08A696]/60 text-[#04423c]"
                  } focus:border-[#26FFDF]`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent
                  className={`${
                    isDark
                      ? "bg-[#02505931] backdrop-blur-sm border-[#08A696]/20"
                      : "bg-white border-[#08A696]/60"
                  }`}
                >
                  <SelectItem
                    value="all"
                    className={`${
                      isDark ? "text-white hover:bg-[#08A696]/20" : "text-[#04423c] hover:bg-[#08A696]/10"
                    }`}
                  >
                    Todas las categorías
                  </SelectItem>
                  <SelectItem
                    value="hardware"
                    className={`${
                      isDark ? "text-white hover:bg-[#08A696]/20" : "text-[#04423c] hover:bg-[#08A696]/10"
                    }`}
                  >
                    Hardware
                  </SelectItem>
                  <SelectItem
                    value="software"
                    className={`${
                      isDark ? "text-white hover:bg-[#08A696]/20" : "text-[#04423c] hover:bg-[#08A696]/10"
                    }`}
                  >
                    Software
                  </SelectItem>
                  <SelectItem
                    value="servicios"
                    className={`${
                      isDark ? "text-white hover:bg-[#08A696]/20" : "text-[#04423c] hover:bg-[#08A696]/10"
                    }`}
                  >
                    Servicios
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4">
            <p className={`text-sm ${isDark ? "text-[#b2fff6]" : "text-[#085c54]"}`}>
              Mostrando {filteredProducts.length} de {products.length} productos
            </p>
          </div>
        </div>

        {/* Products Table */}
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
                    Imagen
                  </TableHead>
                  <TableHead
                    className={`${isDark ? "text-[#26FFDF]" : "text-[#04423c]"}`}
                  >
                    Producto
                  </TableHead>
                  <TableHead
                    className={`${isDark ? "text-[#26FFDF]" : "text-[#04423c]"}`}
                  >
                    Categoría
                  </TableHead>
                  <TableHead
                    className={`${isDark ? "text-[#26FFDF]" : "text-[#04423c]"}`}
                  >
                    Precio
                  </TableHead>
                  <TableHead
                    className={`${isDark ? "text-[#26FFDF]" : "text-[#04423c]"}`}
                  >
                    Stock
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
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className={`text-center py-12 ${
                        isDark ? "text-[#b2fff6]" : "text-[#085c54]"
                      }`}
                    >
                      No se encontraron productos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className={`${
                        isDark
                          ? "border-[#08A696]/20 hover:bg-[#02505950]"
                          : "border-[#08A696]/60 hover:bg-[#c5ebe7]"
                      } transition-colors`}
                    >
                      <TableCell>
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-background/50">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p
                            className={`font-semibold ${
                              isDark ? "text-white" : "text-[#04423c]"
                            }`}
                          >
                            {product.name}
                          </p>
                          <p
                            className={`text-sm ${
                              isDark ? "text-[#b2fff6]" : "text-[#085c54]"
                            } line-clamp-1`}
                          >
                            {product.description}
                          </p>
                          <p
                            className={`text-xs ${
                              isDark ? "text-[#b2fff6]/70" : "text-[#085c54]/70"
                            }`}
                          >
                            ID: {product.id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${
                            product.category === "hardware"
                              ? "border-blue-500 text-blue-500"
                              : product.category === "software"
                              ? "border-purple-500 text-purple-500"
                              : "border-green-500 text-green-500"
                          }`}
                        >
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p
                            className={`font-bold ${
                              isDark ? "text-[#26FFDF]" : "text-[#04423c]"
                            }`}
                          >
                            ${product.price.toLocaleString()}
                          </p>
                          {product.originalPrice && (
                            <p
                              className={`text-sm line-through ${
                                isDark ? "text-[#b2fff6]/50" : "text-[#085c54]/50"
                              }`}
                            >
                              ${product.originalPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p
                          className={`font-semibold ${
                            product.stock === 0
                              ? "text-red-400"
                              : product.stock < 10
                              ? "text-yellow-400"
                              : isDark
                              ? "text-white"
                              : "text-[#04423c]"
                          }`}
                        >
                          {product.stock}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {product.featured && (
                            <Badge className="bg-[#26FFDF]/20 text-[#26FFDF] border-[#26FFDF]">
                              Destacado
                            </Badge>
                          )}
                          {product.badge && (
                            <Badge
                              variant="outline"
                              className="border-[#08A696] text-[#08A696]"
                            >
                              {product.badge}
                            </Badge>
                          )}
                          {product.stock === 0 && (
                            <Badge variant="destructive">Sin Stock</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(product)}
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
                            onClick={() => openDeleteDialog(product)}
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
      </div>

      {/* Product Form Dialog */}
      <ProductFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
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
              Esta acción no se puede deshacer. Se eliminará permanentemente el producto{" "}
              <span className="font-bold text-white">&quot;{productToDelete?.name}&quot;</span>{" "}
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
