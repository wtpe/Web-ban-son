import Product from "@/model/Product";
import Cookies from "js-cookie";

export const get_product = async(query:string)=>{
  try {
    const response = await fetch(`/api/search?query=${query}`,{
      method:'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify(query),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error in getting Products',error);
  }
}

export const add_new_product = async (formData: any) => {
    try {
        const res = await fetch(`/api/Admin/product/add-product`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.log('Error in Add New Category (service) =>', error);
    }
  }
  

  export const get_all_products = async () => {
    try {
      const res = await fetch('/api/common/product/getProduct', {
        method: 'GET',
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log('Error in getting all products (service) =>', error)
    }
  }
  

  export const delete_a_product = async (id:string) => {
    try {
      const res = await fetch(`/api/Admin/product/delete-product?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
      })
  
      const data = await res.json();
      return data;
    } catch (error) {
      console.log('Error in deleting Product (service) =>', error)
    }
  }

  export const update_product_quantity = async (formData : {_id:string, productQuantity:number}) => {
    try{
      const response = await fetch(`/api/Admin/product/update-product-quantity`, {
      method: 'PUT',
      headers: {
        
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ formData }),
    });
    
    const data = await response.json();
    return data;
    }catch(error){
      console.log('Error in updating quantity Product (service) =>', error)
    }
    
  };

  export const update_a_product = async (formData : any) => {
    try {
      const res = await fetch(`/api/Admin/product/update-product`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      })
  
      const data = await res.json();
      return data;
    } catch (error) {
      console.log('Error in updating Product (service) =>', error)
    }
  }

  export const get_product_by_id = async (id:string) => {
    try {
      const res = await fetch(`/api/common/product/get-product-by-id?id=${id}`, {
        method: 'GET',
      })
  
      const data = await res.json();
      return data;
    } catch (error) {
      console.log('Error in getting product by ID (service) =>', error)
    }
  }


  
  export const get_product_by_category_id = async (id:string) => {
    try {
      const res = await fetch(`/api/common/product/get-product-by-category-id?id=${id}`, {
        method: 'GET',
      })
  
      const data = await res.json();
      return data;
    } catch (error) {
      console.log('Error in getting product by category ID (service) =>', error)
    }
  }