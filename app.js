import express from "express";
import axios from "axios";
import _ from "lodash";

const app=express();




app.get('/api/blog-stats', async (req, res) => {
    try {

        
      const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
        headers: { 'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6' }
      });
  
      const blogData = response.data.blogs;

    
      // Call the data analysis function and send the response
      const analysisResult = performDataAnalysis(blogData);
      res.json(analysisResult);
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: 'Error fetching data from the third-party API.' });
    }
  });

 //for got lodash 
  function performDataAnalysis(data) {
    
    const totalBlogs = data.length;
    
   const longestBlog = _.maxBy(data, blog => blog.title.length); // Access title length within maxBy
    const blogsWithPrivacy = data.filter(blog => blog.title.toLowerCase().includes('privacy'));
    const uniqueTitles = _.uniqBy(data, 'title');
  
    return {
      totalBlogs,
      longestBlog: longestBlog.title, // Access the title property within the result
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueTitles: uniqueTitles.map(blog => blog.title),
    };
  }




//seach tiitle on passing query
  app.get('/api/blog-search', async (req, res,next) => {

    try {
        const { query } = req.query;
    
        if (!query) {
          return res.status(400).json({ error: 'Query parameter is missing.' });
        }

        const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
        headers: { 'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6' }
      });
  
      const blogData = response.data.blogs;
      
        // Filter blogs based on the query
        const matchingBlogs = blogData.filter(blog =>
          blog.title.toLowerCase().includes(query.toLowerCase())
        );
      
        res.json(matchingBlogs);
        
    } catch (error) {
        next(error);
        // console.log(error);
    }
   
  });






app.get("/",(req,res)=>{
    res.send("hello app m hu")
})


app.listen(3000,()=>{
    console.log("server is working");
})