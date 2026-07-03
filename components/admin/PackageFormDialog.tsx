"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";

export interface Plan {
  id: string;
  name: string;
  price: number;
  billingPeriod?: string;
  features: string[];
  folios?: number;
  isPopular?: boolean;
  cta: string;
  packageType?: "pos" | "hardware" | "iot";
}

const packageSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  billingPeriod: z.string().optional(),
  features: z.array(z.string().min(1, "La característica no puede estar vacía")).min(1, "Debe agregar al menos una característica"),
  folios: z.number().int().min(0, "Los folios deben ser mayor o igual a 0").optional(),
  isPopular: z.boolean().default(false),
  cta: z.string().min(3, "El CTA debe tener al menos 3 caracteres"),
  packageType: z.enum(["pos", "hardware", "iot"], {
    required_error: "Debe seleccionar un tipo de paquete",
  }),
});

type PackageFormValues = z.infer<typeof packageSchema>;

interface PackageFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packagePlan?: Plan | null;
  onSubmit: (data: Plan) => void;
  mode: "create" | "edit";
}

export function PackageFormDialog({
  open,
  onOpenChange,
  packagePlan,
  onSubmit,
  mode,
}: PackageFormDialogProps) {
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: "",
      price: 0,
      billingPeriod: "",
      features: [""],
      folios: 0,
      isPopular: false,
      cta: "",
      packageType: "pos",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields, append, remove } = useFieldArray({
    control: form.control as any,
    name: "features",
  });

  // Reset form cuando cambia el paquete o se abre/cierra el dialog
  useEffect(() => {
    if (open && packagePlan && mode === "edit") {
      form.reset({
        name: packagePlan.name,
        price: packagePlan.price,
        billingPeriod: packagePlan.billingPeriod || "",
        features: packagePlan.features.length > 0 ? packagePlan.features : [""],
        folios: packagePlan.folios || 0,
        isPopular: packagePlan.isPopular || false,
        cta: packagePlan.cta,
        packageType: packagePlan.packageType || "pos",
      });
    } else if (open && mode === "create") {
      form.reset({
        name: "",
        price: 0,
        billingPeriod: "",
        features: [""],
        folios: 0,
        isPopular: false,
        cta: "",
        packageType: "pos",
      });
    }
  }, [open, packagePlan, mode, form]);

  const generateId = (name: string, type: string): string => {
    return `${type}-${name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim()}`;
  };

  const handleSubmit = (data: PackageFormValues) => {
    const packageData: Plan = {
      id: packagePlan?.id || generateId(data.name, data.packageType),
      name: data.name,
      price: data.price,
      ...(data.billingPeriod && { billingPeriod: data.billingPeriod }),
      features: data.features.filter((f) => f.trim() !== ""),
      ...(data.folios !== undefined && data.folios > 0 && { folios: data.folios }),
      isPopular: data.isPopular,
      cta: data.cta,
      packageType: data.packageType,
    };

    onSubmit(packageData);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#26FFDF]">
            {mode === "create" ? "Crear Nuevo Paquete" : "Editar Paquete"}
          </DialogTitle>
          <DialogDescription className="text-[#b2fff6]">
            {mode === "create"
              ? "Completa todos los campos para agregar un nuevo paquete"
              : "Modifica los campos que desees actualizar"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Package Type */}
            <FormField
              control={form.control}
              name="packageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#26FFDF]">Tipo de Paquete *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[#02505950] border-[#08A696]/20 text-white focus:border-[#26FFDF]">
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#02505931] backdrop-blur-sm border-[#08A696]/20">
                      <SelectItem value="pos" className="text-white hover:bg-[#08A696]/20">
                        POS Package
                      </SelectItem>
                      <SelectItem value="hardware" className="text-white hover:bg-[#08A696]/20">
                        Hardware Package
                      </SelectItem>
                      <SelectItem value="iot" className="text-white hover:bg-[#08A696]/20">
                        IoT Package
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#26FFDF]">Nombre del Paquete *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Plan Premium"
                      {...field}
                      className="bg-[#02505950] border-[#08A696]/20 text-white placeholder:text-[#b2fff6]/50 focus:border-[#26FFDF]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Price & Billing Period */}
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
                name="billingPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#26FFDF]">Periodo de Facturación</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: mes, año, 7 días"
                        {...field}
                        value={field.value || ""}
                        className="bg-[#02505950] border-[#08A696]/20 text-white placeholder:text-[#b2fff6]/50 focus:border-[#26FFDF]"
                      />
                    </FormControl>
                    <FormDescription className="text-[#b2fff6]/70 text-xs">
                      Opcional - Ej: &quot;mes&quot;, &quot;año&quot;
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            {/* Folios (solo para POS) */}
            <FormField
              control={form.control}
              name="folios"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#26FFDF]">Folios Incluidos</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="bg-[#02505950] border-[#08A696]/20 text-white placeholder:text-[#b2fff6]/50 focus:border-[#26FFDF]"
                    />
                  </FormControl>
                  <FormDescription className="text-[#b2fff6]/70 text-xs">
                    Opcional - Principalmente para paquetes POS
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Features (Dynamic Array) */}
            <div className="space-y-3">
              <FormLabel className="text-[#26FFDF]">Características *</FormLabel>
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`features.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            placeholder={`Característica ${index + 1}`}
                            {...field}
                            className="bg-[#02505950] border-[#08A696]/20 text-white placeholder:text-[#b2fff6]/50 focus:border-[#26FFDF]"
                          />
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              className="text-red-400 hover:bg-red-500/20"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append("")}
                className="w-full bg-transparent border-[#08A696]/20 text-[#b2fff6] hover:bg-[#08A696]/10 hover:text-[#26FFDF] hover:border-[#26FFDF]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Característica
              </Button>
            </div>

            {/* CTA */}
            <FormField
              control={form.control}
              name="cta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#26FFDF]">Texto del Botón (CTA) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Comenzar Ahora, Comprar Kit"
                      {...field}
                      className="bg-[#02505950] border-[#08A696]/20 text-white placeholder:text-[#b2fff6]/50 focus:border-[#26FFDF]"
                    />
                  </FormControl>
                  <FormDescription className="text-[#b2fff6]/70 text-xs">
                    Texto que aparecerá en el botón del paquete
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Is Popular */}
            <FormField
              control={form.control}
              name="isPopular"
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
                      Paquete Popular
                    </FormLabel>
                    <FormDescription className="text-[#b2fff6]/70 text-xs">
                      Marcar este paquete como el más popular/recomendado
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
                {mode === "create" ? "Crear Paquete" : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
