"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryTable } from "@/components/categories/category-table";
import { CreateCategoryDialog } from "@/components/categories/create-category-dialog";
import { CategoryPagination } from "@/components/categories/category-pagination";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/toaster";
import { Sidebar } from "@/components/sidebar";
import { useSession } from "next-auth/react";

export function CategoryPageClient() {
  const { data: session, status } = useSession();
  const [selectedTab, setSelectedTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCreator, setSelectedCreator] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [categoryCreators, setCategoryCreators] = useState([{ id: "all", name: "All Creators" }]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const itemsPerPage = 10;

  // **Fetch category creators**
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await fetch("/api/manageCategory");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        const uniqueCreators = [...new Set(data.map((cat) => cat.createdBy))];
        const creators = uniqueCreators.map((email) => ({ id: email, name: email }));
        setCategoryCreators([{ id: "all", name: "All Creators" }, ...creators]);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch category creators.",
        });
      }
    };
    fetchCreators();
  }, []);

  // **Fetch categories with filtering and client-side pagination**
  const fetchCategories = async () => {
    setIsLoadingData(true);
    try {
      const queryParams = new URLSearchParams({
        ...(searchQuery && { name: searchQuery }),
        ...(selectedCreator !== "all" && { createdBy: selectedCreator }),
      });
      const response = await fetch(`/api/manageCategory?${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const allCategories = await response.json();

      // Filter categories based on isDeleted status
      const filteredCategories = allCategories.filter(
        (cat) => (cat.isDeleted || false) === (selectedTab === "deleted")
      );

      // Implement client-side pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedCategories = filteredCategories.slice(
        startIndex,
        startIndex + itemsPerPage
      );

      setCategories(paginatedCategories);
      setTotalCategories(filteredCategories.length);
      setTotalPages(Math.ceil(filteredCategories.length / itemsPerPage));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch categories.",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchCategories();
    }
  }, [currentPage, selectedTab, searchQuery, selectedCreator, status]);

  // **Handle search button click**
  const handleSearch = () => {
    setCurrentPage(1);
  };

  // **Handle tab change (active/deleted)**
  const handleTabChange = (value) => {
    setSelectedTab(value);
    setCurrentPage(1);
  };

  // **Handle creator filter change**
  const handleCreatorChange = (value) => {
    setSelectedCreator(value);
    setCurrentPage(1);
  };

  // **Handle category actions (delete, restore, edit)**
  const handleCategoryAction = async (type, categoryId, data) => {
    setIsLoading(true);
    try {
      let message = "";
      let response;

      switch (type) {
        case "delete":
          response = await fetch(`/api/manageCategory`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id: categoryId }),
          });
          if (!response.ok) throw new Error(await response.text());
          message = "Category moved to trash";
          break;

        case "restore":
          response = await fetch(`/api/manageCategory`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id: categoryId, isDeleted: false }),
          });
          if (!response.ok) throw new Error(await response.text());
          message = "Category restored successfully";
          break;

        case "edit":
          response = await fetch(`/api/manageCategory`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id: categoryId, ...data }),
          });
          if (!response.ok) throw new Error(await response.text());
          message = "Category updated successfully";
          break;

        default:
          throw new Error("Unknown action type");
      }

      toast({ title: "Success", description: message });
      await fetchCategories();
    } catch (error) {
      const errorMessage = JSON.parse(error.message).error || "An unexpected error occurred";
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${type} category: ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // **Handle new category creation**
  const handleCategoryAdded = async () => {
    await fetchCategories();
    toast({
      title: "Success",
      description: "Category created successfully",
    });
  };

  // **Loading and authentication states**
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in to manage categories.</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar />
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">Category Management</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              <span className="hidden md:inline">Total </span>Categories: {totalCategories}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search categories..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button variant="secondary" size="sm" onClick={handleSearch}>
              Search
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedCreator} onValueChange={handleCreatorChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Creator" />
              </SelectTrigger>
              <SelectContent>
                {categoryCreators.map((creator) => (
                  <SelectItem key={creator.id} value={creator.id}>
                    <span className="sm:hidden">{creator.name.split(" ")[0]}</span>
                    <span className="hidden sm:inline">{creator.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTab} onValueChange={handleTabChange}>
              <SelectTrigger className="w-[140px] md:w-[180px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">
                  <span className="sm:hidden">Active</span>
                  <span className="hidden sm:inline">Active Categories</span>
                </SelectItem>
                <SelectItem value="deleted">
                  <span className="sm:hidden">Deleted</span>
                  <span className="hidden sm:inline">Deleted Categories</span>
                </SelectItem>
              </SelectContent>
            </Select>
            <CreateCategoryDialog userSession={session} onCategoryAdded={handleCategoryAdded} />
          </div>
        </div>

        <Card>
          <CardHeader className="p-2 md:p-4">
            <CardTitle>{selectedTab === "active" ? "All Categories" : "Deleted Categories"}</CardTitle>
            <CardDescription className="hidden md:block">
              {selectedTab === "active"
                ? "Manage all categories in the marketplace system"
                : "View and restore deleted categories"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <CategoryTable
              categories={categories}
              isLoading={isLoadingData}
              userSession={session}
              onCategoryAction={handleCategoryAction}
              selectedTab={selectedTab}
            />
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <CategoryPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <Toaster />
      </main>
    </div>
  );
}