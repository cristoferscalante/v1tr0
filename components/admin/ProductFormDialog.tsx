"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Product } from "@/components/shop/products/ProductCard";

const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  originalPrice: z.number().optional(),
  image: z.string().url("Debe ser una URL válida"),
  category: z.enum(["hardware", "software", "servicios"], {
    required_error: "Debe seleccionar una categoría",
  }),
  stock: z.number().int().min(0, "El stock debe ser mayor o igual a 0"),
  featured: z.boolean().default(false),
  badge: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSubmit: (data: Product) => void;
  mode: "create" | "edit";
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  mode,
}: ProductFormDialogProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      originalPrice: undefined,
      image: "",
      category: "hardware",
      stock: 0,
      featured: false,
      badge: "",
    },
  });

  // Reset form cuando cambia el producto o se abre/cierra el dialog
  useEffect(() => {
    if (open && product && mode === "edit") {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category as "hardware" | "software" | "servicios",
        stock: product.stock,
        featured: product.featured || false,
        badge: product.badge || "",
      });
    } else if (open && mode === "create") {
      form.reset({
        name: "",
        description: "",
        price: 0,
        originalPrice: undefined,
        image: "",
        category: "hardware",
        stock: 0,
        featured: false,
        badge: "",
      });
    }
  }, [open, product, mode, form]);

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  };

  const handleSubmit = (data: ProductFormValues) => {
    const productData: Product = {
      id: product?.id || `${Date.now()}`,
      name: data.name,
      slug: generateSlug(data.name),
      description: data.description,
      price: data.price,
      ...(data.originalPrice && { originalPrice: data.originalPrice }),
      image: data.image,
      category: data.category,
      stock: data.stock,
      ...(data.featured !== undefined && { featured: data.featured }),
      ...(data.badge && { badge: data.badge }),
    };

    onSubmit(productData);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#26FFDF]">
            {mode === "create" ? "Crear Nuevo Producto" : "Editar Producto"}
          </DialogTitle>
          <DialogDescription className="text-[#b2fff6]">
            {mode === "create"
              ? "Completa todos los campos para agregar un nuevo producto"
              : "Modifica los campos que desees actualizar"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#26FFDF]">Nombre del Producto *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Cyber Deck Pro"
                      {...field}
                      className="bg-[#02505950] border-[#08A696]/20 text-white placeholder:text-[#b2fff6]/50 focus:border-[#26FFDF]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#26FFDF]">Descripción *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe el producto en detalle..."
                      {...field}
                      rows={4}
                      className="bg-[#02505950] border-[#08A696]/20 text-white placeholder:text-[#b2fff6]/50 focus:border-[#26FFDF] resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Price & Original Price */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#26FFDF]">Precio *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-[#02505950] border-[#08A696]/20 text-white placeholder:text-[#b2fff6]/50 focus:border-[#26FFDF]"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#26FFDF]">Precio Original</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                        }
                        className="bg-[#02505950] border-[#08A696]/20 text-white placeholder:text-[#b2fff6]/50 focus:border-[#26FFDF]"
                      />
                    </FormControl>
                    <FormDescription className="text-[#b2fff6]/70 text-xs">
                      Opcional - Para mostrar descuentos
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            {/* Image URL */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#26FFDF]">URL de la Imagen *</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      {...field}
                      className="bg-[#02505950] border-[#08A696]/20 text-white placeholder:text-[#b2fff6]/50 focus:border-[#26FFDF]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Category & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#26FFDF]">Categoría *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-[#02505950] border-[#08A696]/20 text-white focus:border-[#26FFDF]">
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#02505931] backdrop-blur-sm border-[#08A696]/20">
                        <SelectItem value="hardware" className="text-white hover:bg-[#08A696]/20">
                          Hardware
                        </SelectItem>
                        <SelectItem value="software" className="text-white hover:bg-[#08A696]/20">
                          Software
                        </SelectItem>
                        <SelectItem value="servicios" className="text-white hover:bg-[#08A696]/20">
                          Servicios
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#26FFDF]">Stock *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="bg-[#02505950] border-[#08A696]/20 text-white placeholder:text-[#b2fff6]/50 focus:border-[#26FFDF]"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            {/* Badge */}
            <FormField
              control={form.control}
              name="badge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#26FFDF]">Badge (Etiqueta)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Nuevo, Destacado, Oferta"
                      {...field}
                      value={field.value || ""}
                      className="bg-[#02505950] border-[#08A696]/20 text-white placeholder:text-[#b2fff6]/50 focus:border-[#26FFDF]"
                    />
                  </FormControl>
                  <FormDescription className="text-[#b2fff6]/70 text-xs">
                    Opcional - Etiqueta especial para el producto
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Featured */}
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-[#08A696]/20 p-4 bg-[#02505950]">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-[#26FFDF] data-[state=checked]:bg-[#26FFDF] data-[state=checked]:text-[#02505931]"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-[#26FFDF] cursor-pointer">
                      Producto Destacado
                    </FormLabel>
                    <FormDescription className="text-[#b2fff6]/70 text-xs">
                      Marcar este producto como destacado en la tienda
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
                className="bg-transparent border-[#08A696]/20 text-[#b2fff6] hover:bg-[#08A696]/10 hover:text-[#26FFDF] hover:border-[#26FFDF]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#08A696]/20 backdrop-blur-sm border border-[#08A696]/50 text-[#26FFDF] hover:bg-[#08A696]/30 hover:border-[#26FFDF] hover:shadow-lg hover:shadow-[#26FFDF]/20 transition-all duration-300"
              >
                {mode === "create" ? "Crear Producto" : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
