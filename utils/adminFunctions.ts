export async function fetchUsers(page: number, limit: number, filters: any) {
    const response = await fetch('/api/manageUsers'); // Assuming GET returns all users
    const users = await response.json();
    return { users, pagination: { total: users.length, page, limit, totalPages: Math.ceil(users.length / limit) } };
  }

  export async function approveUser(userId: string, uniqueTin: string) {
    const response = await fetch("/api/manageUsers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve", userId, uniqueTin }),
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  }
  
  export async function rejectUser(userId: string, actionData: { reason: string; description: string; }) {
    const response = await fetch("/api/manageUsers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "reject", 
        userId, 
        data: { rejectionReason: { reason: actionData.reason, description: actionData.description } }
      }),
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  }
  
  export async function banUser(userId: string, banData: { reason: string; description: string; } | undefined) {
    const response = await fetch("/api/manageUsers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "ban", 
        userId, 
        data: banData ? { banReason: { reason: banData.reason, description: banData.description } } : {}
      }),
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  }
  
  export async function unbanUser(userId: string) {
    const response = await fetch("/api/manageUsers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unban", userId }),
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  }
  
  export async function deleteUser(userId: string) {
    const response = await fetch("/api/manageUsers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", userId }),
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  }
  
  export async function restoreUser(userId: string) {
    const response = await fetch("/api/manageUsers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "restore", userId }),
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  }
  
  export async function permanentlyDeleteUser(userId: string) {
    const response = await fetch("/api/manageUsers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  }