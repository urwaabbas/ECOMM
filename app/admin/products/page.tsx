"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  title: string;
  price: number;
  stock: number;
  images: string[];
  category: { name: string };
}

interface FormFieldsProps {
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  stock: string;
  setStock: (v: string) => void;
  image: string;
  categoryName: string;
  setCategoryName: (v: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingImage: boolean;
}

function FormFields({
  title, setTitle,
  description, setDescription,
  price, setPrice,
  stock, setStock,
  image,
  categoryName, setCategoryName,
  handleImageUpload,
  uploadingImage,
}: FormFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Product title"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        >
          <option value="">Select category</option>
          <option value="Electronics">Electronics</option>
          <option value="Apparel">Apparel</option>
          <option value="Home & Living">Home & Living</option>
          <option value="Fitness">Fitness</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="0"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
          {uploadingImage && (
            <span className="text-xs text-[#2563EB] font-semibold shrink-0">Uploading...</span>
          )}
        </div>
        {image && (
          <div className="mt-2 flex items-center gap-2">
            <img src={image} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
            <p className="text-xs text-[#10B981] font-semibold">✓ Image uploaded</p>
          </div>
        )}
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product description"
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      if ((session?.user as any)?.role !== "admin") {
        router.push("/");
        return;
      }
      fetchProducts(page);
    }
  }, [session, status, router, page]);

  const fetchProducts = async (pageNumber: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/products?page=${pageNumber}&limit=${limit}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        if (data.totalPages) setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setStock("");
    setImage("");
    setCategoryName("");
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImage(data.url);
      } else {
        alert("Image upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, price, stock, image, categoryName }),
      });
      const data = await res.json();
      if (data.success) {
        resetForm();
        fetchProducts(page);
      }
    } catch (err) {
      console.error("Failed to add product:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: editingProduct?._id,
          title, description, price, stock, image, categoryName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        resetForm();
        fetchProducts(page);
      }
    } catch (err) {
      console.error("Failed to update product:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setImage(product.images?.[0] || "");
    setCategoryName(product.category?.name || "");
    setDescription("");
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-medium">Loading products...</p>
      </div>
    );
  }

  const formProps = {
    title, setTitle,
    description, setDescription,
    price, setPrice,
    stock, setStock,
    image,
    categoryName, setCategoryName,
    handleImageUpload,
    uploadingImage,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Product Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage store inventory items</p>
          </div>
          <button
            onClick={() => { setShowAddForm(!showAddForm); setEditingProduct(null); }}
            className="bg-[#2563EB] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-xs"
          >
            {showAddForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-xs">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Product</h2>
            <form onSubmit={handleAdd}>
              <FormFields {...formProps} />
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="bg-[#2563EB] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 shadow-xs"
                >
                  {submitting ? "Adding..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Modal with Reduced Opacity Background */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 px-4 transition-all">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Edit Product</h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold transition"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <FormFields {...formProps} />
                <div className="mt-6 flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting || uploadingImage}
                    className="bg-[#2563EB] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 shadow-xs"
                  >
                    {submitting ? "Saving..." : "Update Product"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="border border-gray-200 text-gray-600 text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="grid grid-cols-[80px_2fr_1fr_1fr_1fr_120px] bg-gray-50/75 border-b border-gray-200 px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>Image</span>
            <span>Title</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Actions</span>
          </div>
          <div className="divide-y divide-gray-100">
            {products.map((product) => (
              <div key={product._id} className="grid grid-cols-[80px_2fr_1fr_1fr_1fr_120px] px-6 py-4 items-center gap-2 hover:bg-gray-50/50 transition">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                  )}
                </div>
                <p className="text-sm font-bold text-gray-900 truncate">{product.title}</p>
                <p className="text-xs text-gray-500">{product.category?.name}</p>
                <p className="text-sm text-gray-900 font-semibold">PKR {(product.price * 278).toLocaleString()}</p>
                <p className={`text-sm font-bold ${product.stock === 0 ? "text-[#EF4444]" : "text-[#10B981]"}`}>
                  {product.stock === 0 ? "Out of Stock" : `${product.stock} units`}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="text-xs font-semibold text-[#2563EB] hover:bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-xs font-semibold text-[#EF4444] hover:bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">No products found</div>
            )}
          </div>
        </div>

        
        <div className="flex items-center justify-between mt-6 bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-xs text-gray-500 font-medium">Page <span className="font-bold text-gray-900">{page}</span> of <span className="font-bold text-gray-900">{totalPages || 1}</span></p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}