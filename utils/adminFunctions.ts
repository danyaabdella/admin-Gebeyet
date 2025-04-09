export async function fetchUsers(page: number, limit: number, filters: any) {
    const response = await fetch('/api/manageUsers'); // Assuming GET returns all users
    const users = await response.json();
    return { users, pagination: { total: users.length, page, limit, totalPages: Math.ceil(users.length / limit) } };
  }
  
  export async function verifyUser(userId: string) {
    // Assuming a separate endpoint or logic for verification if not part of PUT
    const response = await fetch('/api/verifyUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: userId }),
    });
    return response.json();
  }
  
  export async function banUser(userId: string, banData: { reason: string; description: string; } | undefined) {
    const response = await fetch('/api/manageUsers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: userId, isBanned: true }),
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  }
  
  export async function unbanUser(userId: string) {
    const response = await fetch('/api/manageUsers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: userId, isBanned: false }),
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  }
  
  export async function deleteUser(userId: string) {
    const response = await fetch('/api/manageUsers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: userId, isDeleted: true }),
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  }
  
  export async function restoreUser(userId: string) {
    const response = await fetch('/api/manageUsers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: userId, isDeleted: false }),
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  }
  
  export async function permanentlyDeleteUser(userId: string) {
    const response = await fetch('/api/manageUsers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: userId }),
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  }