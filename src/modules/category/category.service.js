// create service
// update service
// delete service
const Category = require('../../models/category');


const createCategory = async({name,desc,imageLink,isActive})=>{
    try{
        if(!name || !desc){
            throw new Error("Category Name or Desc is required");
        }
        const category = await Category.find({name:name});
        if(category){
           throw new Error("Category Already Exist") ;
        }
        await Category.create({
                name,
                desc,
                isActive,
                imageLink
        });
        return {
            message:"New category is created"
        }
    }
    catch(e){

    }
}