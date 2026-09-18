import { NextFunction, Request, Response } from "express";
import BlogModel from "../models/blogModel";
import { DateTime } from "luxon";
import { getisotime } from "../utils/comman";
import BlogImage from "../models/blogImage.model"
// export const addBlog = async (  
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id, title, content, author, tags, image, isPublished=false } = req.body;
//     const userId = req.user?._id;
//     if (!title || !content || !author || !Array.isArray(tags)) {
//        res
//         .status(400)
//         .json({ error: "title, author, tags and content are required." });
//         return
//     }

//     if (id) {
//       const updatedBlog = await blogModel.findByIdAndUpdate(
//         id,
//         {
//           title,
//           content,
//           author,
//           tags,
//           image,
//           isPublished,
//           updated_at: new Date().toISOString(),
//           updated_by: userId,
//         },
//         { new: true }
//       );

//       if (!updatedBlog) {
//         res.status(404).json({ error: "Blog not found." });
//         return
//       }

//       res.status(200).json({
//         message: "Blog updated successfully.",
//         data: updatedBlog,
//       });
//       return
//     } else {
//       //  Create new role
//       const existingBlog = await blogModel.findOne({ title });
//       if (existingBlog) {
//         res.status(409).json({ error: "Blog with this name already exists." });
//         return
//       }

//       const newBlog = new blogModel({
//         title,
//         content,
//         author,
//         tags,
//         image,
//         isPublished,
//         updated_at: new Date().toISOString(),
//         created_at: new Date().toISOString(),
//         created_by: userId,
//         updated_by: userId,
//       });

//       await newBlog.save();

//       res.status(201).json({
//         message: "Blog created successfully.",
//         data: newBlog,
//       });
//       return
//     }
//   } catch (error) {
//     console.error("Create/Update Blog Error:", error);
//     res.status(500).json({ error: "Internal server error." });
//     next(error);
//     return
//   }
// };

// export const getBlog = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id, search } = req.query;
//     if (id) {
//       const blog = await blogModel
//         .findById(id)
//         .populate("created_by updated_by");
//       if (!blog) {
//         res.status(404).json({ error: "Blog not found." });
//         return
//       }

//       res.status(200).json({
//         message: "Blog fetched successfully.",
//         data: blog,
//       });
//       return
//     }

//     // 2. Get Blogs with Search (by title, content, or author)
//     let query: any = {};
//     if (search) {
//       const searchRegex = new RegExp(search as string, "i");
//       query = {
//         $or: [
//           { title: searchRegex },
//           { content: searchRegex },
//           { author: searchRegex },
//         ],
//       };
//     }

//     // 3. Get All Blogs (or filtered ones)
//     const blogs = await blogModel.find(query).sort({ created_at: -1 });

//     res.status(200).json({
//       message: "Blogs fetched successfully.",
//       data: blogs,
//     });
//     return
//   } catch (error) {
//     console.error("Get Blog Error:", error);
//     res.status(500).json({ error: "Internal server error." });
//     next(error);
//     return
//   }
// };

// export const deleteBlog = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id } = req.body;
//     if (!id) {
//        res.status(400).json({ error: "Blog ID is required." });
//        return
//     }
//     const deletedBlog = await blogModel.findByIdAndDelete(id);

//     if (!deletedBlog) {
//        res.status(404).json({ error: "Blog not found." });
//        return
//     }
//     res.status(200).json({
//       message: "Blog deleted successfully.",
//       data: deletedBlog,
//     });
//     return
//   } catch (error) {
//     console.error("Delete Blog Error:", error);
//     res.status(500).json({ error: "Internal server error." });
//     next(error);
//     return
//   }
// };

export const createBlog = async (
  req: Request,
  res: Response,
) => {
  try {
    const { title, author = "", content = {}, slug } = req.body;
    console.log(req.body, "blog etails")
    const userId = req.user?._id;
    if (!title || !content || !author || !slug) {
      res
        .status(400)
        .json({ error: "title, author, content are required." });
      return
    }
    const tslug = slug.trim()

    const existingSlug = await BlogModel.findOne({slug:tslug});
    if (existingSlug) {
      return res.status(400).json({ error: "Blog with this slug already exists." });

    }
    const existingBlog = await BlogModel.findOne({ slug, title });
    if (existingBlog) {
      return res.status(400).json({ error: "Blog with this name already exists." });

    }

    const newBlog = new BlogModel({
      title,
      content,
      author,
      slug,
      created_by: userId,
      updated_by: userId,
    });

    await newBlog.save();

    return res.status(201).json({
      message: "Blog created successfully.",
      data: newBlog,
    });


  } catch (error) {
    console.error("Create/Update Blog Error:", error);
    return res.status(500).json({ error: "Internal server error." });

  }
};

export const editBlog = async (
  req: Request,
  res: Response,
) => {
  try {
    const { title, author = "", content = {}, blogstatus, slug, publisheddate, id } = req.body;
    console.log(req.body, "blog details")
    const userId = req?.user?._id;
    if (!slug) {
      return res
        .status(400)
        .json({ error: "slug is required." });

    }

      const existingBlog = await BlogModel.findById(id);
    if (!existingBlog) {
      return res.status(400).json({ error: "This blog doesnot exists." });
    }
    const tslug = slug.trim()
    const checkduplicateslug = await BlogModel.findOne({slug:tslug})

    if(checkduplicateslug && checkduplicateslug._id.toString() != id.toString() ){
          return res.status(400).json({ error: "This slug already exists." });
    }    

    const updatedBlog = await BlogModel.findByIdAndUpdate(existingBlog._id,
      {
        title,
        content,
        author,
        blogstatus,
        publisheddate,
        slug,
        updated_by: userId,
      },
      { new: true, runValidators:true}
    );

    
    return res.status(200).json({
      message: "Blog updated successfully.",
      data: updatedBlog,
    });


  } catch (error) {
    console.error("Create/Update Blog Error:", error);
    return res.status(500).json({ error: "Internal server error." });

  }
};

export const getSingleBlogAdmin = async (
  req: Request,
  res: Response,
) => {
  try {
    const { slug } = req.body; // 👈 get id properly

    if (!slug) {
      return res.status(400).json({ error: "Blog slug is required." });
    }

    const blog = await BlogModel.findOne({ slug: slug });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }

    return res.status(200).json({
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error) {
    console.error("Get Blog Error:", error);
  }
};

export const getSingleBlog = async (
  req: Request,
  res: Response,
) => {
  try {
    const { slug } = req.body; // 👈 get id properly

    if (!slug) {
      return res.status(400).json({ error: "Blog slug is required." });
    }

    const blog = await BlogModel.findOne({ slug: slug, blogstatus: "published" });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }

    return res.status(200).json({
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error) {
    console.error("Get Blog Error:", error);
  }
};

export const deleteBlog = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.body; // 👈 get id properly

    if (!id) {
      return res.status(400).json({ error: "Blog id is required." });
    }

    const blog = await BlogModel.findByIdAndUpdate(id, { status: 14, blogstatus:"draft" }, { new: true });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }


    return res.status(200).json({
      message: "Blog deleted successfully",
      blog,
    });
  } catch (error) {
    console.error("Get Blog Error:", error);
  }
};

export const restoreBlog = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.body; // 👈 get id properly

    if (!id) {
      return res.status(400).json({ error: "Blog id is required." });
    }

    const blog = await BlogModel.findByIdAndUpdate(id, { status: 13, blogstatus:"published" }, { new: true });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }


    return res.status(200).json({
      message: "Blog restored successfully",
      blog,
    });
  } catch (error) {
    console.error("Get Blog Error:", error);
  }
};

export const blogPublishStatus = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id, blogstatus } = req.body; // 👈 get id properly
    const date = getisotime(DateTime)

    if (!id) {
      return res.status(400).json({ error: "Blog id is required." });
    }

    const blog = await BlogModel.findByIdAndUpdate(id, { blogstatus, publisheddate: date }, { new: true });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }


    return res.status(200).json({
      message: "Blog status updated successfully",
      blog,
    });
  } catch (error) {
    console.error("Get Blog Error:", error);
  }
};

export const getAllBlogsAdmin = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = "", order = { col: "created_at", order: -1 } } = req.body

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    let sortObj: any = {}
    sortObj[order.col] = order.order
    // 🔍 Search condition

    const filter: any = {};

    if (search && typeof search === "string") {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    const blogs = await BlogModel.find(filter)
      .select("-content") // exclude content field
      .sort(sortObj)
      .skip(skip)
      .limit(limit);


    const totalBlogs = await BlogModel.countDocuments(filter);

    res.status(200).json({message:"blog fetched successfully", 
      blogs,
      totalBlogs,
      currentPage: page,
      totalCount: Math.ceil(totalBlogs),
    });
  } catch (error) {
    console.error("Get Blogs Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// export const getAllBlogs = async (req: Request, res: Response) => {
//   try {
//     const { page = 1, limit = 10, search = "", order = { "created_at": -1 }, } = req.body

//     const skip = (page - 1) * limit;
//     let blogs
//     let totalBlogs = 0
//     // 🔍 Search condition
//     const filter: any = {};
//     if (search) {
//       filter.title = { $regex: search, $options: "i" };


//       blogs = await BlogModel.find({ ...filter, blogstatus: "published", status: 13 })
//         .sort({ created_at: -1 }) // DESCENDING
//         .skip(skip)
//         .limit(limit);
//       totalBlogs = await BlogModel.countDocuments(filter);

//     }

//     blogs = await BlogModel.find({ blogstatus: "published", status: 13 })
//       .sort({ created_at: -1 }) // DESCENDING
//       .skip(skip)
//       .limit(limit);
//     totalBlogs = await BlogModel.countDocuments({ blogstatus: "published", status: 13 });

//     // 🔢 Total count for pagination
//     console.log(blogs, totalBlogs)
//     res.status(200).json({
//       message: " Blog fetched successfully", data: blogs,
//       pagination: {
//         total: totalBlogs,
//         page,
//         limit,
//         totalPages: Math.ceil(totalBlogs / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Get Blogs Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
    } = req.body;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const filter: any = {
      blogstatus: "published",
      status: 13,
    };

    // Search condition
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    const blogs = await BlogModel.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalBlogs = await BlogModel.countDocuments(filter);

    console.log(blogs, totalBlogs);

    res.status(200).json({
      message: "Blog fetched successfully",
      data: blogs,
      pagination: {
        total: totalBlogs,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalBlogs / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get Blogs Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};







export const uploadBlogImage = async (
  req: any,
  res: any
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: 0,
        error: "Image file is required",
      });
    }

    const image =
      await BlogImage.create({
        fileName:
          req.file.originalname,

        contentType:
          req.file.mimetype,

        data:
          req.file.buffer,
      });

    const imageId =
      image._id.toString();

    return res.status(200).json({
      success: 1,

      message:
        "Image uploaded successfully",

      file: {
        id: imageId,

        url: `/api/blog-image/${imageId}`,
      },
    });

  } catch (error) {
    console.error(
      "UPLOAD BLOG IMAGE ERROR:",
      error
    );

    return res.status(500).json({
      success: 0,
      error:
        "Failed to upload image",
    });
  }
};


export const getBlogImage = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("Image ID is required");
    }

    const image = await BlogImage.findById(id);

    if (!image) {
      return res.status(404).send("Image not found");
    }

    res.setHeader("Content-Type", image.contentType);

    res.setHeader(
      "Content-Length",
      image.data.length.toString()
    );

    res.setHeader(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );

    // IMPORTANT
    res.setHeader(
      "Access-Control-Allow-Origin",
      "http://localhost:3000"
    );

    res.setHeader(
      "Cross-Origin-Resource-Policy",
      "cross-origin"
    );

    return res.end(image.data);

  } catch (error) {
    console.error(
      "GET BLOG IMAGE ERROR:",
      error
    );

    return res
      .status(500)
      .send("Failed to load image");
  }
};
export const deleteBlogImage = async (
  req: any,
  res: any
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Image ID is required",
      });
    }

    const image =
      await BlogImage.findById(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        error: "Image not found",
      });
    }

    await BlogImage.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "Image deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE BLOG IMAGE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "Failed to delete image",
    });
  }
};