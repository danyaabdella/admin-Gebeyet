import Category from "@/models/Category";

import { checkSession,isAdminOrSuperAdmin, connectToDB, isAdmin, userInfo, isSuperAdmin } from "../../../utils/functions";

export async function POST(req) {
    try {
      isAdminOrSuperAdmin();
      await connectToDB();
      
      const { name, description } = await req.json();
      const user = await userInfo();
      console.log("User info: ", user);
      const email = user.email;
  
      const newCategory = await Category.create({ name, description, createdBy: email });
  
      return new Response(JSON.stringify(newCategory), { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
  }

export async function GET(req) {
    try {
      await connectToDB();

      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
      const name = searchParams.get('name');
      const createdBy = searchParams.get('createdBy');
      const createdAt = searchParams.get('createdAt');
  
      let query = {};
      if (id) query._id = id;
      if (name) query.name = name;
      if (createdBy) query.createdBy = createdBy;
      if (createdAt) query.createdAt = { $gte: new Date(createdAt) };
  
      const categories = await Category.find(query);
  
      return new Response(JSON.stringify(categories), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
  }

export async function PUT(req) {
    await connectToDB();

    try {
        const { _id, name, description, isDeleted } = await req.json();
        const category = await Category.findById(_id);

        if (!category) {
            return new Response(JSON.stringify({ error: 'Category not found' }), { status: 404 });
        }

        const user = await userInfo();
        console.log("Admin user info: ", user);
        const userEmail = user.email;
        console.log("Admin user email: ", userEmail);

        // Check if the user is either the creator or a superAdmin
        if (category.createdBy !== userEmail) {
            try {
                await isSuperAdmin(); 
            } catch (error) {
                return new Response(JSON.stringify({ error: 'Unauthorized: You must be the creator or a superAdmin' }), { status: 403 });
            }
        }

        // Handle category restoration
        if (isDeleted === false && category.isDeleted === true) {
            category.isDeleted = false;
            category.trashDate = null;
            await category.save();
            return new Response(JSON.stringify("Category restored from trash"), { status: 200 });
        } 

        // Update category details
        category.name = name || category.name;
        category.description = description || category.description;

        await category.save();
        return new Response(JSON.stringify(category), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
}

export async function DELETE(req) {
  await connectToDB();

  try {
      const { _id } = await req.json();
      const category = await Category.findById(_id);

      if (!category) {
          return new Response(JSON.stringify({ error: 'Category not found' }), { status: 404 });
      }

      const user = await userInfo();
      const userEmail = user.email;

      // Check if the user is either the creator or a superAdmin
      if (category.createdBy !== userEmail) {
          try {
              await isSuperAdmin(); 
          } catch (error) {
              return new Response(JSON.stringify({ error: 'Unauthorized: You must be the creator or a superAdmin' }), { status: 403 });
          }
      }

      // Mark as deleted instead of actual deletion (soft delete)
      category.isDeleted = true;
      category.trashDate = new Date();
      await category.save();

      return new Response(JSON.stringify({ message: 'Category moved to trash' }), { status: 200 });

  } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

