"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DialogDemo() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    original: "https://seu-link-aqui.com",
    slug: "Apelido-maneiro-do-seu-link",
  });
  const [errors, setErrors] = useState({
    original: "",
    slug: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    
    // Clear error when user types
    if (errors[id as keyof typeof errors]) {
      setErrors({
        ...errors,
        [id]: "",
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { original: "", slug: "" };

    // Validate URL
    if (!formData.original) {
      newErrors.original = "URL é obrigatória";
      isValid = false;
    } else if (!formData.original.startsWith("http://") && !formData.original.startsWith("https://")) {
      newErrors.original = "URL deve começar com http:// ou https://";
      isValid = false;
    }

    // Validate slug
    if (!formData.slug) {
      newErrors.slug = "Slug é obrigatório";
      isValid = false;
    } else if (formData.slug.includes(" ")) {
      newErrors.slug = "Slug não pode conter espaços";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Use the full URL with the correct host and port
      const response = await axios.post("http://localhost/api/shortener", formData, {
        withCredentials: true, // Include credentials if your API uses cookies/sessions
      });
      
      // Handle success
      if (response.status === 201) {
        // Using alert instead of toast
        alert(`QR code criado com sucesso! URL encurtada: ${response.data.shortUrl || formData.slug}`);
        setOpen(false); // Close dialog on success
        
        // Reset form
        setFormData({
          original: "https://seu-link-aqui.com",
          slug: "Apelido-maneiro-do-seu-link",
        });
      }
    } catch (error: any) {
      // Handle error with alert
      const errorMessage = error.response?.data?.message || "Erro ao criar QR code. Tente novamente.";
      alert(`Erro: ${errorMessage}`);
      console.error("Erro ao criar QR code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Criar novo QR-code</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar QR code</DialogTitle>
            <DialogDescription>
              Insira o link que deseja encurtar e seu slug personalizado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="original" className="text-right">
                URL
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="original"
                  value={formData.original}
                  onChange={handleInputChange}
                  className={errors.original ? "border-red-500" : ""}
                  disabled={isLoading}
                  placeholder="https://seu-link-aqui.com"
                />
                {errors.original && (
                  <p className="text-red-500 text-xs">{errors.original}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className={errors.slug ? "border-red-500" : ""}
                  disabled={isLoading}
                  placeholder="Apelido-maneiro-do-seu-link"
                />
                {errors.slug && (
                  <p className="text-red-500 text-xs">{errors.slug}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar QR code"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}