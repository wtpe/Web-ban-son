import Cookies from "js-cookie";


export const get_all_users = async () => {
  try {
    const res = await fetch('/api/common/user/getUser', {
      method: 'GET',
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in getting all Users (service) =>', error)
  }
}