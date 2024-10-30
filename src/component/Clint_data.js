const client_data = {
  _id: null,
  username: null,
  about_user: null,
  email: null,
  password: null,
  is_public: null,
  profile_image: null, 
  profile_image_url: null, 
  favorite_img_s: null,
  block_by_users: null,
  block_list: null,
  last_active_time: null,
  __v: null,
};

const getBase64FromArrayBuffer = (data) => {
  const byteCharacters = new Uint8Array(data);
  let byteString = '';
  for (let i = 0; i < byteCharacters.length; i++) {
    byteString += String.fromCharCode(byteCharacters[i]);
  }
  return btoa(byteString);
};

async function update_client_data(key, value) {
  if (client_data.hasOwnProperty(key)) {
    
    if (value instanceof Promise) {
      value = await value; 
    }

    
    if (key === 'profile_image' && value && value.data) {
      client_data[key] = value; 
      client_data.profile_image_url = `data:image/png;base64,${getBase64FromArrayBuffer(value.data)}`;
    } else {
      client_data[key] = value;
    }
  } else {
    alert(`Key "${key}" does not exist in client_data`);
  }
}


export { client_data, update_client_data };
