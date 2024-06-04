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

export const update_user = async (formData : any) => {
  try {
    const res = await fetch(`/api/common/user/update-user`, {
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
    console.log('Error in updating user (service) =>', error)
  }
}