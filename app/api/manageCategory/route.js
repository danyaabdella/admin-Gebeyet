import Category from "../../../models/Category";
import { checkSession, connectToDB, isAdmin, userInfo } from "../../../utils/functions";

export async function POST(req) {
    try {
      isAdmin();
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
        const email = user.email;

        if (await checkSession(email) !== null) {
            return new Response(JSON.stringify({ error: 'You are not the creator of this category' }), { status: 403 });
        }

        // If admin wants to restore from trash
        if (isDeleted === false) {
            category.isDeleted = false;
            category.trashDate = null;

            return new Response(JSON.stringify("Category restored from trash"), { status: 200 });
        } else {
            category.name = name || category.name;
            category.description = description || category.description;
        }

        await category.save();
        return new Response(JSON.stringify(category), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
}


export async function DELETE(req) {
  try {
      const { _id } = await req.json();
      const user = await userInfo();
      const email = user.email;

      if (await checkSession(email) !== null) {
          return new Response(JSON.stringify({ error: 'You are not the creator of this category' }), { status: 403 });
      }

      const category = await Category.findById(_id);
      if (!category) {
          return new Response(JSON.stringify({ error: 'Category not found' }), { status: 404 });
      }

      // Mark as deleted instead of actual deletion
      category.isDeleted = true;
      category.trashDate = new Date();
      await category.save();

      return new Response(JSON.stringify({ message: 'Category moved to trash' }), { status: 200 });

  } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
