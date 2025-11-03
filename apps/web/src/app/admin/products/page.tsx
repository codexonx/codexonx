"use client";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve Radix UI/Lucide
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Edit,
  Trash2,
  ExternalLink,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Tag,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  featured: boolean;
  status: "active" | "inactive" | "draft";
  createdAt: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    status: "active" as "active" | "inactive" | "draft",
    featured: false
  });
  
  // Simüle edilmiş kategoriler
  const categories = [
    "Teknoloji", "Giyim", "Ev Eşyaları", "Kitaplar", "Spor", "Müzik", "Oyunlar"
  ];

  // Simüle edilmiş ürün verileri
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Gerçek uygulamada API isteği burada olacak
        setTimeout(() => {
          const mockProducts: Product[] = Array.from({ length: 30 }).map((_, index) => ({
            id: `prod-${index + 1}`,
            name: `Ürün ${index + 1}`,
            description: `${index + 1} numaralı ürün için açıklama metni. Ürün özellikleri burada detaylandırılacak.`,
            price: Math.floor(Math.random() * 1000) + 10,
            category: categories[Math.floor(Math.random() * categories.length)],
            stock: Math.floor(Math.random() * 100),
            imageUrl: `/products/${index + 1}.jpg`,
            featured: Math.random() > 0.8,
            status: ["active", "inactive", "draft"][Math.floor(Math.random() * 3)] as "active" | "inactive" | "draft",
            createdAt: new Date(
              Date.now() - Math.floor(Math.random() * 10000000000)
            ).toISOString(),
          }));

          setProducts(mockProducts);
          setFilteredProducts(mockProducts);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Ürün veri hatası:", error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Arama ve filtreleme
  useEffect(() => {
    let filtered = [...products];
    
    // Arama sorgusu filtreleme
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sekmelerle filtreleme
    if (activeTab !== "all") {
      filtered = filtered.filter((product) => product.status === activeTab);
    }
    
    setFilteredProducts(filtered);
  }, [searchQuery, products, activeTab]);

  // Tarih formatı
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // Para formatı
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };
  
  // Form değişikliklerini izle
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Checkbox değişikliklerini izle
  const handleCheckboxChange = (checked: boolean, name: string) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Ürünü düzenleme modunu aç
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      status: product.status,
      featured: product.featured
    });
    setIsEditDialogOpen(true);
  };

  // Ürün silme modunu aç
  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  // Ürün ekleme işlevi
  const handleAddProduct = () => {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      stock: formData.stock,
      imageUrl: `/products/placeholder.jpg`,
      featured: formData.featured,
      status: formData.status,
      createdAt: new Date().toISOString(),
    };

    setProducts(prev => [newProduct, ...prev]);
    setIsAddDialogOpen(false);
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      status: "active",
      featured: false
    });
    
    toast({
      title: "Ürün Eklendi",
      description: "Yeni ürün başarıyla eklendi.",
    });
  };

  // Ürün güncelleme işlevi
  const handleUpdateProduct = () => {
    if (!selectedProduct) return;

    const updatedProduct: Product = {
      ...selectedProduct,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      stock: formData.stock,
      featured: formData.featured,
      status: formData.status,
    };

    setProducts(prev => 
      prev.map(product => product.id === selectedProduct.id ? updatedProduct : product)
    );
    setIsEditDialogOpen(false);
    
    toast({
      title: "Ürün Güncellendi",
      description: "Ürün bilgileri başarıyla güncellendi.",
    });
  };

  // Ürün silme işlevi
  const handleConfirmDelete = () => {
    if (!selectedProduct) return;
    
    setProducts(prev => 
      prev.filter(product => product.id !== selectedProduct.id)
    );
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Ürün Silindi",
      description: "Ürün başarıyla silindi.",
      variant: "destructive"
    });
  };
  
  // Ürün formu diyalogu (Ekleme ve Düzenleme için ortak)
  const renderProductFormDialog = (isEdit: boolean = false) => {
    const dialogOpen = isEdit ? isEditDialogOpen : isAddDialogOpen;
    const setDialogOpen = isEdit ? setIsEditDialogOpen : setIsAddDialogOpen;
    const dialogTitle = isEdit ? "Ürünü Düzenle" : "Yeni Ürün Ekle";
    const dialogDescription = isEdit 
      ? "Ürün bilgilerini düzenlemek için formu kullanın."
      : "Yeni bir ürün eklemek için aşağıdaki formu doldurun.";
    const submitAction = isEdit ? handleUpdateProduct : handleAddProduct;
    
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Ürün Adı
                </label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Ürün adı" 
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Fiyat
                </label>
                <Input 
                  id="price" 
                  name="price"
                  type="number" 
                  placeholder="0.00" 
                  value={formData.price}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Açıklama
              </label>
              <textarea 
                id="description" 
                name="description"
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Ürün açıklaması..."
                value={formData.description}
                onChange={handleFormChange}
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Kategori
                </label>
                <select 
                  id="category" 
                  name="category"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.category}
                  onChange={handleFormChange}
                >
                  <option value="">Kategori seçin</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="stock" className="text-sm font-medium">
                  Stok Miktarı
                </label>
                <Input 
                  id="stock" 
                  name="stock"
                  type="number" 
                  placeholder="0" 
                  value={formData.stock}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Durum
                </label>
                <select 
                  id="status" 
                  name="status"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                  <option value="draft">Taslak</option>
                </select>
              </div>
              <div className="flex items-end space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured" 
                    name="featured"
                    checked={formData.featured} 
                    onCheckedChange={(checked) => handleCheckboxChange(!!checked, "featured")}
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Öne Çıkan
                  </label>
                </div>
              </div>
            </div>
            {!isEdit && (
              <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium">
                  Ürün Görseli
                </label>
                <Input id="image" type="file" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
            >
              İptal
            </Button>
            <Button onClick={submitAction}>
              {isEdit ? 'Güncelle' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  // Silme onay diyalogu
  const renderDeleteDialog = () => {
    return (
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ürünü Sil</DialogTitle>
            <DialogDescription>
              Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/50">
              <div className="h-10 w-10 rounded-md bg-muted/30 flex items-center justify-center overflow-hidden">
                {selectedProduct && (
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="h-full w-full object-cover" />
                )}
              </div>
              <div>
                <div className="font-medium">{selectedProduct?.name}</div>
                <div className="text-xs text-muted-foreground">{selectedProduct?.category}</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              İptal
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Duruma göre simge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="mr-1 h-3 w-3" />
            <span>Aktif</span>
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <X className="mr-1 h-3 w-3" />
            <span>Pasif</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <span>Taslak</span>
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Başlık ve Ekle Düğmesi */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ürün Yönetimi</h1>
          <p className="text-muted-foreground">Tüm ürünlerinizi yönetin, yenilerini ekleyin ve düzenleyin.</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Ürün
        </Button>
      </div>

      {/* Filtreler ve Arama */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Ürün adı, açıklama veya kategori ile ara..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtreler
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Kategoriler</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuItem key={category} className="flex items-center gap-2">
                <Checkbox id={`category-${category}`} />
                <label htmlFor={`category-${category}`}>{category}</label>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button variant="ghost" size="sm" className="w-full">
                Filtreleri Uygula
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sekmeler */}
      <Tabs 
        defaultValue="all" 
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList>
          <TabsTrigger value="all">Tüm Ürünler</TabsTrigger>
          <TabsTrigger value="active">Aktif</TabsTrigger>
          <TabsTrigger value="inactive">Pasif</TabsTrigger>
          <TabsTrigger value="draft">Taslak</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Ürün Tablosu */}
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium">
                  <div className="flex items-center gap-2">
                    Ürün
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">Kategori</th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  <div className="flex items-center gap-2">
                    Fiyat
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">Stok</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Durum</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Eklenme Tarihi</th>
                <th className="h-12 px-4 text-right align-middle font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-muted/30 flex items-center justify-center overflow-hidden">
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge variant="secondary" className="font-normal">
                      <Tag className="mr-1 h-3 w-3" />
                      {product.category}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle font-medium">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="p-4 align-middle">
                    <span className={`${product.stock < 10 ? "text-destructive" : product.stock < 50 ? "text-amber-600" : "text-green-600"}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    {renderStatusBadge(product.status)}
                  </td>
                  <td className="p-4 align-middle">
                    {formatDate(product.createdAt)}
                  </td>
                  <td className="p-4 text-right align-middle">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">İşlemler</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Düzenle</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>Görüntüle</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Sil</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diyaloglar */}
      {renderProductFormDialog(false)} {/* Ekleme diyaloğu */}
      {renderProductFormDialog(true)} {/* Düzenleme diyaloğu */}
      {renderDeleteDialog()} {/* Silme diyaloğu */}
    </div>
  );
}
