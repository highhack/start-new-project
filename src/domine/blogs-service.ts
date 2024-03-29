import { blogsRepository } from "../repositories/blogs/blogs-repository-db";
import { Post, postsRepository } from "../repositories/posts/posts-repository-db";

export interface Blog {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  _id?: string
}

export interface BlogsData {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: Blog[]
}
export interface PostsData {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: Post[]
}



 export interface BlogQueries {
  searchNameTerm?: string | null;
  pageNumber?: string;
  pageSize?: string;
  sortBy?: string;
  sortDirection?: string | undefined
} 

 function sortByDirection (str: string | undefined) {
  if (str === 'desc') return -1
  if (str === 'asc') return 1 
  return  -1
}
  

export const blogsService = {

 async deleteAllBlogs(): Promise<Blog[]> {
 return blogsRepository.deleteAllBlogs()
 },

 async getAllBlogs(queries: BlogQueries): Promise<BlogsData> {
  const {searchNameTerm, pageNumber, pageSize, sortBy, sortDirection } = queries
  const totalCount = await blogsRepository.getTotalCount(searchNameTerm)
  const createdQueries = {
    searchNameTerm: searchNameTerm || null,
    pageNumber: Number(pageNumber) || 1,
    pageSize: Number(pageSize) || 10,
    sortBy: sortBy || 'createdAt',
    sortDirection: sortByDirection(sortDirection) as 1 | -1
    } 
  const blogs = await blogsRepository.getAllBlogs(createdQueries)
   return {
    pagesCount: Math.ceil(totalCount/Number(pageSize || 10)),
    page: Number(pageNumber) || 1,
    pageSize: Number(pageSize) || 10,
    totalCount: totalCount,
    items: blogs
  }
 },

 async findPostsByBlogId(id: string, queries?: any): Promise<PostsData | null> {
  const {pageNumber, pageSize, sortBy, sortDirection} = queries
  const postsTotalCount = await postsRepository.getTotalCount(id)
  const createdQueries = {
    pageNumber: Number(pageNumber) || 1,
    pageSize: Number(pageSize) || 10,
    sortBy: sortBy || 'createdAt',
    sortDirection: sortByDirection(sortDirection) 
    } 
    const posts = await postsRepository.findPostsByBlogID(id, createdQueries)
    return  {
      pagesCount: Math.ceil(postsTotalCount/Number(pageSize || 10)),
      page: Number(pageNumber) || 1,
      pageSize: Number(pageSize) || 10,
      totalCount: postsTotalCount,
      items: posts
    } 
  },

  async findBlog(id: string): Promise<Blog | null> {
    return blogsRepository.findBlog(id)
  },

 async createBlog(body: {name: string; description: string; websiteUrl: string}): Promise<Blog>{

    const {name, description, websiteUrl} = body 
      const blog = {
        "id": new Date().getTime().toString(),
        "name": name,
        "description": description,
        "websiteUrl": websiteUrl,
        "createdAt": new Date().toISOString(),
        "isMembership": false,
      }
    const createdBlog = blogsRepository.createBlog(blog)
      return createdBlog
 },
 

 async updateBlog(
    body: {name: string; websiteUrl: string, description: string},
    blogId: string
    ): Promise<boolean | undefined >{
         return await blogsRepository.updateBlog( body, blogId)

 },
 async removeBlog  (id: string): Promise<boolean | undefined>{
 return  await blogsRepository.removeBlog(id)
  }
 }